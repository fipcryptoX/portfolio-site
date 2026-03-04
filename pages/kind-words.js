import Head from "next/head";
import util from "../styles/util.module.css";
import KindWordCard from "../components/tiles/kindWordCard";
import {
  getDatabaseId,
  getFileUrl,
  getRichTextPlain,
  getTitle,
  getUrl,
  queryVisible,
} from "../lib/notion-portfolio";

export default function KindWords({ list }) {
  return (
    <>
      <Head>
        <title>Gideon Ng</title>
        <meta
          name="description"
          content="Testimonials and recommendations from people I have worked with."
        />
      </Head>
      <main className={util.page}>
        <div className={util.pageColumn}>
          <h1 className={util.header}>Kind Words</h1>
          <div className={util.inset}>
            <p className={util.description}>
              Testimonials and recommendations from people I have worked with.
            </p>
            <div className={util.flexGrid}>
              {list.map((item) => {
                const name = getTitle(item);
                const quote = getRichTextPlain(item, "Quote");
                const role = getRichTextPlain(item, "PersonRole");
                const avatar = getFileUrl(item, "Avatar");
                const profile = getUrl(item, "LinkedIn");
                return (
                  <KindWordCard
                    key={item.id}
                    name={name}
                    role={role}
                    quote={quote}
                    avatarUrl={avatar}
                    profileUrl={profile}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export async function getStaticProps() {
  const dbId = getDatabaseId("NOTION_KIND_WORDS_ID");
  const list = dbId
    ? await queryVisible({
        databaseId: dbId,
        sorts: [{ property: "Order", direction: "ascending" }],
      })
    : [];

  return {
    props: {
      list,
    },
    revalidate: 5,
  };
}
