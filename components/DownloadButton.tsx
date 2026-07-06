"use client";

import Button from "./Button";

export default function DownloadButton() {
  return (
    <div className="invoice" >
      <Button
      title="Print Invoice"
      onClick={() => window.print()} />
      </div>
  );
  
}