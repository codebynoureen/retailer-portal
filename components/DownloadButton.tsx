"use client";

import Button from "./Button";

export default function DownloadButton() {
  return (
    <Button
      title="Print Invoice"
      onClick={() => window.print()}
    />
  );
}