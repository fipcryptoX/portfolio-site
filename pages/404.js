// pages/404.js
import Head from "next/head";
import util from "../styles/util.module.css";
import Link from "next/link";

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Gideon Ng</title>
        <meta name="description" content="Page missing" />
        <meta property="og:image" content="https://www.sj.land/og/index.png" />
      </Head>
      <main className={util.page} id="recentsPage">
        <div className={util.center}>
          <h1 className={util.header} style={{ marginBottom: "0.25rem" }}>
            404
          </h1>
          <p className={util.description}>Page not found</p>
          <Link href="/">
            <button
              className={util.singleButton + " " + util.button}
              style={{ marginTop: "1.25rem" }}
            >
              <span className={util.buttonText}>Go to Home</span>
            </button>
          </Link>
        </div>
      </main>
    </>
  );
}
