/**
 * CSV parsing utilities for quiz upload
 */

/**
 * Maximum lines allowed in uploaded files
 */
export const MAX_LINES = 300;

/**
 * Parse CSV line handling quoted values with commas
 */
export const parseCSVLine = (line: string): string[] => {
  const values: string[] = [];
  let currentValue = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        currentValue += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      values.push(currentValue.trim());
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  
  // Add last value
  values.push(currentValue.trim());
  return values;
};

/**
 * Parse CSV file and convert to JSON format
 */
export const parseCSV = (csvText: string): any[] => {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length < 2) {
    throw new Error('CSV file must have at least a header row and one data row');
  }

  // Parse header row
  const headers = parseCSVLine(lines[0]).map(h => h.replace(/^"|"$/g, '').trim());
  
  // Expected CSV columns: question, optionA, optionB, optionC, optionD, correctAnswer, explanation, hint, questionType, points
  const questions: any[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]).map(v => v.replace(/^"|"$/g, '').trim());

    const question: any = {};
    
    // Map CSV columns to question object
    headers.forEach((header, index) => {
      const value = values[index] || '';
      const lowerHeader = header.toLowerCase();
      
      if (lowerHeader === 'question' || lowerHeader === 'questiontext') {
        question.question = value;
      } else if (lowerHeader === 'questiontype' || lowerHeader === 'type') {
        question.questionType = value || 'multiple_choice';
      } else if (lowerHeader === 'correctanswer' || lowerHeader === 'correct' || lowerHeader === 'answer') {
        question.correctAnswer = value.toUpperCase();
      } else if (lowerHeader === 'explanation' || lowerHeader === 'justification') {
        question.explanation = value;
      } else if (lowerHeader === 'hint') {
        question.hint = value;
      } else if (lowerHeader === 'points') {
        question.points = parseInt(value) || 1;
      } else if (lowerHeader.startsWith('option')) {
        // Handle options: optionA, optionB, optionC, optionD, etc.
        if (!question.options) {
          question.options = {};
        }
        const optionKey = header.replace(/^option/i, '').toUpperCase();
        question.options[optionKey] = value;
      }
    });

    // Ensure required fields
    if (!question.question) {
      throw new Error(`Row ${i + 1}: Missing question field`);
    }
    
    if (!question.correctAnswer) {
      throw new Error(`Row ${i + 1}: Missing correctAnswer field`);
    }

    // Build options object if individual option columns exist
    if (!question.options || Object.keys(question.options).length === 0) {
      // Try to find option columns
      const optionKeys = ['A', 'B', 'C', 'D', 'E', 'F'];
      question.options = {};
      optionKeys.forEach(key => {
        const optionIndex = headers.findIndex(h => h.toLowerCase() === `option${key.toLowerCase()}`);
        if (optionIndex >= 0 && values[optionIndex]) {
          question.options[key] = values[optionIndex];
        }
      });
    }

    questions.push(question);
  }

  return questions;
};

/**
 * Count lines in file content
 */
export const countLines = (content: string): number => {
  return content.split('\n').filter(line => line.trim()).length;
};

/**
 * Handle file upload (CSV or JSON)
 */
export const handleFileUpload = async (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const fileName = file.name.toLowerCase();
        
        // Validate line count
        const lineCount = countLines(content);
        if (lineCount > MAX_LINES) {
          reject(new Error(`File exceeds maximum limit of ${MAX_LINES} lines. Current file has ${lineCount} lines.`));
          return;
        }
        
        if (fileName.endsWith('.csv')) {
          // Parse CSV
          const questions = parseCSV(content);
          resolve(questions);
        } else if (fileName.endsWith('.json')) {
          // Parse JSON
          const questions = JSON.parse(content);
          if (!Array.isArray(questions)) {
            reject(new Error('JSON file must contain an array of questions'));
            return;
          }
          if (questions.length > MAX_LINES) {
            reject(new Error(`File exceeds maximum limit of ${MAX_LINES} questions. Current file has ${questions.length} questions.`));
            return;
          }
          resolve(questions);
        } else {
          reject(new Error('Unsupported file type. Please upload a CSV or JSON file.'));
        }
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};

