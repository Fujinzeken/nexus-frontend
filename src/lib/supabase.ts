import { createBrowserClient } from "@supabase/ssr";

let client: ReturnType<typeof createBrowserClient> | undefined;

export function createClient() {
  if (client) return client;

  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  return client;
}

// Export a legacy singleton for easy migration, but lazy-initialize it
// Use the underlying type for createBrowserClient to maintain full type safety
export const supabase: ReturnType<typeof createBrowserClient> = createClient();
