
import Herosection from "./Herosection";
import About from "./About";
import Services from "./Services";
import Projects from "./Projects";
import Contact from "./Contact";

function Home() {
  return (
    <>
      <main className="bg-slate-950 text-white overflow-hidden">
        {/* Hero Section */}
        <Herosection />
        <About />

        {/* Services Section */}
        <Services />
        <Projects />

        {/* Contact */}
        <Contact />
      </main>
    </>
  );
}

export default Home;
