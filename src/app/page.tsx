import { redirect } from "next/navigation";

/** wreckmatch.com root → support app entry (not the legacy compliance landing). */
export default function RootPage() {
  redirect("/splash");
}
