import styles from "./writingCard.module.css";
import util from "../../styles/util.module.css";

export default function WritingCard({ title, excerpt, href, imageUrl }) {
  return (
    <a href={href} rel="noopener noreferrer" target="_blank" className={styles.container}>
      {imageUrl ? <img src={imageUrl} alt={title} className={styles.image} /> : null}
      <div className={styles.stack}>
        <div>
          <h3 className={util.tileTitle + " " + styles.inline}>{title}</h3>
          <span className={styles.externalIcon}>↗</span>
        </div>
        {excerpt ? <p className={styles.content}>{excerpt}</p> : null}
      </div>
    </a>
  );
}
