import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';

import Management from '../components/Management';
import Activities from '../components/Activities';
import Projects from '../components/Projects';
import Events from '../components/Events';
import News from '../components/News';
import TurkicWorld from '../components/TurkicWorld';
import JoinUs from '../components/JoinUs';
import SocialMedia from '../components/SocialMedia';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero />
        <About />

        <Management />
        <Projects />
        <Events />
        <News />
        <TurkicWorld />
        <JoinUs />
        <SocialMedia />
        <FAQ />
        <Activities />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
