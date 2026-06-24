import jsPDF from 'jspdf';
import { put } from '@vercel/blob';

function addColorPalette(doc, colors, startY) {
  const boxW = 38;
  const boxH = 26;
  const gap = 6;
  const startX = 20;
  const textColor = '#1A1A1A';

  colors.forEach((c, i) => {
    const x = startX + i * (boxW + gap);

    doc.setFillColor(c.hex);
    doc.roundedRect(x, startY, boxW, boxH, 2, 2, 'F');

    doc.setFontSize(7);
    doc.setTextColor(textColor);
    doc.text(c.role, x, startY - 3);

    doc.setFontSize(8);
    doc.setTextColor(c.hex);
    doc.text(c.hex, x + boxW / 2, startY + boxH + 8, { align: 'center' });

    doc.setFontSize(7);
    doc.setTextColor(textColor);
    doc.text(c.name, x + boxW / 2, startY + boxH + 16, { align: 'center' });
  });

  doc.setTextColor('#000000');
  return startY + boxH + 24;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { result, firstName } = req.body;

    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(18);
    doc.text(`${firstName || 'Your'} Brand Identity Guide`, 20, y);
    y += 12;

    if (Array.isArray(result.personality)) {
      doc.setFontSize(11);
      doc.text(result.personality.join(' • '), 20, y);
      y += 12;
    }

    if (Array.isArray(result.colors)) {
      doc.setFontSize(14);
      doc.text('Color Palette', 20, y);
      y += 8;
      y = addColorPalette(doc, result.colors, y);
      doc.setFontSize(11);
      y += 4;
    }

    if (result.fonts) {
      doc.setFontSize(14);
      doc.text('Typography', 20, y);
      y += 8;
      doc.setFontSize(11);
      if (result.fonts.heading) {
        doc.text(`Heading: ${result.fonts.heading.name} - ${result.fonts.heading.use}`, 20, y);
        y += 7;
      }
      if (result.fonts.body) {
        doc.text(`Body: ${result.fonts.body.name} - ${result.fonts.body.use}`, 20, y);
        y += 7;
      }
      y += 4;
    }

    if (result.aesthetic) {
      doc.setFontSize(14);
      doc.text('Aesthetic Direction', 20, y);
      y += 8;
      doc.setFontSize(11);
      const lines = doc.splitTextToSize(result.aesthetic, 170);
      doc.text(lines, 20, y);
      y += lines.length * 7 + 4;
    }

    if (Array.isArray(result.imagery)) {
      doc.setFontSize(14);
      doc.text('Imagery', 20, y);
      y += 8;
      doc.setFontSize(11);
      const lines = doc.splitTextToSize(result.imagery.join(', '), 170);
      doc.text(lines, 20, y);
    }

    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    const fileName = `brand-kits/${(firstName || 'brand').toLowerCase()}-${Date.now()}.pdf`;

    const blob = await put(fileName, pdfBuffer, {
      access: 'public',
      contentType: 'application/pdf'
    });

    return res.status(200).json({ success: true, pdfUrl: blob.url });
  } catch (err) {
    console.error('PDF generation error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
