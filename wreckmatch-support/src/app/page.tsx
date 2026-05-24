import { redirect } from "next/navigation";
import { WM } from "@/lib/wreckmatch/routes";

export default function RootPage() {
  redirect(WM.splash);
}
