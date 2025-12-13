/**
 * File template generators for quiz upload
 */

/**
 * Generate JSON template for quiz questions
 */
export const generateJSONTemplate = () => {
  return [
    {
      question: 'What is 2 + 2?',
      questionType: 'multiple_choice',
      options: {
        A: '3',
        B: '4',
        C: '5',
        D: '6',
      },
      correctAnswer: 'B',
      explanation: '2 + 2 equals 4. This is basic addition.',
      justification: 'The sum of two and two is four.',
      hint: 'Think about counting: 2, then 2 more',
      points: 1,
    },
    {
      question: 'Which planet is closest to the Sun?',
      questionType: 'multiple_choice',
      options: {
        A: 'Venus',
        B: 'Mercury',
        C: 'Earth',
        D: 'Mars',
      },
      correctAnswer: 'B',
      explanation: 'Mercury is the closest planet to the Sun in our solar system.',
      justification: 'Mercury orbits closest to the Sun.',
      points: 1,
    },
  ];
};

/**
 * Generate CSV template for quiz questions
 */
export const generateCSVTemplate = () => {
  return `question,optionA,optionB,optionC,optionD,correctAnswer,explanation,hint,questionType,points
"What is 2 + 2?",3,4,5,6,B,"2 + 2 equals 4. This is basic addition.","Think about counting: 2, then 2 more",multiple_choice,1
"Which planet is closest to the Sun?",Venus,Mercury,Earth,Mars,B,"Mercury is the closest planet to the Sun in our solar system.",,multiple_choice,1`;
};

/**
 * Download JSON template file
 */
export const downloadJSONTemplate = () => {
  const template = generateJSONTemplate();
  const jsonString = JSON.stringify(template, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'quiz-template.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Download CSV template file
 */
export const downloadCSVTemplate = () => {
  const csvContent = generateCSVTemplate();
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'quiz-template.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

