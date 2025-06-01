import { test, expect } from '@playwright/test';

test('homepage has correct title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/FlowBoost/);
});

test('can add a new task', async ({ page }) => {
  await page.goto('/');
  
  // Click the "Add New Task" button
  await page.getByRole('button', { name: 'Add New Task' }).click();
  
  // Fill in task details
  await page.getByLabel('Task Title').fill('Test Task');
  await page.getByLabel('Task Type').selectOption('general');
  await page.getByLabel('Priority').selectOption('Medium');
  
  // Click "Suggest Steps" button
  await page.getByRole('button', { name: 'Suggest Steps' }).click();
  
  // Wait for suggestions to appear
  await page.waitForSelector('text=Suggested Steps:');
  
  // Add a suggested step
  await page.getByRole('button', { name: 'Add' }).first().click();
  
  // Create the task
  await page.getByRole('button', { name: 'Create Task' }).click();
  
  // Verify task was added
  await expect(page.getByText('Test Task')).toBeVisible();
});

test('focus timer works correctly', async ({ page }) => {
  await page.goto('/');
  
  // Start the timer
  await page.getByRole('button', { name: 'Start' }).click();
  
  // Check if timer is running
  await expect(page.getByText(/\d+:\d+/)).toBeVisible();
  
  // Pause the timer
  await page.getByRole('button', { name: 'Pause' }).click();
  
  // Check if timer is paused
  await expect(page.getByRole('button', { name: 'Resume' })).toBeVisible();
});