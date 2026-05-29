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

async function uploadLocally(filename: string, buffer: Buffer): Promise<string> {
  const uploadDir = join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(join(uploadDir, filename), buffer);
  return `/uploads/${filename}`;
}

function isSmallImage(file: File): boolean {
  const isImage = file.type.startsWith("image/");
  const small = file.size <= 500 * 1024;
  return isImage && small;
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

    let url: string;
    if (hasBlobToken) {
      url = (await uploadToBlob(filename, buffer)) ?? (await uploadLocally(filename, buffer));
      logger.info({ filename, size: file.size, storage: "blob" }, "File uploaded");
    } else if (isSmallImage(file)) {
      url = toDataUri(file, buffer);
      logger.info({ filename, size: file.size, storage: "data-uri" }, "File uploaded as data URI");
    } else {
      url = await uploadLocally(filename, buffer);
      logger.info({ filename, size: file.size, storage: "local" }, "File uploaded");
    }

    return NextResponse.json({ url });
  } catch (error) {
    logger.error({ error }, "Upload failed");
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
