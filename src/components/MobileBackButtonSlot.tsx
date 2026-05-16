"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import BackHomeButton from "@/components/BackHomeButton";

export default function MobileBackButtonSlot() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <div className="lg:hidden px-4 md:px-6 pt-6 pb-2 bg-transparent">
      <Suspense fallback={null}>
        <BackHomeButton iconOnly />
      </Suspense>
    </div>
  );
}
