import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Expertise from '@/components/Expertise'
import Gallery from '@/components/Gallery'
import Configurator from '@/components/Configurator'
import Process from '@/components/Process'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import Reveal from '@/components/Reveal'
import { DevisProvider } from '@/components/DevisProvider'

export default function Home() {
  return (
    // Le configurateur dépose sa configuration en mots, le formulaire de
    // contact la reprend : le fournisseur enjambe les deux sections.
    <DevisProvider>
    <main>
      {/* La barre de navigation reste fixe et immobile : c'est du mobilier, pas
          du contenu à révéler. Le configurateur non plus ne s'anime pas —
          quand on tire un curseur pour voir un prix, une animation qui se
          déclenche gêne au lieu de plaire. */}
      <Nav />
      <Reveal immediate>
        <Hero />
      </Reveal>
      <Reveal>
        <Expertise />
      </Reveal>
      <Reveal>
        <Gallery />
      </Reveal>
        <Configurator />
      <Reveal>
        <Process />
      </Reveal>
      <Reveal>
        <Contact />
      </Reveal>
      <Reveal>
        <Footer />
      </Reveal>
    </main>
    </DevisProvider>
  )
}
