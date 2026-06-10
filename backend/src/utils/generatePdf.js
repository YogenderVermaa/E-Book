/* eslint-env node */
import PDFDocument from 'pdfkit';
import fs from 'fs';
import fetch from 'node-fetch';

// ─────────────────────────────────────────────
// THEME / DESIGN TOKENS
// ─────────────────────────────────────────────
const THEME = {
  // Colours
  accent: '#C0392B', // deep crimson
  accentLight: '#E8C4C0', // blush tint for rules/fills
  dark: '#1A1A2E', // near-black for headings
  body: '#2C2C3E', // dark-grey body text
  muted: '#7F8C8D', // footer / caption
  pageRule: '#D5D8DC', // light horizontal rules
  coverBg: '#1A1A2E', // fallback cover background

  // Typography sizes
  titleSize: 42,
  subtitleSize: 20,
  authorSize: 15,
  chapterSize: 26,
  bodySize: 11.5,
  footerSize: 9,
  tocTitle: 22,
  tocEntry: 12,

  // Layout
  marginTop: 70,
  marginBottom: 70,
  marginLeft: 72,
  marginRight: 72,

  // Line height multiplier for body text
  lineGap: 5,
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

/** Fetch a remote image into a Buffer */
async function fetchImageBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

/** Draw a full-width horizontal rule */
function drawRule(doc, y, color = THEME.pageRule, thickness = 0.5) {
  const { left, right } = getMargins(doc);
  doc
    .save()
    .moveTo(left, y)
    .lineTo(right, y)
    .lineWidth(thickness)
    .strokeColor(color)
    .stroke()
    .restore();
}

/** Draw a coloured rectangle accent bar on the left edge */
function drawAccentBar(doc, y, height, color = THEME.accent) {
  doc
    .save()
    .rect(THEME.marginLeft - 24, y, 4, height)
    .fill(color)
    .restore();
}

/** Return usable left / right x positions */
function getMargins(doc) {
  return {
    left: THEME.marginLeft,
    right: doc.page.width - THEME.marginRight,
    width: doc.page.width - THEME.marginLeft - THEME.marginRight,
  };
}

/** Register the page-number / footer event once */
function attachFooters(doc, book, pageNumberRef) {
  doc.on('pageAdded', () => {
    // We'll draw footers in a post-pass using the range event; PDFKit
    // doesn't support reliable after-page hooks, so we write them inline
    // via drawFooter() called at the END of each page build.
  });
}

/** Draw footer for the CURRENT page */
function drawFooter(doc, book, pageNum) {
  const { left, right, width } = getMargins(doc);
  const y = doc.page.height - THEME.marginBottom + 16;

  drawRule(doc, y - 6, THEME.pageRule, 0.4);

  doc
    .save()
    .fontSize(THEME.footerSize)
    .fillColor(THEME.muted)
    .font('Helvetica')
    .text(book.title || 'Untitled', left, y, { width: width / 2, align: 'left' })
    .text(String(pageNum), left, y, { width, align: 'right' })
    .restore();
}

/** Draw a decorative drop-cap for the first letter of a paragraph */
function drawDropCap(doc, letter, x, y, capSize = 46) {
  const { left } = getMargins(doc);
  doc
    .save()
    .fontSize(capSize)
    .font('Times-BoldItalic')
    .fillColor(THEME.accent)
    .text(letter, x, y - 6, { lineBreak: false })
    .restore();
}

// ─────────────────────────────────────────────
// SECTION BUILDERS
// ─────────────────────────────────────────────

async function buildCoverPage(doc, book) {
  const pw = doc.page.width;
  const ph = doc.page.height;

  // ── solid background ──
  doc.save().rect(0, 0, pw, ph).fill(THEME.coverBg).restore();

  // ── decorative top bar ──
  doc.save().rect(0, 0, pw, 8).fill(THEME.accent).restore();

  // ── cover image ──
  if (book.coverImage) {
    try {
      let imgSrc;
      if (book.coverImage.startsWith('http')) {
        imgSrc = await fetchImageBuffer(book.coverImage);
      } else if (fs.existsSync(book.coverImage)) {
        imgSrc = book.coverImage;
      }
      if (imgSrc) {
        // Draw image centred, semi-transparent overlay applied via rect after
        doc.image(imgSrc, 0, 0, { width: pw, height: ph, align: 'center', valign: 'center' });
        // Dark overlay so text remains readable
        doc.save().rect(0, 0, pw, ph).opacity(0.55).fill(THEME.coverBg).restore();
      }
    } catch (err) {
      console.log('⚠️  Cover image failed:', err.message);
    }
  }

  // ── accent side stripe ──
  doc.save().rect(0, 0, 8, ph).fill(THEME.accent).restore();
  doc
    .save()
    .rect(pw - 8, 0, 8, ph)
    .fill(THEME.accent)
    .restore();

  // ── title ──
  const titleY = ph * 0.35;
  doc
    .save()
    .fontSize(THEME.titleSize)
    .font('Times-Bold')
    .fillColor('#FFFFFF')
    .text(book.title || 'Untitled Book', THEME.marginLeft, titleY, {
      width: pw - THEME.marginLeft * 2,
      align: 'center',
      lineGap: 6,
    })
    .restore();

  // ── rule under title ──
  const ruleY = doc.y + 14;
  doc
    .save()
    .moveTo(pw * 0.2, ruleY)
    .lineTo(pw * 0.8, ruleY)
    .lineWidth(1.5)
    .strokeColor(THEME.accent)
    .stroke()
    .restore();

  // ── subtitle ──
  if (book.subtitle) {
    doc
      .save()
      .fontSize(THEME.subtitleSize)
      .font('Times-Italic')
      .fillColor(THEME.accentLight)
      .text(book.subtitle, THEME.marginLeft, ruleY + 18, {
        width: pw - THEME.marginLeft * 2,
        align: 'center',
      })
      .restore();
  }

  // ── author ──
  doc
    .save()
    .fontSize(THEME.authorSize)
    .font('Helvetica')
    .fillColor('#CCCCCC')
    .text(`by  ${book.author || 'Unknown Author'}`, THEME.marginLeft, ph * 0.72, {
      width: pw - THEME.marginLeft * 2,
      align: 'center',
      characterSpacing: 2,
    })
    .restore();

  // ── bottom bar ──
  doc
    .save()
    .rect(0, ph - 8, pw, 8)
    .fill(THEME.accent)
    .restore();
}

function buildTitlePage(doc, book, pageNumberRef) {
  const { left, width } = getMargins(doc);
  const pw = doc.page.width;
  const ph = doc.page.height;

  // Decorative top ornament
  doc.save().rect(left, THEME.marginTop, width, 3).fill(THEME.accent).restore();

  doc
    .save()
    .rect(left, THEME.marginTop + 8, width, 0.5)
    .fill(THEME.accentLight)
    .restore();

  // Title
  doc
    .save()
    .fontSize(THEME.titleSize - 4)
    .font('Times-Bold')
    .fillColor(THEME.dark)
    .text(book.title || 'Untitled Book', left, ph * 0.28, {
      width,
      align: 'center',
      lineGap: 6,
    })
    .restore();

  // Rule
  const midY = doc.y + 12;
  doc
    .save()
    .moveTo(pw * 0.3, midY)
    .lineTo(pw * 0.7, midY)
    .lineWidth(1)
    .strokeColor(THEME.accent)
    .stroke()
    .restore();

  // Subtitle
  if (book.subtitle) {
    doc
      .save()
      .fontSize(THEME.subtitleSize - 2)
      .font('Times-Italic')
      .fillColor(THEME.muted)
      .text(book.subtitle, left, midY + 16, { width, align: 'center' })
      .restore();
  }

  // Author
  doc
    .save()
    .fontSize(THEME.authorSize)
    .font('Helvetica-Oblique')
    .fillColor(THEME.body)
    .text(`by  ${book.author || 'Unknown Author'}`, left, ph * 0.6, {
      width,
      align: 'center',
      characterSpacing: 1.5,
    })
    .restore();

  // Year / publisher line
  if (book.year || book.publisher) {
    doc
      .save()
      .fontSize(10)
      .font('Helvetica')
      .fillColor(THEME.muted)
      .text(
        [book.publisher, book.year].filter(Boolean).join('  ·  '),
        left,
        ph - THEME.marginBottom - 40,
        { width, align: 'center' }
      )
      .restore();
  }

  // Bottom ornament
  doc
    .save()
    .rect(left, ph - THEME.marginBottom - 3, width, 0.5)
    .fill(THEME.accentLight)
    .restore();
  doc
    .save()
    .rect(left, ph - THEME.marginBottom, width, 3)
    .fill(THEME.accent)
    .restore();

  pageNumberRef.count++;
}

function buildTOC(doc, chapters, book, pageNumberRef) {
  const { left, right, width } = getMargins(doc);

  // Heading
  doc
    .save()
    .fontSize(THEME.tocTitle)
    .font('Times-Bold')
    .fillColor(THEME.dark)
    .text('Table of Contents', left, THEME.marginTop, { width, align: 'left' })
    .restore();

  drawRule(doc, doc.y + 8, THEME.accent, 1.5);
  doc.moveDown(1.5);

  chapters.forEach((ch, i) => {
    const chapterLabel = ch.title || `Chapter ${i + 1}`;
    const estPage = pageNumberRef.count + 2 + i; // rough estimate

    const entryY = doc.y;

    // Chapter number pill
    doc
      .save()
      .fontSize(8)
      .font('Helvetica-Bold')
      .fillColor('#FFFFFF')
      .rect(left, entryY + 1, 22, 14)
      .fill(THEME.accent)
      .text(String(i + 1).padStart(2, '0'), left + 4, entryY + 3, {
        lineBreak: false,
      })
      .restore();

    // Chapter title
    doc
      .save()
      .fontSize(THEME.tocEntry)
      .font('Times-Roman')
      .fillColor(THEME.body)
      .text(chapterLabel, left + 30, entryY, { width: width - 60, lineBreak: false })
      .restore();

    // Dot leaders
    doc
      .save()
      .fontSize(THEME.tocEntry)
      .font('Helvetica')
      .fillColor(THEME.muted)
      .text(String(estPage), right - 24, entryY, { width: 24, align: 'right', lineBreak: false })
      .restore();

    drawRule(doc, entryY + 18, THEME.pageRule, 0.3);
    doc.moveDown(1.2);
  });

  pageNumberRef.count++;
}

function buildChapterPage(doc, ch, index, book, pageNumberRef) {
  const { left, right, width } = getMargins(doc);
  const ph = doc.page.height;

  // ── Chapter header band ──
  doc
    .save()
    .rect(0, THEME.marginTop - 20, doc.page.width, 90)
    .fill('#F7F9FA')
    .restore();

  // Chapter number (large faint watermark style)
  doc
    .save()
    .fontSize(90)
    .font('Times-Bold')
    .fillColor('#EAECEE')
    .text(String(index + 1).padStart(2, '0'), doc.page.width - 130, THEME.marginTop - 30, {
      lineBreak: false,
    })
    .restore();

  // "CHAPTER X" label
  doc
    .save()
    .fontSize(9)
    .font('Helvetica-Bold')
    .fillColor(THEME.accent)
    .text(`CHAPTER ${index + 1}`, left, THEME.marginTop + 2, {
      characterSpacing: 3,
      lineBreak: false,
    })
    .restore();

  // Chapter title
  doc
    .save()
    .fontSize(THEME.chapterSize)
    .font('Times-Bold')
    .fillColor(THEME.dark)
    .text(ch.title || `Chapter ${index + 1}`, left, THEME.marginTop + 20, {
      width: width * 0.78,
      lineGap: 4,
    })
    .restore();

  // Accent underline
  const titleBottom = doc.y;
  doc
    .save()
    .moveTo(left, titleBottom + 4)
    .lineTo(left + 60, titleBottom + 4)
    .lineWidth(3)
    .strokeColor(THEME.accent)
    .stroke()
    .restore();

  doc.y = titleBottom + 22;

  // ── Body text ──
  const lines = (ch.content || '').split('\n');
  let isFirstPara = true;

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      doc.moveDown(0.4);
      return;
    }

    if (isFirstPara) {
      // Drop cap for the very first paragraph
      const firstLetter = trimmed[0];
      const rest = trimmed.slice(1);
      const capX = left;
      const capY = doc.y;
      const capSize = 42;
      const capWidth = capSize * 0.72;

      drawDropCap(doc, firstLetter, capX, capY, capSize);

      doc
        .save()
        .fontSize(THEME.bodySize)
        .font('Times-Roman')
        .fillColor(THEME.body)
        .text(rest, capX + capWidth + 4, capY + 6, {
          width: width - capWidth - 4,
          align: 'justify',
          lineGap: THEME.lineGap,
        })
        .restore();

      // Move doc.y past the drop cap area (at least)
      if (doc.y < capY + capSize - 8) {
        doc.y = capY + capSize - 8;
      }
      doc.moveDown(0.6);
      isFirstPara = false;
    } else {
      doc
        .save()
        .fontSize(THEME.bodySize)
        .font('Times-Roman')
        .fillColor(THEME.body)
        .text(trimmed, left, doc.y, {
          width,
          align: 'justify',
          lineGap: THEME.lineGap,
          indent: 20,
        })
        .restore();
      doc.moveDown(0.5);
    }

    // Auto-insert page break when near bottom, then redraw footer first
    if (doc.y > ph - THEME.marginBottom - 40) {
      drawFooter(doc, book, pageNumberRef.count);
      doc.addPage();
      pageNumberRef.count++;
    }
  });

  drawFooter(doc, book, pageNumberRef.count);
  pageNumberRef.count++;
}

