import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { HeroSection } from "./(home)/hero-section";
import { FeaturesSection } from "./(home)/features-section";
import { CtaSection } from "./(home)/cta-section";

export const metadata: Metadata = {
  title: "Home — Last Peace of Art",
  description: "Create, share, and connect. Your space for projects, blogs, profiles, and discussions.",
  openGraph: {
    title: "Last Peace of Art",
    description: "Create, share, and connect. Your space for projects, blogs, profiles, and discussions.",
  },
};

export default async function LandingPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <>
      <HeroSection loggedIn={!!session} />
      <FeaturesSection />
      {!session && <CtaSection />}
    </>
  );
}
