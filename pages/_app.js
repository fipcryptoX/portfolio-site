import "../styles/globals.css";
import Head from "next/head";
import Background from "../components/background";
import Menu from "../components/menu";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Gideon Ng</title>
        <link
          rel="icon"
          href="/favicon-light.svg"
          type="image/svg+xml"
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="icon"
          href="/favicon-dark.svg"
          type="image/svg+xml"
          media="(prefers-color-scheme: dark)"
        />
      </Head>
      <Toaster
        toastOptions={{
          duration: 1500,
          style: {
            padding: "3px",
            borderRadius: "6px",
            fontSize: "14px",
          },
        }}
      />
      <div className="base"></div>
      <Background />
      <Menu />
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}

export default MyApp;
