import Navbar from './components/Navbar.tsx'
import Hero from './components/Hero.tsx'
import ResearchFocus from './components/ResearchFocus.tsx'
import About from './components/About.tsx'
import Education from './components/Education.tsx'
import Experience from './components/Experience.tsx'
import Training from './components/Training.tsx'
import Research from './components/Research.tsx'
import Publications from './components/Publications.tsx'
import Views from './components/Views.tsx'
import Recognition from './components/Recognition.tsx'
import Contact from './components/Contact.tsx'
import Footer from './components/Footer.tsx'
import { useScrollReveal } from './hooks/useScrollReveal.ts'

export default function App() {
  useScrollReveal('main > section:not(:first-of-type) > .container > *')

  return (
    <>
      <a href="#top" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <main id="top" tabIndex={-1}>
        <Hero />
        <ResearchFocus />
        <About />
        <Education />
        <Experience />
        <Training />
        <Research />
        <Publications />
        <Views />
        <Recognition />
        <Contact />
      </main>
      <Footer />
    </>
  )
}