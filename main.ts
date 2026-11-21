import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_BYTES = 1048576;
const MAX_DIMENSION = 1024;
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const PNG_IEND = Buffer.from([0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82]);

function verifyPngBuffer(buf: Buffer): { width: number; height: number } {
  if (buf.byteLength === 0 || buf.byteLength > MAX_BYTES) {
    throw new Error(`Invalid PNG byte length: ${buf.byteLength} (max ${MAX_BYTES})`);
  }
  if (buf.byteLength < 57 || !buf.subarray(0, 8).equals(PNG_SIGNATURE)) {
    throw new Error('Missing valid PNG 8-byte signature');
  }
  const ihdrType = buf.subarray(12, 16).toString('ascii');
  if (ihdrType !== 'IHDR') {
    throw new Error(`Expected IHDR chunk first, found ${ihdrType}`);
  }
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  if (width < 1 || height < 1 || width > MAX_DIMENSION || height > MAX_DIMENSION) {
    throw new Error(`PNG dimensions ${width}x${height} exceed ${MAX_DIMENSION}x${MAX_DIMENSION}`);
  }
  const tail = buf.subarray(buf.byteLength - 12);
  if (!tail.equals(PNG_IEND)) {
    throw new Error('Missing valid PNG IEND trailer chunk');
  }
  return { width, height };
}

function run(): void {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const sourceImage = join(currentDir, 'entry.png');
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
  const targetImage = join(outDir, 'entry.png');

  const imageBytes = readFileSync(sourceImage);
  verifyPngBuffer(imageBytes);

  mkdirSync(outDir, { recursive: true });
  writeFileSync(targetImage, imageBytes);
}

run();
