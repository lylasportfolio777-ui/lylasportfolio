import { login } from "./actions";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function LoginPage(props: { 
  searchParams?: Promise<{ message?: string }> 
}) {
  // Check if user is already authenticated
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/admin");
  }

  const resolvedSearchParams = props.searchParams ? await props.searchParams : {};

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 select-none">
      <div className="w-full max-w-md space-y-8 bg-card border border-border p-8 rounded-xl shadow-xl">
        <div>
          <h2 className="text-3xl tracking-tight text-foreground font-semibold">Admin Login</h2>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to access the management dashboard.</p>
        </div>
        
        <form className="mt-8 space-y-6" action={login}>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium leading-none text-foreground block mb-2">
                Email Address
              </label>
              <input 
                name="email" 
                type="email" 
                required
                autoComplete="email"
                maxLength={254}
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all" 
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium leading-none text-foreground block mb-2">
                Password
              </label>
              <input 
                name="password" 
                type="password" 
                required 
                autoComplete="current-password"
                maxLength={128}
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all" 
                placeholder="••••••••"
              />
            </div>
          </div>

          {resolvedSearchParams?.message && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center rounded-md font-medium">
              {resolvedSearchParams.message}
            </div>
          )}

          <button 
            type="submit" 
            className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-foreground text-background h-11 px-4 py-2 hover:opacity-90 active:scale-[0.99] transition-all duration-150 shadow-sm"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
