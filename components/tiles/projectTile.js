import styles from "./projectTile.module.css";
import util from "../../styles/util.module.css";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function ProjectTile({ imageUrl, title, content, type, date, href, internal = true }) {
  const [isLoaded, setIsLoaded] = useState(!imageUrl);
  const imgRef = useRef(null);

  useEffect(() => {
    setIsLoaded(!imageUrl);
  }, [imageUrl]);

  useEffect(() => {
    if (!imageUrl) return;
    if (imgRef.current?.complete) {
      setIsLoaded(true);
      return;
    }
    const timeoutId = setTimeout(() => setIsLoaded(true), 6000);
    return () => clearTimeout(timeoutId);
  }, [imageUrl]);

  const image = imageUrl ? (
    <div className={styles.imageWrap}>
      <img
        ref={imgRef}
        src={imageUrl}
        alt={title}
        className={`${styles.image} ${isLoaded ? styles.imageLoaded : ""}`}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsLoaded(true)}
      />
      {!isLoaded ? <div className={styles.skeleton} aria-hidden="true" /> : null}
    </div>
  ) : null;

  return (
    <div className={styles.outer}>
      <p className={styles.date}>
        {date
          ? new Date(date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
            })
          : ""}
      </p>
      {internal ? (
        <Link href={href || "#"}>
          <a className={styles.container}>
            {image}
            <div className={styles.stack}>
              <h3 className={util.tileTitle}>{title}</h3>
              {content ? <p className={util.tileContent}>{content}</p> : null}
              {type ? <p className={styles.type}>{type}</p> : null}
            </div>
          </a>
        </Link>
      ) : (
        <a href={href || "#"} target="_blank" rel="noopener noreferrer" className={styles.container}>
          {image}
          <div className={styles.stack}>
            <div className={styles.row}>
              <h3 className={util.tileTitle}>{title}</h3>
              <span className={styles.externalIcon}>↗</span>
            </div>
            {content ? <p className={util.tileContent}>{content}</p> : null}
            {type ? <p className={styles.type}>{type}</p> : null}
          </div>
        </a>
      )}
    </div>
  );
}
