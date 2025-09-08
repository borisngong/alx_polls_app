"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function getAuthenticatedUser() {
  const supabase = createServerComponentClient({ cookies });
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("Authentication error:", error.message);
      return null;
    }

    return user;
  } catch (e) {
    console.error("Unexpected error fetching user:", e);
    return null;
  }
}