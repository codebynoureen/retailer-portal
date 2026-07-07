import crypto from "crypto";

interface JazzCashRequestInput {
  amountPaisa: number;
  invoiceId: string;
  billReference: string;
}

interface JazzCashRequestPayload {
  pp_Version: string;
  pp_TxnType: string;
  pp_Language: string;
  pp_MerchantID: string;
  pp_SubMerchantID: string;
  pp_Password: string;
  pp_BankID: string;
  pp_ProductID: string;
  pp_TxnRefNo: string;
  pp_Amount: string;
  pp_TxnCurrency: string;
  pp_TxnDateTime: string;
  pp_BillReference: string;
  pp_Description: string;
  pp_TxnExpiryDateTime: string;
  pp_SecureHash: string;
}

function formatDateTime(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    date.getFullYear().toString() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  );
}

/**
 * Builds a JazzCash Mobile Wallet transaction request payload, including
 * the pp_SecureHash computed via HMAC-SHA256 as required by JazzCash's API.
 *
 * NOTE: JAZZCASH_INTEGRITY_SALT is currently a placeholder/dummy value.
 * JazzCash only issues the real Integrity Salt to licensed merchant
 * accounts — swap the .env value once that access is granted. No code
 * changes will be needed at that point; only the env var.
 *
 * This function is NOT currently called from any live payment flow.
 * Per project sign-off, recording the payment method/details in our own
 * database (see POST /api/invoices/:id/pay) is sufficient for this
 * submission — this file exists so the integration path is ready to
 * activate later without rewriting anything.
 */
export function buildJazzCashRequest(input: JazzCashRequestInput): JazzCashRequestPayload {
  const merchantId = process.env.JAZZCASH_MERCHANT_ID!;
  const password = process.env.JAZZCASH_PASSWORD!;
  const integritySalt = process.env.JAZZCASH_INTEGRITY_SALT!;

  const now = new Date();
  const expiry = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour expiry

  const txnRefNo = `T${now.getTime()}`;
  const amountString = input.amountPaisa.toString(); // JazzCash expects amount in paisa, no decimal

  const fields = {
    pp_Version: "1.1",
    pp_TxnType: "MWALLET",
    pp_Language: "EN",
    pp_MerchantID: merchantId,
    pp_SubMerchantID: "",
    pp_Password: password,
    pp_BankID: "TBANK",
    pp_ProductID: "RETL",
    pp_TxnRefNo: txnRefNo,
    pp_Amount: amountString,
    pp_TxnCurrency: "PKR",
    pp_TxnDateTime: formatDateTime(now),
    pp_BillReference: input.billReference,
    pp_Description: `Payment for invoice ${input.invoiceId}`,
    pp_TxnExpiryDateTime: formatDateTime(expiry),
  };

  // JazzCash requires fields sorted alphabetically by key, concatenated
  // with '&', with the Integrity Salt prepended, then HMAC-SHA256 signed.
  const sortedValues = Object.keys(fields)
    .sort()
    .map((key) => fields[key as keyof typeof fields])
    .filter((v) => v !== "")
    .join("&");

  const hashString = `${integritySalt}&${sortedValues}`;
  const pp_SecureHash = crypto
    .createHmac("sha256", integritySalt)
    .update(hashString)
    .digest("hex")
    .toUpperCase();

  return { ...fields, pp_SecureHash };
}