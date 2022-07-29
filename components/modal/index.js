import { useState } from "react";
import ClientOnlyPortal from "../ClientOnlyPortal";

export default function Modal({ open, setOpen, children }) {
  return (
    <>
      {open && (
        <ClientOnlyPortal selector="#modal">
          <div className="backdrop fixed backdrop-blur-sm top-0 right-0 bottom-0 left-0">
            <div className="modal bg-white absolute p-16 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
              {children}
              <button
                onClick={() => setOpen(false)}
                type="button"
                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Close modal
              </button>
            </div>
          </div>
        </ClientOnlyPortal>
      )}
    </>
  );
}