// ─────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────

export const generatePdf = async (book, chapters) => {
  const doc = new PDFDocument({
    size: 'A4',
    margins: {
      top: THEME.marginTop,
      bottom: THEME.marginBottom,
      left: THEME.marginLeft,
      right: THEME.marginRight,
    },
    info: {
      Title: book.title || 'Untitled',
      Author: book.author || 'Unknown',
      Subject: book.subtitle || '',
      Creator: 'BookGen PDF Engine',
    },
    autoFirstPage: false, // we control every page manually
    bufferPages: true, // allows page count post-pass if needed
  });

  // Collect output
  const chunks = [];
  doc.on('data', (chunk) => chunks.push(chunk));
  const bufferPromise = new Promise((resolve) =>
    doc.on('end', () => resolve(Buffer.concat(chunks)))
  );

  // Shared mutable page counter (passed by reference)
  const pageNumberRef = { count: 1 };

  // ── 1. COVER PAGE ──────────────────────────────────
  doc.addPage({ margins: { top: 0, bottom: 0, left: 0, right: 0 } });
  await buildCoverPage(doc, book);

  // ── 2. TITLE PAGE ──────────────────────────────────
  doc.addPage();
  buildTitlePage(doc, book, pageNumberRef);

  // ── 3. TABLE OF CONTENTS ───────────────────────────
  if (chapters.length > 1) {
    doc.addPage();
    buildTOC(doc, chapters, book, pageNumberRef);
  }

  // ── 4. CHAPTERS ────────────────────────────────────
  chapters.forEach((ch, index) => {
    doc.addPage();
    buildChapterPage(doc, ch, index, book, pageNumberRef);
  });

  doc.end();
  return await bufferPromise;
};
