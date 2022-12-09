import { CheckIcon, ClipboardCopyIcon } from "@heroicons/react/solid";
import React, { useEffect, useState } from "react";

export default function CopyButton({ tournamentCode }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (copied) setCopied(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [copied]);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(tournamentCode);
        setCopied(true);
      }}
      className={`${
        copied && "border-2 border-green-700 text-green-300"
      } inline-flex cursor-pointer select-none items-center rounded-full border-2 border-gray-500 px-2.5 py-0.5`}
    >
      <ClipboardCopyIcon className={`${copied && "hidden"} mx-1 w-4`} />
      <CheckIcon className={copied ? "visible mx-1 w-4" : "hidden"} />
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
