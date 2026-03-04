import styles from "../components/menu.module.css";
import Link from "next/link";
import NavLink from "./navLink";
import Contact from "./contact";
import util from "../styles/util.module.css";
import {
  Code2,
  FolderKanban,
  House,
  Linkedin,
  MessageCircle,
  MessageSquareQuote,
  PenLine,
  UserRound,
} from "lucide-react";

export default function Menu() {
  return (
    <div className={styles.container}>
      <div className={styles.upper}>
        <Link href="/">
          <img
            className={util.hiddenOnMobile + " " + util.pointer + " logoInvert"}
            src="/logo.svg"
            alt="site logo"
          ></img>
        </Link>

        <nav className={styles.nav}>
          <NavLink svg="recents" href="/" label="Home" shortcut="1" icon={House} />
          <NavLink svg="about" href="/about" label="About" shortcut="2" icon={UserRound} />
          <NavLink svg="edit-3" href="/writing" label="Writing" shortcut="3" icon={PenLine} />
          <NavLink
            svg="projects"
            href="/projects"
            label="Projects"
            shortcut="4"
            icon={FolderKanban}
          />
          <NavLink
            svg="zap"
            href="/vibe-coding"
            label="Vibe Coding"
            shortcut="5"
            icon={Code2}
          />
          <NavLink
            svg="users"
            href="/kind-words"
            label="Kind Words"
            shortcut="6"
            icon={MessageSquareQuote}
          />
          <p className={styles.divider}>Stay in touch</p>
          <Contact svg="chat" label="Contact" icon={MessageCircle} />
          <NavLink
            svg="linkedin"
            href="https://www.linkedin.com/in/gideon-ng/"
            label="LinkedIn"
            external="true"
            icon={Linkedin}
          />
        </nav>
      </div>
    </div>
  );
}
