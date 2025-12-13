/**
 * OpenAI service for generating quiz questions and handling AI interactions
 */

import OpenAI from 'openai';
import { QuizConfig, Question } from '@/types/quiz';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

/**
 * Validates OpenAI API key configuration
 * @throws {Error} If API key is not configured
 */
function validateApiKey(): void {
  if (!import.meta.env.VITE_OPENAI_API_KEY) {
    throw new Error(
      'OpenAI API key is not configured. Please set VITE_OPENAI_API_KEY in your .env file.'
    );
  }
}

/**
 * Generates quiz questions based on configuration
 * @param config - Quiz configuration (age, language, subject, subtopic, difficulty)
 * @returns Promise resolving to array of quiz questions
 * @throws {Error} If API call fails or returns invalid data
 */
export async function generateQuizQuestions(
  config: QuizConfig
): Promise<Question[]> {
  validateApiKey();

  // Determine difficulty based on selected level
  let difficultyLevel: string;
  let questionLength: string;
  
  switch (config.difficulty) {
    case 'Basic':
      difficultyLevel = config.age <= 8 ? 'very easy' : config.age <= 10 ? 'easy' : 'medium';
      questionLength = 'Keep questions short and simple (1 line maximum).';
      break;
    case 'Advanced':
      difficultyLevel = config.age <= 8 ? 'easy' : config.age <= 10 ? 'medium' : 'moderately challenging';
      questionLength = 'Use longer, more detailed questions (2-3 lines). Include context and scenarios.';
      break;
    case 'Expert':
      difficultyLevel = config.age <= 10 ? 'challenging' : 'advanced';
      questionLength = 'Use complex, multi-part questions (2-3 lines). Require deeper understanding and reasoning.';
      break;
    case 'Mix':
      difficultyLevel = 'varied - mix of easy, medium, and challenging';
      questionLength = 'Mix question lengths: some short (1 line), some longer (2-3 lines). Distribute difficulty evenly.';
      break;
    default:
      difficultyLevel = 'medium';
      questionLength = 'Keep questions appropriate for the age.';
  }

  const languageInstruction =
    config.language === 'Hindi'
      ? 'Use mostly Hindi with simple words. Use Devanagari script if possible, otherwise Roman script.'
      : config.language === 'English'
      ? 'Use only English.'
      : 'Mix simple Hindi and English, but keep it clear.';

  const subtopicsText =
    config.subtopics.length === 1
      ? config.subtopics[0]
      : config.subtopics.join(', ');

  const isCurrentAffairs = config.subject.toLowerCase().includes('current affairs');
  const isChess = config.subject.toLowerCase().includes('chess');
  
  let subjectSpecificGuidance = '';
  
  if (isCurrentAffairs) {
    subjectSpecificGuidance = `SPECIAL INSTRUCTIONS FOR CURRENT AFFAIRS:
- Focus on recent events and news (within the last 1-2 years)
- Questions should be about current happenings in India and around the world
- Make questions age-appropriate - avoid complex political details
- Include questions about recent sports events, science discoveries, space missions, awards, etc.
- Connect to things kids can relate to (school events, festivals, popular culture, etc.)
- Keep explanations simple and relevant to a ${config.age}-year-old`;
  } else if (isChess) {
    subjectSpecificGuidance = `SPECIAL INSTRUCTIONS FOR CHESS:
- Focus on chess strategies, tactics, and concepts appropriate for age ${config.age}
- Use chess notation (e.g., e4, Nf3) when helpful but explain in simple terms
- Include visual descriptions of board positions when relevant
- Explain chess concepts step-by-step
- Make it fun and engaging - chess is a game!
- Include examples from famous games or common patterns
- For younger kids (6-8), focus on basic moves and simple tactics
- For older kids (9-14), include more advanced strategies and combinations`;
  }

  const customInstructions = config.instructions
    ? `\nADDITIONAL INSTRUCTIONS FROM USER:\n${config.instructions}\n\nPlease incorporate these specific requirements into the question generation.`
    : '';

  // Build additional context fields
  const gradeLevelContext = config.gradeLevel
    ? `- Grade/Class Level: ${config.gradeLevel}\n`
    : '';

  const sampleQuestionContext = config.sampleQuestion
    ? `- Sample Question Pattern:\n${config.sampleQuestion}\n\nUse this as a reference for the style and format of questions to generate. Follow similar patterns, complexity, and structure.\n`
    : '';

  const examStyleContext = config.examStyle
    ? `- Exam Style: ${config.examStyle}\n\nGenerate questions that align with ${config.examStyle} exam standards and patterns. For CBSE, follow CBSE curriculum and question formats. For NCERT, align with NCERT textbook style. For Olympiad, include more challenging and analytical questions. For competitive exams, focus on application-based and reasoning questions.\n`
    : '';

  // Add timestamp for context
  const currentTimestamp = new Date().toISOString();
  const timestampContext = `- Generation Date/Time: ${currentTimestamp}\n\nUse current date context when generating questions, especially for subjects like Current Affairs or recent events.\n`;

  const prompt = `You are a friendly AI quiz tutor for kids aged ${config.age} years old.

Generate exactly ${config.questionCount} multiple-choice questions for:
- Subject: ${config.subject}
- Subtopic(s): ${subtopicsText}
- Language: ${config.language}
- Difficulty Level: ${config.difficulty} (${difficultyLevel} - appropriate for age ${config.age})
${gradeLevelContext}${examStyleContext}${timestampContext}
${languageInstruction}

${subjectSpecificGuidance}

${customInstructions}

${sampleQuestionContext}

Requirements:
1. Each question must have exactly 4 options (A, B, C, D)
2. Questions should be age-appropriate and engaging
3. ${questionLength}
4. Be positive and encouraging
5. Include one correct answer and three plausible distractors
6. Distribute questions across the selected subtopic(s) evenly
7. For Advanced and Expert levels, questions should be 2-3 lines long with more context
8. For Mix level, vary question lengths and difficulty throughout the quiz
9. EXPLANATIONS ARE CRITICAL: Each explanation must be detailed (3-5 sentences) and include:
   - Why the correct answer is right
   - Why each incorrect option is wrong
   - Additional context or examples
   - Learning tips or related concepts
   - Encouraging language appropriate for age ${config.age}

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
    "explanation": "Detailed explanation (3-5 sentences) that: 1) Clearly explains why this answer is correct, 2) Explains why other options are wrong, 3) Provides additional context or examples, 4) Helps the student understand the concept better. Make it educational and encouraging."
  },
  ...
]

Return exactly ${config.questionCount} questions.`;

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

    const questions = JSON.parse(jsonString) as Question[];

    // Validate response
    if (!Array.isArray(questions) || questions.length !== config.questionCount) {
      throw new Error(
        `Invalid response: Expected ${config.questionCount} questions, got ${questions.length}`
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
      throw new Error(
        'Failed to parse quiz questions. Please try again.'
      );
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred while generating quiz questions');
  }
}

/**
 * Generates improvement tips based on quiz results
 * @param wrongAnswers - Array of wrong answers with explanations
 * @param age - Age of the child
 * @param language - Language preference
 * @returns Promise resolving to array of improvement tips
 */
export async function generateImprovementTips(
  wrongAnswers: Array<{
    questionNumber: number;
    question: string;
    childAnswer: string;
    correctAnswer: string;
    explanation: string;
  }>,
  age: number,
  language: string
): Promise<string[]> {
  validateApiKey();

  if (wrongAnswers.length === 0) {
    return ['Great job! You answered all questions correctly! 🎉'];
  }

  const languageInstruction =
    language === 'Hindi'
      ? 'Use simple Hindi words. Be encouraging and friendly.'
      : language === 'English'
      ? 'Use simple English. Be encouraging and friendly.'
      : 'Mix simple Hindi and English. Be encouraging and friendly.';

  const prompt = `You are a friendly AI tutor helping a ${age}-year-old child improve.

The child got these questions wrong:
${wrongAnswers
  .map(
    (wa) => `
Question ${wa.questionNumber}: ${wa.question}
Child's answer: ${wa.childAnswer}
Correct answer: ${wa.correctAnswer}
Explanation: ${wa.explanation}
`
  )
  .join('\n')}

${languageInstruction}

Generate 3-5 short, encouraging improvement tips (1-2 lines each) to help the child improve.
Be positive, friendly, and use simple language appropriate for age ${age}.

Return ONLY a JSON array of strings:
["Tip 1", "Tip 2", "Tip 3", ...]`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that generates encouraging improvement tips for children. Always return valid JSON arrays.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI API');
    }

    // Extract JSON from markdown code blocks if present
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    const jsonString = jsonMatch ? jsonMatch[0] : content;

    const tips = JSON.parse(jsonString) as string[];

    if (!Array.isArray(tips) || tips.length === 0) {
      return ['Keep practicing! You are doing great! 🌟'];
    }

    return tips;
  } catch (error) {
    console.error('Error generating improvement tips:', error);
    return [
      'Keep practicing! Review the explanations and try again! 🌟',
    ];
  }
}
