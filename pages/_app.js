import "../styles/globals.css";
import Head from "next/head";
import Background from "../components/background";
import Menu from "../components/menu";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";

function MyApp({ Component, pageProps }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portfolio.fipcrypto.com";
  const description =
    "I'm a crypto-native Content Strategist with 4+ years in Web3. Learn more about me here";
  const previewImage = `${siteUrl}/og/preview.png`;

  return (
    <>
      <Head>
        <title>Gideon Ng</title>
        <meta property="og:title" content="Gideon Ng" />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={previewImage} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Gideon Ng" />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={previewImage} />
        <link rel="icon" href="/favicon.png" type="image/png" />
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
