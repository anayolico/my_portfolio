import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SEO from '../components/SEO'
import ServerOfflineBot from '../components/ServerOfflineBot.jsx'
import { fetchFromApi } from '../services/api'
import { generateCvPdf } from '../lib/generateCvPdf.js'

export default function CV() {
  const [cv, setCv] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCv() {
      try {
        const res = await fetchFromApi('/api/cv');
        const cvPayload = res?.data || res;
        if (cvPayload && cvPayload.fullName) {
          setCv(cvPayload);
        } else {
          setCv(null);
        }
      } catch (err) {
        console.warn('Error loading CV from database:', err);
        setCv(null);
      } finally {
        setLoading(false);
      }
    }
    loadCv();
  }, []);

  const handleDownloadPdf = () => {
    if (!cv) return;
    try {
      generateCvPdf(cv)
    } catch (err) {
      console.warn('Fallback to native print:', err)
      window.print()
    }
  }

  return (
    <>
      <SEO
        title="Caleb Anayolico (CaleByte) — Executive CV / Resume | Full-Stack Engineer"
        description="Official Executive Curriculum Vitae (CV) of Caleb Anayolico (CaleByte Technologies), Full-Stack & Backend Engineer & SaaS Builder. Comprehensive work history, software architecture projects, awards, and technical expertise."
        keywords="CaleByte, CaleByte Technologies, CaleByte Technology, Caleb Anayolico, Caleb Anayolico CV, Caleb Anayolico Resume, Caleb Anayo, Caleb Anayo CV, Full-Stack Engineer CV, Backend Developer Resume"
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
              disabled={!cv || loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Download PDF</span>
            </button>
          </div>

          {loading ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-12 space-y-6 animate-pulse">
              <div className="h-8 w-64 bg-white/10 rounded mx-auto" />
              <div className="h-4 w-96 bg-white/10 rounded mx-auto" />
              <div className="space-y-3 pt-4">
                <div className="h-4 w-full bg-white/10 rounded" />
                <div className="h-4 w-5/6 bg-white/10 rounded" />
                <div className="h-4 w-4/6 bg-white/10 rounded" />
              </div>
            </div>
          ) : !cv ? (
            <ServerOfflineBot
              title="Server Offline"
              message="Could not connect to the database to load your CV."
            />
          ) : (
          /* Animated Entry Wrapper */
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
                <p className="text-xs sm:text-sm font-extrabold text-blue-700 tracking-wide">
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
                  <span className="text-slate-700 font-medium">{cv.location && cv.location.startsWith('Remote') ? cv.location : `Remote / ${cv.location}`}</span>
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
                <div className="space-y-2.5">
                  {(cv.education || []).map((edu, idx) => (
                    <div key={idx} style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }} className="space-y-1">
                      <div className="flex justify-between items-baseline text-xs sm:text-sm">
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
                      {edu.bullets && edu.bullets.length > 0 && (
                        <ul className="list-disc list-outside ml-4 space-y-1 text-[11px] sm:text-xs text-slate-800 leading-relaxed">
                          {edu.bullets.map((bullet, bIdx) => (
                            <li key={bIdx}>{bullet}</li>
                          ))}
                        </ul>
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
          )}
        </div>
      </div>
    </>
  )
}
