import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SEO from '../components/SEO'
import { fetchFromApi } from '../services/api'

const DEFAULT_CV = {
  fullName: "Caleb Anayolico",
  title: "Full-Stack Web & Mobile Application Engineer | SaaS Builder",
  location: "Port Harcourt, Rivers State, Nigeria",
  phone: "+234 916 558 7681",
  email: "acnwa1234@gmail.com",
  portfolio: "https://anayolico.name.ng",
  github: "github.com/anayolico",
  linkedin: "linkedin.com/in/caleb-anayolico-9861a8350",
  summary: "Driven Full-Stack & Backend Engineer with hands-on experience designing, shipping, and maintaining production-grade web and mobile applications across fintech, SaaS, and security domains. Strong command of React.js, Next.js, Node.js, Express, Python (FastAPI), React Native, and PostgreSQL (Prisma ORM, Neon DB), paired with cloud deployment experience on Vercel, Render, and AWS (S3). Skilled in configuring relational and document databases, integrating payment gateways (Paystack, Flutterwave), and deploying scalable server infrastructure.",
  skills: [
    {
      category: "Backend",
      items: ["Node.js", "Express.js", "Python (FastAPI)", "Java (Android)", "RESTful API Design", "JWT Authentication", "WebSockets", "Automation Systems"]
    },
    {
      category: "Frontend",
      items: ["React.js", "Next.js", "JavaScript (ES6+)", "HTML5", "CSS3 & Sass", "Tailwind CSS", "Vite", "React Native", "Responsive Web Design"]
    },
    {
      category: "Databases",
      items: ["PostgreSQL", "Prisma ORM", "MongoDB", "Supabase", "SQL", "Neon Database"]
    },
    {
      category: "Cloud & DevOps",
      items: ["Vercel", "Render", "Hostinger & VPS", "AWS (S3)", "Docker", "Git & GitHub Actions (CI/CD)", "Postman & API Testing"]
    },
    {
      category: "Integrations & Tools",
      items: ["Paystack", "Flutterwave", "Stripe", "Clerk", "Mailgun & Resend", "CloudConvert & Sharp API", "Figma"]
    },
    {
      category: "AI & Automation",
      items: ["Google Generative AI (Gemini API)", "OpenAI API", "Prompt Engineering", "Agentic Workflow Integration"]
    }
  ],
  projects: [
    {
      title: "Nigeria SecureVote",
      subtitle: "1st Place Hackathon Winner & Best Security Architecture",
      tech: "React, Node.js, Python (FastAPI), Neon DB, PWA Offline Sync",
      bullets: [
        "Engineered an award-winning next-generation cryptographic E-Voting & Identity Ingestion platform for high-security multi-service elections.",
        "Integrated real-time National Identity (NIMC/NIN) verification & dynamic citizen profile ingestion via Prembly API.",
        "Built a PWA offline-first resilient vote queue with local cryptographic signing and WebAuthn biometric authorization enforcing single-vote integrity.",
        "Developed a Python FastAPI fraud detection engine and real-time public transparency audit ledger."
      ]
    },
    {
      title: "LuminaConvert",
      subtitle: "Online Media Converter & AI Workstation",
      tech: "React, Vite, Node.js, Express, Prisma ORM, Neon PostgreSQL, Supabase, Google Generative AI",
      bullets: [
        "Engineered an online multi-format image & media conversion workstation with high-speed backend execution pipelines.",
        "Integrated CloudConvert API, Sharp API, Google Generative AI assistant, and automated Resend transactional email workflows."
      ]
    },
    {
      title: "Mindful Canvas",
      subtitle: "Distraction-Free Note-Taking Application",
      tech: "React, Vite, Node.js, Express, PostgreSQL, Neon DB, Supabase",
      bullets: [
        "Designed a minimalist note-taking platform with secure authentication, real-time auto-saving, and React Markdown parsing."
      ]
    },
    {
      title: "Construction Company Web Platform",
      subtitle: "Commercial Web Platform & Engineering Flow",
      tech: "React.js, Node.js, Express, Tailwind CSS",
      bullets: [
        "Designed and engineered a commercial web platform for a Nigerian construction firm using React.js, Node.js, and Tailwind CSS with interactive project galleries and service inquiry flows."
      ]
    },
    {
      title: "Weather Forecast App",
      subtitle: "Real-Time Weather Visualization & API Service",
      tech: "React, OpenWeather API, CSS Weather Animations",
      bullets: [
        "Developed a real-time weather application with location search, multi-day forecasts, and smooth CSS weather visualizations."
      ]
    }
  ],
  experience: [
    {
      period: "",
      role: "Full-Stack Software Engineer (Intern)",
      company: "Fowgate",
      bullets: [
        "Building enterprise features, internal application modules, and optimizing frontend performance using React.js and Next.js.",
        "Architecting scalable state management solutions, integrating RESTful API endpoints, and improving server payload loading speeds."
      ]
    },
    {
      period: "",
      role: "Full-Stack Developer & NIIT Graduate",
      company: "Self-Employed / NIIT",
      bullets: [
        "Earned a Diploma in Software Engineering from the National Institute of Information Technology (NIIT).",
        "Delivered custom web and SaaS applications, integrating Paystack and Flutterwave payment gateways and designing normalized PostgreSQL database schemas."
      ]
    },
    {
      period: "",
      role: "Mobile Application Developer",
      company: "Freelance Client Work",
      bullets: [
        "Engineered cross-platform mobile applications using React Native and Java (Android).",
        "Optimized mobile component render speeds, implemented offline data persistence, and integrated native mobile capabilities."
      ]
    },
    {
      period: "",
      role: "UI/UX & Web Designer",
      company: "Independent Client Work",
      bullets: [
        "Spearheaded user interface research and wireframing in Figma, translating visual mockups into clean, responsive frontend codebases."
      ]
    }
  ],
  education: [
    {
      degree: "Diploma in Software Engineering",
      institution: "National Institute of Information Technology (NIIT)",
      period: "Graduated"
    }
  ],
  certifications: [
    { title: "Diploma in Software Engineering", issuer: "NIIT", year: "2024" },
    { title: "Google AI & Web Architecture Fundamentals", issuer: "Google", year: "2024" }
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
          setCv({ ...DEFAULT_CV, ...res });
        } else if (res && res.data && res.data.fullName) {
          setCv({ ...DEFAULT_CV, ...res.data });
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
          margin: [8, 10, 8, 10],
          filename: `${cv.fullName ? cv.fullName.replace(/\s+/g, '_') : 'Caleb_Anayolico'}_CV.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            logging: false,
            scrollY: 0,
            scrollX: 0
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
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
        title="Caleb Anayolico — Executive CV / Resume | Full-Stack Engineer"
        description="Official Executive Curriculum Vitae (CV) of Caleb Anayolico, Full-Stack Engineer & SaaS Builder. Comprehensive work history, software architecture projects, awards, and technical expertise."
        keywords="Caleb Anayolico CV, Caleb Anayolico Resume, Caleb Anayolico, Anayolico CV, Full-Stack Engineer CV, Software Developer Resume"
        url="/cv"
        type="profile"
      />

      <style>{`
        @media print {
          @page {
            margin: 10mm 12mm 10mm 12mm;
            size: A4 portrait;
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
          .cv-section-title {
            color: #1d4ed8 !important;
            border-bottom-color: #2563eb !important;
          }
          a {
            color: #2563eb !important;
            text-decoration: none !important;
          }
        }
      `}</style>

      <div className="cv-page-bg min-h-screen bg-slate-950 py-8 px-4 md:px-8 selection:bg-blue-600 selection:text-white">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Floating Action Header Bar */}
          <div className="no-print flex justify-between items-center gap-4 bg-slate-900/90 backdrop-blur-xl p-4 rounded-2xl border border-slate-800 shadow-xl">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault()
                window.history.pushState({}, '', '/')
                window.dispatchEvent(new Event('popstate'))
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 text-slate-300 hover:text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Portfolio</span>
            </a>

            <button
              onClick={handleDownloadPdf}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Download PDF</span>
            </button>
          </div>

          {/* Animated Entry Wrapper */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Executive White Paper Document modeled after Winner OrluVictor's PDF */}
            <div
              id="cv-paper"
              className="cv-paper bg-white text-slate-900 p-8 sm:p-12 rounded-2xl shadow-2xl shadow-black/50 border border-slate-200 space-y-5 font-sans"
            >
              {/* Header / Contact Info Header Banner */}
              <div className="text-center border-b border-slate-200 pb-4 space-y-2">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-900 tracking-tight font-sans">
                  {cv.fullName}
                </h1>
                <p className="text-xs sm:text-sm font-extrabold text-blue-700 tracking-wide uppercase">
                  {cv.title}
                </p>

                {/* Primary Contact Details Single Line */}
                <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-xs font-semibold text-slate-600 pt-1">
                  <a href={`mailto:${cv.email}`} className="text-blue-700 hover:underline">
                    {cv.email}
                  </a>
                  <span className="text-slate-400">|</span>
                  <span>{cv.phone}</span>
                  <span className="text-slate-400">|</span>
                  {cv.portfolio && (
                    <a
                      href={cv.portfolio.startsWith('http') ? cv.portfolio : `https://${cv.portfolio}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 hover:underline"
                    >
                      {cv.portfolio.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                  <span className="text-slate-400">|</span>
                  <span className="text-slate-700 font-medium">Remote / {cv.location}</span>
                </div>

                {/* Social Profiles Row */}
                <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-[11px] font-semibold text-slate-600">
                  {cv.github && (
                    <a
                      href={cv.github.startsWith('http') ? cv.github : `https://${cv.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 hover:underline"
                    >
                      GitHub: {cv.github.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                  {cv.linkedin && (
                    <>
                      <span className="text-slate-300">•</span>
                      <a
                        href={cv.linkedin.startsWith('http') ? cv.linkedin : `https://${cv.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 hover:underline"
                      >
                        LinkedIn: {cv.linkedin.replace(/^https?:\/\//, '')}
                      </a>
                    </>
                  )}
                </div>
              </div>

              {/* 1. PROFESSIONAL SUMMARY */}
              <div style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }} className="space-y-1.5">
                <h2 className="cv-section-title text-xs font-extrabold uppercase tracking-widest text-blue-900 border-b-2 border-blue-600 pb-1">
                  PROFESSIONAL SUMMARY
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-800 leading-relaxed font-normal text-justify">
                  {cv.summary}
                </p>
              </div>

              {/* 2. TECHNICAL SKILLS */}
              <div style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }} className="space-y-2">
                <h2 className="cv-section-title text-xs font-extrabold uppercase tracking-widest text-blue-900 border-b-2 border-blue-600 pb-1">
                  TECHNICAL SKILLS
                </h2>
                <div className="space-y-1 text-[11px] sm:text-xs text-slate-800 leading-relaxed">
                  {(cv.skills || []).map((group, idx) => (
                    <p key={idx}>
                      <strong className="font-extrabold text-blue-950">{group.category}: </strong>
                      <span>{Array.isArray(group.items) ? group.items.join(', ') : group.items}</span>
                    </p>
                  ))}
                </div>
              </div>

              {/* 3. WORK EXPERIENCE */}
              <div style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }} className="space-y-3">
                <h2 className="cv-section-title text-xs font-extrabold uppercase tracking-widest text-blue-900 border-b-2 border-blue-600 pb-1">
                  WORK EXPERIENCE
                </h2>
                <div className="space-y-3.5">
                  {(cv.experience || []).map((exp, idx) => (
                    <div key={idx} style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }} className="space-y-1">
                      <div className="flex justify-between items-baseline flex-wrap text-xs sm:text-sm">
                        <div className="font-extrabold text-slate-900">
                          {exp.role} <span className="font-bold text-blue-700">| {exp.company}</span>
                        </div>
                      </div>
                      <ul className="list-disc list-outside ml-4 space-y-1 text-[11px] sm:text-xs text-slate-800 leading-relaxed">
                        {(exp.bullets || []).map((bullet, bIdx) => (
                          <li key={bIdx}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. PROJECTS */}
              <div style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }} className="space-y-3">
                <h2 className="cv-section-title text-xs font-extrabold uppercase tracking-widest text-blue-900 border-b-2 border-blue-600 pb-1">
                  PROJECTS
                </h2>
                <div className="space-y-3.5">
                  {(cv.projects || []).map((proj, idx) => (
                    <div key={idx} style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }} className="space-y-1">
                      <div className="flex justify-between items-baseline flex-wrap text-xs sm:text-sm">
                        <div className="font-extrabold text-slate-900">
                          {proj.title}
                          {proj.subtitle && (
                            <span className="font-semibold text-blue-700 italic"> — {proj.subtitle}</span>
                          )}
                          {proj.role && !proj.subtitle && (
                            <span className="font-semibold text-blue-700"> — {proj.role}</span>
                          )}
                        </div>
                      </div>
                      {proj.tech && (
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                          Tech Stack: {proj.tech}
                        </p>
                      )}
                      <ul className="list-disc list-outside ml-4 space-y-1 text-[11px] sm:text-xs text-slate-800 leading-relaxed">
                        {(proj.bullets || []).map((bullet, bIdx) => (
                          <li key={bIdx}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. EDUCATION */}
              <div style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }} className="space-y-2">
                <h2 className="cv-section-title text-xs font-extrabold uppercase tracking-widest text-blue-900 border-b-2 border-blue-600 pb-1">
                  EDUCATION
                </h2>
                <div className="space-y-2">
                  {(cv.education || []).map((edu, idx) => (
                    <div key={idx} style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }} className="flex justify-between items-baseline text-xs sm:text-sm">
                      <div>
                        <span className="font-extrabold text-slate-900">{edu.degree}</span>
                        <span className="text-slate-600"> — {edu.institution}</span>
                      </div>
                      {edu.period && (
                        <span className="text-[11px] font-semibold text-slate-500 ml-2">
                          {edu.period}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. CERTIFICATIONS */}
              {cv.certifications && cv.certifications.length > 0 && (
                <div style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }} className="space-y-2">
                  <h2 className="cv-section-title text-xs font-extrabold uppercase tracking-widest text-blue-900 border-b-2 border-blue-600 pb-1">
                    CERTIFICATIONS
                  </h2>
                  <ul className="list-disc list-outside ml-4 space-y-1 text-[11px] sm:text-xs text-slate-800 leading-relaxed">
                    {cv.certifications.map((cert, idx) => (
                      <li key={idx}>
                        <strong className="font-bold">{typeof cert === 'string' ? cert : cert.title}</strong>
                        {typeof cert !== 'string' && cert.issuer && (
                          <span className="text-slate-600"> — {cert.issuer} {cert.year && `(${cert.year})`}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div> {/* End of #cv-paper */}
          </motion.div>
        </div>
      </div>
    </>
  )
}
