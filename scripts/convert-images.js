import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const convertSvgToJpg = async (inputPath, outputPath, width, height) => {
  try {
    await sharp(inputPath)
      .resize(width, height)
      .jpeg({ quality: 90 })
      .toFile(outputPath);
    console.log(`Converted ${inputPath} to ${outputPath}`);
  } catch (error) {
    console.error(`Error converting ${inputPath}:`, error);
  }
};

const main = async () => {
  const images = [
    {
      input: 'public/images/hero-bg.svg',
      output: 'public/images/hero-bg.jpg',
      width: 1920,
      height: 1080
    },
    {
      input: 'public/images/features-bg.svg',
      output: 'public/images/features-bg.jpg',
      width: 1920,
      height: 800
    },
    {
      input: 'public/images/tech-bg.svg',
      output: 'public/images/tech-bg.jpg',
      width: 1920,
      height: 800
    }
  ];

  for (const image of images) {
    await convertSvgToJpg(image.input, image.output, image.width, image.height);
  }
};

main(); 