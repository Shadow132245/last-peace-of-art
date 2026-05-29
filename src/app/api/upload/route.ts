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
    const url = hasBlobToken
      ? (await uploadToBlob(filename, buffer)) ?? (await uploadLocally(filename, buffer))
      : await uploadLocally(filename, buffer);

    logger.info({ filename, size: file.size, storage: hasBlobToken ? "blob" : "local" }, "File uploaded");
    return NextResponse.json({ url });
  } catch (error) {
    logger.error({ error }, "Upload failed");
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
