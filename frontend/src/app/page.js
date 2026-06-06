import ClubsSection from "./components/ClubsSection";
import ContactSection from "./components/ContactSection";
import EventsSection from "./components/EventsSection";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import RegistrationForm from "./components/RegistrationForm";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <EventsSection />
        <ClubsSection />
        <RegistrationForm />
        <ContactSection />
      </main>
    </>
  );
}
