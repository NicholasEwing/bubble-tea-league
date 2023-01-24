import { useState, useEffect, useRef, cloneElement } from "react";
import ClientOnlyPortal from "../ClientOnlyPortal";

export default function Modal({ open, closeModal, children }) {
  const ref = useRef();

  function useOnClickOutside(ref, handler) {
    useEffect(
      () => {
        const listener = (event) => {
          // Do nothing if clicking ref's element or descendent elements
          if (!ref.current || ref.current.contains(event.target)) {
            return;
          }
          handler(event);
        };
        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);
        return () => {
          document.removeEventListener("mousedown", listener);
          document.removeEventListener("touchstart", listener);
        };
      },
      // Add ref and handler to effect dependencies
      // It's worth noting that because the passed-in handler is a new ...
      // ... function on every render that will cause this effect ...
      // ... callback/cleanup to run every render. It's not a big deal ...
      // ... but to optimize you can wrap handler in useCallback before ...
      // ... passing it into this hook.
      [ref, handler]
    );
  }

  // TODO: show confirm close button if clicking outside while form inputs have information
  useOnClickOutside(ref, closeModal);

  return (
    <>
      {open && (
        <ClientOnlyPortal selector="#modal">
          <div className="backdrop fixed top-0 right-0 bottom-0 left-0 overflow-y-auto backdrop-blur-sm">
            <div
              ref={ref}
              className="modal min-w-screen absolute flex min-h-screen w-full flex-col items-center justify-center rounded-md bg-gradient-to-br from-slate-900 to-slate-800 text-slate-400 shadow-xl ring-1 ring-slate-900 ring-opacity-10 md:top-1/2 md:left-1/2 md:min-h-[80%] md:w-auto md:min-w-[80%] md:-translate-x-1/2 md:-translate-y-1/2"
            >
              {cloneElement(children, { closeModal })}
            </div>
          </div>
        </ClientOnlyPortal>
      )}
    </>
  );
}
