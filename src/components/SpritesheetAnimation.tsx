import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  SpritesheetAnimationAsset,
  StaticSpriteAsset,
} from "../assets/runtimeAssetRegistry";

type SpritesheetAnimationProps = {
  alt: string;
  animation?: SpritesheetAnimationAsset;
  className?: string;
  fallback?: ReactNode;
  fallbackAsset?: StaticSpriteAsset;
  onComplete?: () => void;
};

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function SpritesheetAnimation({
  alt,
  animation,
  className = "",
  fallback,
  fallbackAsset,
  onComplete,
}: SpritesheetAnimationProps) {
  const onCompleteRef = useRef(onComplete);
  const [frameIndex, setFrameIndex] = useState(0);
  const [isAnimationLoaded, setIsAnimationLoaded] = useState(false);
  const [failedAnimationFile, setFailedAnimationFile] = useState<string | null>(
    null,
  );
  const [failedFallbackSource, setFailedFallbackSource] = useState<
    string | null
  >(null);
  const [isReducedMotion, setIsReducedMotion] = useState(prefersReducedMotion);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => setIsReducedMotion(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const animationFailed =
    animation !== undefined && failedAnimationFile === animation.file;

  useEffect(() => {
    if (!animation || animationFailed || !isAnimationLoaded) {
      return;
    }

    const finalFrame = Math.max(animation.frameCount - 1, 0);

    if (isReducedMotion) {
      setFrameIndex(
        Math.min(Math.max(animation.reducedMotionFrame, 0), finalFrame),
      );

      if (animation.loop) {
        return;
      }

      const completionTimer = window.setTimeout(
        () => onCompleteRef.current?.(),
        animation.frameCount * animation.frameDurationMs,
      );
      return () => window.clearTimeout(completionTimer);
    }

    const frameTimer = window.setTimeout(() => {
      if (frameIndex < finalFrame) {
        setFrameIndex(frameIndex + 1);
        return;
      }

      if (animation.loop || animation.animationType === "loop") {
        setFrameIndex(0);
        return;
      }

      onCompleteRef.current?.();
    }, animation.frameDurationMs);

    return () => window.clearTimeout(frameTimer);
  }, [
    animation,
    animationFailed,
    frameIndex,
    isAnimationLoaded,
    isReducedMotion,
  ]);

  const showAnimation =
    animation !== undefined && isAnimationLoaded && !animationFailed;
  const showFallbackAsset =
    !showAnimation &&
    fallbackAsset !== undefined &&
    failedFallbackSource !== fallbackAsset.src;

  return (
    <span
      aria-label={alt}
      className={`relative grid shrink-0 place-items-center overflow-hidden ${className}`}
      data-animation-id={animation?.assetId ?? "idle"}
      data-animation-state={
        showAnimation ? (isReducedMotion ? "reduced-motion" : "playing") : "idle"
      }
      data-frame-index={showAnimation ? frameIndex : 0}
      role="img"
    >
      {!showAnimation && !showFallbackAsset && (
        <span aria-hidden="true">
          {fallback ?? animation?.fallbackIdentity ?? alt}
        </span>
      )}

      {showFallbackAsset && (
        <img
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 h-full max-w-none select-none"
          draggable={false}
          onError={() => setFailedFallbackSource(fallbackAsset.src)}
          src={fallbackAsset.src}
          style={{
            imageRendering: "pixelated",
            width: `${fallbackAsset.frameCount * 100}%`,
          }}
        />
      )}

      {animation && !animationFailed && (
        <img
          alt=""
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 h-full max-w-none select-none ${showAnimation ? "" : "opacity-0"}`}
          draggable={false}
          onError={() => {
            setFailedAnimationFile(animation.file);
            onCompleteRef.current?.();
          }}
          onLoad={() => setIsAnimationLoaded(true)}
          src={animation.file}
          style={{
            imageRendering: "pixelated",
            left: `${-frameIndex * 100}%`,
            width: `${animation.frameCount * 100}%`,
          }}
        />
      )}
    </span>
  );
}
