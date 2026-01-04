import { GoogleGenAI } from '@google/genai';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/api-error.js';
import { ApiResponse } from '../utils/api-response.js';

const ai = new GoogleGenAI({ apiKey: process.env.AI_API_KEY });

const generateOutline = asyncHandler(async (req, res) => {
  const { topic, style, numChapter, description } = req.body;

  if (!topic) {
    throw new ApiError(400, 'Please provide a topic');
  }

  const prompt = `You are an Expert book outline generator. Create a comprehensive book outline based on the following requirements:

    Topic: "${topic}"
    ${description ? `Description: ${description}` : ''}
    Writing Style: ${style}
    Number of Chapters: ${numChapter || 5}

    Requirements:
    1. Generate exactly ${numChapter || 5} chapters
    2. Each chapter title should be clear, engaging, and follow a logical progression
    3. Each chapter description should be 2-3 sentences explaining what the chapter covers
    4. Ensure chapters build upon each other coherently
    5. Match the "${style}" writing style in your titles and descriptions

    Output Format:
    Return only a valid JSON array with no additional text, markdown, or formatting. Each object must have exactly two keys: "title" and "description"

    Example structure:
    [
    {
    "title": "Chapter 1: Introduction to the Topic",
    "description": "A comprehensive overview introducing the main concepts. Sets the foundation for understanding the subject matter."
    },
    {
    "title": "Chapter 2: Core Principles",
    "description": "Explores the fundamental principles and theories. Provides detailed examples and real-world applications."
    }
    ]

    Generate the outline now:`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-lite',
    contents: prompt,
  });

  const text = response.text;

  const startIndex = text.indexOf('[');
  const endIndex = text.lastIndexOf(']');

  if (startIndex === -1 || endIndex === -1) {
    throw new ApiError(500, 'Failed to parse AI response, no JSON array found');
  }

  const jsonString = text.substring(startIndex, endIndex + 1);

  if (!jsonString) {
    throw new ApiError(500, 'JSON string extraction failed');
  }

  let outline;
  try {
    outline = JSON.parse(jsonString);
  } catch {
    throw new ApiError(500, 'Failed to parse AI response as valid JSON');
  }

  if (!outline) {
    throw new ApiError(500, 'Invalid outline structure');
  }

  return res.status(200).json(new ApiResponse(200, { outline }, 'Outline generated successfully'));
});

const generateChapterContent = asyncHandler(async (req, res) => {
  const { chapterTitle, chapterDescription, style } = req.body;

  if (!chapterTitle) {
    throw new ApiError(400, 'Please provide the chapter title');
  }

  const prompt = `You are an expert writer specializing in ${style} content. Write a complete chapter for a book with the following specifications:
    Chapter Title: "${chapterTitle}"
    ${chapterDescription ? `Chapter Description: ${chapterDescription}` : ''}
    Writing Style: ${style}
    Target Length: strict aim for 100-130 words don't exceed it.

    Requirements:
    1. Write in a ${style.toLowerCase()} tone throughout the chapter
    2. Structure the content with clear sections and smooth transitions
    3. Ensure the content flows logically from introduction to conclusion
    4. Make the content engaging and valuable to readers
    ${chapterDescription ? '5. Cover all points mentioned in the chapter description' : ''}

    Format Guidelines:
    - Start with a compelling opening paragraph
    - Use clear paragraph breaks for readability
    - Include subheadings if appropriate for the content length
    - End with a strong conclusion or transition to the next chapter
    - Write in plain text without markdown formatting

    Begin writing the chapter content now:`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-lite',
    contents: prompt,
  });

  if (!response) {
    throw new ApiError(500, 'Failed to generate content');
  }

  console.log(response.text);

  return res
    .status(200)
    .json(new ApiResponse(200, { content: response.text }, 'Generated content successfully'));
});

export { generateOutline, generateChapterContent };
