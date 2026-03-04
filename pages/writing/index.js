import Head from "next/head";
import React, { useEffect } from "react";
import util from "../../styles/util.module.css";
import Script from "next/script";
import WritingCard from "../../components/tiles/writingCard";
import {
  getDatabaseId,
  getFileUrl,
  getRichTextPlain,
  getTitle,
  getUrl,
  queryVisible,
} from "../../lib/notion-portfolio";

export default function Writing({ list }) {
  useEffect(() => {
    let thisPage = document.querySelector("#writingPage");
    let top = sessionStorage.getItem("writing-scroll");
    if (top !== null) {
      thisPage.scrollTop = top;
    }
    const handleScroll = () => {
      sessionStorage.setItem("writing-scroll", thisPage.scrollTop);
    };
    thisPage.addEventListener("scroll", handleScroll);
    return () => thisPage.removeEventListener("scroll", handleScroll);
  }, []);

  const description =
    "The pieces I'm most proud of spanning @fipcrypto, @nuhgid, and Automata";
  return (
    <>
      <Head>
        <title>Gideon Ng</title>
        <meta name="description" content={description} />
        <meta property="og:image" content="https://www.sj.land/og/index.png" />
      </Head>

      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-T2CWC86NTK"
      ></script>
      <Script id="google-analytics" strategy="afterInteractive">
        {`
       window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-T2CWC86NTK');
        `}
      </Script>
      <main className={util.page} id="writingPage">
        <div className={util.pageColumn}>
          <h1 className={util.header}>Writing</h1>
          <p className={util.description}>{description}</p>
          <div className={util.grid}>
            {list.map((item) => {
              const articleUrl = getUrl(item, "ArticleURL") || item.url || "#";
              return (
                <WritingCard
                  key={item.id}
                  title={getTitle(item)}
                  excerpt={getRichTextPlain(item, "Excerpt")}
                  href={articleUrl}
                  imageUrl={getFileUrl(item, "Cover")}
                />
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
//notion API
export async function getStaticProps() {
  const writingDbId = getDatabaseId("NOTION_WRITING_ID");
  const list = writingDbId
    ? await queryVisible({
        databaseId: writingDbId,
        sorts: [{ property: "Published", direction: "descending" }],
      })
    : [];

  return {
    props: {
      list,
    },
    revalidate: 5,
  };
}
