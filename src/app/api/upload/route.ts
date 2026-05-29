import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import crypto from "node:crypto";

async function uploadToBlob(filename: string, buffer: Buffer): Promise<string | null> {
  try {
    const { put } = await import("@vercel/blob");
    const blob = await put(filename, buffer, { access: "public" });
    return blob.url;
  } catch {
    return null;
  }
}

function toDataUri(file: File, buffer: Buffer): string {
  const base64 = buffer.toString("base64");
  return `data:${file.type};base64,${base64}`;
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const isZip = file.type === "application/zip" || file.type === "application/x-zip-compressed" || file.name.endsWith(".zip");
    const maxSize = isZip ? 50 * 1024 * 1024 : 5 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json({ error: `File too large (max ${isZip ? "50MB" : "5MB"})` }, { status: 400 });
    }

    const ext = file.name.split(".").pop() ?? "bin";
    const filename = `${crypto.randomUUID()}.${ext}`;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN;
    const isImage = file.type.startsWith("image/");

    let url: string;
    if (hasBlobToken) {
      const blobUrl = await uploadToBlob(filename, buffer);
      if (blobUrl) {
        url = blobUrl;
        logger.info({ filename, size: file.size, storage: "blob" }, "File uploaded to Vercel Blob");
      } else {
        url = toDataUri(file, buffer);
        logger.info({ filename, size: file.size, storage: "data-uri-fallback" }, "Blob failed, using data URI");
      }
    } else if (isImage) {
      url = toDataUri(file, buffer);
      logger.info({ filename, size: file.size, storage: "data-uri" }, "File uploaded as data URI");
    } else {
      logger.warn({ filename, size: file.size }, "No Blob token set — non-image files will not persist on Vercel");
      const uploadDir = join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });
      await writeFile(join(uploadDir, filename), buffer);
      url = `/uploads/${filename}`;
      logger.info({ filename, size: file.size, storage: "local" }, "File uploaded locally");
    }

    return NextResponse.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    logger.error({ error, message }, "Upload failed");
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
