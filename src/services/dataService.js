import { apiRequest } from "./apiService.js";

export async function getExpenses() {
  return apiRequest("/api/expenses");
}

export async function getExpenseById(expenseId) {
  return apiRequest(`/api/expenses/${expenseId}`);
}

export async function createExpense(payload) {
  return apiRequest("/api/expenses", "POST", payload);
}

export async function updateExpense(expenseId, payload) {
  return apiRequest(`/api/expenses/${expenseId}`, "PUT", payload);
}

export async function deleteExpense(expenseId) {
  return apiRequest(`/api/expenses/${expenseId}`, "DELETE");
}

export async function getCategories() {
  return apiRequest("/api/categories");
}

export async function createCategory(payload) {
  return apiRequest("/api/categories", "POST", payload);
}

export async function updateCategory(categoryName, payload) {
  return apiRequest(`/api/categories/${categoryName}`, "PUT", payload);
}

export async function deleteCategory(categoryName) {
  return apiRequest(`/api/categories/${categoryName}`, "DELETE");
}

export async function getPaymentSources() {
  return apiRequest("/api/payment-sources");
}

export async function createPaymentSource(payload) {
  return apiRequest("/api/payment-sources", "POST", payload);
}

export async function updatePaymentSource(sourceName, payload) {
  return apiRequest(`/api/payment-sources/${sourceName}`, "PUT", payload);
}

export async function deletePaymentSource(sourceName) {
  return apiRequest(`/api/payment-sources/${sourceName}`, "DELETE");
}

export async function getQuickAddItems() {
  return apiRequest("/api/quick-add-items");
}

export async function createQuickAddItem(payload) {
  return apiRequest("/api/quick-add-items", "POST", payload);
}

export async function updateQuickAddItem(itemId, payload) {
  return apiRequest(`/api/quick-add-items/${itemId}`, "PUT", payload);
}

export async function deleteQuickAddItem(itemId) {
  return apiRequest(`/api/quick-add-items/${itemId}`, "DELETE");
}

export async function downloadBackup() {
  return apiRequest("/api/backup");
}

export async function restoreBackup(payload) {
  return apiRequest("/api/restore", "POST", payload);
}

export async function sendPushNotification(subscription, message) {
  return apiRequest("/api/push-notification", "POST", {
    title: message.title,
    body: message.body,
    subscription,
  });
}

export async function sendSubscription(subscription) {
  return apiRequest("/api/subscribe", "POST", subscription);
}
