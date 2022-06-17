import React from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";

export default function MobileNavLink({ name, href, current, classNames }) {
  return (
    <Disclosure.Button
      key={name}
      as="a"
      href={href}
      className={classNames(
        current
          ? "bg-gray-900 text-white"
          : "text-gray-300 hover:bg-gray-700 hover:text-white",
        "block px-3 py-2 rounded-md text-base font-medium"
      )}
      aria-current={current ? "page" : undefined}
    >
      {name}
    </Disclosure.Button>
  );
}
