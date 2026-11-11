import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/trips";

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Upsert profile in Postgres
      try {
        await prisma.user.upsert({
          where: { id: data.user.id },
          update: {
            email: data.user.email!,
            displayName:
              data.user.user_metadata?.full_name ||
              data.user.user_metadata?.name ||
              data.user.email!.split("@")[0],
          },
          create: {
            id: data.user.id,
            email: data.user.email!,
            displayName:
              data.user.user_metadata?.full_name ||
              data.user.user_metadata?.name ||
              data.user.email!.split("@")[0],
            theme: "sepia",
          },
        });
      } catch (err) {
        console.error("Database user sync error on OAuth callback:", err);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return to login with error parameter if code exchange fails
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
