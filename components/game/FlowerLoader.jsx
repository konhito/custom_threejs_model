"use client";

import React from 'react';

const FlowerLoader = () => {
  return (
    <>
      <style jsx global>{`
        @keyframes l10-0 {
          0%, 30% {
            background-position: 0 0px;
          }
          50%, 100% {
            background-position: 0 -0.1px;
          }
        }
        @keyframes l10-1 {
          50%, 100% {
            top: 109.5%;
          }
        }
        @keyframes l10-2 {
          0%, 30% {
            transform: translateY(0);
          }
          80%, 100% {
            transform: translateY(-260%);
          }
        }
        .flower-loader {
          width: fit-content;
          font-size: 17px;
          font-family: monospace;
          line-height: 1.4;
          font-weight: bold;
          padding: 30px 2px 50px;
          background: linear-gradient(#000 0 0) 0 0/100% 100% content-box padding-box no-repeat;
          position: relative;
          overflow: hidden;
          animation: l10-0 2s infinite cubic-bezier(1, 175, 0.5, 175);
        }
        .flower-loader::before {
          content: "Loading";
          display: inline-block;
          animation: l10-2 2s infinite;
        }
        .flower-loader::after {
          content: "";
          position: absolute;
          width: 34px;
          height: 28px;
          top: 110%;
          left: calc(50% - 16px);
          background: 
            linear-gradient(90deg, #0000 12px, #ff69b4 0 22px, #0000 0 26px, #ffb6c1 0 32px, #0000) bottom 26px left 50%,
            linear-gradient(90deg, #0000 10px, #ff69b4 0 28px, #ffb6c1 0 32px, #0000 0) bottom 24px left 50%,
            linear-gradient(90deg, #0000 10px, #ff1493 0 16px, #ffb6c1 0 20px, #000 0 22px, #ffb6c1 0 24px, #000 0 26px, #ff69b4 0 32px, #0000 0) bottom 22px left 50%,
            linear-gradient(90deg, #0000 8px, #ff1493 0 10px, #ffb6c1 0 12px, #ff1493 0 14px, #ffb6c1 0 20px, #000 0 22px, #ffb6c1 0 28px, #ff69b4 0 32px, #0000 0) bottom 20px left 50%,
            linear-gradient(90deg, #0000 8px, #ff1493 0 10px, #ffb6c1 0 12px, #ff1493 0 16px, #ffb6c1 0 22px, #000 0 24px, #ffb6c1 0 30px, #ff69b4 0 32px, #0000 0) bottom 18px left 50%,
            linear-gradient(90deg, #0000 8px, #ff1493 0 12px, #ffb6c1 0 20px, #000 0 28px, #ff69b4 0 30px, #0000 0) bottom 16px left 50%,
            linear-gradient(90deg, #0000 12px, #ffb6c1 0 26px, #ff69b4 0 30px, #0000 0) bottom 14px left 50%,
            linear-gradient(90deg, #ffb6c1 6px, #ff69b4 0 14px, #ff1493 0 16px, #ff69b4 0 22px, #ff1493 0 24px, #ff69b4 0 28px, #0000 0 32px, #ff1493 0) bottom 12px left 50%,
            linear-gradient(90deg, #ffb6c1 6px, #ff69b4 0 16px, #ff1493 0 18px, #ff69b4 0 24px, #ff69b4 0 26px, #0000 0 30px, #ff1493 0) bottom 10px left 50%,
            linear-gradient(90deg, #0000 10px, #ff69b4 0 16px, #ff1493 0 24px, #ffb6c1 0 26px, #ff1493 0 30px, #ff1493 0) bottom 8px left 50%,
            linear-gradient(90deg, #0000 12px, #ff1493 0 18px, #ffb6c1 0 20px, #ff1493 0 30px, #ff1493 0) bottom 6px left 50%,
            linear-gradient(90deg, #0000 8px, #ff1493 0 12px, #ff1493 0 30px, #ff1493 0) bottom 4px left 50%,
            linear-gradient(90deg, #0000 6px, #ff1493 0 14px, #ff1493 0 26px, #0000 0) bottom 2px left 50%,
            linear-gradient(90deg, #0000 6px, #ff1493 0 10px, #0000 0) bottom 0px left 50%;
          background-size: 34px 2px;
          background-repeat: no-repeat;
          animation: inherit;
          animation-name: l10-1;
        }
      `}</style>
      <div className="flower-loader" />
    </>
  );
};

export default FlowerLoader;

