"use client"
import Image from "next/image"
import { useEffect, useState } from "react"
import FadeDown from "@/components/animations/FadeDown"
import FadeUp from "@/components/animations/FadeUp"

interface CertificationItem {
  id: number
  title: string
  issuer: string
  date?: string
  type: "Certification" | "Award"
  credentialUrl?: string
  credentialId?: string
  description?: string
  image?: string
  skills: string[]
}

const certifications: CertificationItem[] = [
  {
    id: 1,
    title: "Certified Blue Team Fundamentals (BTF)",
    issuer: "CyberWarFare Labs",
    date: "Nov 2026",
    type: "Certification",
    credentialId: "6af470cc5415119b914540995",
    description:
      "Credential issued by Cyberwarfare Labs for completing the Certified Blue Team Fundamentals (BTF) examination. Validates hands-on skills in Security Operations (SOC), Threat Hunting, Incident Response, Digital Forensics, and SIEM log analysis.",
    image: "/certificate/sertifikat-btf.jpg",
    skills: ["Security Operations", "Cyber Threat Hunting (CTH)"],
  },
  {
    id: 2,
    title: "Certified Cyber Security Analyst (C3SA)",
    issuer: "CyberWarFare Labs",
    date: "Nov 2026",
    type: "Certification",
    credentialId: "C3SA-6af47553415119b91453ff0f",
    description: "Official C3SA certificate issued by CyberWarfare Labs (11/11/2026).",
    image: "/certificate/sertifikat-c3sa.jpg",
    skills: ["Threat Detection", "Network Security"],
  },
  {
    id: 3,
    title: "Mastering Model Mechanics",
    issuer: "Mercor",
    date: "Oct 2026",
    type: "Certification",
    credentialId: "MRC-2026-8G4GBMF3",
    description:
      "Official Certificate of Recognition from Mercor for completing the \"Mastering Model Mechanics\" course (ID: MRC-2026-8G4GBMF3). Demonstrates proficiency in LLM token prediction dynamics, context window optimization, attention budget allocation, and context rot mitigation for AI agent evaluation.",
    image: "/certificate/sertifikat-mercor-mastering.png",
    skills: ["Prompt Engineering", "Large Language Models (LLM)"],
  },
  {
    id: 4,
    title: "Introduction to Agents",
    issuer: "Mercor",
    date: "Oct 2026",
    type: "Certification",
    credentialId: "MRC-2026-6TS44Z4D",
    description:
      "Official certificate from Mercor for completing the \"Introduction to Agents\" course. Demonstrates proficiency in AI agent design and evaluation, including context management, workspace setup, trajectory log analysis, and structured agent performance assessment.",
    image: "/certificate/sertifikat-mercor-agents.png",
    skills: ["AI Agents", "Artificial Intelligence (AI)"],
  },
  {
    id: 5,
    title: "Scientific Computing with Python",
    issuer: "freeCodeCamp",
    date: "Jun 2026",
    type: "Certification",
    credentialId: "alhadiazumi-pyv9",
    description: "Sertifikasi komputasi sains menggunakan Python dari freeCodeCamp.",
    image: "/certificate/sertifikat-python.png",
    skills: ["Python", "Computer Science"],
  },
  {
    id: 6,
    title: "Learn Basic AI",
    issuer: "Dicoding Indonesia",
    date: "Feb 2026",
    type: "Certification",
    credentialId: "JMZVOGRJ3XN9",
    description: "Sertifikasi dasar-dasar Artificial Intelligence dari Dicoding Indonesia.",
    image: "/certificate/sertifikat-basic-ai.jpg",
    skills: ["Machine Learning", "Artificial Intelligence (AI)"],
  },
  {
    id: 7,
    title: "1st Place - National Science Olympiad (OSN) in Informatics",
    issuer: "Kementerian Pendidikan dan Kebudayaan (Ministry of Education and Culture Republic of Indonesia)",
    date: "Apr 2024",
    type: "Award",
    description: "Sertifikat kemenangan juara 1 OSN Informatika tingkat Kota Langsa.",
    image: "/certificate/sertifikat-osn.jpg",
    skills: ["Analytical Skills", "Problem Solving"],
  },
]

function CertificateIcon({ type }: { type: CertificationItem["type"] }) {
  if (type === "Award") {
    return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 21h8m-4-4v4m-5.5-9.5a5.5 5.5 0 1111 0 5.5 5.5 0 01-11 0zM7 21l1.5-5m10 5l-1.5-5" />
      </svg>
    )
  }

  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  )
}

