"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

const AUTH_HIDDEN_PATHS = ["/login", "/register"] as const;

export default function NavbarShell() {
  const pathname = usePathname();

  if (
    AUTH_HIDDEN_PATHS.includes(pathname as (typeof AUTH_HIDDEN_PATHS)[number])
  ) {
    return null;
  }

  return <Navbar />;
}
