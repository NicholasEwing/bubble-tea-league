interface DesktopNavLinkProps {
  name: string;
  href: string;
  current?: string;
  classNames: Function;
}

export default function DesktopNavLink({
  name,
  href,
  current,
  classNames,
}: DesktopNavLinkProps) {
  return (
    <a
      key={name}
      href={href}
      className={classNames(
        current
          ? "bg-gray-900 text-white"
          : "text-gray-300 hover:bg-gray-700 hover:text-white",
        "rounded-md px-3 py-2 text-sm font-medium"
      )}
      aria-current={current ? "page" : undefined}
    >
      {name}
    </a>
  );
}
