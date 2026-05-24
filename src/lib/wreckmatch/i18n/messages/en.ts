export const en = {
  lang: {
    switch: "Language",
    en: "English",
    es: "Español",
    choose: "Choose your language",
  },
  splash: {
    subtitle: "A calm space for support, connection, and help after a wreck.",
    createProfile: "Create your support profile",
    exploreApp: "Explore the app",
    hasAccount: "I already have an account",
  },
  sarah: {
    hereForYou: "Sarah is here for you",
    callOrChat247: "24/7 call or chat",
    call: "Call",
    chat: "Chat",
    supportGuide: "Your support guide",
    talkToSarah: "Talk to Sarah",
    heroDescription:
      "Available 24/7 by call or chat. No pressure — just someone who listens and helps you figure out next steps.",
    callOrText: "Call or text",
    chatWithSarah: "Chat with Sarah",
  },
  form: {
    requestFreeHelp: "Request free help",
    tapToFill: "Tap to fill out a short form",
    getMatchedTitle: "Get matched with help",
    getMatchedDescription: "Free and confidential. Share only what feels comfortable.",
    firstName: "First name",
    lastName: "Last name",
    phone: "Phone",
    phonePlaceholder: "Your best number",
    email: "Email",
    state: "State",
    selectState: "Select your state",
    messageLabel: "Anything you'd like us to know?",
    optional: "(optional)",
    messagePlaceholder: "Only share what feels comfortable...",
    consent:
      "I consent to be contacted about support and optional legal resources. I understand this is not legal advice.",
    sending: "Sending...",
    submit: "Request free help",
    successTitle: "We received your message",
    successBody:
      "Sarah or someone from our team will reach out gently — only when you're ready. There is no obligation.",
    errorGeneric: "We couldn't send your request. Please try calling Sarah.",
    errorNetwork: "Something went wrong. Please call 855-8-WRECKMATCH — Sarah is here for you.",
  },
  nav: {
    main: "Main navigation",
    home: "Home",
    community: "Community",
    matches: "Matches",
    help: "Help",
    profile: "Profile",
  },
  home: {
    greetingMorning: "Good morning",
    greetingAfternoon: "Good afternoon",
    greetingEvening: "Good evening",
    friend: "friend",
    headerSubtitle: "However today feels, you don't have to carry it alone.",
    peopleLikeYou: "People like you",
    peopleLikeYouDescription:
      "Survivors with similar experiences who may understand your path.",
    survivorStories: "Survivor stories",
    survivorStoriesDescription: "Real moments from people on the same road.",
  },
  quick: {
    struggling: "I'm struggling today",
    strugglingDescription: "Talk to Sarah or find calm support",
    shareWin: "Share a win",
    shareWinDescription: "Celebrate progress, big or small",
  },
  help: {
    supportNow: "Support now",
    title: "You're not alone in this moment",
    subtitle:
      "Take your time. There is no wrong choice — only what feels safe for you right now.",
    requestHelp: "Request help",
    requestHelpDescription: "We'll reach out gently when you're ready.",
    emergencyResources: "Emergency resources",
    emergencyDescription: "If you're in crisis or immediate danger.",
    crisis988: "988 Crisis Lifeline",
    crisis988Description: "Free, confidential support 24/7. Call or text {phone}.",
    medicalEmergency: "Medical or immediate danger",
    medicalEmergencyDescription: "Call 911 for emergencies.",
    calmBody: "Calm your body",
    connectOthers: "Connect with others",
    connectOthersDescription: "Survivors who understand what you're going through.",
    communityFeed: "Community feed",
    communityFeedDescription: "Read and share with others",
    shareHowYouFeel: "Share how you feel",
    shareHowYouFeelDescription: "Post from your home screen",
    moreResources: "More resources & guides →",
  },
  grounding: {
    title: "Grounding exercise",
    description: "Three slow breaths. No rush. You can stop anytime.",
    breatheIn: "Breathe in",
    hold: "Hold",
    breatheOut: "Breathe out",
    rest: "Rest",
    ready: "Ready when you are",
    breathOf: "Breath {current} of {total}",
    stop: "Stop",
    start: "Start breathing",
  },
  crisis: {
    supportNow: "Support Now",
    ariaLabel: "Support now — crisis help and resources",
  },
  demo: {
    label: "Demo mode",
    body: "— browsing with sample data. Add Supabase keys to",
    setupGuide: "Setup guide",
  },
  legal: {
    disclaimer:
      "WreckMatch is a peer support community, not a law firm. We do not provide legal advice, and no attorney-client relationship is formed through this app. Always consult a licensed attorney in your state for legal guidance.",
    medical:
      "Information in WreckMatch is for general support only and is not medical advice. If you are in pain or concerned about your health, please contact a licensed healthcare provider.",
    auth: "WreckMatch offers emotional support and community connection. If you are in immediate danger or a medical emergency, call 911. For emotional crisis support, call or text 988.",
  },
  retell: {
    fabText: "Chat with Sarah",
    title: "Talk to Sarah",
    popup:
      "Hi — I'm Sarah from WreckMatch. I'm here if you need support after your wreck.",
  },
  tagline: "You're not alone after the wreck.",
};

