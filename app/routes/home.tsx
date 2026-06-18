import type { Route } from "./+types/home";
import Navbar from "../components/Navbar";
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  Layers,
  Check,
  Star,
  Zap,
  Shield,
  Sparkles,
  Grid,
  Layout,
  Download as DownloadIcon,
  Cpu,
  Flame,
  Share2,
  HelpCircle,
  ChevronDown,
  MessageSquare,
  Users,
  Building,
  CheckCircle2,
  FileCode2
} from "lucide-react";
import Button from "../components/ui/Button";
import Upload from "~/components/Upload";
import { useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import { createProject, getProjects } from "../../lib/puter.action";
import { motion, AnimatePresence } from "framer-motion";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Planora | AI-First 2D to 3D Space Visualizer" },
    {
      name: "description",
      content: "Transform 2D floor plans into premium 3D visualizations instantly with AI-powered rendering and collaborative design workflows."
    },
  ];
}

interface Partner {
  name: string;
  icon: React.ComponentType<any>;
}

const PARTNERS: Partner[] = [
  { name: "Aether Arch", icon: Sparkles },
  { name: "Grid & Wall", icon: Grid },
  { name: "Studio Prism", icon: Layout },
  { name: "Nouveau Lab", icon: Cpu },
  { name: "Summit Build", icon: Building },
  { name: "Apex Draft", icon: Layers }
];

const FEATURES = [
  {
    title: "AI-Powered Conversion",
    description: "Transform hand-drawn sketches or digital 2D floor plans into structured 3D spaces in seconds.",
    icon: Sparkles,
    gradient: "from-orange-500 to-amber-500"
  },
  {
    title: "Photorealistic Rendering",
    description: "Generate beautiful lighting, materials, and textures tailored to your style with a single click.",
    icon: Flame,
    gradient: "from-rose-500 to-orange-500"
  },
  {
    title: "Instant Export",
    description: "Download ready-to-use renders in high-definition or export structured 3D formats.",
    icon: DownloadIcon,
    gradient: "from-blue-500 to-indigo-500"
  },
  {
    title: "Cloud Processing",
    description: "No heavy hardware or high-end GPU required. All generations run instantly on our optimized cloud servers.",
    icon: Cpu,
    gradient: "from-emerald-500 to-teal-500"
  },
  {
    title: "Multiple Formats",
    description: "Export clean 3D assets compatible with major DCC packages, game engines, and CAD software.",
    icon: Layers,
    gradient: "from-purple-500 to-pink-500"
  },
  {
    title: "Commercial Usage",
    description: "Full licensing rights to use generated assets and visual renders for commercial client projects.",
    icon: Shield,
    gradient: "from-sky-500 to-blue-500"
  }
];

const STEPS = [
  {
    number: "01",
    title: "Upload Floor Plan",
    description: "Drag and drop any 2D sketch, blueprints, or screenshot of a floor plan layout.",
    icon: Layers
  },
  {
    number: "02",
    title: "AI Generates 3D Model",
    description: "Our advanced neural engines interpret wall coordinates, doorways, and depths to model the room.",
    icon: Sparkles
  },
  {
    number: "03",
    title: "Download & Use Anywhere",
    description: "Instantly export high-resolution comparisons or share interactive links directly with clients.",
    icon: ArrowUpRight
  }
];

const TESTIMONIALS = [
  {
    quote: "Planora has reduced our architectural visualization turnaround times by over 80%. What used to take days now takes less than a minute.",
    author: "Elena Rostova",
    role: "Lead Architect at Rostova Designs",
    avatarColor: "from-orange-400 to-amber-300",
    rating: 5
  },
  {
    quote: "The detail and photorealism in the generated renders is incredible. Clients love the instant feedback we can give them during consultations.",
    author: "Marc Dupond",
    role: "Interior Designer",
    avatarColor: "from-blue-400 to-indigo-400",
    rating: 5
  },
  {
    quote: "Planora API integration was seamless. Our automated property staging engine now processes thousands of sketches daily with zero downtime.",
    author: "Sarah Jenkins",
    role: "CTO, PropTech Global",
    avatarColor: "from-purple-400 to-pink-400",
    rating: 5
  }
];

