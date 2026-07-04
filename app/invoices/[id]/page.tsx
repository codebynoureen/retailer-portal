import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DownloadButton from "@/components/DownloadButton";
import invoices from "@/data/invoices";

export default async function InvoiceDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const invoice = invoices.find((item) => item.id === id);

  if (!invoice) {
    return (
      <div className="max-w-sm mx-auto min-h-screen bg-bg flex flex-col">
        <Header title="Invoice Details" subtitle={id} />
        <main className="flex-1 p-4 pb-24">
          <p className="text-text-muted">Invoice not found</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto min-h-screen bg-bg flex flex-col">
      <Header title="Invoice Details" subtitle={id} />

      <main className="flex-1 p-4 pb-24 space-y-4">
        <div className="border border-border bg-surface rounded-xl p-4 space-y-1 text-sm text-text">
          <p>
            <strong>Invoice No:</strong> {id}
          </p>
          <p>
            <strong>Amount:</strong> {invoice.amount}
          </p>
          <p>
            <strong>Status:</strong> {invoice.status}
          </p>
          <p>
            <strong>Due Date:</strong> {invoice.dueDate}
          </p>
        </div>

        {invoice.items && (
          <div>
            <h3 className="text-base font-bold font-display mb-2 text-text">
              Line Items
            </h3>
            <div className="bg-surface border border-border rounded-xl px-4">
              {invoice.items.map((item) => (
                <div
                  key={item.name}
                  className="flex justify-between border-b border-border last:border-b-0 py-3 text-sm"
                >
                  <span className="text-text">{item.name}</span>
                  <span className="font-mono-num text-text">{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-base font-bold font-display mb-2 text-text">
            Payment History
          </h3>
          <div className="bg-surface border border-border rounded-xl px-4">
            {invoice.payments.map((payment) => (
              <div
                key={payment.date}
                className="flex justify-between border-b border-border last:border-b-0 py-3 text-sm"
              >
                <div>
                  <p className="text-text">{payment.method}</p>
                  <p className="text-xs text-text-muted">{payment.date}</p>
                </div>
                <span className="font-mono-num text-text">{payment.amount}</span>
              </div>
            ))}
          </div>
        </div>

        <DownloadButton />
      </main>

      <Footer />
    </div>
  );
}