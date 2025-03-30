import { shaFromString } from "./sha1.js";
import * as fsSync from "fs";
import * as fs from "fs/promises";

class FetchError extends Error {}

const cache_buffers = new URL("../../.cache/buffers/", import.meta.url);

type Alt = {};

export const downloadImgFromURL = async (url: string) => {
  const hash = await shaFromString("SHA-512", url);
  const buffer_target = new URL(hash, cache_buffers);
  const info_target = new URL(`${hash}-info.json`, cache_buffers);

  if (fsSync.existsSync(buffer_target)) {
    return new Uint8Array(await fs.readFile(buffer_target));
  }

  await fs.mkdir(cache_buffers, { recursive: true });
  const response = await fetch(url);

  if (!response.ok) {
    throw new FetchError(
      `Failed to fetch image from URL: ${url}, status: ${response.status}`,
    );
  }

  const data = new Uint8Array(await response.arrayBuffer());

  await fs.writeFile(buffer_target, data);

  await fs.writeFile(
    info_target,
    JSON.stringify(
      {
        url,
        hash,
        size: data.byteLength,
        contentType: response.headers.get("content-type"),
        lastModified: response.headers.get("last-modified"),
        expires: response.headers.get("expires"),
        cacheControl: response.headers.get("cache-control"),
        pragma: response.headers.get("pragma"),
        age: response.headers.get("age"),
        etag: response.headers.get("etag"),
        createdAt: new Date().toISOString(),
      },
      null,
      2,
    ),
  );

  return data;
};
