/* eslint-env node */
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  ImageRun,
  Header,
  Footer,
  PageNumber,
  NumberFormat,
  TabStopType,
  TabStopPosition,
  BorderStyle,
  ShadingType,
  TableOfContents,
  PageBreak,
  LevelFormat,
  WidthType,
} from 'docx';
import fs from 'fs';
import fetch from 'node-fetch';

// ─────────────────────────────────────────────
// DESIGN TOKENS  (tweak here to restyle everything)
// ─────────────────────────────────────────────
const T = {
  // Colours  (hex, no #)
  accent: 'C0392B', // deep crimson
  accentLight: 'E8C4C0', // blush
  dark: '1A1A2E', // near-black
  muted: '7F8C8D', // grey
  white: 'FFFFFF',
  ruleLine: 'D5D8DC',

  // Font sizes in half-points (docx unit: 24 = 12pt, 48 = 24pt)
  title: 72, // 36pt
  subtitle: 36, // 18pt
  author: 28, // 14pt
  chapterNum: 20, // 10pt
  chapterHead: 52, // 26pt
  body: 24, // 12pt
  footer: 18, // 9pt

  // Spacing in TWIPs (1 inch = 1440 twips, 1pt = 20 twips)
  // A4: 11906 wide, 16838 tall  — content width @ 1" margins = 9026
  pageW: 11906,
  pageH: 16838,
  marginIn: 1440, // 1 inch
  contentW: 9026, // 11906 - 2*1440 (approx, used for tab stops)
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

async function fetchImageBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

/** Detect image type from buffer magic bytes */
function detectImageType(buf) {
  if (buf[0] === 0xff && buf[1] === 0xd8) return 'jpg';
  if (buf[0] === 0x89 && buf[1] === 0x50) return 'png';
  if (buf[0] === 0x47 && buf[1] === 0x49) return 'gif';
  if (buf[0] === 0x52 && buf[1] === 0x49) return 'webp';
  return 'png'; // safe fallback
}

/** Empty spacer paragraph */
const spacer = (pts = 0) =>
  new Paragraph({ children: [], spacing: { before: pts * 20, after: pts * 20 } });

/** Horizontal rule via paragraph bottom border */
const rule = (color = T.ruleLine, thickness = 6) =>
  new Paragraph({
    children: [],
    border: { bottom: { style: BorderStyle.SINGLE, size: thickness, color, space: 1 } },
    spacing: { before: 0, after: 120 },
  });

/** Accent rule (thicker, coloured) */
const accentRule = () => rule(T.accent, 12);

/**
 * Estimate how many "pages" a chapter's text will consume.
 * Rough heuristic: ~2800 chars per A4 page at 12pt body text.
 */
function estimatePageCount(content = '') {
  const chars = content.replace(/\s+/g, ' ').trim().length;
  return Math.max(1, Math.ceil(chars / 2800));
}

function estimateTotalContentPages(chapters) {
  return chapters.reduce((sum, ch) => sum + estimatePageCount(ch.content), 0);
}

// ─────────────────────────────────────────────
// STYLES DEFINITION
// ─────────────────────────────────────────────

function buildStyles() {
  return {
    default: {
      document: {
        run: { font: 'Georgia', size: T.body, color: '2C2C3E' },
      },
    },
    paragraphStyles: [
      // ── Book Title (cover / title page) ──
      {
        id: 'BookTitle',
        name: 'Book Title',
        basedOn: 'Normal',
        next: 'Normal',
        run: {
          font: 'Georgia',
          size: T.title,
          bold: true,
          color: T.dark,
        },
        paragraph: {
          alignment: AlignmentType.CENTER,
          spacing: { before: 240, after: 240 },
        },
      },
      // ── Book Subtitle ──
      {
        id: 'BookSubtitle',
        name: 'Book Subtitle',
        basedOn: 'Normal',
        next: 'Normal',
        run: {
          font: 'Georgia',
          size: T.subtitle,
          italics: true,
          color: T.muted,
        },
        paragraph: {
          alignment: AlignmentType.CENTER,
          spacing: { before: 120, after: 120 },
        },
      },
      // ── Author Name ──
      {
        id: 'AuthorName',
        name: 'Author Name',
        basedOn: 'Normal',
        next: 'Normal',
        run: {
          font: 'Arial',
          size: T.author,
          color: T.muted,
        },
        paragraph: {
          alignment: AlignmentType.CENTER,
          spacing: { before: 240, after: 240 },
        },
      },
      // ── Chapter Number label ──
      {
        id: 'ChapterLabel',
        name: 'Chapter Label',
        basedOn: 'Normal',
        next: 'Normal',
        run: {
          font: 'Arial',
          size: T.chapterNum,
          bold: true,
          color: T.accent,
          characterSpacing: 80,
        },
        paragraph: {
          spacing: { before: 0, after: 80 },
        },
      },
      // ── Chapter Heading (overrides Heading1 for TOC) ──
      {
        id: 'Heading1',
        name: 'Heading 1',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: {
          font: 'Georgia',
          size: T.chapterHead,
          bold: true,
          color: T.dark,
        },
        paragraph: {
          spacing: { before: 80, after: 280 },
          outlineLevel: 0,
        },
      },
      // ── Body paragraph ──
      {
        id: 'BodyText',
        name: 'Body Text',
        basedOn: 'Normal',
        next: 'BodyText',
        run: {
          font: 'Georgia',
          size: T.body,
          color: '2C2C3E',
        },
        paragraph: {
          alignment: AlignmentType.BOTH, // justified
          spacing: { before: 0, after: 160, line: 360, lineRule: 'auto' },
          indent: { firstLine: 360 }, // 0.25 inch first-line indent
        },
      },
      // ── First body paragraph (no indent, after drop cap) ──
      {
        id: 'BodyFirst',
        name: 'Body First',
        basedOn: 'BodyText',
        next: 'BodyText',
        paragraph: { indent: { firstLine: 0 } },
      },
      // ── TOC entries ──
      {
        id: 'TOC1',
        name: 'toc 1',
        basedOn: 'Normal',
        next: 'Normal',
        run: { font: 'Georgia', size: T.body, color: T.dark },
        paragraph: {
          spacing: { before: 80, after: 80 },
          tabs: [{ type: TabStopType.RIGHT, position: T.contentW, leader: 'dot' }],
        },
      },
    ],
  };
}

// ─────────────────────────────────────────────
// HEADER / FOOTER
// ─────────────────────────────────────────────

function buildHeader(book) {
  return new Header({
    children: [
      new Paragraph({
        children: [
          new TextRun({ text: book.title || 'Untitled', font: 'Arial', size: 18, color: T.muted }),
        ],
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: T.ruleLine, space: 4 } },
        spacing: { after: 0 },
      }),
    ],
  });
}

