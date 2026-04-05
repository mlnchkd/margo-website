"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./BeforeAfterSlider.module.css";

type Props = {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel: string;
  afterLabel: string;
  aspectRatio?: [number, number];
};

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeLabel,
  afterLabel,
  aspectRatio,
}: Props) {
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  // Mouse drag
  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => updatePosition(e.clientX);
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging, updatePosition]);

  // Touch drag
  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: TouchEvent) => updatePosition(e.touches[0].clientX);
    const onEnd = () => setDragging(false);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onEnd);
    return () => {
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [dragging, updatePosition]);

  return (
    <div
      ref={containerRef}
      className={styles.container}
      style={
        aspectRatio
          ? { aspectRatio: `${aspectRatio[0]} / ${aspectRatio[1]}` }
          : undefined
      }
      onMouseDown={(e) => {
        setDragging(true);
        updatePosition(e.clientX);
      }}
      onTouchStart={(e) => {
        setDragging(true);
        updatePosition(e.touches[0].clientX);
      }}
    >
      {/* After — base layer */}
      <div className={styles.layer}>
        <Image
          src={afterSrc}
          alt={afterLabel}
          fill
          className={styles.image}
          draggable={false}
        />
      </div>

      {/* Before — clipped layer */}
      <div
        className={styles.layer}
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={beforeSrc}
          alt={beforeLabel}
          fill
          className={styles.image}
          draggable={false}
        />
      </div>

      {/* Labels */}
      <span className={`${styles.label} ${styles.labelBefore}`}>
        {beforeLabel}
      </span>
      <span className={`${styles.label} ${styles.labelAfter}`}>
        {afterLabel}
      </span>

      {/* Handle */}
      <div className={styles.handle} style={{ left: `${position}%` }}>
        <div className={styles.handleLine} />
        <div className={styles.handleCircle}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M6 4L2 9L6 14"
              stroke="#111"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 4L16 9L12 14"
              stroke="#111"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
