"use client";

import React from 'react';
import styles from './PageLoader.module.css';

const PageLoader = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className={styles.loaderWrapper}>
      <div className={styles.brandText}>
        AQUA MUNDI
      </div>
      <div className={styles.flower}>
        <div className={`${styles.petal} ${styles.petal1}`} />
        <div className={`${styles.petal} ${styles.petal2}`} />
        <div className={`${styles.petal} ${styles.petal3}`} />
        <div className={`${styles.petal} ${styles.petal4}`} />
        <div className={`${styles.petal} ${styles.petal5}`} />
        <div className={`${styles.petal} ${styles.petal6}`} />
        <div className={`${styles.petal} ${styles.petal7}`} />
        <div className={`${styles.petal} ${styles.petal8}`} />
        <div className={styles.center} />
      </div>
    </div>
  );
};

export default PageLoader;

