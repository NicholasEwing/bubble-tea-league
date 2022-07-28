import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import SequelizeAdapter from "@next-auth/sequelize-adapter";
import sequelize from "../../../sequelize/index.js";

// I usually have an isAdmin flag or something in the sessions, which is based on the database tag

export default NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
  adapter: SequelizeAdapter(sequelize),
  callbacks: {
    async session({ session, token, user }) {
      session.user.id = user.id; // used to uniquely identify user
      return session;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
});
