import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, ImageRun } from 'docx';
import fs from 'fs';

export const generateDocx = async (book, chapters) => {
  const sections = [];

  // COVER PAGE
  if (book.coverImage) {
    const imageBuffer = fs.readFileSync(book.coverImage);

    sections.push(
      new Paragraph(''),
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

  // TITLE PAGE
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: book.title,
          bold: true,
          size: 60,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
    })
  );

  if (book.subtitle) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: book.subtitle,
            size: 32,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );
  }

  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `By ${book.author}`,
          size: 26,
        }),
      ],
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({ text: '', pageBreakBefore: true })
  );

  // CHAPTERS
  chapters.forEach((ch, index) => {
    sections.push(
      new Paragraph({
        text: ch.title,
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 },
      })
    );

    const lines = ch.content.split('\n');

    lines.forEach((line) => {
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: line })],
          spacing: { after: 150 },
          alignment: AlignmentType.JUSTIFIED,
        })
      );
    });

    if (index < chapters.length) sections.push(new Paragraph({ text: '', pageBreakBefore: true }));
  });

  const doc = new Document({ sections: [{ children: sections }] });
  return await Packer.toBuffer(doc);
};
