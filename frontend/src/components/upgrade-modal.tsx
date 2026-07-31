import { X } from "lucide-react";

type UpgradeModalProps = {
  open: boolean;
  creditsUsed: number;
  creditLimit: number;
  plan: string;
  onClose: () => void;
};

const PRICING_URL = import.meta.env.VITE_PRICING_URL ?? "/pricing";

export function UpgradeModal({
  open,
  creditsUsed,
  creditLimit,
  plan,
  onClose,
}: UpgradeModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="relative w-full max-w-md rounded-3xl border border-[#d7d0c5] bg-[#fcfbf8] p-6 shadow-2xl dark:border-[#4a433b] dark:bg-[#23211f]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-[#8a8176] hover:bg-[#f2ede6] dark:hover:bg-[#2b2825]"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>

        <h2 className="font-display text-2xl text-[#25211c] dark:text-[#f5f2ed]">
          You&apos;ve used all your free queries
        </h2>
        <p className="mt-2 text-sm text-[#6f675d] dark:text-[#a39c93]">
          You&apos;ve used {creditsUsed} of {creditLimit} queries on the {plan} plan.
          Upgrade to continue searching without limits.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <a
            href={PRICING_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl bg-accent px-4 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            View pricing &amp; upgrade
            <span className="ml-2 rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
              Pro
            </span>
          </a>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-4 py-3 text-sm text-[#6f675d] transition-colors hover:bg-[#f2ede6] dark:text-[#a39c93] dark:hover:bg-[#2b2825]"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
