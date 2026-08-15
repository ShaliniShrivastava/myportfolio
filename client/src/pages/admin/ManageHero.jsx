import { useEffect, useState } from "react";
import API from "../../services/api";

function ManageHero() {
  // ================= STATE =================

  const [hero, setHero] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    frontendTitle: "",
    backendTitle: "",
    subtitle: "",
    description: "",
    resumeLink: "",
    github: "",
    linkedin: "",
    instagram: "",
  });

  // ================= GET HERO =================

  const fetchHero = async () => {
    try {
      setLoading(true);

      const res = await API.get("/getAllHero");

      console.log("GET HERO RESPONSE:", res.data);

      if (res.data?.success && res.data?.hero) {
        setHero(res.data.hero);
      } else {
        setHero(null);
      }
    } catch (error) {
      console.log("GET HERO ERROR:", error);

      // Hero not found means database is empty
      if (error.response?.status === 404) {
        setHero(null);
      } else {
        alert(error.response?.data?.message || "Hero data load nahi ho raha.");
        setHero(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // ================= LOAD HERO =================

  useEffect(() => {
    fetchHero();
  }, []);

  // ================= RESET FORM =================

  const resetForm = () => {
    setForm({
      name: "",
      frontendTitle: "",
      backendTitle: "",
      subtitle: "",
      description: "",
      resumeLink: "",
      github: "",
      linkedin: "",
      instagram: "",
    });

    setImage(null);
  };

  // ================= ADD HERO =================

  const handleAdd = () => {
    resetForm();
    setOpenModal(true);
  };

  // ================= EDIT HERO =================

  const handleEdit = () => {
    if (!hero?._id) {
      alert("Hero data nahi mila.");
      return;
    }

    setForm({
      name: hero.name || "",
      frontendTitle: hero.frontendTitle || "",
      backendTitle: hero.backendTitle || "",
      subtitle: hero.subtitle || "",
      description: hero.description || "",
      resumeLink: hero.resumeLink || "",
      github: hero.github || "",
      linkedin: hero.linkedin || "",
      instagram: hero.instagram || "",
    });

    setImage(null);
    setOpenModal(true);
  };

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= HANDLE IMAGE =================

  const handleImage = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    setImage(selectedFile);
  };

  // ================= CREATE HERO =================

  const createHero = async () => {
    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("subtitle", form.subtitle);
    formData.append("description", form.description);
    formData.append("resumeLink", form.resumeLink);
    formData.append("github", form.github);
    formData.append("linkedin", form.linkedin);
    formData.append("instagram", form.instagram);
    formData.append("frontendTitle", form.frontendTitle);
    formData.append("backendTitle", form.backendTitle);

    // IMPORTANT:
    // createHero controller expects profileImage
    if (image) {
      formData.append("profileImage", image);
    }

    const res = await API.post("/create-Hero", formData);

    return res;
  };

  // ================= UPDATE HERO =================

  const updateHero = async () => {
    if (!hero?._id) {
      throw new Error("Hero ID not found");
    }

    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("subtitle", form.subtitle);
    formData.append("description", form.description);
    formData.append("resumeLink", form.resumeLink);
    formData.append("github", form.github);
    formData.append("linkedin", form.linkedin);
    formData.append("instagram", form.instagram);
    formData.append("frontendTitle", form.frontendTitle);
    formData.append("backendTitle", form.backendTitle);

    // IMPORTANT:
    // updateHero controller expects image
    if (image) {
      formData.append("image", image);
    }

    const res = await API.put(`/updateHero/${hero._id}`, formData);

    return res;
  };

  // ================= SUBMIT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // CREATE requires image
    if (!hero && !image) {
      alert("Profile image is required.");
      return;
    }

    try {
      setSaving(true);

      let res;

      if (hero?._id) {
        // UPDATE
        res = await updateHero();
      } else {
        // CREATE
        res = await createHero();
      }

      console.log("SAVE RESPONSE:", res.data);

      if (res.data?.success) {
        alert(
          hero ? "Hero updated successfully!" : "Hero created successfully!",
        );

        // Updated/created hero directly set
        if (res.data?.hero) {
          setHero(res.data.hero);
        } else {
          await fetchHero();
        }

        setOpenModal(false);
        setImage(null);
      } else {
        alert(res.data?.message || "Something went wrong.");
      }
    } catch (error) {
      console.log("SAVE HERO ERROR:", error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Hero save nahi ho paaya.",
      );
    } finally {
      setSaving(false);
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-4xl font-bold mb-8 text-white">Manage Hero</h1>

        <div className="bg-slate-900 rounded-3xl p-10 text-center">
          <p className="text-slate-300 text-lg">Loading Hero...</p>
        </div>
      </div>
    );
  }

  // ================= NO HERO =================

  if (!hero) {
    return (
      <div className="p-6">
        <h1 className="text-4xl font-bold mb-8 text-white">Manage Hero</h1>

        <div className="bg-slate-900 rounded-3xl p-12 text-center">
          <div className="text-6xl mb-5">👤</div>

          <h2 className="text-2xl font-bold text-white mb-3">No Hero Found</h2>

          <p className="text-slate-400 mb-7">
            Abhi database me Hero section available nahi hai.
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={handleAdd}
              className="bg-cyan-500 hover:bg-cyan-600 px-7 py-3 rounded-xl text-white font-semibold transition"
            >
              + Add Hero
            </button>

            <button
              onClick={fetchHero}
              className="bg-slate-700 hover:bg-slate-600 px-7 py-3 rounded-xl text-white font-semibold transition"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* ADD MODAL */}
        {openModal && (
          <HeroModal
            form={form}
            image={image}
            saving={saving}
            isEdit={false}
            hero={hero}
            onChange={handleChange}
            onImage={handleImage}
            onSubmit={handleSubmit}
            onClose={() => {
              setOpenModal(false);
              setImage(null);
            }}
          />
        )}
      </div>
    );
  }

  // ================= HERO EXISTS =================

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-8 text-white">Manage Hero</h1>

      {/* HERO CARD */}

      <div className="bg-slate-900 rounded-3xl overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 h-40"></div>

        <div className="p-8 relative">
          {/* IMAGE */}

          <div className="absolute -top-16 left-8">
            <img
              src={hero.profileImage}
              alt={hero.name || "Hero"}
              className="w-32 h-32 rounded-full border-4 border-slate-900 object-cover"
            />
          </div>

          {/* BUTTONS */}

          <div className="flex justify-end gap-3">
            <button
              onClick={handleEdit}
              className="bg-yellow-500 hover:bg-yellow-600 px-5 py-3 rounded-xl text-white font-semibold transition"
            >
              Edit Hero
            </button>
          </div>

          {/* INFO */}

          <div className="mt-16 grid lg:grid-cols-2 gap-10">
            {/* LEFT */}

            <div>
              <h2 className="text-4xl font-bold text-white">{hero.name}</h2>

              <p className="text-cyan-400 mt-3 text-lg">{hero.subtitle}</p>

              <p className="text-slate-300 mt-6 leading-relaxed">
                {hero.description}
              </p>
            </div>

            {/* RIGHT */}

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-slate-800 p-5 rounded-2xl">
                <h3 className="text-slate-400 mb-2">Frontend</h3>

                <p className="text-white font-semibold">{hero.frontendTitle}</p>
              </div>

              <div className="bg-slate-800 p-5 rounded-2xl">
                <h3 className="text-slate-400 mb-2">Backend</h3>

                <p className="text-white font-semibold">{hero.backendTitle}</p>
              </div>

              <div className="bg-slate-800 p-5 rounded-2xl">
                <h3 className="text-slate-400 mb-2">GitHub</h3>

                <a
                  href={hero.github || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:underline"
                >
                  Open GitHub
                </a>
              </div>

              <div className="bg-slate-800 p-5 rounded-2xl">
                <h3 className="text-slate-400 mb-2">LinkedIn</h3>

                <a
                  href={hero.linkedin || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:underline"
                >
                  Open LinkedIn
                </a>
              </div>

              <div className="bg-slate-800 p-5 rounded-2xl sm:col-span-2">
                <h3 className="text-slate-400 mb-2">Resume</h3>

                <a
                  href={hero.resumeLink || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:underline"
                >
                  Open Resume
                </a>
              </div>

              <div className="bg-slate-800 p-5 rounded-2xl sm:col-span-2">
                <h3 className="text-slate-400 mb-2">Instagram</h3>

                <a
                  href={hero.instagram || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:underline"
                >
                  Open Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}

      {openModal && (
        <HeroModal
          form={form}
          image={image}
          saving={saving}
          isEdit={true}
          hero={hero}
          onChange={handleChange}
          onImage={handleImage}
          onSubmit={handleSubmit}
          onClose={() => {
            setOpenModal(false);
            setImage(null);
          }}
        />
      )}
    </div>
  );
}

// =====================================================
// HERO MODAL
// =====================================================

function HeroModal({
  form,
  image,
  saving,
  isEdit,
  hero,
  onChange,
  onImage,
  onSubmit,
  onClose,
}) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 w-full max-w-5xl rounded-3xl p-8 overflow-y-auto max-h-[90vh]">
        {/* HEADER */}

        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">
            {isEdit ? "Update Hero" : "Add Hero"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-white text-4xl"
          >
            ×
          </button>
        </div>

        {/* FORM */}

        <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-6">
          {/* IMAGE */}

          <div className="md:col-span-2 flex items-center gap-6">
            <div>
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="w-28 h-28 rounded-full object-cover border-4 border-cyan-400"
                />
              ) : hero?.profileImage ? (
                <img
                  src={hero.profileImage}
                  alt={hero.name || "Hero"}
                  className="w-28 h-28 rounded-full object-cover border-4 border-cyan-400"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-slate-800 border-4 border-cyan-400 flex items-center justify-center text-slate-500">
                  Image
                </div>
              )}
            </div>

            <div className="flex-1">
              <label className="block text-white mb-3">
                {isEdit ? "Upload New Image" : "Profile Image"}
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={onImage}
                required={!isEdit}
                className="bg-slate-800 p-4 rounded-xl text-white w-full"
              />

              {!isEdit && (
                <p className="text-slate-400 text-sm mt-2">
                  Profile image is required.
                </p>
              )}
            </div>
          </div>

          {/* NAME */}

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={onChange}
            required
            className="bg-slate-800 p-4 rounded-xl text-white outline-none"
          />

          {/* SUBTITLE */}

          <input
            type="text"
            name="subtitle"
            placeholder="Subtitle"
            value={form.subtitle}
            onChange={onChange}
            required
            className="bg-slate-800 p-4 rounded-xl text-white outline-none"
          />

          {/* FRONTEND */}

          <input
            type="text"
            name="frontendTitle"
            placeholder="Frontend Title"
            value={form.frontendTitle}
            onChange={onChange}
            required
            className="bg-slate-800 p-4 rounded-xl text-white outline-none"
          />

          {/* BACKEND */}

          <input
            type="text"
            name="backendTitle"
            placeholder="Backend Title"
            value={form.backendTitle}
            onChange={onChange}
            required
            className="bg-slate-800 p-4 rounded-xl text-white outline-none"
          />

          {/* RESUME */}

          <input
            type="text"
            name="resumeLink"
            placeholder="Resume Link"
            value={form.resumeLink}
            onChange={onChange}
            required
            className="bg-slate-800 p-4 rounded-xl text-white outline-none"
          />

          {/* GITHUB */}

          <input
            type="text"
            name="github"
            placeholder="GitHub Link"
            value={form.github}
            onChange={onChange}
            required
            className="bg-slate-800 p-4 rounded-xl text-white outline-none"
          />

          {/* LINKEDIN */}

          <input
            type="text"
            name="linkedin"
            placeholder="LinkedIn Link"
            value={form.linkedin}
            onChange={onChange}
            required
            className="bg-slate-800 p-4 rounded-xl text-white outline-none"
          />

          {/* INSTAGRAM */}

          <input
            type="text"
            name="instagram"
            placeholder="Instagram Link"
            value={form.instagram}
            onChange={onChange}
            required
            className="bg-slate-800 p-4 rounded-xl text-white outline-none"
          />

          {/* DESCRIPTION */}

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={onChange}
            required
            className="bg-slate-800 p-4 rounded-xl text-white outline-none md:col-span-2 h-36"
          ></textarea>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={saving}
            className={`py-4 rounded-xl font-bold text-white md:col-span-2 transition ${
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
                ? "Update Hero"
                : "Create Hero"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ManageHero;
