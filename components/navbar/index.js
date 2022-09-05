/* This example requires Tailwind CSS v2.0+ */
import Link from "next/link";
import Image from "next/image";
import { Fragment, useState, useEffect } from "react";
import HomeIcon from "./HomeIcon";
import DesktopNavLink from "./DesktopNavLink";
import ProfileDropdown from "./ProfileDropdown";
import btlLogo from "../../public/btl-logo.png";
import MobileMenuButton from "./MobileMenuButton";
import discordLogo from "../../public/discordLogo.png";
import { signIn, signOut, useSession } from "next-auth/react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { PlusSmIcon } from "@heroicons/react/solid";
import { BellIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import MobileNavLink from "./MobileNavLink";
import admins from "../../admins";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);

  const navigation = [
    {
      name: "Schedule",
      href: "/schedule",
    },
    {
      name: "Standings",
      href: "/standings",
    },
    { name: "Stats", href: "/player-stats" },
    { name: "Rules", href: "/rules" },
  ];

  useEffect(() => {
    const userIsAdmin = admins.includes(session?.user?.email);
    setIsAdmin(userIsAdmin);
  }, [session]);

  if (isAdmin)
    navigation.push({
      name: "Admin",
      href: "/admin",
    });

  return (
    <Disclosure
      as="nav"
      className="border-b-2 border-b-[rgba(51,51,51,.25)] bg-[#0a0e13]"
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <MobileMenuButton isOpen={open} />
              </div>
              <div className="items-left flex flex-1 justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <HomeIcon />
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <DesktopNavLink
                        key={item.name}
                        {...item}
                        classNames={classNames}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* todo, if not signed in, show sign in button */}
                {/* if signed in, show profile dropdown */}
                <ProfileDropdown
                  session={session}
                  status={status}
                  discordLogo={discordLogo}
                  classNames={classNames}
                />
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item) => (
                <MobileNavLink
                  key={item.name}
                  {...item}
                  classNames={classNames}
                />
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
