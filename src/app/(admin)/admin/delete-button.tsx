"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function DeleteButton({ url, label = "Delete" }: { url: string; label?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    setLoading(true);
    await fetch(url, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  };

  return (
    <Button variant="danger" size="sm" onClick={handleDelete} loading={loading}>
      {label}
    </Button>
  );
}
