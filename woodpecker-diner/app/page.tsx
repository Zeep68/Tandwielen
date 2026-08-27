import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import MenuSection from '@/components/MenuSection'
import About from '@/components/About'
import Reserve from '@/components/Reserve'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <div className="checkerboard" style={{ ['--check' as string]: 'var(--brown)' }} />
        <MenuSection />
        <div className="checkerboard" style={{ ['--check' as string]: 'var(--orange)' }} />
        <About />
        <Reserve />
        <div className="checkerboard" style={{ ['--check' as string]: 'var(--green)' }} />
      </main>
      <Footer />
    </>
  )
}
