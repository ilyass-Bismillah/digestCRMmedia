import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'digest-media-assets';
const publicUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL;

let s3ClientInstance: S3Client | null = null;

export function getR2Client(): S3Client | null {
  if (!accountId || !accessKeyId || !secretAccessKey) {
    return null;
  }

  if (!s3ClientInstance) {
    s3ClientInstance = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  return s3ClientInstance;
}

export function getR2BucketName(): string {
  return bucketName;
}

/**
 * Returns public CDN URL or direct R2 path for a stored object
 */
export function getR2PublicUrl(key: string): string {
  if (publicUrl) {
    const cleanBase = publicUrl.replace(/\/$/, '');
    const cleanKey = key.replace(/^\//, '');
    return `${cleanBase}/${cleanKey}`;
  }
  return `https://${bucketName}.${accountId}.r2.cloudflarestorage.com/${key}`;
}

/**
 * Generates a presigned PUT URL allowing clients to upload directly to Cloudflare R2
 */
export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresInSeconds = 3600
): Promise<{ uploadUrl: string; publicUrl: string } | null> {
  const client = getR2Client();
  if (!client) {
    return null;
  }

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: expiresInSeconds });
  return {
    uploadUrl,
    publicUrl: getR2PublicUrl(key),
  };
}

/**
 * Uploads a file buffer directly to Cloudflare R2 from server-side
 */
export async function uploadFileToR2(
  key: string,
  body: Buffer | Uint8Array,
  contentType: string
): Promise<{ publicUrl: string; key: string } | null> {
  const client = getR2Client();
  if (!client) {
    return null;
  }

  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );

  return {
    publicUrl: getR2PublicUrl(key),
    key,
  };
}

/**
 * Deletes a file object from Cloudflare R2
 */
export async function deleteFileFromR2(key: string): Promise<boolean> {
  const client = getR2Client();
  if (!client) {
    return false;
  }

  try {
    await client.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      })
    );
    return true;
  } catch (error) {
    console.error('Failed to delete file from Cloudflare R2:', error);
    return false;
  }
}
