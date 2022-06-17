import React from "react";

export default function DesktopNavLink({ name, href, current, classNames }) {
  return (
    <a
      key={name}
      href={href}
      className={classNames(
        current
          ? "bg-gray-900 text-white"
          : "text-gray-300 hover:bg-gray-700 hover:text-white",
        "px-3 py-2 rounded-md text-sm font-medium"
      )}
      aria-current={current ? "page" : undefined}
    >
      {name}
    </a>
  );
}
