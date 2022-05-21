const { default: fetch } = require("node-fetch");

async function createProviderId() {
  // Docs on creating a new providerId
  // New API key means you need to re-register as a provider
  // https://developer.riotgames.com/apis#tournament-stub-v4/POST_registerProviderData

  const ProviderRegistrationParameters = {
    region: "NA",
    url: process.env.BTL_MATCHES_ENDPOINT,
  };

  const res = await fetch(
    "https://americas.api.riotgames.com/lol/tournament-stub/v4/providers",
    {
      method: "POST",
      body: JSON.stringify(ProviderRegistrationParameters),
      headers: {
        "X-Riot-Token": process.env.RIOT_GAMES_API_KEY,
      },
    }
  );

  const providerId = await res.json();
  const hasStatusCode = !!providerId?.status?.status_code;

  let statusCode;
  if (hasStatusCode) {
    statusCode = providerId?.status?.status_code;
  }

  if (hasStatusCode && (statusCode < 200 || statusCode >= 300)) {
    throw new Error(
      `Error from Riot Games API. Received status code ${statusCode}`
    );
  }

  return providerId;
}

module.exports = { createProviderId };
