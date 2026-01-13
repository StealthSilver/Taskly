"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { status } = useSession();

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:h-16 sm:px-6 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 shadow-sm ring-1 ring-slate-900/10">
            <Image
              src="/todo.svg"
              alt="Taskly logo"
              width={24}
              height={24}
              priority
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-semibold tracking-tight text-slate-900">
              Taskly
            </span>
          </div>
        </Link>

        {status === "authenticated" ? (
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Sign out
          </button>
        ) : (
          <Link
            href="/login"
            className="text-xs font-medium text-slate-600 transition hover:text-slate-900"
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
