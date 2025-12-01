"use client";

import React from "react";
import { cn } from "@/lib/utils";

export default function AnimatedBeamMultipleOutputDemo({ className }) {
  return (
    <div className={cn("relative flex h-full w-full items-center justify-center overflow-hidden", className)}>
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg" />
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg" />
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg" />
        </div>
        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-orange-500 to-red-500 shadow-xl" />
      </div>
    </div>
  );
}

