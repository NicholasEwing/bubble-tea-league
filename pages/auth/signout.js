import Image from "next/image";
import Link from "next/link";
import discordLogo from "../../public/discordLogo.png";
import { signOut, useSession } from "next-auth/react";

export default function SignOut() {
  const { data: session, status } = useSession();
  if (session) {
    return (
      <>
        <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2>TODO: BTL Logo here late</h2>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign out of your account
            </h2>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <div>
                <button
                  onClick={() => signOut()}
                  type="submit"
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <div className="flex justify-end items-center mr-2"></div>
                  Sign Out of BTL
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return <h1>You are not signed in!</h1>;
  }
}
