import { useEffect, useState } from "react";
import API from "../services/api";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get("/getAllProjects");
        setProjects(res.data.projects);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-white">Loading Projects...</div>
    );
  }

  return (
    <section id="projects" className="py-28 px-6 bg-slate-900">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-20">
          <p className="text-cyan-400 uppercase tracking-widest font-semibold">
            Portfolio
          </p>

          <h2 className="text-5xl font-bold mt-4 text-white">
            Featured Projects
          </h2>
        </div>

        {/* Projects */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden hover:scale-105 transition duration-300 shadow-xl"
            >
              {/* Image */}
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-56 object-cover"
              />

              <div className="p-8">
                <div className="h-2 w-24 bg-linear-to-r from-cyan-400 to-blue-500 rounded-full mb-6"></div>

                {/* Title */}
                <h3 className="text-2xl font-bold mb-4 text-white">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-slate-400 mb-6">{project.description}</p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies?.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-white transition"
                  >
                    <FaGithub />
                    GitHub
                  </a>

                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 rounded-xl text-white transition"
                  >
                    <FaExternalLinkAlt />
                    Live Demo
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;
