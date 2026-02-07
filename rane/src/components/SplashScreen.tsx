"use client";

import { useState, useRef, useEffect } from "react";

interface SplashScreenProps {
  children: React.ReactNode;
}

export default function SplashScreen({ children }: SplashScreenProps) {
  const [phase, setPhase] = useState<"playing" | "fading" | "done">("playing");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // End after 3 seconds regardless of video length
    const timer = setTimeout(() => {
      if (phase === "playing") setPhase("fading");
    }, 1000);
    return () => clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase === "fading") {
      const timer = setTimeout(() => setPhase("done"), 700);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  if (phase === "done") {
    return <>{children}</>;
  }

  return (
    <>
      {/* Preload app content behind splash */}
      <div
        className={`transition-opacity duration-700 ${
          phase === "fading" ? "opacity-100" : "opacity-0"
        }`}
      >
        {children}
      </div>

      {/* Splash overlay — background matches app (#F8F6FC) */}
      <div
        className={`fixed inset-0 z-[9999] flex items-center justify-center bg-background transition-opacity duration-700 ${
          phase === "fading" ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <video
          ref={videoRef}
          src="/splash.mp4"
          autoPlay
          muted
          playsInline
          className="h-full max-h-full object-contain"
        />
      </div>
    </>
  );
}
