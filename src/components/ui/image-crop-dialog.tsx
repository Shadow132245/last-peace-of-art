"use client";

import { useState, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Button } from "./button";

interface ImageCropDialogProps {
  open: boolean;
  imageUrl: string;
  aspect: number;
  title?: string;
  onCrop: (blob: Blob) => void;
  onClose: () => void;
}

export function ImageCropDialog({ open, imageUrl, aspect, title, onCrop, onClose }: ImageCropDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [loading, setLoading] = useState(false);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    if (!croppedAreaPixels) return;
    setLoading(true);

    try {
      const croppedBlob = await getCroppedBlob(imageUrl, croppedAreaPixels);
      onCrop(croppedBlob);
    } catch {
      // fallback: send original
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      onCrop(blob);
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900">
        <h3 className="mb-4 text-lg font-semibold">{title ?? "Crop Image"}</h3>

        <div className="relative h-72 w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <span className="text-xs text-zinc-500">Zoom:</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1"
          />
          <span className="text-xs text-zinc-500">{Math.round(zoom * 100)}%</span>
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="button" onClick={handleCrop} loading={loading}>Apply</Button>
        </div>
      </div>
    </div>
  );
}

async function getCroppedBlob(imageUrl: string, pixelCrop: Area): Promise<Blob> {
  const image = await createImage(imageUrl);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Canvas toBlob failed"));
    }, "image/jpeg", 0.9);
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}
