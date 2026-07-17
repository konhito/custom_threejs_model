"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const bucketName = "aquamundi-glb-models";
const region = process.env.AWS_REGION || "ap-south-1";

const s3Client = new S3Client({
  region,
});

export async function getAssetUploadPresignedUrl(filename, contentType, folder = "assets") {
  try {
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      console.warn("AWS Credentials missing. Cannot generate presigned URL.");
      return {
        success: false,
        error: "AWS configuration is missing on the server. Please add AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY to your .env.local file.",
      };
    }

    const safeFolder = String(folder || "assets")
      .replace(/[^a-zA-Z0-9_\-\/]/g, "_")
      .replace(/^\/+|\/+$/g, "");
    const safeFilename = filename.replace(/[^a-zA-Z0-9_\-\.]/g, "_");
    const uniqueKey = `${safeFolder || "assets"}/${Date.now()}-${safeFilename}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: uniqueKey,
      ContentType: contentType || "application/octet-stream",
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 300 });
    const publicUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${uniqueKey}`;

    return {
      success: true,
      url,
      key: uniqueKey,
      publicUrl,
    };
  } catch (error) {
    console.error("Asset presigner error:", error);
    return { success: false, error: error.message };
  }
}
