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
    attorneys: string;
    about: string;
    contact: string;
    callNow: string;
  };
  footer: {
    tagline: string;
    rights: string;
    locations: string;
    phoneLabel: string;
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
    attorneys: "Our Attorneys",
    about: "About Bobby",
    contact: "Contact",
    callNow: "Call 24/7",
  },
  footer: {
    tagline: "Bobby está contigo — Justice Made Simple",
    rights: "All rights reserved.",
    locations: "Office locations",
    phoneLabel: "24/7 Customer Support",
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
    "arturo-garcia": {
      name: "Arturo Garcia",
      role: "Of Counsel",
      quote:
        "Every client deserves a lawyer who listens first and fights second. At Bobby Garcia Law, we stand with families through the hardest moments and never stop pushing for accountability.",
      meetLabel: "Meet Arturo",
    },
    "roxana-lopez": {
      name: "Roxana Lopez",
      role: "Of Counsel",
      quote:
        "When someone trusts us with their case, we treat that trust as sacred. Our job is to protect your rights, explain every step clearly, and fight until justice is done.",
      meetLabel: "Meet Roxana",
    },
  },
};
