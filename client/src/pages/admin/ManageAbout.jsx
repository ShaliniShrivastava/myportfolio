import { useEffect, useState } from "react";
import API from "../../services/api";

function ManageAbout() {
  // ================= STATE =================

  const [about, setAbout] = useState(null);

  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    skills: "",
    achievements: "",
  });

  // ================= FETCH ABOUT =================

  const fetchAbout = async () => {
    try {
      const res = await API.get("/getAbout");

      setAbout(res.data.about);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  // ================= OPEN EDIT =================

  const handleEdit = () => {
    setOpen(true);

    setForm({
      title: about.title || "",
      description: about.description || "",
      skills: about.skills?.join(", ") || "",
      achievements: about.achievements?.join(", ") || "",
    });
  };

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= UPDATE ABOUT =================

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const updateData = {
        title: form.title,
        description: form.description,

        skills: form.skills.split(",").map((item) => item.trim()),

        achievements: form.achievements.split(",").map((item) => item.trim()),
      };

      const res = await API.put(`/updateAbout/${about._id}`, updateData, {
        withCredentials: true,
      });

      alert(res.data.message);

      setOpen(false);

      fetchAbout();
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message);
    }
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-white">Manage About</h1>

        <button
          onClick={handleEdit}
          className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl text-white font-semibold transition"
        >
          Edit About
        </button>
      </div>

      {/* ABOUT CARD */}
      <div className="bg-slate-900 rounded-3xl p-8">
        {/* TITLE */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">{about?.title}</h2>

          <p className="text-slate-300 leading-relaxed text-lg">
            {about?.description}
          </p>
        </div>

        {/* GRID */}
        <div className="grid lg:grid-cols-2 gap-10">
          {/* SKILLS */}
          <div>
            <h3 className="text-2xl font-bold text-cyan-400 mb-6">Skills</h3>

            <div className="flex flex-wrap gap-4">
              {about?.skills?.map((skill, index) => (
                <div
                  key={index}
                  className="bg-slate-800 border border-slate-700 px-5 py-3 rounded-2xl text-white"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>

          {/* ACHIEVEMENTS */}
          <div>
            <h3 className="text-2xl font-bold text-cyan-400 mb-6">
              Achievements
            </h3>

            <div className="space-y-4">
              {about?.achievements?.map((item, index) => (
                <div
                  key={index}
                  className="bg-slate-800 p-5 rounded-2xl border border-slate-700"
                >
                  <p className="text-white">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= POPUP ================= */}

      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 w-full max-w-3xl rounded-3xl p-8 relative">
            {/* CLOSE */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-white text-2xl"
            >
              ✕
            </button>

            <h2 className="text-3xl font-bold text-white mb-8">Update About</h2>

            <form onSubmit={handleUpdate} className="space-y-6">
              {/* TITLE */}
              <div>
                <label className="text-white block mb-2">Title</label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full bg-slate-800 p-4 rounded-xl outline-none text-white"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="text-white block mb-2">Description</label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full bg-slate-800 p-4 rounded-xl outline-none text-white h-32"
                ></textarea>
              </div>

              {/* SKILLS */}
              <div>
                <label className="text-white block mb-2">Skills</label>

                <input
                  type="text"
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  placeholder="React, Node, MongoDB"
                  className="w-full bg-slate-800 p-4 rounded-xl outline-none text-white"
                />
              </div>

              {/* ACHIEVEMENTS */}
              <div>
                <label className="text-white block mb-2">Achievements</label>

                <textarea
                  name="achievements"
                  value={form.achievements}
                  onChange={handleChange}
                  placeholder="2+ Years Experience, 100+ Projects"
                  className="w-full bg-slate-800 p-4 rounded-xl outline-none text-white h-28"
                ></textarea>
              </div>

              {/* BUTTON */}
              <button className="w-full bg-cyan-500 hover:bg-cyan-600 py-4 rounded-xl text-white font-bold transition">
                Update About
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageAbout;
