"use client";

import SplashScreen from "./SplashScreen";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return <SplashScreen>{children}</SplashScreen>;
}