function buildFooter(book) {
  return new Footer({
    children: [
      new Paragraph({
        children: [
          new TextRun({ text: book.author || '', font: 'Arial', size: T.footer, color: T.muted }),
          new TextRun({
            children: ['\t', PageNumber.CURRENT],
            font: 'Arial',
            size: T.footer,
            color: T.muted,
          }),
        ],
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: T.ruleLine, space: 4 } },
        tabs: [{ type: TabStopType.RIGHT, position: T.contentW }],
        spacing: { before: 0 },
      }),
    ],
  });
}

// A completely blank header/footer for cover & title pages
function blankHeader() {
  return new Header({ children: [new Paragraph({ children: [] })] });
}
function blankFooter() {
  return new Footer({ children: [new Paragraph({ children: [] })] });
}

// ─────────────────────────────────────────────
// SECTION BUILDERS — return arrays of Paragraphs
// ─────────────────────────────────────────────

async function buildCoverSection(book) {
  const children = [];

  // Cover image
  if (book.coverImage) {
    try {
      let buf;
      if (book.coverImage.startsWith('http')) {
        buf = await fetchImageBuffer(book.coverImage);
      } else if (fs.existsSync(book.coverImage)) {
        buf = fs.readFileSync(book.coverImage);
      }
      if (buf) {
        children.push(
          new Paragraph({
            children: [
              new ImageRun({
                data: buf,
                type: detectImageType(buf),
                transformation: { width: 450, height: 580 },
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 0 },
          })
        );
      }
    } catch (err) {
      console.log('⚠️  Cover image failed:', err.message);
    }
  }

  // If no image, build a styled text-only cover
  if (children.length === 0) {
    children.push(spacer(120));

    // Large decorative accent bar (via shaded paragraph)
    children.push(
      new Paragraph({
        children: [new TextRun({ text: ' ', size: 8 })],
        shading: { type: ShadingType.CLEAR, fill: T.accent },
        spacing: { before: 0, after: 0 },
      })
    );
    children.push(spacer(80));

    // Title
    children.push(
      new Paragraph({
        style: 'BookTitle',
        children: [
          new TextRun({
            text: book.title || 'Untitled Book',
            font: 'Georgia',
            size: T.title,
            bold: true,
            color: T.dark,
          }),
        ],
      })
    );

    if (book.subtitle) {
      children.push(
        new Paragraph({
          style: 'BookSubtitle',
          children: [new TextRun({ text: book.subtitle, italics: true, color: T.muted })],
        })
      );
    }

    children.push(spacer(40));
    children.push(rule(T.accentLight, 8));
    children.push(spacer(40));

    children.push(
      new Paragraph({
        style: 'AuthorName',
        children: [
          new TextRun({
            text: `by  ${book.author || 'Unknown Author'}`,
            color: T.muted,
            size: T.author,
          }),
        ],
      })
    );
  }

  return children;
}

function buildTitleSection(book) {
  const children = [];

  children.push(spacer(80));
  children.push(accentRule());
  children.push(spacer(20));

  // Title
  children.push(
    new Paragraph({
      style: 'BookTitle',
      children: [
        new TextRun({
          text: book.title || 'Untitled Book',
          bold: true,
          size: T.title,
          color: T.dark,
        }),
      ],
    })
  );

  // Subtitle
  if (book.subtitle) {
    children.push(
      new Paragraph({
        style: 'BookSubtitle',
        children: [new TextRun({ text: book.subtitle, italics: true, color: T.muted })],
      })
    );
  }

  children.push(spacer(60));
  children.push(rule(T.accentLight, 6));
  children.push(spacer(60));

  // Author
  children.push(
    new Paragraph({
      style: 'AuthorName',
      children: [new TextRun({ text: `by  ${book.author || 'Unknown Author'}`, color: T.muted })],
    })
  );

  // Publisher / year
  if (book.publisher || book.year) {
    children.push(spacer(20));
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: [book.publisher, book.year].filter(Boolean).join('  ·  '),
            font: 'Arial',
            size: 18,
            color: T.muted,
          }),
        ],
        alignment: AlignmentType.CENTER,
      })
    );
  }

  children.push(spacer(20));
  children.push(rule(T.accent, 10));

  return children;
}

