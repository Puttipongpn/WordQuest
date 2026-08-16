import { useState, type ReactNode } from "react";
import type { StaticUiIconAsset } from "../assets/runtimeAssetRegistry";

type StaticUiIconProps = {
  asset: StaticUiIconAsset;
  className?: string;
  fallback?: ReactNode;
};

export function StaticUiIcon({
  asset,
  className = "",
  fallback = null,
}: StaticUiIconProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const showFallback = failedSource === asset.src;

  return (
    <span
      aria-hidden="true"
      className={`relative inline-grid shrink-0 place-items-center overflow-hidden ${className}`}
      data-ui-icon-id={asset.assetId}
      data-ui-icon-state={showFallback ? "fallback" : "image"}
    >
      {showFallback ? (
        fallback
      ) : (
        <img
          alt=""
          aria-hidden="true"
          className="pointer-events-none size-full select-none object-contain"
          draggable={false}
          height={asset.height}
          onError={() => setFailedSource(asset.src)}
          src={asset.src}
          style={{ imageRendering: "pixelated" }}
          width={asset.width}
        />
      )}
    </span>
  );
}
