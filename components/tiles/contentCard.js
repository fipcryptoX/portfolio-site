import styles from "./contentCard.module.css";
import util from "../../styles/util.module.css";
import Link from "next/link";

export default function ContentCard({
  title,
  excerpt,
  imageUrl,
  href,
  external = false,
  tags = [],
  date = null,
}) {
  const body = (
    <>
      {imageUrl ? <img src={imageUrl} alt={title} className={styles.image} /> : null}
      <div className={styles.stack}>
        <div className={styles.row}>
          <h3 className={util.tileTitle}>{title}</h3>
          <span className={styles.icon}>{external ? "↗" : "→"}</span>
        </div>
        {excerpt ? <p className={util.tileContent}>{excerpt}</p> : null}
        {date ? (
          <p className={styles.date}>
            {new Date(date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        ) : null}
        {tags.length ? (
          <div className={util.tags + " " + util.flexRow}>
            {tags.map((tag) => (
              <p key={tag.name + tag.color} className={tag.color + "Tag tag"}>
                {tag.name}
              </p>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={styles.container}>
        {body}
      </a>
    );
  }

  return (
    <Link href={href}>
      <a className={styles.container}>{body}</a>
    </Link>
  );
}

