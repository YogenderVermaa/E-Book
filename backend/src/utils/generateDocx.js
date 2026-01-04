/* eslint-env node */
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, ImageRun } from 'docx';
import fs from 'fs';
import fetch from 'node-fetch';

export const generateDocx = async (book, chapters) => {
  const sections = [];

  // =============================
  // 📌 1. COVER IMAGE (URL or File)
  // =============================
  if (book.coverImage) {
    try {
      let imageBuffer;

      if (book.coverImage.startsWith('http')) {
        // Cloudinary URL → fetch
        const res = await fetch(book.coverImage);
        imageBuffer = Buffer.from(await res.arrayBuffer());
      } else if (fs.existsSync(book.coverImage)) {
        // Local file → read
        imageBuffer = fs.readFileSync(book.coverImage);
      }

      if (imageBuffer) {
        sections.push(
          new Paragraph({
            children: [
              new ImageRun({
                data: imageBuffer,
                transformation: { width: 450, height: 600 },
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: '', pageBreakBefore: true })
        );
      }
    } catch (error) {
      console.log('⚠️ Cover image load failed, skipping:', error.message);
    }
  }

  // =============================
  // 📌 2. TITLE PAGE
  // =============================
  sections.push(
    new Paragraph({
      children: [new TextRun({ text: book.title, bold: true, size: 60 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
    })
  );

  if (book.subtitle) {
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: book.subtitle, size: 32 })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );
  }

  sections.push(
    new Paragraph({
      children: [new TextRun({ text: `By ${book.author}`, size: 26 })],
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({ text: '', pageBreakBefore: true })
  );

  // =============================
  // 📌 3. CHAPTERS
  // =============================
  chapters.forEach((ch, idx) => {
    sections.push(
      new Paragraph({
        text: ch.title,
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 },
      })
    );

    const lines = (ch.content || '').split('\n');
    lines.forEach((line) => {
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: line })],
          spacing: { after: 150 },
          alignment: AlignmentType.JUSTIFIED,
        })
      );
    });

    if (idx < chapters.length - 1)
      sections.push(new Paragraph({ text: '', pageBreakBefore: true }));
  });

  // =============================
  // 📌 4. BUILD DOCX FILE
  // =============================
  const doc = new Document({ sections: [{ children: sections }] });
  return await Packer.toBuffer(doc);
};
