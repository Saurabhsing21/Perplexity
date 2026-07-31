import { useState } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../src/context/auth-context";

export default function AuthPage() {
  const { session, signInWithGoogle, signInWithGithub } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  if (session) {
    return <Navigate to="/" replace />;
  }

  const handleSignIn = async (provider: "google" | "github") => {
    setError(null);
    setLoading(provider);
    try {
      if (provider === "google") await signInWithGoogle();
      else await signInWithGithub();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
      setLoading(null);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f2ec] px-4 dark:bg-[#171615]">
      <div className="w-full max-w-md rounded-3xl border border-[#d7d0c5] bg-[#fcfbf8] p-8 shadow-lg dark:border-[#4a433b] dark:bg-[#23211f]">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-[#25211c] text-lg font-semibold text-[#f8f5f0] dark:bg-[#f5f2ed] dark:text-[#1b1713]">
            P
          </div>
          <h1 className="font-display text-3xl tracking-tight text-[#25211c] dark:text-[#f5f2ed]">
            perplexity
          </h1>
          <p className="mt-2 text-sm text-[#6f675d] dark:text-[#a39c93]">
            Sign in to start searching with AI
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            disabled={loading !== null}
            onClick={() => handleSignIn("google")}
            className="rounded-full border border-[#d7d0c5] bg-white px-4 py-3 text-sm font-medium text-[#25211c] transition-colors hover:bg-[#f5f1eb] disabled:opacity-50 dark:border-[#4a433b] dark:bg-[#2a2724] dark:text-[#f5f2ed] dark:hover:bg-[#332f2c]"
          >
            {loading === "google" ? "Redirecting..." : "Continue with Google"}
          </button>
          <button
            type="button"
            disabled={loading !== null}
            onClick={() => handleSignIn("github")}
            className="rounded-full bg-[#25211c] px-4 py-3 text-sm font-medium text-[#f8f5f0] transition-colors hover:bg-[#171411] disabled:opacity-50 dark:bg-[#f5f2ed] dark:text-[#1b1713] dark:hover:bg-white"
          >
            {loading === "github" ? "Redirecting..." : "Continue with GitHub"}
          </button>
        </div>

        {error ? <p className="mt-4 text-center text-sm text-red-600">{error}</p> : null}
      </div>
    </div>
  );
}
