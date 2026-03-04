import Head from "next/head";
import React, { useEffect } from "react";
import util from "../styles/util.module.css";
import ContactContent from "../components/contactContent";
import Script from "next/script";
import Tile from "../components/tiles/tile";
import {
  getDatabaseId,
  getDate,
  getFileUrl,
  getRichText,
  getTitle,
  getUrl,
  queryVisible,
} from "../lib/notion-portfolio";

export default function About({ list }) {
  useEffect(() => {
    const thisPage = document.querySelector("#aboutPage");
    const top = sessionStorage.getItem("about-scroll");
    if (top !== null && thisPage) {
      thisPage.scrollTop = top;
    }
    const handleScroll = () => {
      if (thisPage) sessionStorage.setItem("about-scroll", thisPage.scrollTop);
    };
    if (thisPage) thisPage.addEventListener("scroll", handleScroll);
    return () => {
      if (thisPage) thisPage.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const description = `Crypto-native Content Strategist with 4+ years in Web3. I help teams translate complex blockchain concepts into content that builds trust and real audiences.`;

  return (
    <>
      <Head>
        <title>Gideon Ng</title>
        <meta name="description" content={description} />
        <meta property="og:image" content="https://www.sj.land/og/index.png" />
      </Head>

      <script async src="https://www.googletagmanager.com/gtag/js?id=G-T2CWC86NTK"></script>
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-T2CWC86NTK');
        `}
      </Script>

      <main className={util.page} id="aboutPage">
        <div className={util.pageColumn}>
          <h1 className={util.header}>About</h1>
          <div className={util.inset}>
            <div className={util.read}>
              <p>
                Crypto-native Content Strategist with 4+ years in Web3. I help teams
                translate complex blockchain concepts into content that builds trust
                and real audiences.
              </p>
              <p>
                I&apos;ve worked across both sides of this space: the infrastructure
                layer at Automata Network (TEEs and other privacy-enhancing
                technologies), and the retail/education layer through FIP Crypto, my
                personal brand.
              </p>
              <p>
                These experiences have pushed my writing to cater to both developers
                and complete beginners alike.
              </p>
              <p>Here&apos;s what I&apos;ve built:</p>
              <ul>
                <li>
                  Launched social campaigns at Automata averaging 100k+ views on
                  Twitter
                </li>
                <li>
                  Grew communities like Discord from scratch from 0 to 2,000+ members
                </li>
                <li>
                  Generated 20M+ annual impressions on X through educational threads
                  and DeFi strategy breakdowns
                </li>
                <li>
                  Grew a Substack newsletter to 4,600 subscribers at 15% open rates
                </li>
              </ul>
              <p>
                I&apos;m most at home in teams that care about quality over volume and
                want content that builds trust and leaves a lasting impact on the
                reader.
              </p>
            </div>

            <div className={util.inset} style={{ marginBottom: "4rem" }}>
              <ContactContent />
            </div>

            <div className={util.read}>
              <h2 id="about-update" style={{ margin: "4rem 0rem 0.25rem 0rem" }}>
                Recent Updates
              </h2>
            </div>

            <ul className={util.list} style={{ margin: "0rem" }}>
              {list.map((item) => (
                <Tile
                  key={item.id}
                  internalUrl={item.properties.Path?.url || null}
                  logoUrl={getFileUrl(item, "Logo")}
                  title={getTitle(item)}
                  content={getRichText(item, "Description")}
                  url={getUrl(item, "URL") || "#"}
                  date={getDate(item, "Date") || item.created_time}
                />
              ))}
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}

export async function getStaticProps() {
  const updatesDbId = getDatabaseId("NOTION_UPDATES_ID", "NOTION_RECENTS_ID");
  const list = updatesDbId
    ? await queryVisible({
        databaseId: updatesDbId,
        sorts: [{ property: "Date", direction: "descending" }],
      })
    : [];

  return {
    props: { list },
    revalidate: 5,
  };
}