const FAQS = [
  {
    q: "How long does generation take?",
    a: "Generations are fast! Typically, our AI translates your 2D floor plan and outputs a beautiful photorealistic render in under 60 seconds."
  },
  {
    q: "Which file formats are supported for uploads?",
    a: "We support PNG, JPG, and WEBP formats up to 10MB. For blueprints or architectural plans, high-contrast images yield the best results."
  },
  {
    q: "Can I use outputs commercially?",
    a: "Absolutely! The models and images you generate are 100% yours, cleared for commercial use under both the Pro and Enterprise tiers."
  },
  {
    q: "Is there a dedicated API for integrations?",
    a: "Yes. Our Enterprise plan includes API access with custom rate limits, webhooks, and easy integration guides to plug into your existing pipeline."
  },
  {
    q: "What industries benefit most from Planora?",
    a: "Planora is built for architects, interior designers, property stagers, real estate developers, and software vendors looking to scale 3D production."
  }
];

export default function Home() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<DesignItem[]>([]);
  const isCreatingProjectRef = useRef(false);

  // Pricing Toggle State
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("yearly");

  // FAQ Accordion State
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Testimonial Carousel State
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const handleUploadComplete = async (base64Image: string) => {
    try {
      if (isCreatingProjectRef.current) return false;
      isCreatingProjectRef.current = true;
      const newId = Date.now().toString();
      const name = `Residence ${newId}`;

      const newItem = {
        id: newId,
        name,
        sourceImage: base64Image,
        renderedImage: undefined,
        timestamp: Date.now(),
      };

      const saved = await createProject({
        item: newItem,
        visibility: "private",
      });

      if (!saved) {
        console.error("Failed to create project");
        return false;
      }

      setProjects((prev) => [saved, ...prev]);

      navigate(`/visualizer/${newId}`, {
        state: {
          initialImage: saved.sourceImage,
          initialRendered: saved.renderedImage || null,
          name,
        },
      });

      return true;
    } catch (error) { }
    const newId = Date.now().toString();
    navigate(`/visualizer/${newId}`);

    return true;
  };

  useEffect(() => {
    const fetchProjects = async () => {
      const items = await getProjects();
      setProjects(items);
    };

    fetchProjects();
  }, []);

  // Auto-play Testimonial Carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="home mesh-gradient min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="hero relative pt-36 pb-20 overflow-hidden">
        {/* Background Decorative Rings */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-orange-100/30 blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-blue-100/20 blur-3xl pointer-events-none -z-10" />

        <div className="announce animate-fade-in">
          <div className="dot">
            <div className="pulse"></div>
          </div>
          <p className="font-sans font-semibold">Introducing Planora 2.0</p>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl lg:text-8xl font-serif leading-[1.0] text-zinc-950 mb-8 max-w-5xl mx-auto tracking-tight"
        >
          Build beautiful spaces at the speed of thought with <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-blue-600">Planora</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-2xl mx-auto text-xs md:text-sm font-mono uppercase tracking-widest text-zinc-500 mb-10 leading-relaxed"
        >
          Planora is an AI-first design environment that helps you visualize,
          render, and ship architectural projects faster than ever.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="actions"
        >
          <a href="#upload" className="cta transition-all hover:scale-[1.03] hover:shadow-lg">
            Start Building <ArrowRight className="icon" />
          </a>

          <Button variant="outline" size="lg" className="demo hover:bg-zinc-50 hover:border-zinc-400 transition-colors">
            Watch Demo
          </Button>
        </motion.div>

        {/* Upload Container */}
        <motion.div
          id="upload"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="apple-upload-container"
        >
          {/* Ambient Glows / Auroras */}
          <div className="aurora-wrapper">
            <div className="aurora-blob aurora-blob-orange" />
            <div className="aurora-blob aurora-blob-blue" />
            <div className="aurora-blob aurora-blob-purple" />
          </div>

          {/* Sleek Dot-Grid Background Overlay */}
          <div className="apple-grid-overlay" />

          {/* Heading and Subheading */}
          <div className="text-center mb-10 max-w-2xl mx-auto relative z-10 ">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-zinc-900 tracking-tight mb-4 opacity-90">Transform floor plan into 3d</h1>
            <p className="text-zinc-500 text-sm md:text-base leading-relaxed">
              Upload a blueprint and generate stunning AI-powered 3D visualizations in seconds.
            </p>
          </div>

          {/* Floating Glass Panel */}
          <div className="apple-glass-panel w-full max-w-3xl p-8 z-10 flex flex-col items-center">
            <Upload onComplete={handleUploadComplete} />

            {/* Trust Elements at the Bottom */}
            <div className="mt-8 pt-6 border-t border-zinc-200/20 w-full flex flex-wrap justify-center gap-3">
              <div className="premium-pill">
                <Check size={12} />
                <span>JPG Supported</span>
              </div>
              <div className="premium-pill">
                <Check size={12} />
                <span>PNG Supported</span>
              </div>
              <div className="premium-pill">
                <Shield size={12} />
                <span>Secure Processing</span>
              </div>
              <div className="premium-pill">
                <Sparkles size={12} />
                <span>AI Enhanced</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Trusted By Section */}
      <section className="partners py-12 bg-white/40 border-y border-zinc-200/30 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-6">
            Empowering architectural workflows across leading studios
          </p>
          <div className="marquee-container">
            <div className="marquee-content">
              {[...PARTNERS, ...PARTNERS, ...PARTNERS].map((partner, index) => (
                <div key={index} className="flex items-center space-x-2 opacity-50 hover:opacity-100 transition-opacity duration-300">
                  <partner.icon className="w-5 h-5 text-zinc-800" />
                  <span className="font-bold text-xs uppercase tracking-wider text-zinc-800">{partner.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] rounded-full bg-blue-100/10 blur-3xl pointer-events-none -z-10" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-mono uppercase tracking-widest bg-orange-100 text-orange-600 px-3 py-1 rounded-full">Powerful Architecture</span>
            <h2 className="text-4xl md:text-5xl font-serif text-zinc-950 mt-4 mb-3">Designed for speed. Engineered for realism.</h2>
            <p className="text-zinc-500 max-w-xl mx-auto text-sm md:text-base">
              Everything you need to automate architectural design in one cohesive tool.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="glass-card glass-card-hover p-8 rounded-3xl border border-zinc-200/50 glow-effect relative overflow-hidden flex flex-col gap-4"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feature.gradient} flex items-center justify-center text-white shadow-md mb-2`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif font-bold text-zinc-950">{feature.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white/50 border-y border-zinc-200/20 backdrop-blur-xs relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-xs font-mono uppercase tracking-widest bg-blue-100 text-blue-600 px-3 py-1 rounded-full">Workflow Overview</span>
            <h2 className="text-4xl md:text-5xl font-serif text-zinc-950 mt-4 mb-3">Simple 3-Step Process</h2>
            <p className="text-zinc-500 max-w-xl mx-auto text-sm md:text-base">
              How Planora turns floor plan images into production-ready 3D spaces.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3  gap-12 z-10">
            {/* Timeline Connector Line */}

            {STEPS.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full bg-white border border-zinc-200/80 shadow-md flex items-center justify-center text-zinc-900 font-mono font-bold text-lg mb-6 group-hover:border-primary group-hover:scale-105 transition-all duration-300 relative">
                  <div className="absolute -inset-1 rounded-full bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xs" />
                  <step.icon className="w-6 h-6 text-primary" />
                </div>

                <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold mb-2">{step.number}</span>
                <h3 className="text-xl font-serif font-bold text-zinc-950 mb-3">{step.title}</h3>
                <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section id="enterprise" className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] rounded-full bg-orange-100/10 blur-3xl pointer-events-none -z-10" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Enterprise Text */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest bg-orange-100 text-orange-600 px-3 py-1 rounded-full inline-block">Planora Enterprise</span>
                <h2 className="text-4xl md:text-5xl font-serif text-zinc-950 tracking-tight mt-4 leading-[1.1]">
                  Built for Teams Scaling 3D Production
                </h2>
              </div>
              <p className="text-zinc-500 text-sm md:text-base leading-relaxed">
                From architectural agencies to global prop-tech platforms, automate and accelerate your spatial asset pipeline with robust enterprise integrations.
              </p>

              <div className="flex flex-col gap-3 font-sans">
                {[
                  "Team workspace collaboration with custom roles",
                  "SSO, SAML authentication and private storage config",
                  "Dedicated support and custom SLA agreements",
                  "Restful API ecosystem with high throughput limits"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span className="text-zinc-700 text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <Button variant="primary" size="lg" className="shadow-lg hover:shadow-xl transition-all">
                  Contact Enterprise Sales
                </Button>
              </div>
            </div>

            {/* Enterprise Pipeline Interactive Graphic */}
            <div className="lg:col-span-7">
              <div className="glass-card p-6 md:p-8 rounded-3xl border border-zinc-200/50 shadow-xl relative bg-white/80 overflow-hidden">
                <div className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage: "radial-gradient(#1a1a1a 1px, transparent 1px)",
                    backgroundSize: "20px 20px"
                  }}
                />

                <div className="flex justify-between items-center mb-6 pb-4 border-b border-zinc-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-400" />
                    <span className="w-3 h-3 rounded-full bg-yellow-400" />
                    <span className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">PLANORA ENGINE PIPELINE</span>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Step 1 */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 border border-zinc-200/50">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-zinc-950 font-sans">2D Floor Plan ingestion</h4>
                        <p className="text-[10px] text-zinc-400 font-mono">Input: floorplan_rev4.png</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">success</span>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex justify-center my-[-4px]">
                    <div className="w-0.5 h-6 bg-zinc-200" />
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 animate-pulse">
                        <Cpu className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-zinc-950 font-sans">Neural Height Extrusion Engine</h4>
                        <p className="text-[10px] text-zinc-500 font-mono">Processing: 94.2% completion</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                      <span className="text-[10px] text-blue-600 font-mono font-bold uppercase">active</span>
                    </div>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex justify-center my-[-4px]">
                    <div className="w-0.5 h-6 bg-zinc-200" />
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 border border-zinc-200/50">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                        <FileCode2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-zinc-950 font-sans">3D Asset Formatting</h4>
                        <p className="text-[10px] text-zinc-400 font-mono">Output formats: OBJ, GLTF, USDZ</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-zinc-100 text-zinc-400 border border-zinc-200/30 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">queued</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white/50 border-y border-zinc-200/20 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-mono uppercase tracking-widest bg-orange-100 text-orange-600 px-3 py-1 rounded-full">Transparent Pricing</span>
            <h2 className="text-4xl md:text-5xl font-serif text-zinc-950 mt-4 mb-3">Pricing designed to scale with you</h2>
            <p className="text-zinc-500 max-w-xl mx-auto text-sm md:text-base mb-8">
              Start rendering for free and upgrade as your projects grow.
            </p>

            {/* Toggle Switch */}
            <div className="pricing-toggle">
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={`pricing-toggle-btn ${billingPeriod === "monthly" ? "active" : "inactive"}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod("yearly")}
                className={`pricing-toggle-btn ${billingPeriod === "yearly" ? "active" : "inactive"}`}
              >
                Yearly <span className="text-[10px] text-emerald-600 font-bold ml-1">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">

            {/* Free Plan */}
            <div className="glass-card p-8 rounded-3xl border border-zinc-200/50 flex flex-col justify-between bg-white/70">
              <div>
                <h3 className="text-xl font-bold font-sans text-zinc-900 mb-2">Free Plan</h3>
                <p className="text-zinc-500 text-xs mb-6">Perfect for students and hobbyists getting started in 3D modeling.</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-bold text-zinc-950">$0</span>
                  <span className="text-zinc-500 text-xs">/ forever</span>
                </div>

                <ul className="flex flex-col gap-3 text-sm text-zinc-700 border-t border-zinc-100 pt-6">
                  {["Limited generations", "Basic exports (JPG/PNG)", "Community support", "Standard processing speed"].map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8">
                <a href="#upload" className="w-full inline-flex items-center justify-center px-4 py-2.5 text-xs uppercase tracking-wider font-bold rounded-lg border border-zinc-300 text-zinc-800 hover:bg-zinc-50 transition-colors">
                  Get Started Free
                </a>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="glass-card p-8 rounded-3xl border-2 border-orange-500/60 shadow-xl flex flex-col justify-between relative bg-white overflow-hidden">
              <div className="absolute top-0 right-0 bg-orange-500 text-white text-[9px] font-bold tracking-widest uppercase py-1 px-4 rounded-bl-lg font-sans">
                MOST POPULAR
              </div>

              <div>
                <h3 className="text-xl font-bold font-sans text-zinc-900 mb-2">Pro Plan</h3>
                <p className="text-zinc-500 text-xs mb-6">For professional architects and designers delivering client work.</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-bold text-zinc-950">
                    {billingPeriod === "yearly" ? "$22" : "$29"}
                  </span>
                  <span className="text-zinc-500 text-xs">/ month</span>
                </div>

                <ul className="flex flex-col gap-3 text-sm text-zinc-700 border-t border-zinc-100 pt-6">
                  {[
                    "Unlimited generations",
                    "HD exports & OBJ/GLTF files",
                    "Priority server processing",
                    "Email & Discord support",
                    "Full commercial usage license",
                    "Beta feature access"
                  ].map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2 font-medium">
                      <Check className="w-4 h-4 text-orange-500 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <a href="#upload" className="w-full inline-flex items-center justify-center px-4 py-3 text-xs uppercase tracking-wider font-bold rounded-lg bg-primary text-white hover:bg-[#ea580c] transition-all shadow-md shadow-orange-500/10">
                  Upgrade to Pro
                </a>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="glass-card p-8 rounded-3xl border border-zinc-200/50 flex flex-col justify-between bg-white/70">
              <div>
                <h3 className="text-xl font-bold font-sans text-zinc-900 mb-2">Enterprise</h3>
                <p className="text-zinc-500 text-xs mb-6">Custom scaling and security controls for corporate design pipelines.</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-bold text-zinc-950">Custom</span>
                </div>

                <ul className="flex flex-col gap-3 text-sm text-zinc-700 border-t border-zinc-100 pt-6">
                  {[
                    "Custom generation limits",
                    "Team collaboration workspaces",
                    "Dedicated support manager",
                    "White-label export options",
                    "Custom REST API integrations",
                    "Custom SSO & SAML"
                  ].map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <button className="w-full inline-flex items-center justify-center px-4 py-2.5 text-xs uppercase tracking-wider font-bold rounded-lg border border-zinc-300 text-zinc-800 hover:bg-zinc-50 transition-colors">
                  Contact Sales
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="py-24 relative overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-orange-100/20 blur-3xl pointer-events-none -z-10" />
        <div className="max-w-7xl mx-auto px-6">

          {/* Social Proof Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 text-center">
            {[
              { num: "50,000+", label: "Active Creators" },
              { num: "2M+", label: "Models Generated" },
              { num: "98%", label: "Satisfaction Rate" }
            ].map((metric, idx) => (
              <div key={idx} className="glass-card py-10 px-6 rounded-3xl border border-zinc-200/50 shadow-xs bg-white/70">
                <span className="block text-4xl md:text-5xl font-serif font-bold text-orange-500 mb-2">{metric.num}</span>
                <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">{metric.label}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left: Testimonials Carousel */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <span className="text-xs font-mono uppercase tracking-widest bg-blue-100 text-blue-600 px-3 py-1 rounded-full inline-block w-fit">Creator Voices</span>
              <h2 className="text-4xl md:text-5xl font-serif text-zinc-950 tracking-tight leading-[1.1]">
                Join thousands of creators building the future of 3D content
              </h2>

              <div className="relative min-h-[200px] flex items-center mt-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTestimonial}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3 }}
                    className="glass-card p-6 md:p-8 rounded-3xl border border-zinc-200/50 bg-white/90 shadow-md relative"
                  >
                    <div className="flex gap-1 mb-4">
                      {[...Array(TESTIMONIALS[currentTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-zinc-800 text-sm md:text-base italic leading-relaxed mb-6 font-sans">
                      "{TESTIMONIALS[currentTestimonial].quote}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${TESTIMONIALS[currentTestimonial].avatarColor} flex items-center justify-center text-white text-xs font-bold uppercase`}>
                        {TESTIMONIALS[currentTestimonial].author[0]}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-zinc-950 font-sans">{TESTIMONIALS[currentTestimonial].author}</h4>
                        <p className="text-[10px] text-zinc-500 font-mono">{TESTIMONIALS[currentTestimonial].role}</p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Slider Dots */}
              <div className="flex gap-2 justify-start mt-2">
                {TESTIMONIALS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentTestimonial(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${currentTestimonial === idx ? "bg-primary w-6" : "bg-zinc-300"}`}
                  />
                ))}
              </div>
            </div>

            {/* Right: Community Call-To-Action & Avatars */}
            <div className="lg:col-span-5">
              <div className="glass-card p-8 rounded-3xl border border-zinc-200/50 shadow-xl bg-white/80 flex flex-col items-center text-center gap-6">

                {/* Floating Avatar Grid */}
                <div className="flex items-center -space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-full border-2 border-white bg-gradient-to-r from-orange-400 to-amber-300 flex items-center justify-center font-bold text-xs text-white">JD</div>
                  <div className="w-12 h-12 rounded-full border-2 border-white bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center font-bold text-xs text-white">SK</div>
                  <div className="w-12 h-12 rounded-full border-2 border-white bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center font-bold text-xs text-white">LM</div>
                  <div className="w-12 h-12 rounded-full border-2 border-white bg-gradient-to-r from-emerald-400 to-teal-400 flex items-center justify-center font-bold text-xs text-white">AR</div>
                  <div className="w-12 h-12 rounded-full border-2 border-white bg-zinc-950 flex items-center justify-center text-[10px] font-bold text-white">+50k</div>
                </div>

                <h3 className="text-xl font-serif font-bold text-zinc-900">Join our growing Discord Community</h3>
                <p className="text-zinc-500 text-xs leading-relaxed max-w-xs font-sans">
                  Connect with professional architects, designers, share generations, request features, and show off your work.
                </p>

                <div className="w-full">
                  <a href="https://rmx.as/discord" target="_blank" rel="noreferrer" className="w-full inline-flex items-center justify-center px-4 py-3 text-xs uppercase tracking-wider font-bold rounded-lg bg-zinc-950 text-white hover:bg-zinc-800 transition-colors shadow-md">
                    Join Discord Server
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Projects Showcase Section (Kept original logic, improved premium layout) */}
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

      {/* FAQ Section */}
      <section id="faq" className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-blue-100/10 blur-3xl pointer-events-none -z-10" />
        <div className="max-w-3xl mx-auto px-6">

          <div className="text-center mb-16">
            <span className="text-xs font-mono uppercase tracking-widest bg-orange-100 text-orange-600 px-3 py-1 rounded-full">Help & Support</span>
            <h2 className="text-4xl md:text-5xl font-serif text-zinc-950 mt-4 mb-3">Frequently Asked Questions</h2>
            <p className="text-zinc-500 text-xs md:text-sm">
              Answers to common questions about generation workflow, formats, and enterprise plans.
            </p>
          </div>

          <div className="flex flex-col gap-2 border-t border-zinc-200/50 pt-4 font-sans">
            {FAQS.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="faq-item">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="faq-trigger"
                  >
                    <span className="text-sm font-semibold text-zinc-950">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  </button>

                  <div
                    className="faq-content transition-all duration-300"
                    style={{ maxHeight: isOpen ? "200px" : "0px", opacity: isOpen ? 1 : 0 }}
                  >
                    <p className="text-xs leading-relaxed text-zinc-500 py-3">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 relative overflow-hidden bg-white/40 border-t border-zinc-200/30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-orange-100/40 blur-3xl pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-8">
          <span className="text-xs font-mono uppercase tracking-widest bg-orange-100 text-orange-600 px-3 py-1 rounded-full">Start Visualizing Today</span>

          <h2 className="text-5xl md:text-7xl font-serif text-zinc-950 leading-[1.0] max-w-2xl mx-auto">
            Build the Future of 3D Design Today
          </h2>

          <p className="text-zinc-500 max-w-md mx-auto text-xs md:text-sm font-sans">
            Join thousands of interior designers, architects, and prop-tech leaders scaling their 3D design pipelines.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#upload" className="cta py-3 px-8 text-sm font-bold uppercase tracking-wider rounded-lg bg-primary text-white hover:bg-[#ea580c] transition-all hover:scale-[1.03] shadow-lg shadow-orange-500/10">
              Get Started Free
            </a>
            <Button variant="outline" size="lg" className="hover:bg-zinc-50 hover:border-zinc-400">
              Request API Access
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
