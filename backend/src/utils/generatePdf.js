/* eslint-env node */
import PDFDocument from 'pdfkit';
import fs from 'fs';
import fetch from 'node-fetch';

export const generatePdf = async (book, chapters) => {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 60, bottom: 60, left: 60, right: 60 },
  });

  const chunks = [];
  doc.on('data', (chunk) => chunks.push(chunk)); // collect PDF data
  const bufferPromise = new Promise((resolve) =>
    doc.on('end', () => resolve(Buffer.concat(chunks)))
  );

  // ======================
  // COVER IMAGE (URL/Local)
  // ======================
  if (book.coverImage) {
    try {
      if (book.coverImage.startsWith('http')) {
        // 🚀 Cloudinary / URL
        const response = await fetch(book.coverImage);
        const imgBuffer = Buffer.from(await response.arrayBuffer());
        doc.image(imgBuffer, { fit: [450, 600], align: 'center' });
      } else if (fs.existsSync(book.coverImage)) {
        // 💾 Local file
        doc.image(book.coverImage, { fit: [450, 600], align: 'center' });
      }
      doc.addPage();
    } catch (err) {
      console.log('⚠️ Failed to load cover image:', err.message);
    }
  }

  // ======================
  // TITLE PAGE
  // ======================
  doc.fontSize(28).text(book.title || 'Untitled Book', { align: 'center' });
  if (book.subtitle) {
    doc.moveDown().fontSize(18).text(book.subtitle, { align: 'center' });
  }
  doc
    .moveDown(2)
    .fontSize(14)
    .text(`By ${book.author || 'Unknown'}`, { align: 'center' });
  doc.addPage();

  // ======================
  // CHAPTERS
  // ======================
  chapters.forEach((ch, index) => {
    doc.fontSize(22).text(ch.title || `Chapter ${index + 1}`, { align: 'left' });
    doc.moveDown().fontSize(12);

    const lines = (ch.content || '').split('\n');
    lines.forEach((line) => {
      if (line.trim()) doc.text(line, { align: 'justify' }).moveDown(0.5);
      else doc.moveDown();
    });

    if (index < chapters.length - 1) doc.addPage();
  });

  doc.end();
  return await bufferPromise; // 📌 returns ready-to-send buffer
};
