

const { GoogleGenAI } = require('@google/genai');


const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

/**
 * Generate course content using AI
 */
const generateCourseContent = async (topic, category, level) => {
  try {
    const prompt = `You are an expert course creator. Generate a comprehensive course outline based on the following:

Topic: ${topic}
Category: ${category}
Level: ${level}

Please provide a JSON response with the following structure (ONLY JSON, no markdown):
{
  "title": "Professional, engaging course title (50-80 characters)",
  "description": "Detailed course description that sells the course (200-300 characters)",
  "learningOutcomes": [
    "Specific skill or knowledge student will gain (4-6 outcomes)",
    "Use action verbs like: Build, Create, Implement, Master, Understand"
  ],
  "prerequisites": [
    "Required knowledge or skills (2-3 items)",
    "Be realistic about what students need to know"
  ],
  "requirements": [
    "Tools, software, or resources needed (2-3 items)"
  ],
  "suggestedDuration": "Estimated hours needed (number only, 10-100)",
  "suggestedPrice": "Market price in INR (number only, 999-9999)",
  "courseOutline": [
    {
      "module": "Module 1: Introduction",
      "topics": ["Topic 1", "Topic 2", "Topic 3"]
    },
    {
      "module": "Module 2: Core Concepts",
      "topics": ["Topic 1", "Topic 2", "Topic 3"]
    },
    "Continue with 4-6 modules total"
  ]
}

Make it professional, realistic, and marketable. The course should provide real value.`;

    const response = await ai.models.generateContent({
      model: "models/gemini-2.5-flash",
      contents: prompt,
    });

    let text = response.text;

    // Clean up the response (remove markdown formatting)
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Parse JSON
    const courseData = JSON.parse(text);

    return {
      success: true,
      data: courseData,
    };
  } catch (error) {
    console.error('AI Generation Error:', error);
    return {
      success: false,
      message: 'Failed to generate course content',
      error: error.message,
    };
  }
};


const generateDescription = async (title, category) => {
  try {
    const prompt = `Write a compelling course description (200-250 characters) for an online course titled "${title}" in the ${category} category. Make it professional and engaging. Only return the description text, nothing else.`;

    const response = await ai.models.generateContent({
      model: "models/gemini-2.5-flash",
      contents: prompt,
    });

    const description = response.text.trim();

    return {
      success: true,
      data: description,
    };
  } catch (error) {
    console.error('AI Generation Error:', error);
    return {
      success: false,
      message: 'Failed to generate description',
      error: error.message,
    };
  }
};


const generateLearningOutcomes = async (title, level) => {
  try {
    const prompt = `Generate 5 specific learning outcomes for a ${level} level course titled "${title}". 
    
Return as JSON array ONLY, no markdown:
["outcome 1", "outcome 2", "outcome 3", "outcome 4", "outcome 5"]

Each outcome should:
- Start with an action verb (Build, Create, Master, Understand, Implement)
- Be specific and measurable
- Be realistic for the level`;

    const response = await ai.models.generateContent({
      model: "models/gemini-2.5-flash",
      contents: prompt,
    });

    let text = response.text.trim();

    // Clean up response
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const outcomes = JSON.parse(text);

    return {
      success: true,
      data: outcomes,
    };
  } catch (error) {
    console.error('AI Generation Error:', error);
    return {
      success: false,
      message: 'Failed to generate learning outcomes',
      error: error.message,
    };
  }
};

/**
 * Improve/enhance existing content
 */
const enhanceContent = async (content, type) => {
  try {
    let prompt = '';

    if (type === 'title') {
      prompt = `Improve this course title to make it more engaging and professional: "${content}". Return only the improved title, nothing else.`;
    } else if (type === 'description') {
      prompt = `Enhance this course description to make it more compelling and professional: "${content}". Keep it 200-250 characters. Return only the improved description, nothing else.`;
    }

    const response = await ai.models.generateContent({
      model: "models/gemini-2.5-flash",
      contents: prompt,
    });

    const enhanced = response.text.trim();

    return {
      success: true,
      data: enhanced,
    };
  } catch (error) {
    console.error('AI Enhancement Error:', error);
    return {
      success: false,
      message: 'Failed to enhance content',
      error: error.message,
    };
  }
};

module.exports = {
  generateCourseContent,
  generateDescription,
  generateLearningOutcomes,
  enhanceContent,
};