import type { AttorneySlug } from "@/lib/bobbygarcia/attorneys";

export type BgAttorneyMessages = {
  name: string;
  role: string;
  quote: string;
  bio?: string;
  meetLabel: string;
};

export type BgMessages = {
  meta: {
    siteName: string;
    titleTemplate: string;
  };
  lang: { switch: string; en: string; es: string };
  nav: {
    ariaMain: string;
    home: string;
    practice: string;
    attorneys: string;
    blog: string;
    about: string;
    contact: string;
    callNow: string;
  };
  home: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    heroTitle: string;
    heroImageAlt: string;
    heroSubtitle: string;
    motto: string;
    ctaCall: string;
    ctaFree: string;
    trustLine: string;
    practiceEyebrow: string;
    practiceTitle: string;
    insightsEyebrow: string;
    insightsTitle: string;
    insightsCount: string;
    viewAllGuides: string;
    finalCtaTitle: string;
    finalCtaBody: string;
  };
  practicePage: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title: string;
    intro: string;
  };
  aboutPage: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title: string;
    paragraphs: string[];
    meetTeam: string;
  };
  contactPage: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title: string;
    intro: string;
    phoneLabel: string;
    available: string;
    emailLabel: string;
    hoursLabel: string;
    officeHours: string;
  };
  footer: {
    tagline: string;
    rights: string;
    locations: string;
    phoneLabel: string;
    emailLabel: string;
    hoursLabel: string;
    officeHours: string;
  };
  attorneysPage: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title: string;
    intro: string;
    motto: string;
    featuredLabel: string;
    teamTitle: string;
    ctaTitle: string;
    ctaBody: string;
    ctaButton: string;
    ctaPhone: string;
  };
  roles: {
    foundingPartner: string;
    ofCounsel: string;
  };
  attorneys: Record<AttorneySlug, BgAttorneyMessages>;
  blog: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title: string;
    intro: string;
    countLabel: string;
    readGuide: string;
    allGuides: string;
    faq: string;
    ctaTitle: string;
    ctaBody: string;
    meetAttorneys: string;
    callNow: string;
    downloadPptx: string;
  };
};

