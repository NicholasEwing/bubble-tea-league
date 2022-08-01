import { useState, useEffect, useRef, cloneElement } from "react";
import ClientOnlyPortal from "../ClientOnlyPortal";

export default function Modal({ open, setOpen, children }) {
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
  useOnClickOutside(ref, () => setOpen(false));

  return (
    <>
      {open && (
        <ClientOnlyPortal selector="#modal">
          <div className="backdrop fixed backdrop-blur-sm top-0 right-0 bottom-0 left-0 overflow-y-auto">
            <div
              ref={ref}
              className="modal absolute w-full md:w-auto flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-slate-400 ring-slate-900 ring-1 ring-opacity-10 rounded-md shadow-xl md:min-w-[80%] md:min-h-[80%] min-w-screen min-h-screen md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2"
            >
              {cloneElement(children, { setOpen })}
            </div>
          </div>
        </ClientOnlyPortal>
      )}
    </>
  );
}