function buildTOCSection() {
  return [
    new Paragraph({
      style: 'BookTitle',
      children: [new TextRun({ text: 'Contents', size: T.chapterHead, bold: true, color: T.dark })],
      alignment: AlignmentType.LEFT,
      spacing: { before: 0, after: 200 },
    }),
    accentRule(),
    new TableOfContents('Contents', {
      hyperlink: true,
      headingStyleRange: '1-1',
      stylesWithLevels: [{ styleName: 'Heading 1', level: 1 }],
    }),
  ];
}

function buildChapterSection(ch, index) {
  const children = [];

  // ── Chapter label  e.g. "CHAPTER 01" ──
  children.push(
    new Paragraph({
      style: 'ChapterLabel',
      children: [
        new TextRun({
          text: `CHAPTER ${String(index + 1).padStart(2, '0')}`,
          font: 'Arial',
          size: T.chapterNum,
          bold: true,
          color: T.accent,
          characterSpacing: 80,
        }),
      ],
    })
  );

  // ── Chapter title (HeadingLevel.HEADING_1 so it appears in TOC) ──
  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [
        new TextRun({
          text: ch.title || `Chapter ${index + 1}`,
          font: 'Georgia',
          size: T.chapterHead,
          bold: true,
          color: T.dark,
        }),
      ],
    })
  );

  // Short accent underline
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: '\u2015\u2015\u2015', color: T.accent, bold: true, size: 28 }),
      ],
      spacing: { before: 0, after: 240 },
    })
  );

  // ── Body paragraphs ──
  const rawParas = (ch.content || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean); // drop blank lines (use them only as para separators)

  rawParas.forEach((para, pIdx) => {
    const isFirst = pIdx === 0;

    if (isFirst && para.length > 0) {
      // Drop-cap first letter via a large TextRun + rest in normal size
      const dropLetter = para[0];
      const rest = para.slice(1);

      children.push(
        new Paragraph({
          style: 'BodyFirst',
          children: [
            new TextRun({
              text: dropLetter,
              font: 'Georgia',
              size: 72, // 36pt drop cap
              bold: true,
              color: T.accent,
            }),
            new TextRun({
              text: rest,
              font: 'Georgia',
              size: T.body,
              color: '2C2C3E',
            }),
          ],
          alignment: AlignmentType.BOTH,
          spacing: { before: 0, after: 160, line: 360, lineRule: 'auto' },
        })
      );
    } else {
      children.push(
        new Paragraph({
          style: 'BodyText',
          children: [new TextRun({ text: para, font: 'Georgia', size: T.body })],
        })
      );
    }
  });

  return children;
}

