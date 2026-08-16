import { useState, type ReactNode } from "react";
import type { StaticBattleBackgroundAsset } from "../assets/runtimeAssetRegistry";

type DecorativeBattleBackgroundProps = {
  asset: StaticBattleBackgroundAsset;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  enabled?: boolean;
  as?: "div" | "section";
};

export function DecorativeBattleBackground({
  asset,
  children,
  className = "",
  contentClassName = "",
  enabled = true,
  as = "div",
}: DecorativeBattleBackgroundProps) {
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
      className={`relative isolate overflow-hidden ${className}`}
      data-battle-background-id={asset.assetId}
      data-battle-background-state={state}
    >
      {enabled && !failed && (
        <img
          alt=""
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 z-0 size-full select-none object-cover transition-opacity duration-300 motion-reduce:transition-none ${loaded ? "opacity-75" : "opacity-0"}`}
          draggable={false}
          height={asset.height}
          onError={() => setFailedSource(asset.src)}
          onLoad={() => setLoadedSource(asset.src)}
          src={asset.src}
          style={{ objectPosition: asset.objectPosition }}
          width={asset.width}
        />
      )}
      {loaded && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-stone-950/35 via-stone-950/50 to-emerald-950/65"
        />
      )}
      <div className={`relative z-10 ${contentClassName}`}>{children}</div>
    </Tag>
  );
}
