import styles from "../components/contact.module.css";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import util from "../styles/util.module.css";
import ContactContent from "./contactContent";
import * as Tooltip from "@radix-ui/react-tooltip";

export default function Contact({ svg, label, shortcut, icon }) {
  const LucideIcon = icon;
  const lastOpenRef = useRef(0);

  useEffect(() => {
    if (!shortcut) return;

    const onKeyPress = (event) => {
      if (event.key !== shortcut) return;

      const now = Date.now();
      // Prevent rapid repeated openings from key repeat.
      if (now - lastOpenRef.current < 300) return;

      const trigger = document.getElementById("contactTrigger");
      if (trigger) {
        trigger.click();
        lastOpenRef.current = now;
      }
    };

    document.addEventListener("keypress", onKeyPress);
    return () => document.removeEventListener("keypress", onKeyPress);
  }, [shortcut]);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild id="contactTrigger">
        <div className={styles.item}>
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
                  <Tooltip.Arrow className={styles.arrow} />
                </Tooltip.Content>
              </Tooltip.Root>
            </Tooltip.Provider>
          ) : null}
        </div>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content
          className={styles.content}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Dialog.Title className={styles.title}>Contact</Dialog.Title>
          <ContactContent inModal="true" />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
