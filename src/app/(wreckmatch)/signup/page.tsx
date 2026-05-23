import { SignUpForm } from "@/components/wreckmatch/auth/SignUpForm";
import { wm } from "@/lib/wreckmatch/theme";

export default function SignUpPage() {
  return (
    <main className={wm.page}>
      <h1 className={wm.heading}>Create your space</h1>
      <p className={`mt-2 ${wm.subheading}`}>
        Join a community that understands what you&apos;re going through.
      </p>
      <div className="mt-8">
        <SignUpForm />
      </div>
    </main>
  );
}
