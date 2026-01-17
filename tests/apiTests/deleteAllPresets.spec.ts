import { expect, test } from '@playwright/test';
import { requiredEnv } from '../../src/utils/env';

test('API cleanup: delete all upload presets', async ({ request }) => {
  const cloudName = requiredEnv('CLOUDINARY_CLOUD_NAME');
  const apiKey = requiredEnv('CLOUDINARY_API_KEY');
  const apiSecret = requiredEnv('CLOUDINARY_API_SECRET');

  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
  const headers = { Authorization: `Basic ${auth}` };

  const base = `https://api.cloudinary.com/v1_1/${cloudName}`;

  // 1) list
  const listRes = await request.get(`${base}/upload_presets?max_results=500`, { headers });
  expect(listRes.ok()).toBeTruthy();

  const { presets } = (await listRes.json()) as { presets: Array<{ name: string }> };

  // 2) delete all
  for (const { name } of presets) {
    const delRes = await request.delete(`${base}/upload_presets/${encodeURIComponent(name)}`, { headers });
    expect(delRes.ok(), `Failed to delete preset: ${name} (status ${delRes.status()})`).toBeTruthy();
  }

  // 3) verify empty (best-effort)
  const verifyRes = await request.get(`${base}/upload_presets?max_results=500`, { headers });
  expect(verifyRes.ok()).toBeTruthy();

  const after = (await verifyRes.json()) as { presets: Array<{ name: string }> };
  expect(after.presets.length).toBe(0);
});
