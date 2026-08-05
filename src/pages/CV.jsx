import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SEO from '../components/SEO'
import { fetchFromApi } from '../services/api'
import logo from '../components/ima-and/logo.png'

const DEFAULT_CV = {
  fullName: "Caleb Anayolico",
  title: "Full-Stack Web & Mobile Application Engineer",
  location: "Port Harcourt, Rivers State, Nigeria",
  phone: "+234 916 558 7681",
  email: "acnwa1234@gmail.com",
  portfolio: "https://anayolico.name.ng",
  github: "github.com/anayolico",
  summary: "Driven Full-Stack Software Engineer with a clear trajectory of growth, evolving from a design focus to becoming a complete application architect. Proficient across the entire stack—leveraging React.js, Next.js, and React Native for dynamic interfaces, alongside Node.js, Python (FastAPI), and Java for scalable server architectures. Skilled in configuring relational and document databases (PostgreSQL, Prisma ORM, MongoDB, Supabase), integrating local/international payment gateways (Paystack, Flutterwave), and deploying cloud infrastructure. A graduate of NIIT with a Diploma in Software Engineering, and currently an intern at Fowgate, actively applying and refining full-stack skills on enterprise-level applications. Proven track record delivering both client solutions and robust production applications.",
  skills: [
    {
      category: "Frontend Development",
      items: ["React.js", "Next.js", "JavaScript (ES6+)", "HTML5", "CSS3 & Sass", "Tailwind CSS", "Vite", "React Native", "Responsive Web Design", "UI/UX Animations"]
    },
    {
      category: "Backend & Mobile Development",
      items: ["Node.js & Express", "Python (FastAPI)", "Java (Android)", "React Native", "PostgreSQL & Prisma ORM", "MongoDB", "RESTful APIs", "Automation Systems"]
    },
    {
      category: "Databases & Storage",
      items: ["PostgreSQL", "Prisma ORM", "MongoDB", "Supabase", "SQL", "Neon Database"]
    },
    {
      category: "Integrations & Cloud Services",
      items: ["Paystack", "Flutterwave", "Stripe", "Vercel", "Render", "Hostinger & VPS", "AWS (S3)", "Supabase/Clerk", "Mailgun & Resend"]
    },
    {
      category: "DevOps & Developer Tools",
      items: ["Git & GitHub Actions (CI/CD)", "Postman & API Testing", "Progressive Web Apps (PWA)", "Figma & UI Prototyping", "CloudConvert & Sharp API"]
    }
  ],
  projects: [
    {
      title: "LuminaConvert",
      role: "Full-Stack Creator & Architect",
      bullets: [
        "Engineered an online multi-format image & media conversion workstation with high-speed backend execution pipelines and an integrated AI assistant.",
        "Integrated React, Vite, Node.js, Express, Prisma ORM, Neon PostgreSQL, Supabase, CloudConvert, Sharp API, Google Generative AI, and Resend."
      ]
    },
    {
      title: "Mindful Canvas",
      role: "Full-Stack Developer",
      bullets: [
        "Designed a minimalist note-taking application providing a distraction-free writing environment with secure authentication, real-time auto-saving, and React Markdown parsing.",
        "Built with React, Vite, Node.js, Express, PostgreSQL, Neon Database, and Supabase."
      ]
    },
    {
      title: "Construction Company Web Platform",
      role: "Full-Stack Developer",
      bullets: [
        "Designed and engineered a commercial web platform for a Nigerian construction firm using React.js, Node.js, and Tailwind CSS with interactive project galleries and service inquiry flows."
      ]
    },
    {
      title: "Weather Forecast App",
      role: "Frontend & API Engineer",
      bullets: [
        "Developed a real-time weather application with location search, multi-day forecasts, and smooth CSS weather visualizations."
      ]
    }
  ],
  hackathonProject: {
    title: "Nigeria SecureVote",
    awardTitle: "1st Place Hackathon Winner & Best Security Architecture",
    role: "Lead Architect & Full-Stack Developer",
    awardImage: "",
    summary: "Award-winning next-generation cryptographic E-Voting & Identity Ingestion platform engineered for secure, transparent multi-service election processing.",
    keyFeatures: [
      "Real-time National Identity (NIMC/NIN) verification & dynamic citizen profile ingestion via Prembly API.",
      "PWA Offline-First Resilient Vote Queue with local cryptographic signing and auto-reconnection background sync.",
      "WebAuthn Biometric Authorization (fingerprint / TouchID / FaceID) enforcing strict single-vote integrity.",
      "Cryptographic Token & Digital PVC Card Generation featuring 6-digit VIN, 16-character security tokens, and QR verification.",
      "Python FastAPI Fraud Detection Engine & Real-Time Public Transparency Audit Ledger."
    ],
    tech: ["React", "Vite", "Node.js", "Express", "Python (FastAPI)", "Prisma ORM", "Neon Database", "Supabase", "Prembly NIMC API", "WebAuthn Biometrics", "PWA Offline Sync"],
    demoLink: "#",
    codeLink: "https://github.com/anayolico/onetime"
  },
  experience: [
    {
      period: "",
      role: "Full-Stack Software Engineer (Intern)",
      company: "Fowgate",
      bullets: [
        "Contributing as a Full-Stack Engineer intern building enterprise features, internal application modules, and scaling frontend UI performance using React.js and Next.js.",
        "Architecting scalable state management solutions, integrating RESTful API endpoints, and optimizing server payload loading speeds."
      ]
    },
    {
      period: "",
      role: "Full-Stack Developer & NIIT Graduate",
      company: "Self-Employed / NIIT",
      bullets: [
        "Earned a Diploma in Software Engineering from the National Institute of Information Technology (NIIT).",
        "Delivered custom software applications across e-commerce and real estate, integrating Paystack and Flutterwave payment gateways and designing PostgreSQL / Prisma schemas."
      ]
    },
    {
      period: "",
      role: "Mobile Application Developer",
      company: "Freelance Client Work",
      bullets: [
        "Engineered cross-platform mobile applications using React Native and Java (Android).",
        "Focused on smooth 60fps UI performance, offline data persistence, and native mobile component integrations."
      ]
    },
    {
      period: "",
      role: "UI/UX & Web Designer",
      company: "Independent Client Work",
      bullets: [
        "Spearheaded user interface research and wireframing using Figma, translating visual designs into clean responsive HTML5/CSS3/JavaScript codebases."
      ]
    }
  ],
  education: [
    {
      degree: "Diploma in Software Engineering",
      institution: "National Institute of Information Technology (NIIT)",
      period: "Graduated"
    },
    {
      degree: "Bachelor of Science (B.Sc.) Candidate — Computer Science / Engineering",
      institution: "University Degree Program",
      period: "Graduation Pending"
    }
  ]
};

