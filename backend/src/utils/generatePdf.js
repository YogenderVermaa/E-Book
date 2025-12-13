/* eslint-env node */
import PDFDocument from 'pdfkit';
import fs from 'fs';
import { Buffer } from 'buffer';

export const generatePdf = (book, chapters) => {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 60, bottom: 60, left: 60, right: 60 },
  });

  const buffers = [];
  doc.on('data', buffers.push.bind(buffers));

  //  COVER PAGE (only if file exists)
  if (book.coverImage && fs.existsSync(book.coverImage)) {
    doc.image(book.coverImage, {
      fit: [450, 600],
      align: 'center',
      valign: 'center',
    });
    doc.addPage();
  }

  //  TITLE PAGE
  doc.fontSize(28).text(book.title, { align: 'center' });

  if (book.subtitle) {
    doc.moveDown().fontSize(18).text(book.subtitle, { align: 'center' });
  }

  doc.moveDown(2).fontSize(16).text(`By ${book.author}`, { align: 'center' });

  doc.addPage();

  // CHAPTERS
  chapters.forEach((ch, idx) => {
    // Chapter Title
    doc.fontSize(22).text(ch.title, { align: 'left' }).moveDown();

    doc.fontSize(12);

    const paragraphs = (ch.content || '').split('\n');

    paragraphs.forEach((p) => {
      if (p.trim().length > 0) {
        doc.text(p, { align: 'justify' }).moveDown(0.5);
      } else {
        doc.moveDown();
      }
    });

    if (idx !== chapters.length - 1) {
      doc.addPage();
    }
  });

  doc.end();

  return new Promise((resolve) => {
    doc.on('end', () => {
      resolve(Buffer.concat(buffers));
    });
  });
};
