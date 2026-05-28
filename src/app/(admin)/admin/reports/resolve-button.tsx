"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ResolveButton({ reportId }: { reportId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleResolve = async () => {
    setLoading(true);
    await fetch(`/api/admin/reports/${reportId}`, { method: "PATCH" });
    router.refresh();
    setLoading(false);
  };

  return (
    <Button variant="secondary" size="sm" onClick={handleResolve} loading={loading}>
      Resolve
    </Button>
  );
}