// ─────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────

export const generateDocx = async (book, chapters) => {
  // ── Smart front-matter decisions (same logic as PDF generator) ──
  const totalContentPages = estimateTotalContentPages(chapters);
  const hasMultipleChapters = chapters.length > 1;
  const isSubstantial = totalContentPages >= 2 || hasMultipleChapters;

  const showCover = !!book.coverImage || isSubstantial;
  const showTitlePage = isSubstantial;
  const showTOC = hasMultipleChapters && isSubstantial;

  const docSections = [];
  const styles = buildStyles();
  const header = buildHeader(book);
  const footer = buildFooter(book);

  // ── 1. COVER (conditional) — its own section, no header/footer ──
  if (showCover) {
    const coverChildren = await buildCoverSection(book);
    docSections.push({
      properties: {
        page: {
          size: { width: T.pageW, height: T.pageH },
          margin: { top: T.marginIn, bottom: T.marginIn, left: T.marginIn, right: T.marginIn },
          pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL },
        },
      },
      headers: { default: blankHeader() },
      footers: { default: blankFooter() },
      children: coverChildren,
    });
  }

  // ── 2. TITLE PAGE (conditional) — own section, no header/footer ──
  if (showTitlePage) {
    docSections.push({
      properties: {
        page: {
          size: { width: T.pageW, height: T.pageH },
          margin: { top: T.marginIn, bottom: T.marginIn, left: T.marginIn, right: T.marginIn },
        },
      },
      headers: { default: blankHeader() },
      footers: { default: blankFooter() },
      children: buildTitleSection(book),
    });
  }

  // ── 3. TOC (conditional) — own section with header/footer ──
  if (showTOC) {
    docSections.push({
      properties: {
        page: {
          size: { width: T.pageW, height: T.pageH },
          margin: { top: T.marginIn, bottom: T.marginIn, left: T.marginIn, right: T.marginIn },
        },
      },
      headers: { default: header },
      footers: { default: footer },
      children: buildTOCSection(),
    });
  }

  // ── 4. CHAPTERS — all in one continuous section (Word handles page breaks) ──
  // Each chapter starts on a new page via pageBreakBefore on its first paragraph.
  const chapterChildren = [];
  chapters.forEach((ch, index) => {
    const chSection = buildChapterSection(ch, index);

    if (index > 0) {
      // Insert a page break before every chapter after the first
      chSection[0] = new Paragraph({
        ...chSection[0], // preserve style
        children: [new PageBreak(), ...(chSection[0].options?.children ?? [])],
      });
    }

    chapterChildren.push(...chSection);
  });

  docSections.push({
    properties: {
      page: {
        size: { width: T.pageW, height: T.pageH },
        margin: { top: T.marginIn, bottom: T.marginIn, left: T.marginIn, right: T.marginIn },
      },
    },
    headers: { default: header },
    footers: { default: footer },
    children: chapterChildren,
  });

  // ── Build Document ──
  const doc = new Document({
    styles,
    features: { updateFields: true }, // auto-update TOC on open
    sections: docSections,
  });

  return await Packer.toBuffer(doc);
};
