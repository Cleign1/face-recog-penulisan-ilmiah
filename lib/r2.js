import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME || process.env.BUCKET_NAME;
const publicBaseUrl = process.env.R2_PUBLIC_URL?.replace(/\/$/, "");

function ensureR2Config() {
  const missing = [];

  if (!accountId) missing.push("R2_ACCOUNT_ID");
  if (!accessKeyId) missing.push("R2_ACCESS_KEY_ID");
  if (!secretAccessKey) missing.push("R2_SECRET_ACCESS_KEY");
  if (!bucketName) missing.push("R2_BUCKET_NAME or BUCKET_NAME");

  if (missing.length > 0) {
    throw new Error(`Missing Cloudflare R2 config: ${missing.join(", ")}`);
  }
}

function getClient() {
  ensureR2Config();

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

export function getR2PublicUrl(objectKey) {
  ensureR2Config();

  if (publicBaseUrl) {
    return `${publicBaseUrl}/${objectKey}`;
  }

  return `https://${accountId}.r2.cloudflarestorage.com/${bucketName}/${objectKey}`;
}

export async function uploadBase64ImageToR2(imageData, objectKey, contentType = "image/jpeg") {
  const buffer = Buffer.from(imageData.split(",")[1], "base64");

  await getClient().send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      Body: buffer,
      ContentType: contentType,
    })
  );

  return getR2PublicUrl(objectKey);
}

export function getObjectKeyFromUrl(fileUrl, fallbackFolder = "") {
  if (!fileUrl) return null;

  try {
    const url = new URL(fileUrl);

    if (publicBaseUrl && fileUrl.startsWith(publicBaseUrl)) {
      const key = fileUrl.slice(publicBaseUrl.length + 1);
      return key || null;
    }

    const pathParts = url.pathname.split("/").filter(Boolean);
    if (pathParts.length === 0) return null;

    const withoutBucket = pathParts[0] === bucketName ? pathParts.slice(1) : pathParts;
    let key = withoutBucket.join("/");

    if (key && !key.includes("/") && fallbackFolder) {
      key = `${fallbackFolder}/${key}`;
    }

    return key || null;
  } catch {
    if (!fallbackFolder) return fileUrl;
    return `${fallbackFolder}/${fileUrl}`;
  }
}

export async function deleteObjectFromR2(objectKey) {
  if (!objectKey) return;

  await getClient().send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    })
  );
}
