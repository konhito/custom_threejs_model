"use client";
import GridScan from "@/components/GridScan";

export default function GameBackground({ showStartButton, isLoading, isLoadingAssets }) {
  if (!isLoading && !isLoadingAssets && showStartButton) {
    return (
      <div className="fixed inset-0 z-0" style={{ width: "100%", height: "100%" }}>
        <GridScan
          sensitivity={0.55}
          lineThickness={1}
          linesColor="#392e4e"
          gridScale={0.1}
          scanColor="#FF9FFC"
          scanOpacity={0.4}
          enablePost
          bloomIntensity={0.6}
          chromaticAberration={0.002}
          noiseIntensity={0.01}
        />
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-0 min-h-screen min-h-[100dvh] min-w-full w-full overflow-hidden bg-black"
      style={{ opacity: isLoading ? 0 : 1, transition: "opacity 0.5s ease-out" }}
    >
      <img
        src="/Game_bg.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
    </div>
  );
}
