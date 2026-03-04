import styles from "./kindWordCard.module.css";
import util from "../../styles/util.module.css";

export default function KindWordCard({ name, role, quote, avatarUrl, profileUrl }) {
  const person = (
    <div className={styles.personRow}>
      {avatarUrl ? <img src={avatarUrl} alt={name} className={styles.icon} /> : null}
      <h3 className={util.tileTitle + " " + styles.name}>
        {name}
        {role ? `, ${role}` : ""}
      </h3>
      {profileUrl ? <span className={styles.externalIcon}>↗</span> : null}
    </div>
  );

  const content = (
    <>
      <div className={util.viewTruncated}>
        <span className={styles.testimonial}>{quote ? `"${quote}"` : ""}</span>
      </div>
      {person}
    </>
  );

  if (!profileUrl) {
    return <div className={styles.container}>{content}</div>;
  }

  return (
    <a href={profileUrl} target="_blank" rel="noopener noreferrer" className={styles.container}>
      {content}
    </a>
  );
}
