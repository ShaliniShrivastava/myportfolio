import { useEffect, useState } from "react";
import API from "../../services/api";

function ManageAbout() {
  // ================= STATE =================

  const [about, setAbout] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    skills: "",
    achievements: "",
  });

  // ================= FETCH ABOUT =================

  const fetchAbout = async () => {
    try {
      setLoading(true);

      const res = await API.get("/getAbout");

      console.log("GET ABOUT RESPONSE:", res.data);

      // Backend returns:
      // { success: true, about: {...} }
      // OR
      // { success: true, about: null }

      setAbout(res.data?.about || null);
    } catch (error) {
      console.log("GET ABOUT ERROR:", error);

      setAbout(null);

      alert(error.response?.data?.message || "About data load nahi ho raha.");
    } finally {
      setLoading(false);
    }
  };

  // ================= LOAD =================

  useEffect(() => {
    fetchAbout();
  }, []);

  // ================= RESET FORM =================

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      skills: "",
      achievements: "",
    });
  };

  // ================= ADD =================

  const handleAdd = () => {
    resetForm();
    setOpen(true);
  };

  // ================= EDIT =================

  const handleEdit = () => {
    if (!about?._id) {
      alert("About data nahi mila.");
      return;
    }

    setForm({
      title: about.title || "",
      description: about.description || "",
      skills: Array.isArray(about.skills)
        ? about.skills.join(", ")
        : about.skills || "",
      achievements: Array.isArray(about.achievements)
        ? about.achievements.join(", ")
        : about.achievements || "",
    });

    setOpen(true);
  };

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= CREATE ABOUT =================

  const createAbout = async () => {
    const createData = {
      title: form.title,
      description: form.description,

      skills: form.skills
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),

      achievements: form.achievements
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    const res = await API.post("/create-About", createData);

    return res;
  };

  // ================= UPDATE ABOUT =================

  const updateAbout = async () => {
    if (!about?._id) {
      throw new Error("About ID not found");
    }

    const updateData = {
      title: form.title,
      description: form.description,

      skills: form.skills
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),

      achievements: form.achievements
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    const res = await API.put(`/updateAbout/${about._id}`, updateData);

    return res;
  };

  // ================= SUBMIT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Title required hai.");
      return;
    }

    if (!form.description.trim()) {
      alert("Description required hai.");
      return;
    }

    try {
      setSaving(true);

      let res;

      if (about?._id) {
        // Existing About → UPDATE
        res = await updateAbout();
      } else {
        // No About → CREATE
        res = await createAbout();
      }

      console.log("SAVE ABOUT RESPONSE:", res.data);

      if (res.data?.success) {
        alert(
          about ? "About updated successfully!" : "About created successfully!",
        );

        // Backend updated/created object return kar raha hai
        if (res.data?.about) {
          setAbout(res.data.about);
        } else {
          await fetchAbout();
        }

        setOpen(false);
      } else {
        alert(res.data?.message || "Something went wrong.");
      }
    } catch (error) {
      console.log("SAVE ABOUT ERROR:", error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "About save nahi ho paaya.",
      );
    } finally {
      setSaving(false);
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-4xl font-bold mb-8 text-white">Manage About</h1>

        <div className="bg-slate-900 rounded-3xl p-10 text-center">
          <p className="text-slate-300 text-lg">Loading About...</p>
        </div>
      </div>
    );
  }

  // ================= NO ABOUT =================

  if (!about) {
    return (
      <div className="p-6">
        {/* HEADER */}

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Manage About</h1>
        </div>

        {/* EMPTY STATE */}

        <div className="bg-slate-900 rounded-3xl p-12 text-center">
          <div className="text-6xl mb-5">👤</div>

          <h2 className="text-2xl font-bold text-white mb-3">No About Found</h2>

          <p className="text-slate-400 mb-7">
            Abhi database me About section available nahi hai.
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={handleAdd}
              className="bg-cyan-500 hover:bg-cyan-600 px-7 py-3 rounded-xl text-white font-semibold transition"
            >
              + Add About
            </button>

            <button
              onClick={fetchAbout}
              className="bg-slate-700 hover:bg-slate-600 px-7 py-3 rounded-xl text-white font-semibold transition"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* MODAL */}

        {open && (
          <AboutModal
            form={form}
            saving={saving}
            isEdit={false}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onClose={() => setOpen(false)}
          />
        )}
      </div>
    );
  }

  // ================= ABOUT EXISTS =================

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
          <h2 className="text-3xl font-bold text-white mb-4">{about.title}</h2>

          <p className="text-slate-300 leading-relaxed text-lg">
            {about.description}
          </p>
        </div>

        {/* GRID */}

        <div className="grid lg:grid-cols-2 gap-10">
          {/* SKILLS */}

          <div>
            <h3 className="text-2xl font-bold text-cyan-400 mb-6">Skills</h3>

            <div className="flex flex-wrap gap-4">
              {about.skills?.map((skill, index) => (
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
              {about.achievements?.map((item, index) => (
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

      {/* EDIT MODAL */}

      {open && (
        <AboutModal
          form={form}
          saving={saving}
          isEdit={true}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

// =====================================================
// ABOUT MODAL
// =====================================================

function AboutModal({ form, saving, isEdit, onChange, onSubmit, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 w-full max-w-3xl rounded-3xl p-8 relative max-h-[90vh] overflow-y-auto">
        {/* CLOSE */}

        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl"
        >
          ✕
        </button>

        {/* TITLE */}

        <h2 className="text-3xl font-bold text-white mb-8">
          {isEdit ? "Update About" : "Add About"}
        </h2>

        {/* FORM */}

        <form onSubmit={onSubmit} className="space-y-6">
          {/* TITLE */}

          <div>
            <label className="text-white block mb-2">Title</label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={onChange}
              placeholder="About Me"
              required
              className="w-full bg-slate-800 p-4 rounded-xl outline-none text-white"
            />
          </div>

          {/* DESCRIPTION */}

          <div>
            <label className="text-white block mb-2">Description</label>

            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              placeholder="Write about yourself..."
              required
              className="w-full bg-slate-800 p-4 rounded-xl outline-none text-white h-32"
            />
          </div>

          {/* SKILLS */}

          <div>
            <label className="text-white block mb-2">Skills</label>

            <input
              type="text"
              name="skills"
              value={form.skills}
              onChange={onChange}
              placeholder="React, Node.js, MongoDB, Express"
              className="w-full bg-slate-800 p-4 rounded-xl outline-none text-white"
            />

            <p className="text-slate-500 text-sm mt-2">
              Skills ko comma se separate karo.
            </p>
          </div>

          {/* ACHIEVEMENTS */}

          <div>
            <label className="text-white block mb-2">Achievements</label>

            <textarea
              name="achievements"
              value={form.achievements}
              onChange={onChange}
              placeholder="2+ Years Experience, 100+ Projects"
              className="w-full bg-slate-800 p-4 rounded-xl outline-none text-white h-28"
            />

            <p className="text-slate-500 text-sm mt-2">
              Achievements ko comma se separate karo.
            </p>
          </div>

          {/* BUTTON */}

          <button
            type="submit"
            disabled={saving}
            className={`w-full py-4 rounded-xl text-white font-bold transition ${
              saving
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-cyan-500 hover:bg-cyan-600"
            }`}
          >
            {saving
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
                ? "Update About"
                : "Create About"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ManageAbout;
