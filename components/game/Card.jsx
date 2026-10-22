"use client";

import Image from "next/image";
import { getCardBackPath } from "@/lib/gameData";
import styles from "./GameBoard.module.css";
import { useTranslation } from "@/lib/useTranslation";

export default function Card({ card, isFlipped, onFlip, disabled }) {
  const { t, locale } = useTranslation();
  const label = card.type === "petal"
    ? `${t("gamePilot.ui.petal")} ${card.petalNumber} - ${locale === "es" ? t(`countries.${card.country?.toLowerCase()}.name`) : card.country}`
    : card.type === "minion"
      ? locale === "es" ? t(`gamePilot.cardNames.${card.minionData?.id}`) : card.minionData?.name || t("gamePilot.ui.minion")
      : locale === "es" ? t(`gamePilot.cardNames.${card.guardianData?.id}`) : card.guardianData?.name || t("gamePilot.ui.guardian");

  return (
    <button
      type="button"
      className={`${styles.card} ${isFlipped ? styles.revealed : ""}`}
      onClick={() => onFlip(card.id)}
      disabled={disabled || isFlipped}
      aria-label={isFlipped ? label : t("gamePilot.ui.revealCard")}
    >
      <span className={`card-flip-container ${styles.cardInner} ${isFlipped ? "flipped" : ""}`}>
        <span className={`card-face card-face-back ${styles.cardFace}`}>
          <Image src={getCardBackPath()} alt="" fill sizes="(min-width: 768px) 158px, 128px" className={styles.cardImage} priority />
        </span>
        <span className={`card-face card-face-front ${styles.cardFace}`}>
          <Image src={card.image} alt="" fill sizes="(min-width: 768px) 158px, 128px" className={styles.cardImage} />
        </span>
      </span>
    </button>
  );
}
