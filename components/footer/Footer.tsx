import React from "react";

export default function Footer() {
  const navigation = [
    {
      name: "GitHub",
      href: "https://github.com/NicholasEwing/bubble-tea-league",
      icon: (props: React.SVGAttributes<SVGSVGElement>) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "Twitch",
      href: "https://www.twitch.tv/thebubbletealeague",
      icon: (props: React.SVGAttributes<SVGSVGElement>) => (
        <svg
          fill="currentColor"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          {...props}
        >
          <path d="M10.224 17.806l1.776-1.776h3.343l2.09-2.09v-6.686h-10.03v8.776h2.821v1.776zm3.866-8.149h1.254v3.653h-1.254v-3.653zm-3.344 0h1.254v3.653h-1.254v-3.653zm1.254-9.657c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.687 14.567l-3.657 3.657h-2.716l-1.777 1.776h-1.88v-1.776h-3.344v-9.821l.941-2.403h12.433v8.567z" />
        </svg>
      ),
    },
  ];
  return (
    <footer className="border-t-2 border-t-[rgba(51,51,51,.25)] bg-[#0a0e13]">
      <div className="mx-auto h-16 max-w-7xl px-4 py-6 sm:px-6 md:flex md:items-center md:justify-between md:py-12 lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </a>
          ))}
        </div>
        <div className="mt-6 md:order-1 md:mt-0">
          <p className="text-center text-xs text-gray-400 md:mr-16 md:text-left">
            BTL is not endorsed by Riot Games and does not reflect views or
            opinions of Riot Games or anyone officially involved in producing or
            managing League of Legends. League of Legends and Riot Games are
            trademarks or registered trademarks of Riot Games, Inc. League of
            Legends© Riot Games, Inc. BTL was created under Riot Games&apos;{" "}
            <a
              href="https://www.riotgames.com/en/legal"
              target="_blank"
              rel="noreferrer"
              className="text-gray-300 underline"
            >
              &quot;Legal Jibber Jabber&quot;
            </a>{" "}
            policy using assets owned by Riot Games. Riot Games does not endorse
            or sponsor this project.
          </p>
        </div>
      </div>
    </footer>
  );
}
