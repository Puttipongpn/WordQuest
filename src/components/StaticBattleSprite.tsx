import { useState, type ReactNode } from "react";
import type { StaticSpriteAsset } from "../assets/runtimeAssetRegistry";

type StaticBattleSpriteProps = {
  alt: string;
  asset?: StaticSpriteAsset;
  className?: string;
  fallback: ReactNode;
};

export function StaticBattleSprite({
  alt,
  asset,
  className = "",
  fallback,
}: StaticBattleSpriteProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const showFallback = !asset || failedSource === asset.src;

  return (
    <span
      aria-label={alt}
      className={`relative grid shrink-0 place-items-center overflow-hidden ${className}`}
      role="img"
    >
      {showFallback ? (
        <span aria-hidden="true">{fallback}</span>
      ) : (
        <img
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 h-full max-w-none select-none"
          draggable={false}
          onError={() => setFailedSource(asset.src)}
          src={asset.src}
          style={{
            imageRendering: "pixelated",
            width: `${asset.frameCount * 100}%`,
          }}
        />
      )}
    </span>
  );
}