export default function CV() {
  const [cv, setCv] = useState(DEFAULT_CV);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCv() {
      try {
        const res = await fetchFromApi('/api/cv');
        if (res && res.fullName) {
          setCv(res);
        } else if (res && res.data && res.data.fullName) {
          setCv(res.data);
        }
      } catch (err) {
        console.warn('Using default CV fallback');
      } finally {
        setLoading(false);
      }
    }
    loadCv();
  }, []);

  const handleDownloadPdf = async () => {
    const element = document.getElementById('cv-paper');
    if (!element) {
      window.print();
      return;
    }

    try {
      if (!window.html2pdf) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      if (window.html2pdf) {
        const opt = {
          margin: [10, 12, 10, 12],
          filename: `${cv.fullName ? cv.fullName.replace(/\s+/g, '_') : 'Caleb_Anayolico'}_CV.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        window.html2pdf().set(opt).from(element).save();
      } else {
        window.print();
      }
    } catch (err) {
      console.warn('Fallback to native print:', err);
      window.print();
    }
  };

  return (
    <>
      <SEO
        title={`${cv.fullName} | Executive Curriculum Vitae (CV) & Resume`}
        description={`${cv.title} - Professional CV & Technical Experience.`}
        keywords="Caleb Anayolico, CV, Resume, Full-Stack Engineer, Software Developer, React.js, Node.js, Port Harcourt, Nigeria"
        url="/cv"
      />

      <style>{`
        @media print {
          @page {
            margin: 12mm 15mm;
            size: auto;
          }
          body {
            background: #ffffff !important;
            color: #0f172a !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .cv-page-bg {
            background: #ffffff !important;
            padding: 0 !important;
            min-height: auto !important;
          }
          .cv-paper {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            max-width: 100% !important;
            margin: 0 !important;
            border-radius: 0 !important;
          }
          a {
            color: #0f766e !important;
            text-decoration: underline !important;
          }
        }
      `}</style>

      <div className="cv-page-bg min-h-screen bg-slate-950 py-8 px-4 md:px-8 selection:bg-teal-500 selection:text-white">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Floating Action Header Bar */}
          <div className="no-print flex justify-end items-center gap-4 bg-slate-900/90 backdrop-blur-xl p-4 rounded-2xl border border-slate-800 shadow-xl">
            <button
              onClick={handleDownloadPdf}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-teal-500/25 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Download PDF</span>
            </button>
          </div>

          {/* Clean Executive White Paper Resume Document */}
          <motion.div
            id="cv-paper"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="cv-paper bg-white text-slate-900 p-8 sm:p-12 rounded-2xl shadow-2xl shadow-black/50 border border-slate-200 space-y-7"
          >
            {/* Header / Contact Info Block */}
            <div className="border-b-2 border-teal-600 pb-6 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight">
                    {cv.fullName}
                  </h1>
                  <p className="text-sm sm:text-base font-bold text-teal-700 tracking-wide uppercase mt-1">
                    {cv.title}
                  </p>
                </div>

                <div className="flex flex-col items-start sm:items-end text-xs text-slate-700 space-y-1 sm:text-right font-medium leading-tight">
                  <img
                    src={logo}
                    alt="Caleb Anayolico Logo"
                    className="h-10 sm:h-12 w-auto object-contain mb-1"
                  />
                  <p className="text-slate-800 font-semibold">{cv.location}</p>
                  <p className="text-slate-700">{cv.phone}</p>
                  <a href={`mailto:${cv.email}`} className="text-teal-700 font-semibold hover:underline">
                    {cv.email}
                  </a>
                </div>
              </div>

              {/* Clean Clickable Links (Fully preserved in exported PDF) */}
              <div className="flex flex-wrap items-center gap-6 text-xs font-bold pt-2 border-t border-slate-100">
                {cv.portfolio && (
                  <a
                    href={cv.portfolio.startsWith('http') ? cv.portfolio : `https://${cv.portfolio}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-700 hover:text-teal-900 hover:underline inline-flex items-center cursor-pointer"
                  >
                    <span>Portfolio Website</span>
                  </a>
                )}
                {cv.github && (
                  <a
                    href={cv.github.startsWith('http') ? cv.github : `https://${cv.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-700 hover:text-teal-900 hover:underline inline-flex items-center cursor-pointer"
                  >
                    <span>GitHub Profile</span>
                  </a>
                )}
              </div>
            </div>

            {/* Professional Summary */}
            <div className="space-y-2">
              <h2 className="text-xs font-black uppercase tracking-widest text-teal-800 font-display pb-1 border-b border-slate-200">
                Professional Summary
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                {cv.summary}
              </p>
            </div>

            {/* Technical Skills & Proficiencies */}
            <div className="space-y-3">
              <h2 className="text-xs font-black uppercase tracking-widest text-teal-800 font-display pb-1 border-b border-slate-200">
                Technical Skills & Proficiencies
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(cv.skills || []).map((group, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <h3 className="text-xs font-bold text-slate-900 font-display">
                      {group.category}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {(group.items || []).map((item, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-900 border border-teal-200/90"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Award-Winning Hackathon Showcase Section */}
            {(cv.hackathonProject || DEFAULT_CV.hackathonProject) && (() => {
              const h = cv.hackathonProject || DEFAULT_CV.hackathonProject;
              return (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between border-b border-teal-200/80 pb-1">
                    <h2 className="text-xs font-black uppercase tracking-widest text-teal-800 font-display flex items-center gap-1.5">
                      <span>🏆</span> {h.awardTitle || "Award-Winning Hackathon Project"}
                    </h2>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-950 border border-teal-300">
                      1st Place Winner
                    </span>
                  </div>

                  <div className="p-4 sm:p-5 rounded-2xl bg-teal-50/40 border border-teal-200/80 flex flex-col sm:flex-row gap-5 items-start">
                    {/* Square Award Trophy / Certificate Photo Container */}
                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-xl bg-slate-900 border-2 border-teal-500/40 shadow-md flex-shrink-0 overflow-hidden flex items-center justify-center relative aspect-square">
                      {h.awardImage && h.awardImage.trim().startsWith('http') ? (
                        <img
                          src={h.awardImage}
                          alt="Hackathon Award Trophy"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-900 via-teal-950/60 to-slate-900 p-3 flex flex-col items-center justify-center text-center space-y-1">
                          <span className="text-2xl">🏆</span>
                          <span className="text-[10px] font-extrabold text-teal-300 font-display uppercase tracking-wider">
                            Hackathon Winner
                          </span>
                          <span className="text-[9px] text-teal-200/70 leading-tight">
                            Award Certificate
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Technical Details */}
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="text-base font-extrabold text-slate-900 font-display">
                          {h.title} <span className="text-xs font-bold text-teal-800">— {h.role}</span>
                        </h3>
                        <div className="flex items-center gap-3 text-xs font-bold">
                          <a
                            href="https://onetime-voter.vercel.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-800 hover:underline"
                          >
                            View Live App
                          </a>
                          <span className="text-slate-300">•</span>
                          {h.codeLink && (
                            <a
                              href={h.codeLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-teal-800 hover:underline"
                            >
                              View GitHub Repository
                            </a>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        {h.summary}
                      </p>

                      <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-700 leading-relaxed font-normal">
                        {(h.keyFeatures || []).map((feat, fIdx) => (
                          <li key={fIdx}>{feat}</li>
                        ))}
                      </ul>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {(h.tech || []).map((t, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-900 border border-teal-200/90"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Featured Software Projects */}
            <div className="space-y-4">
              <h2 className="text-xs font-black uppercase tracking-widest text-teal-800 font-display pb-1 border-b border-slate-200">
                Featured Software Projects
              </h2>
              <div className="space-y-4">
                {(cv.projects || []).map((proj, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <h3 className="text-sm font-bold text-slate-900 font-display">
                        {proj.title} <span className="text-xs font-semibold text-teal-700">— {proj.role}</span>
                      </h3>
                    </div>
                    <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-700 leading-relaxed font-normal">
                      {(proj.bullets || []).map((bullet, bIdx) => (
                        <li key={bIdx}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Professional Experience */}
            <div className="space-y-4">
              <h2 className="text-xs font-black uppercase tracking-widest text-teal-800 font-display pb-1 border-b border-slate-200">
                Professional Experience
              </h2>
              <div className="space-y-5">
                {(cv.experience || []).map((exp, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <h3 className="text-sm font-bold text-slate-900 font-display">
                        {exp.role} <span className="text-xs font-semibold text-slate-600">| {exp.company}</span>
                      </h3>
                    </div>
                    <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-700 leading-relaxed font-normal">
                      {(exp.bullets || []).map((bullet, bIdx) => (
                        <li key={bIdx}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="space-y-3">
              <h2 className="text-xs font-black uppercase tracking-widest text-teal-800 font-display pb-1 border-b border-slate-200">
                Education
              </h2>
              <div className="space-y-2">
                {(cv.education || []).map((edu, idx) => (
                  <div key={idx} className="flex justify-between items-baseline text-xs">
                    <div>
                      <h3 className="font-bold text-slate-900 font-display text-sm">{edu.degree}</h3>
                      <p className="text-slate-600 text-xs font-medium">{edu.institution}</p>
                    </div>
                    {edu.period && (
                      <span className="text-teal-800 font-bold text-[11px] bg-teal-50 border border-teal-200/80 px-2 py-0.5 rounded-md">
                        {edu.period}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Open for Collaboration Section */}
            <div className="space-y-2 pt-4 border-t-2 border-teal-600">
              <h2 className="text-xs font-black uppercase tracking-widest text-teal-800 font-display">
                Open for Collaboration
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                Full-Stack Engineer open for high-impact project collaborations, technical consulting, and innovative joint ventures.
              </p>
            </div>

          </motion.div>
        </div>
      </div>
    </>
  )
}

