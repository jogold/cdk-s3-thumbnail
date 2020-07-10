import { S3 } from 'aws-sdk';
import sharp from 'sharp';
import * as path from 'path';

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png'];
const RESIZE_WIDTH = 200;

const s3 = new S3();

export async function handler(event: AWSLambda.S3Event): Promise<void> {
  try {
    if (!process.env.DESTINATION_BUCKET_NAME) {
      console.log('Missing DESTINATION_BUCKET_NAME');
      return;
    }

    console.log('Event: %j', event);

    const srcBucket = event.Records[0].s3.bucket.name;
    const srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

    const ext = path.extname(srcKey);
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      console.log(`Unsupported image type: ${ext}`);
      return;
    }

    const dstKey = `${path.basename(srcKey, ext)}-resized${ext}`;
    const image = await s3.getObject({
      Bucket: srcBucket,
      Key: srcKey
    }).promise();

    if (!image.Body) {
      console.log('Image has no body');
      return;
    }

    const resized = await sharp(image.Body as Buffer).resize(RESIZE_WIDTH).toBuffer();

    await s3.upload({
      Bucket: process.env.DESTINATION_BUCKET_NAME,
      Key: dstKey,
      Body: resized,
      ContentType: 'image'
    }).promise();

  } catch (err) {
    console.log(err);
  }
}
