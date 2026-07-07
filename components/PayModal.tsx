"use client";

import { useState } from "react";

type PaymentMethod = "CASH" | "BANK_TRANSFER" | "JAZZCASH" | "EASYPAISA";

const METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "CASH", label: "Cash" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "JAZZCASH", label: "JazzCash" },
  { value: "EASYPAISA", label: "EasyPaisa" },
];

type PayModalProps = {
  invoiceNo: string;
  remainingPaisa: number;
  remainingLabel: string;
  onClose: () => void;
  onSubmit: (amountPaisa: number, method: PaymentMethod) => Promise<void>;
};

export default function PayModal({
  invoiceNo,
  remainingPaisa,
  remainingLabel,
  onClose,
  onSubmit,
}: PayModalProps) {
  const remainingRupees = Math.round(remainingPaisa / 100);
  const [amountInput, setAmountInput] = useState(remainingRupees.toString());
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const enteredRupees = Number(amountInput);
  const isAmountValid =
    amountInput.trim() !== "" &&
    Number.isFinite(enteredRupees) &&
    enteredRupees > 0 &&
    Math.round(enteredRupees * 100) <= remainingPaisa;

  async function handleSubmit() {
    setError(null);

    if (!isAmountValid) {
      setError(`Enter an amount between PKR 1 and ${remainingLabel.replace("PKR ", "")}`);
      return;
    }
    if (!method) {
      setError("Select a payment method");
      return;
    }

    const amountPaisa = Math.round(enteredRupees * 100);

    setSubmitting(true);
    try {
      await onSubmit(amountPaisa, method);
    } catch {
      setError("Payment failed. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-surface rounded-t-2xl p-5 pb-6 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1.5 bg-border-strong rounded-full mx-auto mb-4" />

        <h2 className="text-lg font-bold font-display text-text">Pay Invoice</h2>
        <p className="text-sm text-text-muted mt-0.5">{invoiceNo}</p>

        <div className="mt-4">
          <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">
            Amount (PKR)
          </label>
          <div className="mt-1.5 flex items-center gap-2 border border-border rounded-lg px-3 h-14 bg-surface-2">
            <span className="text-text-muted font-semibold">PKR</span>
            <input
              type="number"
              inputMode="decimal"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              className="flex-1 bg-transparent outline-none text-xl font-bold font-mono-num text-text"
              placeholder="0"
            />
          </div>
          <p className="text-xs text-text-muted mt-1.5">
            Remaining balance: <span className="font-semibold text-text">{remainingLabel}</span>
          </p>
        </div>

        <div className="mt-5">
          <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">
            Payment Method
          </label>
          <div className="grid grid-cols-2 gap-3 mt-1.5">
            {METHODS.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMethod(m.value)}
                className={`h-12 rounded-lg border-[1.5px] font-semibold text-sm transition-colors ${
                  method === m.value
                    ? "bg-dist-subtle border-dist text-dist"
                    : "bg-surface border-border text-text-dim active:bg-surface-2"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-sm text-danger bg-danger-subtle rounded-lg px-3 py-2 mt-4">
            {error}
          </p>
        )}

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="flex-1 h-12 rounded-lg font-semibold text-sm bg-surface text-dist border-[1.5px] border-border-strong disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 h-12 rounded-lg font-semibold text-sm bg-dist text-white active:bg-dist-hover disabled:opacity-60"
          >
            {submitting ? "Processing…" : "Confirm Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}