import Image from "next/image";
import React from "react";
import discordLogo from "../../public/discordLogo.png";
import { signIn, signOut } from "next-auth/react";

export default function SignInButton() {
  return (
    <button className="relative flex h-12 w-28 items-center justify-between rounded-md border border-transparent bg-indigo-500 px-2 py-1 text-sm font-medium text-white shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800">
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
    </button>
  );
}
