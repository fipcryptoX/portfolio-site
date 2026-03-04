import Head from "next/head";
import Link from "next/link";
import util from "../../styles/util.module.css";
import NotionBlockRenderer from "../../components/notionBlockRenderer";
import {
  getDate,
  getDatabaseId,
  getRichTextPlain,
  getSlug,
  getTitle,
  listPageBlocks,
  queryVisible,
} from "../../lib/notion-portfolio";

export default function VibeCodingDetail({ project, blocks }) {
  const description = getRichTextPlain(project, "Summary");
  return (
    <>
      <Head>
        <title>Gideon Ng</title>
        <meta name="description" content={description} />
      </Head>
      <main className={util.page}>
        <div className={util.pageColumn}>
          <h1 className={util.header}>{getTitle(project)}</h1>
          {getDate(project, "Date") ? (
            <p className={util.projectDate}>{getDate(project, "Date")}</p>
          ) : null}
          <p className={util.description}>{description}</p>
          <NotionBlockRenderer blocks={blocks} />
          <Link href="/vibe-coding">
            <a className={util.backButton}>← Other Projects</a>
          </Link>
        </div>
      </main>
    </>
  );
}

export async function getStaticPaths() {
  const vibeDbId = getDatabaseId("NOTION_VIBE_CODING_ID");
  const list = vibeDbId
    ? await queryVisible({
        databaseId: vibeDbId,
        sorts: [{ property: "Date", direction: "descending" }],
      })
    : [];

  return {
    paths: list.map((item) => ({ params: { slug: getSlug(item) } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const vibeDbId = getDatabaseId("NOTION_VIBE_CODING_ID");
  const list = vibeDbId
    ? await queryVisible({
        databaseId: vibeDbId,
        sorts: [{ property: "Date", direction: "descending" }],
      })
    : [];
  const project = list.find((item) => getSlug(item) === params.slug);
  if (!project) return { notFound: true };
  const blocks = await listPageBlocks(project.id);

  return {
    props: {
      project,
      blocks,
    },
    revalidate: 5,
  };
}
