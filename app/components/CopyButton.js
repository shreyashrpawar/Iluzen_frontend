"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react"; // optional, for icons

export default function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500); // reset after 1.5s
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 text-xs rounded-lg bg-blue-100 text-slate-500 p-2 m-2 hover:bg-slate-700 transition"
    >
      {copied ? (
        <>
          <Check size={10} className="text-green-400" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Copy size={10} />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}
