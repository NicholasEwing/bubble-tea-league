import "../styles/globals.css";
import "@glideapps/glide-data-grid/dist/index.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { SessionProvider } from "next-auth/react";
import APIErrorProvider from "../components/providers/APIErrorProvider";
import APIErrorNotification from "../components/alerts/APIErrorNotification";
import Layout from "../components/layout";
import useAPIError from "../components/hooks/useAPIError";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <APIErrorProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <APIErrorNotification />
      </APIErrorProvider>
    </SessionProvider>
  );
}

export default MyApp;
