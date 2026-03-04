import Head from "next/head";
import React, { useEffect } from "react";
import util from "../styles/util.module.css";
import Script from "next/script";
import ProjectTile from "../components/tiles/projectTile";
import {
  getDate,
  getDatabaseId,
  getFileUrl,
  getMultiSelect,
  getRichTextPlain,
  getSlug,
  getTitle,
  queryVisible,
} from "../lib/notion-portfolio";

export default function Projects({ list }) {
  useEffect(() => {
    const thisPage = document.querySelector("#projectsPage");
    const top = sessionStorage.getItem("projects-scroll");
    if (top !== null) thisPage.scrollTop = top;
    const handleScroll = () => {
      sessionStorage.setItem("projects-scroll", thisPage.scrollTop);
    };
    thisPage.addEventListener("scroll", handleScroll);
    return () => thisPage.removeEventListener("scroll", handleScroll);
  }, []);

  const description = "Projects that I've worked on (click to expand)";
  const getMeta = (item) => {
    const tags = getMultiSelect(item, "Tags").map((tag) => tag.name).filter(Boolean);
    return tags.join(" · ");
  };

  return (
    <>
      <Head>
        <title>Gideon Ng</title>
        <meta name="description" content={description} />
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

      <main id="projectsPage" className={util.page}>
        <div className={util.pageColumn}>
          <h1 className={util.header}>Projects</h1>
          <p className={util.description}>{description}</p>
          <ul className={util.list}>
            {list.map((item) => (
              <ProjectTile
                key={item.id}
                imageUrl={getFileUrl(item, "Cover")}
                title={getTitle(item)}
                content={getRichTextPlain(item, "Summary")}
                type={getMeta(item)}
                date={getDate(item, "Date")}
                href={`/projects/${getSlug(item)}`}
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
  const projectsDbId = getDatabaseId("NOTION_PROJECTS_ID", "NOTION_CAM_PROJECTS_ID");
  const list = projectsDbId
    ? await queryVisible({
        databaseId: projectsDbId,
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
