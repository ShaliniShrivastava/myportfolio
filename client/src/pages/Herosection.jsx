import React, { useState, useEffect } from "react";
import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaServer,
  FaLaptopCode,
} from "react-icons/fa";
import API from "../services/api";

function Herosection() {
  const [Hero, setHero] = useState([]);
  const fetchHero = async () => {
    try {
      const res = await API.get("/getAllHero");
      console.log(res.data);
      setHero(res.data.hero);
      // setLoading(false)
    } catch (error) {
      console.log(error);
      // setLoading(false)
    }
  };

  useEffect(() => {
    fetchHero();
  }, []);

  // const hero = {
  //     subtitle: "Full Stack Developer",
  //     name: "Mansi Batham",
  //     description:
  //         "I am a passionate MERN Stack Developer and Web Designer with experience in building responsive, modern, and user-friendly web applications. I love creating beautiful UI and scalable backend solutions.",

  //     resumeLink: "/resume.pdf",

  //     github: "https://github.com/yourgithub",
  //     linkedin: "https://linkedin.com/in/yourlinkedin",
  //     instagram: "https://instagram.com/yourinstagram",

  //     profileImage:
  //         "https://images.unsplash.com/photo-1500648767791-00dcc994a43?w=600",

  //     frontendTitle: "Frontend Developer",
  //     backendTitle: "Backend Developer",
  // }

  return (
    <section
      id="home"
      className="min-h-screen flex items-center pt-28 px-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
    >
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <div>
          <p className="text-cyan-400 font-semibold mb-4 uppercase tracking-widest">
            {Hero.subtitle}
          </p>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 text-white">
            Hi, I'm
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-transparent bg-clip-text">
              {Hero.name}
            </span>
          </h1>

          <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
            {Hero.description}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 mb-10">
            <a
              href="#projects"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-105 transition font-semibold shadow-lg text-white"
            >
              View Portfolio
            </a>

            <a
              href={Hero.resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-2xl border border-slate-700 hover:border-cyan-400 transition text-white"
            >
              Download Resume
            </a>
          </div>

          {/* Social Links */}
          <div className="flex gap-5 text-2xl text-white">
            <a
              href={Hero.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition"
            >
              <FaGithub />
            </a>

            <a
              href={Hero.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition"
            >
              <FaLinkedin />
            </a>

            <a
              href={Hero.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition"
            >
              <FaInstagram />
            </a>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative flex justify-center">
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <img
              src={Hero.profileImage}
              alt={Hero.name}
              className="rounded-3xl w-96 h-[500px] object-cover"
            />
          </div>

          {/* Floating Card 1 */}
          <div className="absolute top-8 -left-8 bg-slate-900 p-4 rounded-2xl border border-slate-700 shadow-lg text-white">
            <FaLaptopCode className="text-cyan-400 text-3xl mb-2" />
            <p className="font-semibold">{Hero.frontendTitle}</p>
          </div>

          {/* Floating Card 2 */}
          <div className="absolute bottom-8 -right-8 bg-slate-900 p-4 rounded-2xl border border-slate-700 shadow-lg text-white">
            <FaServer className="text-cyan-400 text-3xl mb-2" />
            <p className="font-semibold">{Hero.backendTitle}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Herosection;
