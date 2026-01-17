import { expect, test } from '@playwright/test';
import { requiredEnv } from '../../src/utils/env';

test('API cleanup: delete all named transformations (skip t_media_lib_thumb)', async ({ request }) => {
  const cloudName = requiredEnv('CLOUDINARY_CLOUD_NAME');
  const apiKey = requiredEnv('CLOUDINARY_API_KEY');
  const apiSecret = requiredEnv('CLOUDINARY_API_SECRET');

  const apiBase = process.env.CLOUDINARY_API_BASE ?? 'https://api.cloudinary.com';
  const base = `${apiBase}/v1_1/${cloudName}`;

  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
  const headers = { Authorization: `Basic ${auth}` };

  // 1) list (named only)
  const listRes = await request.get(`${base}/transformations?named=true&max_results=500`, { headers });
  expect(listRes.ok()).toBeTruthy();

  const { transformations = [] } = (await listRes.json()) as {
    transformations?: Array<{ name?: string }>;
  };

  const names = transformations
    .map((t) => t.name)
    .filter((n): n is string => Boolean(n))
    .filter((n) => n !== 't_media_lib_thumb');

  // 2) delete all (except t_media_lib_thumb)
  for (const name of names) {
    const delRes = await request.delete(`${base}/transformations/${encodeURIComponent(name)}`, { headers });
    expect(delRes.ok(), `Failed to delete transformation: ${name} (status ${delRes.status()})`).toBeTruthy();
  }

  // 3) verify empty (best-effort) — allow t_media_lib_thumb to remain
  const verifyRes = await request.get(`${base}/transformations?named=true&max_results=500`, { headers });
  expect(verifyRes.ok()).toBeTruthy();

  const after = (await verifyRes.json()) as { transformations?: Array<{ name?: string }> };
  const remaining = (after.transformations ?? [])
    .map((t) => t.name)
    .filter((n): n is string => Boolean(n));

  expect(remaining).toEqual(['t_media_lib_thumb']);
});
