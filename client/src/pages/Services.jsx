import { useEffect, useState } from "react";
import API from "../services/api";
import { FaCode, FaServer, FaLaptopCode } from "react-icons/fa";

function Services() {
  const [services, setServices] = useState([]);

  const iconMap = {
    FaCode: <FaCode />,
    FaServer: <FaServer />,
    FaLaptopCode: <FaLaptopCode />,
  };

  const fetchServices = async () => {
    try {
      const res = await API.get("/getAllServices");

      setServices(res.data.services);
      console.log(res.data.services);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <section className="py-28 px-6">
      <div className="max-w-7xl mx-auto text-center mb-20">
        <p className="text-cyan-400 uppercase tracking-widest font-semibold">
          What I Do
        </p>

        <h2 className="text-5xl font-bold mt-4 text-white">
          Professional Services
        </h2>
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <div
            key={service._id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-10 hover:scale-105 transition"
          >
            <div className="text-cyan-400 text-5xl mb-6">
              {iconMap[service.icon]}
            </div>

            <h3 className="text-2xl font-bold mb-4 text-white">
              {service.title}
            </h3>

            <p className="text-slate-400">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Services;
