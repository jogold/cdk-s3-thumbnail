import { S3 } from 'aws-sdk';
import sharp from 'sharp';
import * as path from 'path';
import mime from 'mime';

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png'];
const RESIZE_WIDTH = 200;

const s3 = new S3();

export async function handler(event: AWSLambda.S3Event): Promise<void> {
  try {
    console.log('Event: %j', event);

    if (!process.env.DESTINATION_BUCKET_NAME) {
      throw new Error('Missing DESTINATION_BUCKET_NAME');
    }

    const srcBucket = event.Records[0].s3.bucket.name;
    const srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

    const ext = path.extname(srcKey);
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      throw new Error(`Unsupported image type: ${ext}`);
    }

    // Download original image from source bucket
    const image = await s3.getObject({
      Bucket: srcBucket,
      Key: srcKey
    }).promise();

    // Resize
    const resized = await sharp(image.Body as Buffer).resize(RESIZE_WIDTH).toBuffer();

    // Upload resized image to destination bucket
    const dstKey = `${path.basename(srcKey, ext)}-resized${ext}`;
    await s3.upload({
      Bucket: process.env.DESTINATION_BUCKET_NAME,
      Key: dstKey,
      Body: resized,
      ContentType: mime.getType(dstKey) ?? 'application/octet-stream',
    }).promise();
  } catch (err) {
    console.log(err);
  }
}
