import { useEffect } from "react";
import { useNavigate } from "react-router";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      navigate(data.session ? "/" : "/auth", { replace: true });
    });
  }, [navigate]);

  return (
    <div className="flex h-screen items-center justify-center bg-[#f6f2ec] text-[#6f675d] dark:bg-[#171615] dark:text-[#a39c93]">
      Signing you in...
    </div>
  );
}
