"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createServerSupabaseClient } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { loginSchema, signupSchema } from "@/schemas/auth";

export interface AuthActionResult {
  success?: boolean;
  error?: string;
}

/**
 * Handle Email + Password Sign Up
 */
export async function signUpAction(formData: FormData): Promise<AuthActionResult> {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
    displayName: formData.get("displayName") || undefined,
  };

  const validation = signupSchema.safeParse(rawData);
  if (!validation.success) {
    return { error: validation.error.errors[0]?.message || "Invalid input data" };
  }

  const { email, password, displayName } = validation.data;
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        displayName: displayName || email.split("@")[0],
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    // Ensure User record exists in Postgres through Prisma
    try {
      await prisma.user.upsert({
        where: { id: data.user.id },
        update: {
          email: data.user.email!,
          displayName: displayName || data.user.email!.split("@")[0],
        },
        create: {
          id: data.user.id,
          email: data.user.email!,
          displayName: displayName || data.user.email!.split("@")[0],
          theme: "sepia",
        },
      });
    } catch (e) {
      console.error("Failed to sync user to database:", e);
      // Not fatal if trigger handles it
    }
  }

  return { success: true };
}

/**
 * Handle Email + Password Login
 */
export async function signInAction(formData: FormData): Promise<AuthActionResult> {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const validation = loginSchema.safeParse(rawData);
  if (!validation.success) {
    return { error: validation.error.errors[0]?.message || "Invalid credentials" };
  }

  const { email, password } = validation.data;
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    try {
      await prisma.user.upsert({
        where: { id: data.user.id },
        update: {},
        create: {
          id: data.user.id,
          email: data.user.email!,
          displayName: data.user.user_metadata?.displayName || data.user.email!.split("@")[0],
          theme: "sepia",
        },
      });
    } catch (e) {
      console.error("Failed to verify user in database:", e);
    }
  }

  return { success: true };
}

/**
 * Handle Sign Out
 */
export async function signOutAction(): Promise<void> {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/login");
}
