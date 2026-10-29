import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyCta } from "@/components/StickyCta";
import { Hero } from "@/components/sections/Hero";
import { Challenge } from "@/components/sections/Challenge";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Speaker } from "@/components/sections/Speaker";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { CommunityProof } from "@/components/sections/CommunityProof";
import { Testimonials } from "@/components/sections/Testimonials";
import { Audience } from "@/components/sections/Audience";
import { EventInfo } from "@/components/sections/EventInfo";
import { Registration } from "@/components/sections/Registration";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";

export default function Page() {
  return (
    <>
      <Header />

      <main id="main" className="flex-1">
        <Hero />
        <Challenge />
        <About />
        <Experience />
        <Speaker />
        <SectionDivider />
        <Speaker karunai />
        <SectionDivider />
        <Speaker panelLeader />
        <SectionDivider />
        <Speaker guest />
        <CommunityProof />
        <Testimonials />
        <Audience />
        <EventInfo />
        <Registration />
        <Faq />
        <FinalCta />
      </main>

      <Footer />
      <StickyCta />
    </>
  );
}
