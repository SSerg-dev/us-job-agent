import { test, expect } from '@playwright/test';
import { spawn, type ChildProcess } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { once } from 'node:events';
const base = 'http://127.0.0.1:4332';
let processHandle: ChildProcess;
const folder = mkdtempSync(join(tmpdir(), 'us-job-browser-'));
async function start() {
  processHandle = spawn(process.execPath, ['dist-server/src/server/main.js'], {
    env: { ...process.env, PORT: '4332', US_JOB_DB: join(folder, 'agent.sqlite') },
    stdio: 'pipe',
  });
  await expect
    .poll(async () => {
      if (processHandle.exitCode !== null) throw new Error('Test server exited; check port 4332.');
      try {
        return (await fetch(`${base}/api/health`)).status;
      } catch {
        return 0;
      }
    })
    .toBe(200);
}
async function stop() {
  if (processHandle && processHandle.exitCode === null) {
    const exited = once(processHandle, 'exit');
    processHandle.kill();
    await exited;
  }
}
test.beforeAll(start);
test.afterAll(async () => {
  await stop();
  rmSync(folder, { recursive: true, force: true });
});
test('persistence through real UI, reload and process restart', async ({ page }) => {
  const external: string[] = [];
  await page.route('**/*', (route) => {
    if (!route.request().url().startsWith(base)) {
      external.push(route.request().url());
      return route.abort();
    }
    return route.continue();
  });
  await page.goto(`${base}/vacancies`);
  await expect(page.getByText('No vacancies yet')).toBeVisible();
  await page.getByRole('link', { name: 'Add vacancy' }).click();
  const original =
    "  Senior C# Engineer\nEmployer: O'Reilly\n<script>window.injected=true</script>\n東京  ";
  await page.getByLabel('Original vacancy text').fill(original);
  await page.getByLabel('Source URL').fill('https://example.com/jobs/123');
  await page.getByLabel('Job title').fill('Senior C# Engineer');
  await page.getByLabel('Employer', { exact: true }).fill("O'Reilly");
  await page.getByLabel('Work format').selectOption('hybrid');
  await page.getByRole('button', { name: 'Save vacancy' }).click();
  await expect(page.getByText('Saved locally.', { exact: false })).toBeVisible();
  const address = page.url();
  await page.reload();
  await expect(page.getByLabel('Original vacancy text')).toHaveValue(original);
  await stop();
  await start();
  await page.goto(address);
  await expect(page.getByLabel('Original vacancy text')).toHaveValue(original);
  await expect(page.getByLabel('Employer', { exact: true })).toHaveValue("O'Reilly");
  await expect(page.getByLabel('Source URL')).toHaveValue('https://example.com/jobs/123');
  await expect(page.getByLabel('Work format')).toHaveValue('hybrid');
  expect(await page.evaluate(() => 'injected' in window)).toBe(false);
  expect(external).toEqual([]);
  await page.getByRole('link', { name: '← Saved vacancies' }).click();
  await expect(page.getByRole('link', { name: 'Senior C# Engineer' })).toBeVisible();
  await page.screenshot({ path: 'test-results/vacancy-list.png', fullPage: true });
});
test('title correction and all reviewed fields survive reload and process restart', async ({
  page,
}) => {
  await page.goto(`${base}/vacancies/new`);
  const original =
    '  Title: Engineer\r\nEmployer: Acme\r\nLocation: Boston, MA\r\nWork format: Hybrid\r\nSalary: USD 80/hour\r\n';
  await page.getByLabel('Original vacancy text').fill(original);
  const textareaText = await page.getByLabel('Original vacancy text').inputValue();
  await page.getByRole('button', { name: 'Review fields', exact: true }).click();
  await expect(page.getByLabel('Job title', { exact: true })).toHaveValue('Engineer');
  await expect(page.getByLabel('Employer', { exact: true })).toHaveValue('Acme');
  await expect(page.getByLabel('Location', { exact: true })).toHaveValue('Boston, MA');
  await expect(page.getByLabel('Work format')).toHaveValue('hybrid');
  await expect(page.getByLabel('Salary as stated')).toHaveValue('USD 80/hour');
  await page.getByLabel('Job title', { exact: true }).fill('  Senior Engineer  ');
  await page.getByRole('button', { name: 'Review fields', exact: true }).click();
  await page.getByRole('button', { name: 'Keep my fields' }).click();
  await expect(page.getByLabel('Job title', { exact: true })).toHaveValue('  Senior Engineer  ');
  await page.getByRole('button', { name: 'Save vacancy', exact: true }).click();
  await expect(page.getByText('Saved locally.', { exact: false })).toBeVisible();
  const address = page.url();
  await page.getByLabel('Employer', { exact: true }).fill('Acme reviewed');
  await page.getByLabel('Location', { exact: true }).fill('Boston reviewed');
  await page.getByLabel('Work format').selectOption('office');
  await page.getByLabel('Salary as stated').fill('USD 85/hour');
  const savedResponse = page.waitForResponse(
    (response) =>
      response.request().method() === 'PUT' && response.url().includes('/api/vacancies/'),
  );
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  expect((await savedResponse).status()).toBe(200);
  await page.reload();
  await expect(page.getByLabel('Employer', { exact: true })).toHaveValue('Acme reviewed');
  await stop();
  await start();
  await page.goto(address);
  await expect(page.getByLabel('Job title', { exact: true })).toHaveValue('  Senior Engineer  ');
  await expect(page.getByLabel('Original vacancy text')).toHaveValue(textareaText);
  await expect(page.getByLabel('Location', { exact: true })).toHaveValue('Boston reviewed');
  await expect(page.getByLabel('Work format')).toHaveValue('office');
  await expect(page.getByLabel('Salary as stated')).toHaveValue('USD 85/hour');
});
test('sparse and contradictory evidence remains visible without invented fields', async ({
  page,
}) => {
  await page.goto(`${base}/vacancies/new`);
  await page
    .getByLabel('Original vacancy text')
    .fill(
      'Title: Engineer\nTitle: Analyst\nBuild remote monitoring systems in Boston.\nSalary: $100000',
    );
  await page.getByRole('button', { name: 'Review fields', exact: true }).click();
  await expect(page.getByLabel('Job title', { exact: true })).toHaveValue('');
  await expect(page.getByLabel('Employer', { exact: true })).toHaveValue('');
  await expect(page.getByLabel('Work format')).toHaveValue('unknown');
  await expect(page.getByLabel('Currency (only if stated)')).toHaveValue('');
  await expect(page.getByLabel('Pay period (only if stated)')).toHaveValue('');
  await expect(page.getByRole('region', { name: 'Field evidence' })).toContainText('ambiguous');
});
