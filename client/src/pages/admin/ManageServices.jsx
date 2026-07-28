import { useEffect, useState } from "react";
import API from "../../services/api";

function ManageServices() {
  // ================= STATE =================

  const [services, setServices] = useState([]);

  const [open, setOpen] = useState(false);

  const [editId, setEditId] = useState(null);

  const [isAdd, setIsAdd] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    icon: "",
  });

  // ================= FETCH SERVICES =================

  const fetchServices = async () => {
    try {
      const res = await API.get("/getAllServices");

      setServices(res.data.services);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= OPEN EDIT =================

  const handleEdit = (service) => {
    setIsAdd(false);
    setOpen(true);

    setEditId(service._id);

    setForm({
      title: service.title,
      description: service.description,
      icon: service.icon,
    });
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/create-service", form, {
        withCredentials: true,
      });

      alert(res.data.message);

      setOpen(false);

      setForm({
        title: "",
        description: "",
        icon: "",
      });

      fetchServices();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message);
    }
  };

  // ================= UPDATE =================

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await API.put(`/updateService/${editId}`, form, {
        withCredentials: true,
      });

      alert(res.data.message);

      setOpen(false);

      fetchServices();
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
      const res = await API.delete(`/delete-service/${id}`, {
        withCredentials: true,
      });

      alert(res.data.message);

      fetchServices();
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message);
    }
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-white">Manage Services</h1>

        <button
          onClick={() => {
            setIsAdd(true);
            setEditId(null);

            setForm({
              title: "",
              description: "",
              icon: "",
            });

            setOpen(true);
          }}
          className="bg-cyan-500 hover:bg-cyan-600 px-5 py-3 rounded-xl text-white font-semibold"
        >
          + Add Service
        </button>
      </div>

      {/* SERVICES GRID */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
        {services.map((service) => (
          <div
            key={service._id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-8"
          >
            {/* ICON */}
            <div className="text-5xl text-cyan-400 mb-6">{service.icon}</div>

            {/* TITLE */}
            <h2 className="text-2xl font-bold text-white mb-4">
              {service.title}
            </h2>

            {/* DESCRIPTION */}
            <p className="text-slate-400 leading-relaxed mb-8">
              {service.description}
            </p>

            {/* BUTTONS */}
            <div className="flex gap-4">
              <button
                onClick={() => handleEdit(service)}
                className="bg-yellow-500 hover:bg-yellow-600 px-5 py-3 rounded-xl text-white font-semibold transition"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(service._id)}
                className="bg-red-500 hover:bg-red-600 px-5 py-3 rounded-xl text-white font-semibold transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= POPUP ================= */}

      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 w-full max-w-2xl rounded-3xl p-8 relative">
            {/* CLOSE */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-white text-2xl"
            >
              ✕
            </button>

            <h2 className="text-3xl font-bold text-white mb-8">
              {isAdd ? "Add Service" : "Update Service"}
            </h2>

            <form
              onSubmit={isAdd ? handleAdd : handleUpdate}
              className="space-y-6"
            >
              {/* TITLE */}
              <div>
                <label className="text-white block mb-2">Service Title</label>

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

              {/* ICON */}
              <div>
                <label className="text-white block mb-2">Icon</label>

                <input
                  type="text"
                  name="icon"
                  value={form.icon}
                  onChange={handleChange}
                  placeholder="FaCode"
                  className="w-full bg-slate-800 p-4 rounded-xl outline-none text-white"
                />
              </div>

              {/* BUTTON */}
              <button className="w-full bg-cyan-500 hover:bg-cyan-600 py-4 rounded-xl text-white font-bold transition">
                {isAdd ? "Add Service" : "Update Service"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageServices;
