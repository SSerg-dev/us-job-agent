import { resolve } from 'node:path';
import { createApp } from './app.js';
import { VacancyStore } from './vacancy-store.js';
const root = resolve(__dirname, '../../..');
const store = new VacancyStore(process.env['US_JOB_DB'] ?? resolve(root, 'data/agent.sqlite'));
const server = createApp(store, resolve(root, 'dist/us-job-agent/browser'));
server.on('error', () => {
  console.error('Unable to start local server. Check the port and database path.');
  store.close();
  process.exitCode = 1;
});
server.listen(Number(process.env['PORT'] ?? 4321), '127.0.0.1', () =>
  console.log('US Job Agent local API ready.'),
);
for (const signal of ['SIGINT', 'SIGTERM'] as const)
  process.on(signal, () =>
    server.close(() => {
      store.close();
      process.exit(0);
    }),
  );
