import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import SequelizeAdapter from "@next-auth/sequelize-adapter";
import sequelize from "../../../sequelize/index";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
  adapter: SequelizeAdapter(sequelize),
});
