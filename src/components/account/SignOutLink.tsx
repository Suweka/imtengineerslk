"use client";

import { signOut } from "next-auth/react";

export function SignOutLink() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm font-medium text-imt-red hover:bg-red-50"
    >
      Sign out
    </button>
  );
}
