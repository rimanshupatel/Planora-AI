import { ArrowUpRight, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { getProjects } from "../../lib/puter.action";
import { useNavigate } from "react-router";
import Navbar from "~/components/Navbar";

export default function Creations() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<DesignItem[]>([]);
    useEffect(() => {
        const fetchProjects = async () => {
            const items = await getProjects();
            setProjects(items);
        };

        fetchProjects();
    }, []);

    return (
        <div className="home mesh-gradient min-h-screen">
            <Navbar />
            <section className="projects bg-white/40 border-y border-zinc-200/20 py-24">
                <div className="section-inner">
                    <div className="section-head mb-12">
                        <div className="copy">
                            <span className="text-xs font-mono uppercase tracking-widest bg-orange-100 text-orange-600 px-3 py-1 rounded-full inline-block">Creative Gallery</span>
                            <h2 className="text-4xl md:text-5xl font-serif text-zinc-950 mt-4 mb-3">Community Creations</h2>
                            <p className="text-zinc-500 text-sm md:text-base max-w-xl">
                                Browse real generated projects created by designers using the Planora 3D engines.
                            </p>
                        </div>
                    </div>

                    {projects.length === 0 ? (
                        <div className="empty rounded-3xl border border-dashed border-zinc-200 bg-zinc-50/50 p-16 text-center text-sm text-zinc-500 max-w-md mx-auto">
                            No projects created yet. Start by uploading a plan above.
                        </div>
                    ) : (
                        <div className="projects-grid">
                            {projects.map(({ id, name, renderedImage, sourceImage, timestamp }) => (
                                <div
                                    key={id}
                                    className="project-card group glass-card glass-card-hover rounded-3xl overflow-hidden border border-zinc-200/50 flex flex-col h-full"
                                    onClick={() => navigate(`/visualizer/${id}`)}
                                >
                                    <div className="preview aspect-4/3 overflow-hidden bg-zinc-50 relative">
                                        <img
                                            src={renderedImage || sourceImage}
                                            alt="Project preview"
                                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                                        />

                                        <div className="badge absolute top-4 left-4 z-10">
                                            <span className="bg-white/80 backdrop-blur-md text-[9px] font-mono tracking-widest uppercase py-1 px-3 rounded-full border border-zinc-200/50 text-zinc-800 shadow-xs">
                                                Community
                                            </span>
                                        </div>
                                    </div>

                                    <div className="card-body p-6 flex justify-between items-center bg-white/90 grow">
                                        <div>
                                            <h3 className="text-lg font-serif font-bold text-zinc-950 group-hover:text-primary transition-colors">
                                                {name}
                                            </h3>

                                            <div className="meta flex items-center gap-2 text-zinc-400 text-[10px] mt-1 font-mono uppercase">
                                                <Clock size={11} className="text-zinc-400" />
                                                <span>{new Date(timestamp).toLocaleDateString()}</span>
                                                <span>•</span>
                                                <span>By Rishii</span>
                                            </div>
                                        </div>
                                        <div className="arrow w-10 h-10 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-400 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300">
                                            <ArrowUpRight size={18} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}