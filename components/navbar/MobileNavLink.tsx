import { Disclosure, Menu, Transition } from "@headlessui/react";

interface MobileNavLinkProps {
  name: string;
  href: string;
  current?: string;
  classNames: Function;
}

export default function MobileNavLink({
  name,
  href,
  current,
  classNames,
}: MobileNavLinkProps) {
  return (
    <Disclosure.Button
      key={name}
      as="a"
      href={href}
      className={classNames(
        current
          ? "bg-gray-900 text-white"
          : "text-gray-300 hover:bg-gray-700 hover:text-white",
        "block rounded-md px-3 py-2 text-base font-medium"
      )}
      aria-current={current ? "page" : undefined}
    >
      {name}
    </Disclosure.Button>
  );
}
