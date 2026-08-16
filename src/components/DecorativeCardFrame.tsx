import { useState, type ReactNode } from "react";
import type { DecorativeCardFrameAsset } from "../assets/runtimeAssetRegistry";

type DecorativeCardFrameProps = {
  asset: DecorativeCardFrameAsset;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  enabled?: boolean;
  as?: "aside" | "div";
};

export function DecorativeCardFrame({
  asset,
  children,
  className = "",
  contentClassName = "",
  enabled = true,
  as = "div",
}: DecorativeCardFrameProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const [loadedSource, setLoadedSource] = useState<string | null>(null);
  const failed = enabled && failedSource === asset.src;
  const loaded = enabled && loadedSource === asset.src && !failed;
  const state = !enabled
    ? "disabled"
    : failed
      ? "fallback"
      : loaded
        ? "image"
        : "loading";
  const Tag = as;

  return (
    <Tag
      className={`relative isolate ${className}`}
      data-card-frame-id={asset.assetId}
      data-card-frame-state={state}
    >
      {enabled && !failed && (
        <img
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute size-px opacity-0"
          draggable={false}
          height={asset.height}
          onError={() => setFailedSource(asset.src)}
          onLoad={() => setLoadedSource(asset.src)}
          src={asset.src}
          width={asset.width}
        />
      )}
      {loaded && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 border-[22px] border-solid border-transparent opacity-95"
          style={{
            borderImageRepeat: "stretch",
            borderImageSlice: `${asset.borderSlice} fill`,
            borderImageSource: `url(${asset.src})`,
            borderImageWidth: "22px",
            imageRendering: "pixelated",
          }}
        />
      )}
      <div className={`relative z-10 ${contentClassName}`}>{children}</div>
    </Tag>
  );
}
