import { LoginForm } from "@/components/wreckmatch/auth/LoginForm";
import { WM } from "@/lib/wreckmatch/routes";
import { wm } from "@/lib/wreckmatch/theme";

type LoginPageProps = {
  searchParams?: { next?: string };
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  const nextPath = searchParams?.next ?? WM.home;

  return (
    <main className={wm.page}>
      <h1 className={wm.heading}>Welcome back</h1>
      <p className={`mt-2 ${wm.subheading}`}>
        Sign in to reconnect with your community.
      </p>
      <div className="mt-8">
        <LoginForm nextPath={nextPath} />
      </div>
    </main>
  );
}
