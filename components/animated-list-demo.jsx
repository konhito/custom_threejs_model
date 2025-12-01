"use client";

import React from "react";
import { cn } from "@/lib/utils";

const notifications = [
  { text: "New user registered", time: "2m ago" },
  { text: "Payment received", time: "5m ago" },
  { text: "New comment on post", time: "10m ago" },
  { text: "System update completed", time: "15m ago" },
];

export default function AnimatedListDemo({ className }) {
  return (
    <div className={cn("relative flex h-full w-full flex-col gap-2 overflow-hidden p-4", className)}>
      {notifications.map((notification, idx) => (
        <div
          key={idx}
          className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-md dark:bg-gray-800"
          style={{
            animation: `slideIn 0.5s ease-out ${idx * 0.1}s both`,
          }}
        >
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {notification.text}
            </p>
          </div>
          <span className="text-xs text-gray-500">{notification.time}</span>
        </div>
      ))}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}

