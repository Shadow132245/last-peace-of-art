"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Settings</h1>

      <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
        <h3 className="font-semibold">Account</h3>
        <div className="mt-4 space-y-3 text-sm">
          <p><span className="text-zinc-500">Name:</span> {session?.user.name}</p>
          <p><span className="text-zinc-500">Email:</span> {session?.user.email}</p>
        </div>
      </div>

      <div className="mt-6">
        <Button variant="danger" onClick={handleLogout}>Sign Out</Button>
      </div>
    </div>
  );
}
