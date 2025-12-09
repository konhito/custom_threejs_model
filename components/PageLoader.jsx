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
      <div className={styles.gifContainer}>
        <img
          src="/giphy.gif"
          alt="Loading animation"
          className={styles.gifImage}
          loading="eager"
        />
      </div>
    </div>
  );
};

export default PageLoader;

