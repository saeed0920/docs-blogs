"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const from = searchParams.get("from") ?? "/";

  async function handleSubmit() {
    setLoading(true);
    setError("");

    const res = await fetch(`/api/login?from=${from}`, {
      method: "POST",
      body: JSON.stringify({ password }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      const { from } = await res.json();
      router.push(from);
    } else {
      setError("Incorrect password.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div className="w-full max-w-sm border rounded-xl p-8 flex flex-col gap-4">
        <h1 className="text-xl font-bold">Restricted Access</h1>
        <p className="text-sm text-fd-muted-foreground">
          This page is private. Enter the password to continue.
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Password"
          className="border rounded-lg px-3 py-2 text-sm w-full bg-transparent outline-none focus:ring-2 ring-fd-primary"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-fd-primary text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
        >
          {loading ? "Checking..." : "Enter"}
        </button>
      </div>
    </div>
  );
}
