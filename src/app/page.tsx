import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyCta } from "@/components/StickyCta";
import { Hero } from "@/components/sections/Hero";
import { Challenge } from "@/components/sections/Challenge";
import { About } from "@/components/sections/About";
import { speakerCards } from "@/config/site";
import { Speaker } from "@/components/sections/Speaker";
import { Container, Section } from "@/components/ui/Section";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { CommunityProof } from "@/components/sections/CommunityProof";
import { Testimonials } from "@/components/sections/Testimonials";
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
        <SectionDivider />
        <Section compact labelledBy="speaker-heading">
          <Container size="wide">
            <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {speakerCards.map(profile => <Speaker key={profile.id} profile={profile} />)}
            </div>
          </Container>
        </Section>
        <SectionDivider />
        <CommunityProof />
        <Testimonials />
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
