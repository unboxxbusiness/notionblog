"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { BorderBeam } from "../magicui/border-beam";

export function BorderButton({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative rounded-md border-input border-[1px] px-4 py-2 text-sm",
        "bg-transparent text-foreground",
        "hover:bg-primary/10 transition-colors",
        {
          "bg-primary text-primary-foreground hover:bg-primary/90": active,
        }
      )}
    >
      {children}
      {active && <BorderBeam size={50} duration={4} delay={0} />}
    </Link>
  );
}