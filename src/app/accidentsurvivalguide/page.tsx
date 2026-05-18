import { AsgHomePage } from "@/components/accidentsurvivalguide/AsgHomePage";
import { getMessages } from "@/lib/i18n/get-messages";
import { getAsgLocale } from "@/lib/i18n/server";

export default function AccidentSurvivalGuideHomePage() {
  const locale = getAsgLocale();
  const messages = getMessages(locale);
  return <AsgHomePage messages={messages} />;
}
