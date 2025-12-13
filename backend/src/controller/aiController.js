import { GoogleGenAI } from '@google/genai';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/api-error.js';
import { ApiResponse } from '../utils/api-response.js';

const ai = new GoogleGenAI({ apiKey: process.env.AI_API_KEY });

const generateOutline = asyncHandler(async (req, res) => {
  const { topic, style, numChapter, description } = req.body;

  if (!topic) {
    return res.status(400).json({ message: 'Please provide a topic' });
  }

  const prompt = `You are an Expert book outline generator.Create a comprehansive book outline based on the following requirements :

    Topic: "${topic}"
    ${description ? `Description: ${description}` : ''}
    Writing Style : ${style}
    Number of Chapters: ${numChapter || 5}

    Requirements:
    1.Generate exactly ${numChapter || 5} chaptes
    2.Each chapter title should be clear , engaging , and follow a logical progression
    3.Each chapter description should be 2-3 sentences explaining what the chapter covers
    4.Ensure chapters build upon each other coherently 
    5.Match the "{style}" writing style in your titles and description

    Output Format :
    Return only a valid JSON array with no additional text, markdown, or formatting. Each object must have exactly two keys: "title" and "description"

    Example structure: 
    [
    {
    "title": "Chapter 1: Intoduction to the Topic",
    "description":"A comprehensive overview introducing the main concepts.Sets the foundation for understanding the subject matter."
    },
    {
    "title":"Chapter 2: Core Principles",
    "description": "Explores the fundamental principles and theories . Provides detailed examples and real-world applications." 
    }
    ]

    Generate the outline now :`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-lite',
    contents: prompt,
  });

  const text = response.text;

  const startIndex = text.indexOf('[');
  const endIndex = text.lastIndexOf(']');

  if (startIndex === -1 || endIndex === -1) {
    throw new ApiError(500, 'Faild to parse AI response,no JSON array found.');
  }

  const jsonString = text.substring(startIndex, endIndex + 1);

  if (!jsonString) {
    throw new ApiError(400, 'Json String Not found');
  }

  const outline = JSON.parse(jsonString);

  if (!outline) {
    throw new ApiError(400, 'Failed to parse AI response');
  }

  return res.status(200).json(new ApiResponse(200, { outline }, 'Ai Response'));
});

const generateChapterContent = asyncHandler(async (req, res) => {
  const { chapterTitle, chapterDescriptioin, style } = req.body;

  if (!chapterTitle) {
    throw new ApiError(400, 'Please Provide the chapter title');
  }

  const prompt = `Yor are a expert writer specalizing in ${style} content.Write a complete chapter for a book with the following specifications: 
    chapter Title = "${chapterTitle}"
    ${chapterTitle ? `Chapter Description : ${chapterDescriptioin}` : ''}
    Writing Style : ${style}
    Target Length: Comprehensive and detailed (aim for 1500-2500 words)

    Requirements:
    1. Write in a ${style.toLowerCase()} tone throughout the chapter
    2.Structure the content with clear sections and smooth transitions
    4.Ensure the content flows logically for Introduction to conslustion
    5.Make the content engaging and valuable to readers
    ${chapterDescriptioin ? '6. Cover all points mentioned in the chapter description' : ''}

    Format Guidelines: 
    -Start with a compelling opening paragraph
    -Use clear paragraph breaks for readability
    -Include subheadings if appropriate for the content length
    -End with a strong conclusion or transition to the next chapter
    -Write in plain text without markdown formatting


    Begin writing the chapter content now:`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-lite',
    contents: prompt,
  });
  if (!response) {
    throw new Error(500, 'Failed to generate content');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { content: response.text }, 'Genereated content successfully'));
});

export { generateOutline, generateChapterContent };
