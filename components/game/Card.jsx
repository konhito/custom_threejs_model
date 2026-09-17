"use client";

import Image from "next/image";
import { getCardBackPath } from "@/lib/gameData";
import styles from "./GameBoard.module.css";

export default function Card({ card, isFlipped, onFlip, disabled }) {
  const label = card.type === "petal"
    ? `Petal ${card.petalNumber} - ${card.country}`
    : card.type === "minion"
      ? card.minionData?.name || "Minion"
      : card.guardianData?.name || "Guardian";

  return (
    <button
      type="button"
      className={`${styles.card} ${isFlipped ? styles.revealed : ""}`}
      onClick={() => onFlip(card.id)}
      disabled={disabled || isFlipped}
      aria-label={isFlipped ? label : "Reveal card"}
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
