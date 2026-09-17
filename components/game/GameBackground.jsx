"use client";

export default function GameBackground({ isLoading }) {
  return (
    <div
      className="fixed inset-0 z-0 bg-[#174538]"
      style={{
        opacity: isLoading ? 0 : 1,
        transition: "opacity 0.5s ease-out",
        backgroundImage: "radial-gradient(ellipse at 50% 42%, #428367 0%, #245a48 48%, #174538 100%)",
      }}
    />
  );
}
