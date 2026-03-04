import styles from "../components/navLink.module.css";
import React, { useEffect } from "react";
import util from "../styles/util.module.css";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import * as Tooltip from "@radix-ui/react-tooltip";

export default function NavLink({ svg, label, href, shortcut, external, icon }) {
  const router = useRouter();
  const LucideIcon = icon;

  const ariaCurrent =
    router.asPath.includes(href) && href !== "/"
      ? "page"
      : router.pathname === href
      ? "page"
      : undefined;

  useEffect(() => {
    if (!shortcut || external) return;

    const onKeyPress = (event) => {
      if (event.key === shortcut) {
        router.push(href);
      }
    };

    document.addEventListener("keypress", onKeyPress);
    return () => document.removeEventListener("keypress", onKeyPress);
  }, [shortcut, href, router, external]);

  return external ? (
    <a
      target="_blank"
      className={styles.item}
      href={href}
      rel="noopener noreferrer"
    >
      <div className={styles.left}>
        {LucideIcon ? (
          <div className={util.icon}>
            <LucideIcon
              className={styles.lucideIcon}
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
          </div>
        ) : (
          <div className={styles.logoIcon}>
            <Image
              priority
              src={"/icons/" + svg + ".svg"}
              height={66}
              width={66}
              alt={label}
            />
          </div>
        )}

        <p className={styles.label}>{label}</p>
      </div>
      <div className={styles.desktopOnly}>
        <div className={styles.externalIcon}>↗</div>
      </div>
    </a>
  ) : (
    <Link href={href}>
      <a className={styles.item} aria-current={ariaCurrent}>
        <div className={styles.left}>
          {LucideIcon ? (
            <div className={util.icon}>
              <LucideIcon
                className={styles.lucideIcon}
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
            </div>
          ) : (
            <div className={util.icon}>
              <Image
                className={"iconInvert"}
                priority
                src={"/feather/" + svg + ".svg"}
                height={66}
                width={66}
                alt={label}
              />
            </div>
          )}
          <p className={styles.label}>{label}</p>
        </div>
        {shortcut ? (
          <Tooltip.Provider delayDuration={500}>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <div className={styles.shortcut}>
                  <span className={styles.shortcutText}>{shortcut}</span>
                </div>
              </Tooltip.Trigger>

              <Tooltip.Content className={util.tooltip}>
                <span style={{ marginRight: "4px" }}>Press</span>
                <div className={styles.shortcut}>
                  <span className={styles.shortcutText}>{shortcut}</span>
                </div>
                <Tooltip.Arrow className={util.arrow} />
              </Tooltip.Content>
            </Tooltip.Root>
          </Tooltip.Provider>
        ) : null}
      </a>
    </Link>
  );
}