export default function Certifications() {
  const [active, setActive] = useState<CertificationItem | null>(null)
  const [extraPages, setExtraPages] = useState(0)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)")
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "unset"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [active])

  const baseCount = isDesktop ? 3 : 2
  const step = isDesktop ? 3 : 2
  const visibleCount = baseCount + extraPages * step
  const visibleCertifications = certifications.slice(0, visibleCount)
  const hasMore = visibleCount < certifications.length

  return (
    <section id="certifications" className="w-full max-w-7xl mx-auto py-24 md:py-32 cursor-default bg-background relative border-t border-text-secondary/10">
      <FadeDown>
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16 md:mb-24 w-full text-left">
          <h2 className="text-sm font-bold tracking-[0.2em] text-text-secondary uppercase mb-4">Credentials & Recognition</h2>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter">Certifications & Awards</h3>
        </div>
      </FadeDown>

      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleCertifications.map((cert, index) => (
          <FadeUp key={cert.id} delay={index * 0.1} className="h-full">
              <div className="group flex flex-col h-full bg-thirdary/20 hover:bg-thirdary/50 border border-text-secondary/10 hover:border-text-primary/50 rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
              {cert.image ? (
                <button
                  type="button"
                  onClick={() => setActive(cert)}
                  className="relative block w-full aspect-[16/10] overflow-hidden bg-background/40 border-b border-text-secondary/10 cursor-zoom-in"
                >
                  <Image
                    src={cert.image}
                    alt={cert.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-contain p-2 transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute top-3 right-3 text-[10px] font-bold tracking-widest text-text-primary bg-background/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-text-secondary/10 uppercase">
                    {cert.type}
                  </span>
                </button>
              ) : (
                <div className="relative aspect-[16/10] flex items-center justify-center bg-thirdary/30 border-b border-text-secondary/10 text-text-primary">
                  <CertificateIcon type={cert.type} />
                </div>
              )}

              <div className="p-6 md:p-8 flex flex-col flex-grow">
                <h4 className="text-xl font-black text-text-primary tracking-tight leading-tight">{cert.title}</h4>
                <h5 className="text-sm font-bold text-text-secondary tracking-wide uppercase mt-2">{cert.issuer}</h5>
                {cert.date && <span className="mt-1 text-xs font-bold tracking-widest text-text-secondary/80 uppercase">{cert.date}</span>}

                {cert.description && (
                  <p className="mt-4 text-sm text-text-secondary font-medium leading-relaxed line-clamp-3">{cert.description}</p>
                )}

                {cert.credentialId && (
                  <p className="mt-3 text-[10px] font-mono font-bold text-text-secondary/70 break-all">ID: {cert.credentialId}</p>
                )}

                {cert.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {cert.skills.map((skill, i) => (
                      <span key={i} className="text-[10px] font-bold bg-background text-text-primary px-2.5 py-1 rounded-md border border-text-secondary/10 uppercase tracking-wider">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto pt-4 border-t border-text-secondary/10 text-xs font-bold tracking-[0.2em] uppercase text-text-primary flex items-center gap-3 group/btn"
                  >
                    View Credential
                    <span className="w-8 h-[2px] bg-text-primary group-hover/btn:w-12 transition-all duration-300"></span>
                  </a>
                )}
              </div>
            </div>
          </FadeUp>
        ))}
      </div>

      {hasMore && (
        <div className="max-w-7xl mx-auto px-6 md:px-12 mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setExtraPages((prev) => prev + 1)}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-background border border-text-secondary/20 text-text-primary hover:border-text-primary hover:bg-text-primary hover:text-background rounded-xl font-bold tracking-widest text-sm uppercase transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.02] shadow-sm hover:shadow-xl"
          >
            <span>See More</span>
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}

      {active && (
        <div
          className="fixed inset-0 z-[60] overflow-y-auto bg-black/80 backdrop-blur-sm"
          onClick={() => setActive(null)}
        >
          <div className="min-h-full flex items-start md:items-center justify-center p-4 md:p-8">
            <div className="relative w-full max-w-5xl my-auto" onClick={(event) => event.stopPropagation()}>
              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label="Close"
                className="absolute top-2 right-2 z-10 p-2 rounded-full bg-black/60 text-white cursor-pointer hover:bg-black/80 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="relative w-full h-[50vh] md:h-[65vh] bg-black/20 rounded-lg overflow-hidden">
                <Image src={active.image ?? ""} alt={active.title} fill sizes="100vw" className="object-contain" />
              </div>

              <div className="mt-4 pb-4 text-center max-w-3xl mx-auto px-2">
                <p className="text-base font-bold text-white">{active.title}</p>
                <p className="text-xs font-medium text-white/70 mt-1">
                  {active.issuer}
                  {active.date ? ` · ${active.date}` : ""}
                </p>
                {active.credentialId && <p className="text-[10px] font-mono text-white/60 mt-1 break-all">ID: {active.credentialId}</p>}
                {active.description && <p className="text-xs text-white/70 font-medium leading-relaxed mt-2">{active.description}</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
