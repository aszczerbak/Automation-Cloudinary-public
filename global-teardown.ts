import { request, type APIRequestContext } from '@playwright/test';
import { cloudinaryApiConfig } from './src/config/cloudinaryApi';

async function deleteAllUploadPresets(api: APIRequestContext, auth: string, cloudName: string): Promise<void> {
  // Safety: limit to 500 per page and iterate until empty
  while (true) {
    const list = await api
      .get(`https://api.cloudinary.com/v1_1/${cloudName}/upload_presets`, {
        params: { max_results: 500 },
        headers: { Authorization: auth },
        timeout: 20_000,
      })
      .catch(() => undefined);

    if (!list || list.status() !== 200) break;

    const body = (await list.json()) as { presets?: Array<{ name: string }> };
    const presets = body.presets || [];
    if (!presets.length) break;

    for (const preset of presets) {
      await api
        .delete(`https://api.cloudinary.com/v1_1/${cloudName}/upload_presets/${preset.name}`, {
          headers: { Authorization: auth },
          timeout: 20_000,
        })
        .catch(() => {});
    }
  }
}

async function deleteAllNamedTransformations(api: APIRequestContext, auth: string, cloudName: string): Promise<void> {
  const baseUrl = `https://api.cloudinary.com/v1_1/${cloudName}`;
  const authHeader = { Authorization: auth };

  let nextCursor: string | undefined;
  let deletedCount = 0;

  do {
    // List named transformations with pagination
    const listUrl = new URL(`${baseUrl}/transformations`);
    listUrl.searchParams.set('max_results', '500');
    listUrl.searchParams.set('named', 'true');
    if (nextCursor) {
      listUrl.searchParams.set('next_cursor', nextCursor);
    }

    const listRes = await api
      .get(listUrl.toString(), {
        headers: authHeader,
        timeout: 20_000,
      })
      .catch(() => undefined);

    if (!listRes || listRes.status() !== 200) break;

    const listJson = (await listRes.json()) as {
      transformations?: Array<{ name?: string }>;
      next_cursor?: string;
    };

    const names = (listJson.transformations ?? []).map((t) => t.name).filter((n): n is string => Boolean(n));

    // Delete each transformation, except t_media_lib_thumb (cannot be deleted)
    for (const name of names) {
      if (name === 't_media_lib_thumb') {
        continue; // Skip this transformation - it cannot be deleted
      }

      const delUrl = `${baseUrl}/transformations/${encodeURIComponent(name)}`;
      const delRes = await api
        .delete(delUrl, {
          headers: authHeader,
          timeout: 20_000,
        })
        .catch(() => undefined);

      if (delRes?.ok()) {
        deletedCount++;
      }
    }

    nextCursor = listJson.next_cursor;
  } while (nextCursor);

  if (deletedCount > 0) {
    console.log(`✓ Deleted ${deletedCount} named transformations`);
  }
}

export default async function globalTeardown(): Promise<void> {
  const auth =
    'Basic ' + Buffer.from(`${cloudinaryApiConfig.apiKey}:${cloudinaryApiConfig.apiSecret}`).toString('base64');
  const api = await request.newContext();

  console.log('🧹 Global teardown: cleaning up Cloudinary resources...');

  // Delete all upload presets
  await deleteAllUploadPresets(api, auth, cloudinaryApiConfig.cloudName);

  // Delete all named transformations (except t_media_lib_thumb)
  await deleteAllNamedTransformations(api, auth, cloudinaryApiConfig.cloudName);

  await api.dispose();
  console.log('✓ Global teardown completed');
}
