import { useRef, useEffect, useState, ReactNode } from "react";
import { createPortal } from "react-dom";

interface ClientOnlyPortalProps {
  children: ReactNode[] | ReactNode;
  selector: string;
}

export default function ClientOnlyPortal({
  children,
  selector,
}: ClientOnlyPortalProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    ref.current = document.querySelector(selector) as HTMLElement;
    setMounted(true);
  }, [selector]);

  if (ref) {
    return mounted ? createPortal(children, ref.current!) : null;
  } else {
    return null;
  }
}
