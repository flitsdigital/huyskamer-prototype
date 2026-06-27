export type Locale = "nl" | "en" | "de";
export const LOCALES: Locale[] = ["nl", "en", "de"];
export const DEFAULT_LOCALE: Locale = "nl";
export const LOCALE_LABELS: Record<Locale, string> = { nl: "NL", en: "EN", de: "DE" };
export const LOCALE_NAMES: Record<Locale, string> = { nl: "Nederlands", en: "English", de: "Deutsch" };

export function normalizeLocale(v: string | null | undefined): Locale {
  return v === "en" || v === "de" || v === "nl" ? v : DEFAULT_LOCALE;
}

type Entry = { nl: string; en: string; de: string };

// Customer-facing strings + shared UI. Admin/staff UI stays Dutch (staff are NL-speaking).
const dict = {
  "common.points": { nl: "punten", en: "points", de: "Punkte" },
  "common.save": { nl: "Opslaan", en: "Save", de: "Speichern" },
  "common.saved": { nl: "Opgeslagen", en: "Saved", de: "Gespeichert" },
  "common.cancel": { nl: "Annuleren", en: "Cancel", de: "Abbrechen" },
  "common.back": { nl: "Terug", en: "Back", de: "Zurück" },

  "auth.welcome": { nl: "Welkom bij", en: "Welcome to", de: "Willkommen bei" },
  "auth.tagline": {
    nl: "Spaar punten en geniet van een gratis kopje koffie.",
    en: "Collect points and enjoy a free cup of coffee.",
    de: "Sammle Punkte und genieße einen Gratis-Kaffee.",
  },
  "auth.email": { nl: "E-mailadres", en: "Email address", de: "E-Mail-Adresse" },
  "auth.name": { nl: "Naam (optioneel)", en: "Name (optional)", de: "Name (optional)" },
  "auth.consent": {
    nl: "Ik ga akkoord met het opslaan van mijn gegevens voor het spaarprogramma",
    en: "I agree to my data being stored for the loyalty programme",
    de: "Ich stimme der Speicherung meiner Daten für das Treueprogramm zu",
  },
  "auth.sendLink": { nl: "Stuur inloglink", en: "Send login link", de: "Login-Link senden" },
  "auth.sending": { nl: "Versturen…", en: "Sending…", de: "Senden…" },
  "auth.checkMail": { nl: "Check je mail", en: "Check your email", de: "Prüfe deine E-Mail" },
  "auth.checkMailBody": {
    nl: "We hebben een inloglink naar {email} gestuurd. Open de link op deze telefoon om in te loggen.",
    en: "We sent a login link to {email}. Open the link on this phone to sign in.",
    de: "Wir haben einen Login-Link an {email} gesendet. Öffne ihn auf diesem Telefon.",
  },
  "auth.noAccount": {
    nl: "Nog geen account? Die maken we automatisch aan bij je eerste inloglink.",
    en: "No account yet? We create one automatically with your first login link.",
    de: "Noch kein Konto? Wir erstellen es automatisch beim ersten Login-Link.",
  },
  "auth.consentRequired": { nl: "Geef toestemming om door te gaan.", en: "Please give consent to continue.", de: "Bitte stimme zu, um fortzufahren." },
  "auth.mailNotReceived": { nl: "Mail niet ontvangen?", en: "Didn't get the email?", de: "Keine E-Mail erhalten?" },
  "auth.resend": { nl: "Opnieuw versturen", en: "Resend", de: "Erneut senden" },
  "auth.resendIn": { nl: "Opnieuw over {s}s", en: "Resend in {s}s", de: "Erneut in {s}s" },
  "auth.referralApplied": { nl: "Uitnodiging toegepast — jullie krijgen allebei bonuspunten!", en: "Invite applied — you both get bonus points!", de: "Einladung übernommen — ihr bekommt beide Bonuspunkte!" },

  "card.greeting": { nl: "Hoi {name}", en: "Hi {name}", de: "Hallo {name}" },
  "card.yourBalance": { nl: "Jouw saldo", en: "Your balance", de: "Dein Guthaben" },
  "card.scanHint": {
    nl: "Laat deze code scannen bij de kassa om punten te sparen of in te wisselen.",
    en: "Show this code at the till to collect or redeem points.",
    de: "Zeige diesen Code an der Kasse, um Punkte zu sammeln oder einzulösen.",
  },
  "card.rewards": { nl: "Beloningen", en: "Rewards", de: "Belohnungen" },
  "card.history": { nl: "Historie", en: "History", de: "Verlauf" },
  "card.noHistory": {
    nl: "Nog geen transacties. Spaar je eerste punten bij De Huyskamer!",
    en: "No transactions yet. Earn your first points at De Huyskamer!",
    de: "Noch keine Transaktionen. Sammle deine ersten Punkte bei De Huyskamer!",
  },
  "card.toNextReward": { nl: "Nog {n} punten tot {reward}", en: "{n} points to {reward}", de: "Noch {n} Punkte bis {reward}" },
  "card.tier": { nl: "Niveau", en: "Tier", de: "Stufe" },
  "card.toNextTier": { nl: "Nog {n} punten tot {tier}", en: "{n} points to {tier}", de: "Noch {n} Punkte bis {tier}" },
  "card.maxTier": { nl: "Hoogste niveau bereikt!", en: "Top tier reached!", de: "Höchste Stufe erreicht!" },
  "card.share": { nl: "Deel & verdien", en: "Share & earn", de: "Teilen & verdienen" },
  "card.logout": { nl: "Uitloggen", en: "Log out", de: "Abmelden" },
  "card.profile": { nl: "Profiel", en: "Profile", de: "Profil" },
  "card.privacy": { nl: "Privacyverklaring", en: "Privacy statement", de: "Datenschutz" },
  "card.deleteAccount": { nl: "Account verwijderen", en: "Delete account", de: "Konto löschen" },
  "card.deleteConfirm": {
    nl: "Weet je zeker dat je je account en al je punten wilt verwijderen?",
    en: "Are you sure you want to delete your account and all your points?",
    de: "Möchtest du wirklich dein Konto und alle Punkte löschen?",
  },

  "profile.title": { nl: "Mijn profiel", en: "My profile", de: "Mein Profil" },
  "profile.displayName": { nl: "Naam", en: "Name", de: "Name" },
  "profile.birthdate": { nl: "Geboortedatum (voor je verjaardagscadeau)", en: "Date of birth (for your birthday gift)", de: "Geburtsdatum (für dein Geburtstagsgeschenk)" },
  "profile.language": { nl: "Taal", en: "Language", de: "Sprache" },
  "profile.referralCode": { nl: "Jouw uitnodigingscode", en: "Your invite code", de: "Dein Einladungscode" },
  "profile.stats": { nl: "Statistieken", en: "Statistics", de: "Statistiken" },
  "profile.earnedThisYear": { nl: "Gespaard dit jaar", en: "Earned this year", de: "Dieses Jahr gesammelt" },
  "profile.redeemedCount": { nl: "Beloningen verzilverd", en: "Rewards redeemed", de: "Eingelöste Belohnungen" },
  "profile.memberSince": { nl: "Lid sinds", en: "Member since", de: "Mitglied seit" },
  "profile.referralBody": {
    nl: "Nodig een vriend uit met jouw code. Schrijft hij/zij zich in? Dan krijgen jullie allebei bonuspunten.",
    en: "Invite a friend with your code. When they sign up, you both get bonus points.",
    de: "Lade einen Freund mit deinem Code ein. Bei Anmeldung bekommt ihr beide Bonuspunkte.",
  },
  "profile.copy": { nl: "Kopieer link", en: "Copy link", de: "Link kopieren" },
  "profile.copied": { nl: "Gekopieerd!", en: "Copied!", de: "Kopiert!" },
} satisfies Record<string, Entry>;

export type MsgKey = keyof typeof dict;

export function t(locale: Locale, key: MsgKey, vars?: Record<string, string | number>): string {
  const entry = dict[key];
  let s = (entry && entry[locale]) || (entry && entry.nl) || String(key);
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }
  return s;
}
