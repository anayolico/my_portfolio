import { jsPDF } from 'jspdf'

/**
 * Generates a real, selectable, ATS-readable text-based PDF from CV data.
 */
export function generateCvPdf(cv) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 15
  const contentWidth = pageWidth - margin * 2
  const bottomLimit = pageHeight - margin
  let y = 18

  const BLUE_DARK = [30, 58, 138]
  const BLUE_MID = [29, 78, 216]
  const SLATE_900 = [15, 23, 42]
  const SLATE_600 = [71, 85, 105]
  const SLATE_500 = [100, 116, 139]

  const ensureSpace = (neededHeight) => {
    if (y + neededHeight > bottomLimit) {
      doc.addPage()
      y = margin
    }
  }

  const drawWrappedText = (text, x, maxWidth, lineHeight = 4.4, fontSize = 9.5, style = 'normal', color = SLATE_900) => {
    if (!text) return
    doc.setFont('helvetica', style)
    doc.setFontSize(fontSize)
    doc.setTextColor(...color)
    const lines = doc.splitTextToSize(String(text), maxWidth)
    for (const line of lines) {
      ensureSpace(lineHeight)
      doc.text(line, x, y)
      y += lineHeight
    }
  }

  const drawSectionHeader = (title) => {
    ensureSpace(11)
    y += 2.5
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...BLUE_DARK)
    doc.text(title.toUpperCase(), margin, y)
    y += 1.5
    doc.setDrawColor(37, 99, 235)
    doc.setLineWidth(0.5)
    doc.line(margin, y, pageWidth - margin, y)
    y += 4.5
  }

  const drawBullet = (text) => {
    if (!text) return
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9.5)
    doc.setTextColor(...SLATE_900)
    const bulletIndent = 4
    const lines = doc.splitTextToSize(String(text), contentWidth - bulletIndent)
    ensureSpace(lines.length * 4.3)
    doc.text('•', margin + 1, y)
    lines.forEach((line) => {
      ensureSpace(4.3)
      doc.text(line, margin + bulletIndent, y)
      y += 4.3
    })
  }

  // --- HEADER ---
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(...BLUE_DARK)
  doc.text(cv.fullName || 'Caleb Anayolico', pageWidth / 2, y, { align: 'center' })
  y += 6.5

  if (cv.title) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9.5)
    doc.setTextColor(...BLUE_MID)
    const titleLines = doc.splitTextToSize(cv.title, contentWidth)
    titleLines.forEach((line) => {
      doc.text(line, pageWidth / 2, y, { align: 'center' })
      y += 4.2
    })
  }

  const normalizeUrl = (raw) => {
    if (!raw) return ''
    return raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`
  }

  const drawCenteredLinkedRow = (segments, rowY, fontSize = 8.5) => {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(fontSize)
    const totalWidth = segments.reduce((sum, seg) => sum + doc.getTextWidth(seg.text), 0)
    let cursorX = (pageWidth - totalWidth) / 2
    for (const seg of segments) {
      if (seg.url) {
        doc.setTextColor(...BLUE_MID)
        doc.textWithLink(seg.text, cursorX, rowY, { url: seg.url })
      } else {
        doc.setTextColor(...(seg.color || SLATE_600))
        doc.text(seg.text, cursorX, rowY)
      }
      cursorX += doc.getTextWidth(seg.text)
    }
  }

  const locText = cv.location && cv.location.startsWith('Remote') ? cv.location : `Remote / ${cv.location || 'Nigeria'}`
  const contactItems = [
    cv.email ? { text: cv.email, url: `mailto:${cv.email}` } : null,
    cv.phone ? { text: cv.phone } : null,
    cv.portfolio ? { text: cv.portfolio.replace(/^https?:\/\//, ''), url: normalizeUrl(cv.portfolio) } : null,
    locText ? { text: locText } : null,
  ].filter(Boolean)

  const contactSegments = []
  contactItems.forEach((item, idx) => {
    if (idx > 0) contactSegments.push({ text: '  |  ', color: SLATE_500 })
    contactSegments.push(item)
  })
  if (contactSegments.length > 0) {
    drawCenteredLinkedRow(contactSegments, y, 8.5)
    y += 4.5
  }

  const socialSegments = []
  if (cv.github) {
    socialSegments.push({ text: 'GitHub: ', color: SLATE_600 })
    socialSegments.push({ text: cv.github.replace(/^https?:\/\//, ''), url: normalizeUrl(cv.github) })
  }
  if (cv.linkedin) {
    if (socialSegments.length > 0) socialSegments.push({ text: '   •   ', color: SLATE_500 })
    socialSegments.push({ text: 'LinkedIn: ', color: SLATE_600 })
    socialSegments.push({ text: cv.linkedin.replace(/^https?:\/\//, ''), url: normalizeUrl(cv.linkedin) })
  }

  if (socialSegments.length > 0) {
    drawCenteredLinkedRow(socialSegments, y, 8.5)
    y += 3.8
  }

  doc.setDrawColor(203, 213, 225)
  doc.setLineWidth(0.3)
  doc.line(margin, y, pageWidth - margin, y)
  y += 4

  // --- 1. PROFESSIONAL SUMMARY ---
  if (cv.summary) {
    drawSectionHeader('PROFESSIONAL SUMMARY')
    drawWrappedText(cv.summary, margin, contentWidth, 4.4, 9.5, 'normal', SLATE_900)
    y += 1.5
  }

  // --- 2. TECHNICAL SKILLS ---
  if (Array.isArray(cv.skills) && cv.skills.length > 0) {
    drawSectionHeader('TECHNICAL SKILLS')
    cv.skills.forEach((group) => {
      const itemsText = Array.isArray(group.items) ? group.items.join(', ') : (group.items || '')
      const fullLine = `${group.category}: ${itemsText}`
      drawWrappedText(fullLine, margin, contentWidth, 4.3, 9.2, 'normal', SLATE_900)
      y += 0.5
    })
    y += 1.5
  }

  // --- 3. WORK EXPERIENCE ---
  if (Array.isArray(cv.experience) && cv.experience.length > 0) {
    drawSectionHeader('WORK EXPERIENCE')
    cv.experience.forEach((exp) => {
      ensureSpace(10)
      const headerText = exp.company ? `${exp.role}  |  ${exp.company}` : exp.role
      drawWrappedText(headerText, margin, contentWidth, 4.6, 10, 'bold', SLATE_900)
      if (exp.period) {
        drawWrappedText(exp.period, margin, contentWidth, 4, 8.5, 'italic', SLATE_500)
      }
      ;(exp.bullets || []).forEach((b) => drawBullet(b))
      y += 2
    })
  }

  // --- 4. PROJECTS ---
  if (Array.isArray(cv.projects) && cv.projects.length > 0) {
    drawSectionHeader('PROJECTS')
    cv.projects.forEach((proj) => {
      ensureSpace(12)
      const titleLine = proj.subtitle
        ? `${proj.title} — ${proj.subtitle}`
        : (proj.role ? `${proj.title} — ${proj.role}` : proj.title)
      drawWrappedText(titleLine, margin, contentWidth, 4.6, 10, 'bold', SLATE_900)
      if (proj.tech) {
        drawWrappedText(`Tech Stack: ${proj.tech}`, margin, contentWidth, 4, 8.5, 'bold', SLATE_500)
      }
      ;(proj.bullets || []).forEach((b) => drawBullet(b))
      y += 2
    })
  }

  // --- 5. EDUCATION ---
  if (Array.isArray(cv.education) && cv.education.length > 0) {
    drawSectionHeader('EDUCATION')
    cv.education.forEach((edu) => {
      ensureSpace(10)
      const eduLine = edu.period
        ? `${edu.degree} — ${edu.institution} (${edu.period})`
        : `${edu.degree} — ${edu.institution}`
      drawWrappedText(eduLine, margin, contentWidth, 4.5, 9.8, 'bold', SLATE_900)
      ;(edu.bullets || []).forEach((b) => drawBullet(b))
      y += 1.5
    })
  }

  // --- 6. CERTIFICATIONS ---
  if (Array.isArray(cv.certifications) && cv.certifications.length > 0) {
    drawSectionHeader('CERTIFICATIONS')
    cv.certifications.forEach((cert) => {
      const certText = typeof cert === 'string'
        ? cert
        : `${cert.title}${cert.issuer ? ` — ${cert.issuer}` : ''}${cert.year ? ` (${cert.year})` : ''}`
      drawBullet(certText)
    })
  }

  const filename = `${cv.fullName ? cv.fullName.replace(/\s+/g, '_') : 'Caleb_Anayolico'}_CV.pdf`
  doc.save(filename)
}
