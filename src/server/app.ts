import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { validateVacancy, ValidationError } from '../domain/vacancy.js';
import type { VacancyStore } from './vacancy-store.js';
const json = (response: ServerResponse, status: number, value: unknown) => {
  response.writeHead(status, {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  response.end(JSON.stringify(value));
};
async function body(request: IncomingMessage): Promise<unknown> {
  let size = 0;
  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    size += Buffer.byteLength(chunk);
    if (size > 1048576) throw new ValidationError('Request too large.');
    chunks.push(Buffer.from(chunk));
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new ValidationError('Invalid JSON.');
  }
}
export function createApp(store: VacancyStore, assetDirectory?: string) {
  return createServer(async (request, response) => {
    try {
      const host = request.headers.host ?? '';
      if (!/^127\.0\.0\.1:\d+$/.test(host))
        return json(response, 403, { error: 'Untrusted host.' });
      const origin = request.headers.origin;
      if (origin && ![`http://${host}`, 'http://127.0.0.1:4320'].includes(origin))
        return json(response, 403, { error: 'Untrusted origin.' });
      const path = new URL(request.url ?? '/', `http://${host}`).pathname;
      if (path.startsWith('/api/')) {
        if (request.method === 'GET' && path === '/api/health')
          return json(response, 200, { status: 'ok' });
        if (request.method === 'GET' && path === '/api/vacancies')
          return json(response, 200, store.list());
        if (request.method === 'GET' && /^\/api\/vacancies\/[^/]+$/.test(path)) {
          const vacancy = store.get(path.slice('/api/vacancies/'.length));
          return json(response, vacancy ? 200 : 404, vacancy ?? { error: 'Vacancy not found.' });
        }
        if (request.method === 'POST' && path === '/api/vacancies') {
          if (request.headers['content-type']?.split(';')[0].trim() !== 'application/json')
            return json(response, 415, { error: 'JSON required.' });
          return json(response, 201, store.create(validateVacancy(await body(request))));
        }
        return json(response, 404, { error: 'Not found.' });
      }
      if (request.method !== 'GET' || !assetDirectory)
        return json(response, 404, { error: 'Not found.' });
      const root = resolve(assetDirectory);
      const file = resolve(root, `.${decodeURIComponent(path)}`);
      if (!file.startsWith(root + sep) && file !== root)
        return json(response, 403, { error: 'Forbidden.' });
      const types: Record<string, string> = {
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.html': 'text/html',
        '.ico': 'image/x-icon',
      };
      let content: Buffer;
      let contentType = types[extname(file)] ?? 'application/octet-stream';
      try {
        content = await readFile(file);
      } catch {
        if (extname(file)) return json(response, 404, { error: 'Not found.' });
        content = await readFile(resolve(root, 'index.html'));
        contentType = 'text/html';
      }
      response.writeHead(200, {
        'Content-Type': contentType,
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'no-referrer',
      });
      response.end(content);
    } catch (error) {
      json(response, error instanceof ValidationError ? 400 : 500, {
        error: error instanceof ValidationError ? error.message : 'Unable to complete request.',
      });
    }
  });
}
