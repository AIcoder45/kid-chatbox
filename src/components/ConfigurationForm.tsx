/**
 * ConfigurationForm component handles quiz setup (subject, subtopics, question count, difficulty)
 */

import {
  Box,
  VStack,
  Text,
  Input,
  Button,
  Card,
  CardBody,
  Heading,
  Checkbox,
  CheckboxGroup,
  Select,
  Radio,
  RadioGroup,
  Stack,
} from '@/shared/design-system';
import {
  SUBJECTS,
  DIFFICULTY_LEVELS,
  HINDI_SUBTOPICS,
  ENGLISH_SUBTOPICS,
  MATHS_SUBTOPICS,
  EVS_SCIENCE_SUBTOPICS,
  GENERAL_KNOWLEDGE_SUBTOPICS,
  CURRENT_AFFAIRS_SUBTOPICS,
  CHESS_SUBTOPICS,
  MESSAGES,
  QUIZ_CONSTANTS,
} from '@/constants/quiz';
import { Subject, Difficulty } from '@/types/quiz';
import { isValidSubject } from '@/utils/validation';
import { useState, useCallback } from 'react';

interface ConfigurationFormProps {
  onConfigComplete: (config: {
    subject: Subject;
    subtopics: string[];
    questionCount?: number; // Optional, defaults to 15 for quiz mode
    difficulty: Difficulty;
  }) => void;
}

/**
 * Form component for collecting quiz configuration from the user
 * @param onConfigComplete - Callback when configuration is complete
 */
