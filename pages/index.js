import Head from "next/head";
import React, { useEffect } from "react";
import util from "../styles/util.module.css";
import Link from "next/link";
import Tile from "../components/tiles/homeVersions/tile";
import ContentCard from "../components/tiles/contentCard";
import styles from "../pages/index.module.css";
import OnboardingCard from "../components/onboardingCard";
import { motion, AnimatePresence } from "framer-motion";
import Script from "next/script";
import { FolderKanban, Code2, UserRound, Newspaper, PenLine } from "lucide-react";
import {
  getCheckbox,
  getDatabaseId,
  getDate,
  getFileUrl,
  getMultiSelect,
  getRichText,
  getRichTextPlain,
  getSlug,
  getTitle,
  getUrl,
  queryVisible,
} from "../lib/notion-portfolio";

export default function Home({ updatesList, writingList, projectsList, vibeList }) {
  //create masterlist objects with uuid and text and cta
  const tips = [
    {
      id: "useShortCut",
      text: "Use keyboard shortcuts 1 → 6 to navigate between pages.",
      ctaText: null,
      ctaLink: null,
    },
    {
      id: "getToKnowMe",
      text: "Get to know me: Learn more about who I am and what I do in my",
      ctaText: "about page →",
      ctaLink: "/about",
    },
    {
      id: "writingProud",
      text: "Here are the pieces of writing that I'm",
      ctaText: "most proud of →",
      ctaLink: "/writing",
    },
    {
      id: "vibeProjects",
      text: "I've gone down the rabbit hole of vibe coding,",
      ctaText: "here are some of my projects →",
      ctaLink: "/vibe-coding",
    },
  ];
  //create currentlist of what user need to see
  const [currentTips, setCurrentTips] = React.useState([0]);

  //on load, check masterlist with location storage,
  const [isVisible, setIsVisible] = React.useState(false);
  useEffect(() => {
    let newTips = tips;
    tips.forEach((tip) => {
      if (localStorage.getItem(tip.id)) {
        newTips = newTips.filter((e) => e.id != tip.id);
      }
    });
    //render currentlist
    setCurrentTips(newTips);
    //hide the tip section - framer motion depends on this
    newTips.length < 1 ? setIsVisible(false) : setIsVisible(true);
  }, []);

  //if all dismissed destroy the box with motion
  useEffect(() => {
    currentTips.length < 1 ? setIsVisible(false) : null;
  }, [currentTips]);

  //when user click on the x on onboarding cards
  //remove the card and write in local storage to not show again
  function handleOnboardingDismiss(e) {
    e.preventDefault();
    let element = e.target.parentElement;
    localStorage.setItem(element.id, true);
    let newTips = currentTips;
    newTips = newTips.filter((e) => e.id != element.id);
    //remove from current array to trigger a change
    setCurrentTips(newTips);
  }

  function resetOnboarding() {
    setCurrentTips(tips);
    tips.forEach((tip) => {
      localStorage.removeItem(tip.id);
    });
    setIsVisible(true);
  }

  useEffect(() => {
    let thisPage = document.querySelector("#recentsPage");
    let top = sessionStorage.getItem("recents-scroll");
    if (top !== null) {
      thisPage.scrollTop = top;
    }
    const handleScroll = () => {
      sessionStorage.setItem("recents-scroll", thisPage.scrollTop);
    };
    thisPage.addEventListener("scroll", handleScroll);
    return () => thisPage.removeEventListener("scroll", handleScroll);
  }, []);

  const description =
    "I’m a designer and developer by training and trade. I spend most of my spare time reading about business, finance and crypto. If this combination interests you, welcome to my corner of the internet. This is where I share my reading list, investment updates, and software adventures.";

  return (
    <>
      <Head>
        <title>Gideon Ng</title>
      </Head>{" "}
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
      <main className={util.page} id="recentsPage">
        <div className={styles.homeColumn}>
          <h1 className={styles.homeGreetingTitle}>Hey, I&apos;m Gideon</h1>
          <span className={styles.tinyText}>
            I&apos;m a crypto-native Content Strategist with 4+ years in Web3.
            {!isVisible ? (
              <span onClick={resetOnboarding} className={styles.reset}>
                Need a refresher? Reset onboarding.
              </span>
            ) : null}
          </span>
          <p className={styles.mobileBio}>
            I&apos;m a crypto-native Content Strategist with 4+ years in Web3.
          </p>
          <div className={styles.mobileQuickLinks}>
            <Link href="/about">
              <a className={styles.mobileQuickLink}>
                <UserRound size={14} strokeWidth={2} aria-hidden="true" />
                <span>About</span>
              </a>
            </Link>
            <a href="#updatesSection" className={styles.mobileQuickLink}>
              <Newspaper size={14} strokeWidth={2} aria-hidden="true" />
              <span>Updates</span>
            </a>
            <a href="#writingSection" className={styles.mobileQuickLink}>
              <PenLine size={14} strokeWidth={2} aria-hidden="true" />
              <span>Writing</span>
            </a>
            <a href="#projectsSection" className={styles.mobileQuickLink}>
              <FolderKanban size={14} strokeWidth={2} aria-hidden="true" />
              <span>Projects</span>
            </a>
            <a href="#vibeCodingSection" className={styles.mobileQuickLink}>
              <Code2 size={14} strokeWidth={2} aria-hidden="true" />
              <span>Vibe Coding</span>
            </a>
          </div>
          <AnimatePresence mode={"sync"}>
            {isVisible && (
              <motion.div
                className={styles.introContainer}
                layout
                // transition={{ type: "spring" }}
                initial={{
                  opacity: 0,
                  height: 0,
                  transition: { duration: 0.2, ease: "easeOut" },
                }}
                animate={{
                  opacity: 1,
                  height: 180,
                  transition: { delay: 0.25, duration: 0.4, ease: "easeInOut" },
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                  transition: { duration: 0.6, ease: "easeInOut" },
                }}
              >
                <AnimatePresence mode={"popLayout"}>
                  {currentTips.map((tip) => (
                    <OnboardingCard
                      key={tip.id}
                      handleDismiss={handleOnboardingDismiss}
                      id={tip.id}
                      text={tip.text}
                      ctaText={tip.ctaText}
                      ctaLink={tip.ctaLink}
                      ref={React.createRef()}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
          <div className={styles.homeSectionContainer} id="updatesSection">
            <h2 className={styles.homeSectionTitle}>
              <span className={styles.mobileSectionTitleWithIcon}>
                <Newspaper size={18} strokeWidth={2} aria-hidden="true" />
                Updates
              </span>
            </h2>
            <Link href="/about#about-update">
              <a className={styles.homeLinkButton}>View All</a>
            </Link>
          </div>
          <ul className={styles.homeUpdatesGrid}>
            {updatesList.map((item) => (
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
          <div className={styles.homeSectionContainer} id="writingSection">
            <h2 className={styles.homeSectionTitle}>
              <span className={styles.mobileSectionTitleWithIcon}>
                <PenLine size={18} strokeWidth={2} aria-hidden="true" />
                Writing
              </span>
            </h2>
            <Link href="/writing">
              <a className={styles.homeLinkButton}>View All</a>
            </Link>
          </div>
          <ul className={styles.homeReadingGrid}>
            {writingList.map((item) => {
              const articleUrl = getUrl(item, "ArticleURL") || item.url || "#";
              return (
              <ContentCard
                key={item.id}
                title={getTitle(item)}
                excerpt={getRichTextPlain(item, "Excerpt")}
                href={articleUrl}
                external={true}
                imageUrl={getFileUrl(item, "Cover")}
                tags={getMultiSelect(item, "Tags")}
                date={getDate(item, "Published")}
              />
              );
            })}
          </ul>
          <div className={styles.homeSectionContainer} id="projectsSection">
            <h2 className={styles.homeSectionTitle}>
              <span className={styles.homeSectionTitleWithIcon}>
                <FolderKanban size={18} strokeWidth={2} aria-hidden="true" />
                Projects
              </span>
            </h2>
            <Link href="/projects">
              <a className={styles.homeLinkButton}>View All</a>
            </Link>
          </div>
          <ul className={styles.homeReadingGrid}>
            {projectsList.map((item) => (
              <ContentCard
                key={item.id}
                title={getTitle(item)}
                excerpt={getRichTextPlain(item, "Summary")}
                href={`/projects/${getSlug(item)}`}
                imageUrl={getFileUrl(item, "Cover")}
                tags={getMultiSelect(item, "Tags")}
                date={getDate(item, "Date")}
              />
            ))}
          </ul>
          <div className={styles.homeSectionContainer} id="vibeCodingSection">
            <h2 className={styles.homeSectionTitle}>
              <span className={styles.homeSectionTitleWithIcon}>
                <Code2 size={18} strokeWidth={2} aria-hidden="true" />
                Vibe Coding
              </span>
            </h2>
            <Link href="/vibe-coding">
              <a className={styles.homeLinkButton}>View All</a>
            </Link>
          </div>
          <ul className={styles.homeReadingGrid}>
            {vibeList.map((item) => (
              <ContentCard
                key={item.id}
                title={getTitle(item)}
                excerpt={getRichTextPlain(item, "Summary")}
                href={`/vibe-coding/${getSlug(item)}`}
                imageUrl={getFileUrl(item, "Cover")}
                tags={getMultiSelect(item, "Tags")}
                date={getDate(item, "Date")}
              />
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}

//notion API
export async function getStaticProps() {
  const updatesDbId = getDatabaseId("NOTION_UPDATES_ID", "NOTION_RECENTS_ID");
  const writingDbId = getDatabaseId("NOTION_WRITING_ID", "NOTION_GOODS_ID");
  const projectsDbId = getDatabaseId("NOTION_PROJECTS_ID", "NOTION_CAM_PROJECTS_ID");
  const vibeDbId = getDatabaseId("NOTION_VIBE_CODING_ID", "NOTION_READINGLIST_ID");

  const updatesList = updatesDbId
    ? await queryVisible({
        databaseId: updatesDbId,
        sorts: [{ property: "Date", direction: "descending" }],
        pageSize: 4,
      })
    : [];

  const writingVisible = writingDbId
    ? await queryVisible({
        databaseId: writingDbId,
        sorts: [{ property: "Published", direction: "descending" }],
      })
    : [];
  const featuredWriting = writingVisible.filter((item) => getCheckbox(item, "Featured"));
  const nonFeaturedWriting = writingVisible.filter((item) => !getCheckbox(item, "Featured"));
  const writingList = [...featuredWriting, ...nonFeaturedWriting].slice(0, 4);

  const projectsList = projectsDbId
    ? await queryVisible({
        databaseId: projectsDbId,
        sorts: [{ property: "Date", direction: "descending" }],
      })
    : [];
  const featuredProjects = projectsList.filter((item) => getCheckbox(item, "Featured"));
  const nonFeaturedProjects = projectsList.filter((item) => !getCheckbox(item, "Featured"));
  const homeProjectsList = [...featuredProjects, ...nonFeaturedProjects].slice(0, 4);

  const vibeList = vibeDbId
    ? await queryVisible({
        databaseId: vibeDbId,
        sorts: [{ property: "Date", direction: "descending" }],
        pageSize: 4,
      })
    : [];

  return {
    props: {
      updatesList,
      writingList,
      projectsList: homeProjectsList,
      vibeList,
    },
    revalidate: 5,
  };
}
