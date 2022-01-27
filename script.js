function loadNavbar() {
  const navbar = document.querySelector(".navbar");
  navbar.innerHTML = `
  <header class="text-gray-400 bg-gray-900 body-font">
  <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
    <a class="flex title-font font-medium items-center text-white mb-4 md:mb-0">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
      </svg>
      <a href="./index.html" class="text-white text-xl font-medium hover:text-gray-300"><span class="ml-3 text-xl">Bubble Tea League</span></a>
    </a>
    <nav class="md:ml-auto flex flex-wrap items-center text-base justify-center">
      <a href="./matches.html"class="mr-5 hover:text-white">Matches</a>
      <a href="./players.html"class="mr-5 hover:text-white">Players</a>
      <a href="./contact.html"class="mr-5 hover:text-white">Contact</a>
    </nav>
    <a href="https://github.com/NicholasEwing/bubble-tea-league" target="__blank">
      <button class="inline-flex items-center bg-gray-800 border-0 py-1 px-3 focus:outline-none hover:bg-gray-700 hover:text-white rounded text-base mt-4 md:mt-0">
        <svg
        class="mr-2 text-gray-400"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        >
          <path
            d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
          />
        </svg>
        Github
      </button>
    </a>
  </div>
</header>
  `;
}

function getUrlParams() {
  const queryString = window.location.search;
  return new URLSearchParams(queryString);
}

function parseTeamName() {
  // check if we're on the team page
  const onTeamPage = window.location.href.indexOf("team.html") > 0;

  // only run function if we're on the team page
  if (onTeamPage) {
    const urlParams = getUrlParams();
    const urlTeamName = urlParams.get("teamName");
    const teamName = urlTeamName.match(/[A-Z][a-z]+/g).join(" ");

    const teamNameEl = document.querySelector(".team-name");
    teamNameEl.textContent = teamName;
  }
}

loadNavbar();
parseTeamName();
