import { User } from "@prisma/client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import SectionContainer from "../../components/Containers/SectionContainer";

import admins from "../../admins";
import { useEffect } from "react";
import Image from "next/image";

export const getServerSideProps = async () => {
  const { prisma } = require("../../prisma/db");

  const users = await prisma.user.findMany();

  return {
    props: {
      users: JSON.parse(JSON.stringify(users)),
    },
  };
};

interface UsersProps {
  users: User[];
}

export default function Users({ users }: UsersProps) {
  const router = useRouter();

  const sessionInfo = useSession();
  const { status } = useSession();
  const isAdmin = admins.includes(sessionInfo?.data?.user?.email!);

  useEffect(() => {
    if (status === "authenticated" && !isAdmin) router.push("/");
  }, [status, isAdmin, router]);

  useEffect(() => {
    if (status === "unauthenticated")
      signIn("discord", undefined, { prompt: "none" });
  }, [status]);

  if (!isAdmin && status === "authenticated")
    return (
      <h2 className="mt-6 text-center text-3xl text-white">
        Must be an admin to view this page.
      </h2>
    );

  if (status !== "authenticated") {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="py-8 px-4 text-white">
      <SectionContainer>
        {users.map((u) => (
          <div key={u.id} className="my-4">
            {u.image && (
              <Image
                className="rounded-full"
                src={u.image}
                alt={`${u.name} image`}
                width={50}
                height={50}
              />
            )}
            <h1>{u.name}</h1>
            <p>{u.email}</p>
          </div>
        ))}
      </SectionContainer>
    </div>
  );
}
