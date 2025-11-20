require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const Expense = require("./models/Expense");
const Category = require("./models/Category");
const PaymentSource = require("./models/PaymentSource");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_CLUSTER = process.env.DB_CLUSTER;
const DB_NAME = process.env.DB_NAME || "riyanris";
const PORT = process.env.PORT || 3000;

const mongoUri = `mongodb+srv://${DB_USERNAME}:${encodeURIComponent(
  DB_PASSWORD
)}@${DB_CLUSTER}/${DB_NAME}?retryWrites=true&w=majority`;

mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

// API routes
app.get("/api/expenses", async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ _id: -1 }).limit(200);
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/expenses/:id", async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ error: "Not found" });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/expenses", async (req, res) => {
  try {
    const payload = req.body;
    const now = new Date();
    const gmt7 = new Date(now.getTime() + (7 * 60 * 60 * 1000));
    payload.input_date = payload.input_date || gmt7.toISOString().split('T')[0];
    payload.input_time = payload.input_time || gmt7.toISOString().split('T')[1].split('.')[0];
    delete payload.id;
    delete payload.createdAt;
    delete payload._local;
    const expense = new Expense(payload);
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/api/expenses/:id", async (req, res) => {
  try {
    const updated = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/api/expenses/:id", async (req, res) => {
  try {
    const deleted = await Expense.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/payment-sources", async (req, res) => {
  try {
    const paymentSources = await PaymentSource.find();
    res.json(paymentSources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/categories", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }
    const newCategory = new Category({ name });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/api/categories/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const deleted = await Category.findOneAndDelete({ name });
    if (!deleted) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/payment-sources", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Payment source name is required" });
    }
    const newPaymentSource = new PaymentSource({ name });
    await newPaymentSource.save();
    res.status(201).json(newPaymentSource);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/api/payment-sources/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const deleted = await PaymentSource.findOneAndDelete({ name });
    if (!deleted) {
      return res.status(404).json({ error: "Payment source not found" });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/backup", async (req, res) => {
  try {
    const expenses = await Expense.find();
    const categories = (await Category.find()).map((c) => c.name);
    const paymentSources = (await PaymentSource.find()).map((p) => p.name);
    res.json({ expenses, categories, paymentSources });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/restore", async (req, res) => {
  try {
    const { expenses = [], categories = [], paymentSources = [] } = req.body || {};

    // Hapus semua data yang ada sebelum restore
    await Expense.deleteMany({});
    await Category.deleteMany({});
    await PaymentSource.deleteMany({});

    let categoriesUpserted = 0;
    for (const name of categories) {
      if (!name) continue;
      const cat = new Category({ name });
      await cat.save();
      categoriesUpserted++;
    }

    let paymentSourcesUpserted = 0;
    for (const name of paymentSources) {
      if (!name) continue;
      const ps = new PaymentSource({ name });
      await ps.save();
      paymentSourcesUpserted++;
    }

    const now = new Date();
    const gmt7 = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    const expensesToInsert = expenses.map((payload) => {
      const copy = { ...payload };
      delete copy._id;
      delete copy.id;
      delete copy.createdAt;
      delete copy._local;
      copy.input_date = copy.input_date || gmt7.toISOString().split("T")[0];
      copy.input_time = copy.input_time || gmt7.toISOString().split("T")[1].split(".")[0];
      return copy;
    });
    let expensesInserted = 0;
    if (expensesToInsert.length) {
      const inserted = await Expense.insertMany(expensesToInsert, { ordered: false });
      expensesInserted = inserted.length;
    }

    res.json({ expensesInserted, categoriesUpserted, paymentSourcesUpserted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
