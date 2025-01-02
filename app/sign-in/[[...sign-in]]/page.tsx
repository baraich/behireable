import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50">
      <div className="p-4 sm:p-8 rounded-2xl bg-white shadow-xl w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
          <p className="text-muted-foreground">Sign in to your account to continue</p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: "bg-primary hover:opacity-90 transition-opacity",
              card: "shadow-none",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton: "border-gray-200 hover:bg-muted/50 transition-colors",
              formFieldInput: "border-gray-200 focus:border-primary focus:ring-primary",
              footer: "hidden"
            }
          }}
        />
      </div>
    </div>
  );
} 