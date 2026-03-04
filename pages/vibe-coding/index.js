import Head from "next/head";
import React, { useEffect } from "react";
import util from "../../styles/util.module.css";
import ProjectTile from "../../components/tiles/projectTile";
import {
  getDate,
  getDatabaseId,
  getFileUrl,
  getMultiSelect,
  getRichTextPlain,
  getSlug,
  getTitle,
  queryVisible,
} from "../../lib/notion-portfolio";

export default function VibeCoding({ list }) {
  useEffect(() => {
    const thisPage = document.querySelector("#vibeCodingPage");
    const top = sessionStorage.getItem("vibe-coding-scroll");
    if (top !== null) thisPage.scrollTop = top;
    const handleScroll = () => {
      sessionStorage.setItem("vibe-coding-scroll", thisPage.scrollTop);
    };
    thisPage.addEventListener("scroll", handleScroll);
    return () => thisPage.removeEventListener("scroll", handleScroll);
  }, []);

  const getMeta = (item) => {
    const tags = getMultiSelect(item, "Tags").map((tag) => tag.name).filter(Boolean);
    return tags.join(" · ");
  };

  return (
    <>
      <Head>
        <title>Gideon Ng</title>
        <meta
          name="description"
          content="Results of my vibe coding experiments in both work and personal use"
        />
      </Head>
      <main className={util.page} id="vibeCodingPage">
        <div className={util.pageColumn}>
          <h1 className={util.header}>Vibe Coding</h1>
          <p className={util.description}>
            Results of my vibe coding experiments in both work and personal use
          </p>
          <ul className={util.list}>
            {list.map((item) => (
              <ProjectTile
                key={item.id}
                imageUrl={getFileUrl(item, "Cover")}
                title={getTitle(item)}
                href={`/vibe-coding/${getSlug(item)}`}
                content={getRichTextPlain(item, "Summary")}
                type={getMeta(item)}
                date={getDate(item, "Date")}
                internal={true}
              />
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}

export async function getStaticProps() {
  const vibeDbId = getDatabaseId("NOTION_VIBE_CODING_ID");
  const list = vibeDbId
    ? await queryVisible({
        databaseId: vibeDbId,
        sorts: [{ property: "Date", direction: "descending" }],
      })
    : [];

  return {
    props: {
      list,
    },
    revalidate: 5,
  };
}
