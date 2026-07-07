type InvoiceCardProps = {
  invoiceNo: string;
  date: string;
  amount: string;
  status: string;
  onDownload?: () => void;
  onPay?: () => void;
};

export default function InvoiceCard({
  invoiceNo,
  date,
  amount,
  status,
  onDownload,
  onPay,
}: InvoiceCardProps) {
  const statusColor =
    status === "Paid"
      ? "bg-success-subtle text-success"
      : status === "Partial"
      ? "bg-warning-subtle text-warning"
      : status === "Pending"
      ? "bg-info-subtle text-info"
      : "bg-danger-subtle text-danger";

  return (
    <div className="bg-surface border border-border rounded-xl p-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-sm text-text">{invoiceNo}</h3>
          <p className="text-xs text-text-muted mt-0.5">{date}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-bold font-mono-num text-sm text-text">{amount}</p>
            <span
              className={`text-[10px] font-bold px-2 py-1 rounded-full inline-block mt-1 ${statusColor}`}
            >
              {status}
            </span>
          </div>

          {onDownload && (
            <button
              type="button"
              onClick={onDownload}
              aria-label={`Download invoice ${invoiceNo} PDF`}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-dist active:bg-dist-subtle shrink-0"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {onPay && (
        <button
          type="button"
          onClick={onPay}
          className="w-full mt-3 h-10 bg-dist text-white rounded-lg text-sm font-semibold active:bg-dist-hover"
        >
          Pay Now
        </button>
      )}
    </div>
  );
}