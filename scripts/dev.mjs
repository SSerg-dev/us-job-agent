import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
for (const port of [4320, 4321])
  await new Promise((done, reject) => {
    const probe = createServer();
    probe.once('error', () =>
      reject(new Error(`Port ${port} is already in use. No process was stopped.`)),
    );
    probe.listen(port, '127.0.0.1', () => probe.close(done));
  });
const children = [];
const launch = (args) => {
  const child = spawn(process.execPath, args, {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, NG_CLI_ANALYTICS: 'false' },
  });
  children.push(child);
  return child;
};
const compiler = launch(['node_modules/typescript/bin/tsc', '-p', 'tsconfig.server.json']);
await new Promise((done, reject) =>
  compiler.once('exit', (code) =>
    code === 0 ? done() : reject(new Error('Server build failed.')),
  ),
);
children.length = 0;
launch(['dist-server/src/server/main.js']);
launch([
  'node_modules/@angular/cli/bin/ng.js',
  'serve',
  '--host',
  '127.0.0.1',
  '--port',
  '4320',
  '--proxy-config',
  'proxy.conf.json',
]);
let closing = false;
function close() {
  if (closing) return;
  closing = true;
  for (const child of children) child.kill();
}
for (const child of children)
  child.once('exit', (code) => {
    close();
    process.exitCode = code ?? 1;
  });
process.once('SIGINT', close);
process.once('SIGTERM', close);
