/**
 * OpenAI service for server-side AI quiz generation
 * Uses OpenAI API to generate quiz questions
 */

const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY,
});

/**
 * Generates quiz questions using OpenAI
 * @param {Object} config - Quiz configuration
 * @param {number} config.numberOfQuestions - Number of questions to generate
 * @param {string} config.difficulty - Difficulty level (Basic, Advanced, Expert, Mix)
 * @param {string[]} config.topics - Array of topic names
 * @param {string} config.ageGroup - Age group (e.g., "6-8", "9-11", "12-14")
 * @param {string} config.language - Language preference
 * @param {string} config.subtopicId - Subtopic ID for context
 * @param {string} config.description - Quiz description/context for better question generation
 * @param {string} config.gradeLevel - Optional grade/class level
 * @param {string} config.sampleQuestion - Optional sample question pattern
 * @param {string} config.examStyle - Optional exam style (CBSE, NCERT, Olympiad, competitive)
 * @returns {Promise<Array>} Array of generated questions
 */
async function generateQuizQuestions(config) {
  const {
    numberOfQuestions = 15,
    difficulty = 'Basic',
    topics = [],
    ageGroup = '6-8',
    language = 'English',
    subtopicId,
    description,
    gradeLevel,
    sampleQuestion,
    examStyle,
  } = config;

  if (!openai.apiKey) {
    throw new Error('OpenAI API key is not configured');
  }

  // Determine difficulty level
  let difficultyLevel = 'medium';
  let questionLength = 'Keep questions appropriate for the age.';

  switch (difficulty) {
    case 'Basic':
      difficultyLevel = 'easy';
      questionLength = 'Keep questions short and simple (1 line maximum).';
      break;
    case 'Advanced':
      difficultyLevel = 'moderately challenging';
      questionLength = 'Use longer, more detailed questions (2-3 lines). Include context and scenarios.';
      break;
    case 'Expert':
      difficultyLevel = 'challenging';
      questionLength = 'Use complex, multi-part questions (2-3 lines). Require deeper understanding and reasoning.';
      break;
    case 'Mix':
      difficultyLevel = 'varied - mix of easy, medium, and challenging';
      questionLength = 'Mix question lengths: some short (1 line), some longer (2-3 lines). Distribute difficulty evenly.';
      break;
  }

  const languageInstruction =
    language === 'Hindi'
      ? 'Use mostly Hindi with simple words. Use Devanagari script if possible, otherwise Roman script.'
      : language === 'English'
      ? 'Use only English.'
      : 'Mix simple Hindi and English, but keep it clear.';

  const topicsText = topics.length === 1 ? topics[0] : topics.join(', ');
  
  // Fetch subtopic description if subtopicId is provided but no description given
  let finalDescription = description;
  if (subtopicId && !finalDescription) {
    try {
      const { pool } = require('../config/database');
      const subtopicResult = await pool.query(
        'SELECT description, title FROM subtopics WHERE id = $1',
        [subtopicId]
      );
      if (subtopicResult.rows.length > 0 && subtopicResult.rows[0].description) {
        finalDescription = `${subtopicResult.rows[0].title}: ${subtopicResult.rows[0].description}`;
      }
    } catch (error) {
      console.warn('Could not fetch subtopic description:', error.message);
    }
  }
  
  // Include description in the prompt if provided
  const descriptionContext = finalDescription 
    ? `\nQuiz Context/Description: ${finalDescription}\nUse this description to understand the quiz's purpose and generate questions that align with this context.`
    : '';

  // Build additional context fields
  const gradeLevelContext = gradeLevel
    ? `Grade/Class Level: ${gradeLevel}\n`
    : '';

  const sampleQuestionContext = sampleQuestion
    ? `\nSample Question Pattern:\n${sampleQuestion}\n\nUse this as a reference for the style and format of questions to generate. Follow similar patterns, complexity, and structure.\n`
    : '';

  const examStyleContext = examStyle
    ? `Exam Style: ${examStyle}\n\nGenerate questions that align with ${examStyle} exam standards and patterns. For CBSE, follow CBSE curriculum and question formats. For NCERT, align with NCERT textbook style. For Olympiad, include more challenging and analytical questions. For competitive exams, focus on application-based and reasoning questions.\n`
    : '';

  // Add timestamp for context
  const currentTimestamp = new Date().toISOString();
  const timestampContext = `Generation Date/Time: ${currentTimestamp}\n\nUse current date context when generating questions, especially for subjects like Current Affairs or recent events.\n`;

  const prompt = `Generate ${numberOfQuestions} educational quiz questions for children aged ${ageGroup} years.

Topics: ${topicsText}${descriptionContext}
Difficulty: ${difficultyLevel}
Language: ${languageInstruction}
Question Style: ${questionLength}
${gradeLevelContext}${examStyleContext}${timestampContext}
${sampleQuestionContext}
Requirements:
- Each question must have exactly 4 options (A, B, C, D)
- Questions should be age-appropriate and educational
- Include clear explanations for each answer
- Make questions engaging and relevant to the topics${description ? ' and aligned with the quiz description/context provided above' : ''}

Return ONLY a valid JSON array with this exact structure:
[
  {
    "number": 1,
    "question": "Question text here",
    "options": {
      "A": "Option A text",
      "B": "Option B text",
      "C": "Option C text",
      "D": "Option D text"
    },
    "correctAnswer": "A",
    "explanation": "Detailed explanation (3-5 sentences) that clearly explains why this answer is correct, why other options are wrong, provides additional context, and helps the student understand the concept better."
  },
  ...
]

Return exactly ${numberOfQuestions} questions.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that generates educational quiz questions for children. Always return valid JSON arrays.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI API');
    }

    // Extract JSON from markdown code blocks if present
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    const jsonString = jsonMatch ? jsonMatch[0] : content;

    const questions = JSON.parse(jsonString);

    // Validate response
    if (!Array.isArray(questions) || questions.length !== numberOfQuestions) {
      throw new Error(
        `Invalid response: Expected ${numberOfQuestions} questions, got ${questions.length}`
      );
    }

    // Validate each question structure
    for (const question of questions) {
      if (
        !question.number ||
        !question.question ||
        !question.options ||
        !question.correctAnswer ||
        !question.explanation
      ) {
        throw new Error('Invalid question structure in API response');
      }

      if (
        !['A', 'B', 'C', 'D'].includes(question.correctAnswer) ||
        !question.options.A ||
        !question.options.B ||
        !question.options.C ||
        !question.options.D
      ) {
        throw new Error('Invalid options or correct answer in question');
      }
    }

    return questions;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Failed to parse quiz questions. Please try again.');
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred while generating quiz questions');
  }
}

module.exports = { generateQuizQuestions };

