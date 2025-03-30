#!/usr/bin/env bun

import * as fsSync from "fs";
import * as fs from "fs/promises";
import * as path from "path";
import * as cheerio from "cheerio";
import { downloadImgFromURL } from "./utils/download_img.js";
import { shaFromString } from "./utils/sha1.js";

const carta_file = new URL("../carta.json", import.meta.url);
const carta_full_file = new URL("../carta-full.json", import.meta.url);
const carta_images_astro_file = new URL(
  "../carta-images.astro",
  import.meta.url,
);
const dump_file = new URL("../dump/snap-page.html", import.meta.url);
const target_images = new URL("../images/", import.meta.url);

await fs.mkdir(target_images, { recursive: true });

/** List products */
const carta_payload = JSON.parse(await fs.readFile(carta_file, "utf-8"));
const dump_payload = cheerio.load(await fs.readFile(dump_file, "utf-8"));

const carta_full: Record<string, { id: string; product: any; image?: string }> =
  {};

for (const product of carta_payload) {
  const id = await shaFromString("SHA-256", JSON.stringify(product));
  if (product.nombre === "SPICY TEQUILA") console.log("🚀 ~ id:", id);
  let image_file: URL | null = null;

  const product_image_element = dump_payload(
    `[alt=${JSON.stringify(product.nombre)}]`,
  );

  const source_target_image = product_image_element.prop("src");
  const isDefaultImage =
    source_target_image?.endsWith("product-default.svg") ?? false;

  if (isDefaultImage === false && source_target_image) {
    const image_payload = await downloadImgFromURL(source_target_image);
    image_file = new URL(`${id}.png`, target_images);
    await fs.writeFile(image_file, image_payload);
  }

  carta_full[id] = { id, product, image: image_file?.toString() };
}

let str = "";
let stre = "";
str += `---\n`;
stre += `export const images = {\n`;
for (const item of Object.values(carta_full)) {
  if (item.image) {
    str += `import _${item.id} from ${JSON.stringify(`./${path.relative(new URL("./", carta_images_astro_file).pathname, new URL(item.image).pathname)}`)};\n`;
    stre += `  "${item.id}": _${item.id},\n`;
  }
}
stre += `}\n`;
str += stre;
str += `---\n`;

await fs.writeFile(carta_full_file, JSON.stringify(carta_full, null, 2));
await fs.writeFile(carta_images_astro_file, str);

console.log(`End of script`);
