import { Suspense } from "react";
import { ThemeSync } from "./ThemeSync";

export default function DesignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <ThemeSync />
      </Suspense>
      {children}
    </>
  );
}
