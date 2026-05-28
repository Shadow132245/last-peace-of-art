"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function BanButton({ userId, banned }: { userId: string; banned: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ banned: !banned }),
    });
    router.refresh();
    setLoading(false);
  };

  return (
    <Button variant={banned ? "secondary" : "danger"} size="sm" onClick={handleToggle} loading={loading}>
      {banned ? "Unban" : "Ban"}
    </Button>
  );
}