export type WmMessages = {
  lang: {
    switch: string;
    en: string;
    es: string;
    choose: string;
  };
  splash: {
    subtitle: string;
    createProfile: string;
    exploreApp: string;
    hasAccount: string;
  };
  sarah: {
    hereForYou: string;
    callOrChat247: string;
    call: string;
    chat: string;
    supportGuide: string;
    talkToSarah: string;
    heroDescription: string;
    callOrText: string;
    chatWithSarah: string;
  };
  form: {
    requestFreeHelp: string;
    tapToFill: string;
    getMatchedTitle: string;
    getMatchedDescription: string;
    firstName: string;
    lastName: string;
    phone: string;
    phonePlaceholder: string;
    email: string;
    state: string;
    selectState: string;
    messageLabel: string;
    optional: string;
    messagePlaceholder: string;
    consent: string;
    sending: string;
    submit: string;
    successTitle: string;
    successBody: string;
    errorGeneric: string;
    errorNetwork: string;
  };
  nav: {
    main: string;
    home: string;
    community: string;
    matches: string;
    help: string;
    profile: string;
  };
  home: {
    greetingMorning: string;
    greetingAfternoon: string;
    greetingEvening: string;
    friend: string;
    headerSubtitle: string;
    peopleLikeYou: string;
    peopleLikeYouDescription: string;
    survivorStories: string;
    survivorStoriesDescription: string;
  };
  quick: {
    struggling: string;
    strugglingDescription: string;
    shareWin: string;
    shareWinDescription: string;
  };
  help: {
    supportNow: string;
    title: string;
    subtitle: string;
    requestHelp: string;
    requestHelpDescription: string;
    emergencyResources: string;
    emergencyDescription: string;
    crisis988: string;
    crisis988Description: string;
    medicalEmergency: string;
    medicalEmergencyDescription: string;
    calmBody: string;
    connectOthers: string;
    connectOthersDescription: string;
    communityFeed: string;
    communityFeedDescription: string;
    shareHowYouFeel: string;
    shareHowYouFeelDescription: string;
    moreResources: string;
  };
  grounding: {
    title: string;
    description: string;
    breatheIn: string;
    hold: string;
    breatheOut: string;
    rest: string;
    ready: string;
    breathOf: string;
    stop: string;
    start: string;
  };
  crisis: {
    supportNow: string;
    ariaLabel: string;
  };
  demo: {
    label: string;
    body: string;
    setupGuide: string;
  };
  legal: {
    disclaimer: string;
    medical: string;
    auth: string;
  };
  retell: {
    fabText: string;
    title: string;
    popup: string;
  };
  tagline: string;
};