export const en: BgMessages = {
  meta: {
    siteName: "Law Office of Bobby Garcia",
    titleTemplate: "%s | Law Office of Bobby Garcia",
  },
  lang: {
    switch: "Language",
    en: "English",
    es: "Español",
  },
  nav: {
    ariaMain: "Main navigation",
    home: "Home",
    practice: "Practice Areas",
    attorneys: "Our Attorneys",
    blog: "Legal Guides",
    about: "About Bobby",
    contact: "Contact",
    callNow: "Call 24/7",
  },
  home: {
    metaTitle: "Texas Personal Injury Lawyers | Bobby Garcia Law",
    metaDescription:
      "Trial lawyers serving South Texas and Houston. Car accidents, 18-wheelers, slip and fall — free 24/7 consultations. Justice Made Simple.",
    eyebrow: "Law Office of Bobby Garcia",
    heroTitle: "Texas trial lawyers who fight for you",
    heroImageAlt: "Attorney Bobby Garcia in the courtroom",
    heroSubtitle:
      "When a serious injury turns your life upside down, you need a team—not just a lawyer. We stand with families across the Rio Grande Valley, Houston, and statewide.",
    motto: "Justice Made Simple",
    ctaCall: "Call 24/7",
    ctaFree: "Free consultation",
    trustLine: "No win, no fee · Bilingual English & Spanish · Two Texas offices",
    practiceEyebrow: "What we do",
    practiceTitle: "Practice areas",
    insightsEyebrow: "Resources",
    insightsTitle: "Legal guides & insights",
    insightsCount: "{count} in-depth guides in English and Spanish",
    viewAllGuides: "View all guides",
    finalCtaTitle: "Injured? We're here 24/7.",
    finalCtaBody: "Free confidential consultation. No win, no fee. Bobby está contigo.",
  },
  practicePage: {
    metaTitle: "Practice Areas",
    metaDescription:
      "Personal injury practice areas at Bobby Garcia Law — car accidents, 18-wheelers, slip and fall, workplace injuries, mass tort, and more.",
    eyebrow: "Our expertise",
    title: "Practice areas",
    intro:
      "From catastrophic trucking crashes to everyday slip-and-fall cases, our trial team handles the full spectrum of personal injury claims across Texas.",
  },
  aboutPage: {
    metaTitle: "About Bobby Garcia",
    metaDescription:
      "Meet Bobby Garcia — founding partner and trial lawyer with 35+ years fighting for injured Texans. Justice Made Simple.",
    eyebrow: "Our story",
    title: "About Bobby Garcia",
    paragraphs: [
      "For over 35 years, Bobby Garcia has been a trial lawyer who treats every client like family. Based in the Rio Grande Valley with a Houston office, his firm has built a reputation for taking on tough cases and winning.",
      "Bobby founded the firm on a simple promise: Justice Made Simple. That means clear communication, aggressive advocacy, and a full team behind every case—not just one attorney juggling hundreds of files.",
      "Today, Bobby Garcia Law includes trial attorneys, legal analysts, medical specialists, and paralegals dedicated to one goal: the best possible outcome for you and your family.",
    ],
    meetTeam: "Meet our full team",
  },
  contactPage: {
    metaTitle: "Contact Us",
    metaDescription:
      "Contact Bobby Garcia Law 24/7 for a free personal injury consultation. Edinburg, McAllen, Houston — English and Spanish.",
    eyebrow: "Get in touch",
    title: "Contact us",
    intro: "Free confidential consultation. Available 24 hours a day, 7 days a week. No win, no fee.",
    phoneLabel: "Call now",
    available: "Available 24/7 · English & Español",
    emailLabel: "Email",
    hoursLabel: "Office hours",
    officeHours: "Monday – Friday, 8:00 AM – 5:00 PM",
  },
  footer: {
    tagline: "Bobby está contigo — Justice Made Simple",
    rights: "All rights reserved.",
    locations: "Office locations",
    phoneLabel: "24/7 Customer Support",
    emailLabel: "Email",
    hoursLabel: "Office hours",
    officeHours: "Monday – Friday, 8:00 AM – 5:00 PM",
  },
  attorneysPage: {
    metaTitle: "Meet Our Attorneys",
    metaDescription:
      "Meet the trial lawyers at the Law Office of Bobby Garcia. Decades of personal injury experience serving Texas and clients nationwide.",
    eyebrow: "Our legal team",
    title: "Meet Our Attorneys",
    intro:
      "At the Law Office of Bobby Garcia, we are trial lawyers who stand with you when something terrible has happened. We know you need someone on your side who cares—who is all in. When you work with us, you have a team committed to fighting for the best results for you and your family.",
    motto: "Justice Made Simple",
    featuredLabel: "Founding Partner",
    teamTitle: "Of Counsel",
    ctaTitle: "Ready to talk with our team?",
    ctaBody:
      "Free confidential consultations. Available 24/7. No win, no fee.",
    ctaButton: "Contact us now",
    ctaPhone: "Call now",
  },
  roles: {
    foundingPartner: "Founding Partner & CEO",
    ofCounsel: "Of Counsel",
  },
  attorneys: {
    "bobby-garcia": {
      name: "Bobby Garcia",
      role: "Founding Partner & CEO",
      quote:
        "I want our clients to know that we are going to be there to guide them through their difficult time, and that we have every intention of being there for them whatever the outcome. Clearly understand, I'm always in it to win it. I absolutely love what I do.",
      bio: "For over two decades, Bobby Garcia has advocated for personal injury clients across Texas and nationwide—treating every person as an individual, not just another case.",
      meetLabel: "Meet Bobby",
    },
  },
  blog: {
    metaTitle: "Personal Injury Legal Guides",
    metaDescription:
      "Texas personal injury guides by city and practice area from Bobby Garcia Law — car accidents, 18-wheelers, slip and fall, and more. English and Spanish.",
    eyebrow: "Resources",
    title: "Legal Guides & Blog",
    intro:
      "Educational articles for South Texas and Houston — what to do after a crash, insurance pitfalls, statutes of limitations, and practice-area overviews from Bobby Garcia Law.",
    countLabel: "{count} in-depth guides in English and Spanish",
    readGuide: "Read guide →",
    allGuides: "← All guides",
    faq: "FAQ",
    ctaTitle: "Free consultation 24/7",
    ctaBody: "Bobby Garcia Law — Justice Made Simple",
    meetAttorneys: "Meet our attorneys",
    callNow: "Call",
    downloadPptx: "Download PowerPoint",
  },
};
