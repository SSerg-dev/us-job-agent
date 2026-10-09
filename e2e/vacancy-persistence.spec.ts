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