export const ConfigurationForm: React.FC<ConfigurationFormProps> = ({
  onConfigComplete,
}) => {
  const [subject, setSubject] = useState<Subject | ''>('');
  const [selectedSubtopics, setSelectedSubtopics] = useState<string[]>([]);
  const [customSubtopic, setCustomSubtopic] = useState<string>('');
  const [questionCount, setQuestionCount] = useState<string>(
    QUIZ_CONSTANTS.DEFAULT_QUESTIONS.toString()
  );
  const [difficulty, setDifficulty] = useState<Difficulty>(DIFFICULTY_LEVELS.BASIC);

  const getSubtopicsForSubject = useCallback((selectedSubject: Subject): readonly string[] => {
    switch (selectedSubject) {
      case SUBJECTS.HINDI:
        return HINDI_SUBTOPICS;
      case SUBJECTS.ENGLISH:
        return ENGLISH_SUBTOPICS;
      case SUBJECTS.MATHS:
        return MATHS_SUBTOPICS;
      case SUBJECTS.EVS_SCIENCE:
        return EVS_SCIENCE_SUBTOPICS;
      case SUBJECTS.GENERAL_KNOWLEDGE:
        return GENERAL_KNOWLEDGE_SUBTOPICS;
      case SUBJECTS.CURRENT_AFFAIRS:
        return CURRENT_AFFAIRS_SUBTOPICS;
      case SUBJECTS.CHESS:
        return CHESS_SUBTOPICS;
      default:
        return [];
    }
  }, []);

  const handleSubtopicToggle = useCallback((subtopic: string, isChecked: boolean) => {
    setSelectedSubtopics((prev) => {
      if (isChecked) {
        return [...prev, subtopic];
      }
      return prev.filter((s) => s !== subtopic);
    });
  }, []);

  const handleSubmit = useCallback(() => {
    const questionCountNum = parseInt(questionCount, 10);
    const finalSubtopics =
      subject === SUBJECTS.OTHER
        ? customSubtopic.trim()
          ? [customSubtopic.trim()]
          : []
        : selectedSubtopics;

    if (
      isValidSubject(subject) &&
      finalSubtopics.length > 0 &&
      questionCountNum >= QUIZ_CONSTANTS.MIN_QUESTIONS &&
      questionCountNum <= QUIZ_CONSTANTS.MAX_QUESTIONS
    ) {
      onConfigComplete({
        subject,
        subtopics: finalSubtopics,
        questionCount: questionCountNum,
        difficulty,
      });
    }
  }, [subject, selectedSubtopics, customSubtopic, questionCount, difficulty, onConfigComplete]);

  const questionCountNum = parseInt(questionCount, 10);
  const isValidQuestionCount =
    !isNaN(questionCountNum) &&
    questionCountNum >= QUIZ_CONSTANTS.MIN_QUESTIONS &&
    questionCountNum <= QUIZ_CONSTANTS.MAX_QUESTIONS;

  const isFormValid =
    isValidSubject(subject) &&
    (subject === SUBJECTS.OTHER
      ? customSubtopic.trim().length > 0
      : selectedSubtopics.length > 0) &&
    isValidQuestionCount;

  const subtopics = subject ? getSubtopicsForSubject(subject) : [];

  return (
    <Card width="100%" maxWidth="700px" margin="0 auto">
      <CardBody>
        <VStack spacing={6} align="stretch">
          <Heading size="lg" color="blue.600" textAlign="center">
            {MESSAGES.GREETING}
          </Heading>

          <Box>
            <Text fontSize="md" fontWeight="semibold" marginBottom={2}>
              {MESSAGES.SUBJECT_PROMPT}
            </Text>
            <Select
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value as Subject);
                setSelectedSubtopics([]);
                setCustomSubtopic('');
              }}
              placeholder="Select a subject"
              size="lg"
            >
              {Object.values(SUBJECTS).map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </Select>
          </Box>

          {subject && subject !== SUBJECTS.OTHER && subtopics.length > 0 && (
            <Box>
              <Text fontSize="md" fontWeight="semibold" marginBottom={2}>
                Select subtopics (you can choose multiple):
              </Text>
              <Box
                maxHeight="300px"
                overflowY="auto"
                padding={4}
                borderWidth={1}
                borderRadius="md"
                borderColor="gray.200"
                bg="gray.50"
              >
                <CheckboxGroup value={selectedSubtopics}>
                  <Stack direction="column" spacing={2}>
                    {subtopics.map((st) => (
                      <Checkbox
                        key={st}
                        value={st}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleSubtopicToggle(st, e.target.checked)
                        }
                        size="lg"
                      >
                        {st}
                      </Checkbox>
                    ))}
                  </Stack>
                </CheckboxGroup>
              </Box>
              {selectedSubtopics.length > 0 && (
                <Text fontSize="sm" color="blue.600" marginTop={2}>
                  Selected: {selectedSubtopics.length} subtopic(s)
                </Text>
              )}
            </Box>
          )}

          {subject === SUBJECTS.OTHER && (
            <Box>
              <Text fontSize="md" fontWeight="semibold" marginBottom={2}>
                What topic would you like to learn about?
              </Text>
              <Input
                value={customSubtopic}
                onChange={(e) => setCustomSubtopic(e.target.value)}
                placeholder="e.g., Space, Animals, Computers..."
                size="lg"
              />
            </Box>
          )}

          <Box>
            <Text fontSize="md" fontWeight="semibold" marginBottom={2}>
              Choose difficulty level:
            </Text>
            <RadioGroup value={difficulty} onChange={(value) => setDifficulty(value as Difficulty)}>
              <Stack direction="column" spacing={2}>
                {Object.values(DIFFICULTY_LEVELS).map((level) => (
                  <Radio key={level} value={level} size="lg">
                    <Box>
                      <Text fontWeight="semibold">{level}</Text>
                      {level === DIFFICULTY_LEVELS.BASIC && (
                        <Text fontSize="sm" color="gray.600">
                          Simple questions, perfect for beginners
                        </Text>
                      )}
                      {level === DIFFICULTY_LEVELS.ADVANCED && (
                        <Text fontSize="sm" color="gray.600">
                          Longer questions (2-3 lines), more challenging
                        </Text>
                      )}
                      {level === DIFFICULTY_LEVELS.EXPERT && (
                        <Text fontSize="sm" color="gray.600">
                          Complex questions (2-3 lines), for advanced learners
                        </Text>
                      )}
                      {level === DIFFICULTY_LEVELS.MIX && (
                        <Text fontSize="sm" color="gray.600">
                          Mix of all difficulty levels
                        </Text>
                      )}
                    </Box>
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
          </Box>

          <Box>
            <Text fontSize="md" fontWeight="semibold" marginBottom={2}>
              How many questions would you like? ({QUIZ_CONSTANTS.MIN_QUESTIONS} - {QUIZ_CONSTANTS.MAX_QUESTIONS})
            </Text>
            <Input
              type="number"
              value={questionCount}
              onChange={(e) => {
                const value = e.target.value;
                // Allow empty string for better UX
                if (value === '') {
                  setQuestionCount('');
                  return;
                }
                const num = parseInt(value, 10);
                if (!isNaN(num)) {
                  // Clamp value between min and max
                  const clamped = Math.max(
                    QUIZ_CONSTANTS.MIN_QUESTIONS,
                    Math.min(QUIZ_CONSTANTS.MAX_QUESTIONS, num)
                  );
                  setQuestionCount(clamped.toString());
                }
              }}
              placeholder={`Default: ${QUIZ_CONSTANTS.DEFAULT_QUESTIONS}`}
              size="lg"
              min={QUIZ_CONSTANTS.MIN_QUESTIONS}
              max={QUIZ_CONSTANTS.MAX_QUESTIONS}
            />
            {questionCount && !isValidQuestionCount && (
              <Text fontSize="sm" color="red.500" marginTop={1}>
                Please enter a number between {QUIZ_CONSTANTS.MIN_QUESTIONS} and {QUIZ_CONSTANTS.MAX_QUESTIONS}
              </Text>
            )}
            {isValidQuestionCount && (
              <Text fontSize="sm" color="blue.600" marginTop={1}>
                Estimated time: {Math.ceil((questionCountNum * QUIZ_CONSTANTS.TIME_PER_QUESTION_SECONDS) / 60)} minutes
              </Text>
            )}
          </Box>

          <Button
            colorScheme="blue"
            size="lg"
            onClick={handleSubmit}
            isDisabled={!isFormValid}
            width="100%"
          >
            Start Quiz! 🎉
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
};
