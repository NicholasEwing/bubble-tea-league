import React from "react";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import Image from "next/image";
import { signIn, signOut } from "next-auth/react";

export default function ProfileDropdown({
  session,
  status,
  discordLogo,
  classNames,
}) {
  return (
    <Menu as="div" className="relative ml-3">
      <div>
        <Menu.Button
          className={
            status !== "authenticated" && !session
              ? "relative flex h-12 w-28 items-center justify-between rounded-md border border-transparent bg-indigo-500 px-2 py-1 text-sm font-medium text-white shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              : "flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
          }
        >
          {status !== "authenticated" && !session ? (
            <a
              onClick={(e) => {
                e.preventDefault();
                signIn("discord", null, { prompt: "none" });
              }}
              className="flex items-center"
            >
              <div className="mx-1 grid h-10 w-8 place-items-center">
                <Image
                  src={discordLogo}
                  alt="Discord Logo"
                  width="30"
                  height="33.75"
                />
              </div>
              <p className="mx-1 mb-0.5 text-sm">Sign In</p>
            </a>
          ) : (
            <>
              <span className="sr-only">Open user menu</span>
              <Image
                className="h-8 w-8 rounded-full"
                src={session?.user?.image}
                alt="Profile icon"
                width="30"
                height="30"
              />
            </>
          )}
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-30 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Menu.Item>
            {({ active }) => (
              <a
                href="#"
                className={classNames(
                  active ? "bg-gray-100" : "",
                  "block px-4 py-2 text-sm text-gray-700"
                )}
              >
                Your Profile
              </a>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <a
                href="#"
                className={classNames(
                  active ? "bg-gray-100" : "",
                  "block px-4 py-2 text-sm text-gray-700"
                )}
              >
                Settings
              </a>
            )}
          </Menu.Item>
          {status === "authenticated" && session && (
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? "bg-gray-100" : "",
                    "block px-4 py-2 text-sm text-gray-700"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    signOut();
                  }}
                >
                  Sign out
                </a>
              )}
            </Menu.Item>
          )}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
