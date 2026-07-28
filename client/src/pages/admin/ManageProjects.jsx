import React, { useEffect, useState } from "react";
import API from "../../services/api";

function ManageProjects() {
  // ================= STATES =================

  const [projects, setProjects] = useState([]);

  const [open, setOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);

  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    liveLink: "",
    githubLink: "",
    technologies: "",
    image: null,
  });

  // ================= FETCH PROJECTS =================

  const fetchProjects = async () => {
    try {
      const res = await API.get("/getAllProjects");

      setProjects(res.data.projects);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({
        ...form,
        image: e.target.files[0],
      });
    } else {
      setForm({
        ...form,
        [e.target.name]: e.target.value,
      });
    }
  };

  // ================= ADD PROJECT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("liveLink", form.liveLink);
      formData.append("githubLink", form.githubLink);

      formData.append(
        "technologies",
        JSON.stringify(form.technologies.split(",").map((item) => item.trim())),
      );

      formData.append("image", form.image);

      const res = await API.post("/create-project", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(res.data.message);

      setOpen(false);

      setForm({
        title: "",
        description: "",
        liveLink: "",
        githubLink: "",
        technologies: "",
        image: null,
      });

      fetchProjects();
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message);
    }
  };

  // ================= EDIT OPEN =================

  const handleEdit = (project) => {
    setEditOpen(true);

    setEditId(project._id);

    setForm({
      title: project.title,
      description: project.description,
      liveLink: project.liveLink,
      githubLink: project.githubLink,
      technologies: project.technologies.join(", "),
      image: null,
    });
  };

  // ================= UPDATE =================

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("liveLink", form.liveLink);
      formData.append("githubLink", form.githubLink);

      formData.append(
        "technologies",
        JSON.stringify(form.technologies.split(",").map((item) => item.trim())),
      );

      if (form.image) {
        formData.append("image", form.image);
      }

      const res = await API.put(`/updateProject/${editId}`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(res.data.message);

      setEditOpen(false);

      fetchProjects();
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message);
    }
  };

  // ================= DELETE =================

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Are you sure want to delete?");

    if (!confirmDelete) return;

    try {
      const res = await API.delete(`/deleteProject/${id}`, {
        withCredentials: true,
      });

      alert(res.data.message);

      fetchProjects();
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message);
    }
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-bold text-white">Manage Projects</h1>

        <button
          onClick={() => setOpen(true)}
          className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl text-white font-semibold transition"
        >
          Add Project
        </button>
      </div>

      {/* PROJECTS GRID */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div
            key={project._id}
            className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden"
          >
            {/* IMAGE */}
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-56 object-cover"
            />

            {/* CONTENT */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                {project.title}
              </h2>

              <p className="text-slate-400 mb-6 line-clamp-3">
                {project.description}
              </p>

              {/* TECHNOLOGIES */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="bg-slate-800 text-cyan-400 px-3 py-1 rounded-lg text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* LINKS */}
              <div className="flex gap-4 mb-6">
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-white"
                >
                  Live
                </a>

                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-white"
                >
                  GitHub
                </a>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-4">
                <button
                  onClick={() => handleEdit(project)}
                  className="bg-yellow-500 hover:bg-yellow-600 px-5 py-3 rounded-xl text-white font-semibold transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(project._id)}
                  className="bg-red-500 hover:bg-red-600 px-5 py-3 rounded-xl text-white font-semibold transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= ADD POPUP ================= */}

      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 w-full max-w-3xl rounded-3xl p-8 relative overflow-y-auto max-h-[95vh]">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-white text-2xl"
            >
              ✕
            </button>

            <h2 className="text-3xl font-bold text-white mb-8">Add Project</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                name="title"
                placeholder="Project Title"
                value={form.title}
                onChange={handleChange}
                className="w-full bg-slate-800 p-4 rounded-xl text-white outline-none"
              />

              <textarea
                name="description"
                placeholder="Project Description"
                value={form.description}
                onChange={handleChange}
                className="w-full bg-slate-800 p-4 rounded-xl text-white outline-none h-32"
              ></textarea>

              <input
                type="text"
                name="liveLink"
                placeholder="Live Link"
                value={form.liveLink}
                onChange={handleChange}
                className="w-full bg-slate-800 p-4 rounded-xl text-white outline-none"
              />

              <input
                type="text"
                name="githubLink"
                placeholder="GitHub Link"
                value={form.githubLink}
                onChange={handleChange}
                className="w-full bg-slate-800 p-4 rounded-xl text-white outline-none"
              />

              <input
                type="text"
                name="technologies"
                placeholder="React, Node, MongoDB"
                value={form.technologies}
                onChange={handleChange}
                className="w-full bg-slate-800 p-4 rounded-xl text-white outline-none"
              />

              <input
                type="file"
                name="image"
                onChange={handleChange}
                className="w-full bg-slate-800 p-4 rounded-xl text-white"
              />

              <button className="w-full bg-cyan-500 hover:bg-cyan-600 py-4 rounded-xl text-white font-bold transition">
                Add Project
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= EDIT POPUP ================= */}

      {editOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 w-full max-w-3xl rounded-3xl p-8 relative overflow-y-auto max-h-[95vh]">
            <button
              onClick={() => setEditOpen(false)}
              className="absolute top-4 right-4 text-white text-2xl"
            >
              ✕
            </button>

            <h2 className="text-3xl font-bold text-white mb-8">
              Update Project
            </h2>

            <form onSubmit={handleUpdate} className="space-y-6">
              <input
                type="text"
                name="title"
                placeholder="Project Title"
                value={form.title}
                onChange={handleChange}
                className="w-full bg-slate-800 p-4 rounded-xl text-white outline-none"
              />

              <textarea
                name="description"
                placeholder="Project Description"
                value={form.description}
                onChange={handleChange}
                className="w-full bg-slate-800 p-4 rounded-xl text-white outline-none h-32"
              ></textarea>

              <input
                type="text"
                name="liveLink"
                placeholder="Live Link"
                value={form.liveLink}
                onChange={handleChange}
                className="w-full bg-slate-800 p-4 rounded-xl text-white outline-none"
              />

              <input
                type="text"
                name="githubLink"
                placeholder="GitHub Link"
                value={form.githubLink}
                onChange={handleChange}
                className="w-full bg-slate-800 p-4 rounded-xl text-white outline-none"
              />

              <input
                type="text"
                name="technologies"
                placeholder="React, Node, MongoDB"
                value={form.technologies}
                onChange={handleChange}
                className="w-full bg-slate-800 p-4 rounded-xl text-white outline-none"
              />

              <input
                type="file"
                name="image"
                onChange={handleChange}
                className="w-full bg-slate-800 p-4 rounded-xl text-white"
              />

              <button className="w-full bg-cyan-500 hover:bg-cyan-600 py-4 rounded-xl text-white font-bold transition">
                Update Project
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageProjects;
