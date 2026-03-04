import styles from "./writingCard.module.css";
import util from "../../styles/util.module.css";
import { useEffect, useRef, useState } from "react";

export default function WritingCard({ title, excerpt, href, imageUrl }) {
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

  return (
    <a href={href} rel="noopener noreferrer" target="_blank" className={styles.container}>
      {imageUrl ? (
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
      ) : null}
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
