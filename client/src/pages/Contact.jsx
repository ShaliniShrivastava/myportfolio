

function Contact() {
  return (
    <>
      <section
        id="contact"
        className="py-28 px-6 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10"
      >
        <div className="max-w-5xl mx-auto text-center bg-slate-900 border border-slate-800 rounded-3xl p-20 shadow-2xl">
          <h2 className="text-5xl md:text-6xl font-bold mb-8">
            Ready to Build Together?
          </h2>

          <p className="text-slate-300 text-xl mb-10 max-w-3xl mx-auto">
            Open for internships, freelance opportunities, and enterprise-level
            collaborations.
          </p>

          <a
            href="mailto:yourname@gmail.com"
            className="px-12 py-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-105 transition font-bold text-lg shadow-lg"
          >
            Hire Me
          </a>
        </div>
      </section>
    </>
  );
}

export default Contact;
