import { useEffect, useState } from "react";
import { FaAward } from "react-icons/fa";
import API from "../services/api";

function About() {

    const [aboutData, setabout] = useState([]);
    const fetchabout = async () => {
        try {
            const res = await API.get("/getAbout");
            console.log(res.data);
            setabout(res.data.about);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchabout()
    }, [])


    // const aboutData = {
    //     title: "About Me",

    //     description:
    //         "I'm a passionate Full Stack MERN Developer and Web Designer with experience in building responsive and modern web applications. I enjoy creating attractive user interfaces and powerful backend systems using React.js, Node.js, Express.js, and MongoDB.",

    //     skills: [
    //         "HTML5",
    //         "CSS3",
    //         "JavaScript",
    //         "Bootstrap",
    //         "Tailwind CSS",
    //         "React.js",
    //         "Redux Toolkit",
    //         "Node.js",
    //         "Express.js",
    //         "MongoDB",
    //         "MySQL",
    //         "PHP",
    //         "Python",
    //         "Git & GitHub",
    //         "REST API",
    //         "MVC Architecture",
    //         "Cloudinary",
    //         "Razorpay"
    //     ],

    //     achievements: [
    //         "3+ Years of Experience",
    //         "50+ Projects Completed",
    //         "100+ Students Trained",
    //         "MERN Stack Developer",
    //         "Web Designer",
    //         "Backend Developer"
    //     ]
    // };

    const title = aboutData?.title || "About Me";
    const description = aboutData?.description || "";
    const skills = aboutData?.skills || [];
    const achievements = aboutData?.achievements || [];

    return (
        <section id="about" className="py-20 px-6 bg-[#060b13] text-white">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-stretch">

                {/* Left Section */}
                <div className="flex flex-col justify-between h-full">

                    <div>
                        <h2 className="text-5xl font-bold mb-6 tracking-tight">
                            {title}
                        </h2>

                        <p className="text-slate-300 text-lg leading-relaxed mb-8">
                            {description}
                        </p>
                    </div>

                    {/* Achievements */}
                    <div className="grid sm:grid-cols-2 gap-4 w-full mt-auto">
                        {achievements.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 bg-[#111a2e]/50 border border-slate-800 p-4 rounded-2xl shadow-sm min-h-[60px]"
                            >
                                <FaAward className="text-cyan-400 text-xl flex-shrink-0" />
                                <span className="text-slate-200 text-sm sm:text-base font-medium">
                                    {item}
                                </span>
                            </div>
                        ))}
                    </div>

                </div>

                {/* Right Section */}
                <div className="flex flex-col h-full">

                    <h3 className="text-4xl font-bold mb-8 tracking-tight">
                        Technical Skills
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

                        {skills.map((skill, index) => (
                            <div
                                key={index}
                                className="bg-[#111a2e]/40 border border-slate-800 rounded-2xl p-4 flex items-center justify-center text-center text-slate-300 font-semibold hover:border-cyan-500 hover:text-white hover:scale-105 transition-all duration-300 cursor-pointer shadow-md min-h-[56px]"
                            >
                                {skill}
                            </div>
                        ))}

                    </div>

                </div>

            </div>
        </section>
    );
}

export default About;