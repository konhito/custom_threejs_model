"use client";
import Image from "next/image";

export default function AssetLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-30 bg-transparent">
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <div className="relative w-full h-full max-w-[90vw] max-h-[90vh] sm:max-w-[80vw] sm:max-h-[80vh] md:max-w-[70vw] md:max-h-[70vh] lg:max-w-[60vw] lg:max-h-[60vh]">
          <Image
            src="/X4SS63h7k5umY.webp"
            alt="Loading..."
            fill
            className="object-contain"
            unoptimized
            priority
            sizes="(max-width: 640px) 90vw, (max-width: 768px) 80vw, (max-width: 1024px) 70vw, 60vw"
          />
        </div>
      </div>
    </div>
  );
}
