/**
 * ConfigurationForm component handles quiz setup (subject, subtopics, question count, difficulty)
 */

import { motion, AnimatePresence } from 'framer-motion';
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
  SimpleGrid,
  Textarea,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  HStack,
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
import { useState, useCallback, useEffect } from 'react';

interface ConfigurationFormProps {
  onConfigComplete: (config: {
    subject: Subject;
    subtopics: string[];
    questionCount?: number; // Optional, defaults to 15 for quiz mode
    difficulty: Difficulty;
    instructions?: string; // Optional custom instructions for AI question generation
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
  const [instructions, setInstructions] = useState<string>('');
  
  // Map difficulty levels to slider values (0-3)
  const difficultyToSliderValue = useCallback((diff: Difficulty): number => {
    const levels = Object.values(DIFFICULTY_LEVELS);
    return levels.indexOf(diff);
  }, []);
  
  const sliderValueToDifficulty = useCallback((value: number): Difficulty => {
    const levels = Object.values(DIFFICULTY_LEVELS);
    return levels[Math.max(0, Math.min(3, value))] as Difficulty;
  }, []);
  
  const [sliderValue, setSliderValue] = useState<number>(0);

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
    let finalSubtopics: string[] = [];
    let finalInstructions: string | undefined = undefined;

    if (subject === SUBJECTS.OTHER) {
      // For "Other" subject, use customSubtopic
      finalSubtopics = customSubtopic.trim() ? [customSubtopic.trim()] : [];
      finalInstructions = instructions.trim() || undefined;
    } else {
      // For regular subjects
      if (selectedSubtopics.length > 0) {
        // If subtopics are selected, use them
        finalSubtopics = selectedSubtopics;
        finalInstructions = instructions.trim() || undefined;
      } else if (instructions.trim()) {
        // If no subtopics selected but instructions provided, use instructions as subtopic
        finalSubtopics = [instructions.trim()];
        finalInstructions = undefined; // Don't duplicate in instructions field
      }
    }

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
        instructions: finalInstructions,
      });
    }
  }, [subject, selectedSubtopics, customSubtopic, questionCount, difficulty, instructions, onConfigComplete]);
  
  const handleSliderChange = useCallback((value: number) => {
    const clampedValue = Math.max(0, Math.min(3, value));
    setSliderValue(clampedValue);
    setDifficulty(sliderValueToDifficulty(clampedValue));
  }, [sliderValueToDifficulty]);
  
  // Sync slider value when difficulty changes externally
  useEffect(() => {
    setSliderValue(difficultyToSliderValue(difficulty));
  }, [difficulty, difficultyToSliderValue]);

  const questionCountNum = parseInt(questionCount, 10);
  const isValidQuestionCount =
    !isNaN(questionCountNum) &&
    questionCountNum >= QUIZ_CONSTANTS.MIN_QUESTIONS &&
    questionCountNum <= QUIZ_CONSTANTS.MAX_QUESTIONS;

  const isFormValid =
    isValidSubject(subject) &&
    (subject === SUBJECTS.OTHER
      ? customSubtopic.trim().length > 0
      : selectedSubtopics.length > 0 || instructions.trim().length > 0) &&
    isValidQuestionCount;

  const subtopics = subject ? getSubtopicsForSubject(subject) : [];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card width="100%" maxWidth="700px" margin="0 auto" boxShadow="xl" borderRadius="2xl" overflow="hidden">
        <CardBody padding={{ base: 4, md: 6 }}>
          <VStack spacing={6} align="stretch">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Heading size="lg" color="blue.600" textAlign="center">
                {MESSAGES.GREETING}
              </Heading>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <Box>
                <Text fontSize="md" fontWeight="semibold" marginBottom={2} color="gray.700">
                  {MESSAGES.SUBJECT_PROMPT}
                </Text>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Select
                    value={subject}
                    onChange={(e) => {
                      setSubject(e.target.value as Subject);
                      setSelectedSubtopics([]);
                      setCustomSubtopic('');
                    }}
                    placeholder="Select a subject"
                    size="lg"
                    borderRadius="xl"
                    borderWidth={2}
                    borderColor="blue.200"
                    _hover={{ borderColor: 'blue.400' }}
                    _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.2)' }}
                    transition="all 0.2s"
                  >
                    {Object.values(SUBJECTS).map((subj) => (
                      <option key={subj} value={subj}>
                        {subj}
                      </option>
                    ))}
                  </Select>
                </motion.div>
              </Box>
            </motion.div>

          <AnimatePresence mode="wait">
            {subject && subject !== SUBJECTS.OTHER && subtopics.length > 0 && (
              <motion.div
                key="subtopics"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              >
                <Box>
                  <Text fontSize="md" fontWeight="semibold" marginBottom={2} color="gray.700">
                    Select subtopics (you can choose multiple):
                  </Text>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Box
                      maxHeight="300px"
                      overflowY="auto"
                      padding={4}
                      borderWidth={2}
                      borderRadius="xl"
                      borderColor="blue.200"
                      bg="blue.50"
                      _hover={{ borderColor: 'blue.300' }}
                      transition="all 0.3s"
                      boxShadow="sm"
                    >
                      <CheckboxGroup value={selectedSubtopics}>
                        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={3}>
                          {subtopics.map((st, index) => (
                            <motion.div
                              key={st}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.1 + index * 0.02 }}
                              whileHover={{ scale: 1.05 }}
                            >
                              <Checkbox
                                value={st}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                  handleSubtopicToggle(st, e.target.checked)
                                }
                                size="lg"
                                colorScheme="blue"
                                _hover={{ transform: 'scale(1.02)' }}
                                transition="all 0.2s"
                                padding={2}
                                borderRadius="md"
                                borderWidth={selectedSubtopics.includes(st) ? 2 : 1}
                                borderColor={selectedSubtopics.includes(st) ? 'blue.300' : 'transparent'}
                                bg={selectedSubtopics.includes(st) ? 'blue.50' : 'transparent'}
                              >
                                <Text fontWeight="medium" fontSize="sm">{st}</Text>
                              </Checkbox>
                            </motion.div>
                          ))}
                        </SimpleGrid>
                      </CheckboxGroup>
                    </Box>
                  </motion.div>
                  <AnimatePresence>
                    {selectedSubtopics.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Text fontSize="sm" color="blue.600" marginTop={2} fontWeight="semibold">
                          ✓ Selected: {selectedSubtopics.length} subtopic(s)
                        </Text>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {subject === SUBJECTS.OTHER && (
              <motion.div
                key="custom-topic"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Box>
                  <Text fontSize="md" fontWeight="semibold" marginBottom={2} color="gray.700">
                    What topic would you like to learn about?
                  </Text>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Input
                      value={customSubtopic}
                      onChange={(e) => setCustomSubtopic(e.target.value)}
                      placeholder="e.g., Space, Animals, Computers..."
                      size="lg"
                      borderRadius="xl"
                      borderWidth={2}
                      borderColor="blue.200"
                      _hover={{ borderColor: 'blue.400' }}
                      _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.2)' }}
                      transition="all 0.2s"
                    />
                  </motion.div>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Box>
              <Text fontSize="md" fontWeight="semibold" marginBottom={4} color="gray.700">
                Choose difficulty level:
              </Text>
              <Box paddingX={2}>
                <Slider
                  value={sliderValue}
                  onChange={handleSliderChange}
                  min={0}
                  max={3}
                  step={1}
                  colorScheme="blue"
                  size="lg"
                >
                  {Object.values(DIFFICULTY_LEVELS).map((level, index) => (
                    <SliderMark
                      key={level}
                      value={index}
                      marginTop={3}
                      fontSize="xs"
                      fontWeight="semibold"
                      color={sliderValue === index ? 'blue.600' : 'gray.500'}
                    >
                      {level}
                    </SliderMark>
                  ))}
                  <SliderTrack bg="gray.200" height={3} borderRadius="full">
                    <SliderFilledTrack bg="blue.500" />
                  </SliderTrack>
                  <SliderThumb boxSize={6} borderWidth={3} borderColor="blue.400" />
                </Slider>
                <Box marginTop={6} padding={4} borderRadius="xl" bg="blue.50" borderWidth={2} borderColor="blue.200">
                  <HStack spacing={2} marginBottom={2}>
                    <Text fontWeight="bold" color="blue.700" fontSize="lg">
                      {difficulty}
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color="gray.700">
                    {difficulty === DIFFICULTY_LEVELS.BASIC && 'Simple questions, perfect for beginners'}
                    {difficulty === DIFFICULTY_LEVELS.ADVANCED && 'Longer questions (2-3 lines), more challenging'}
                    {difficulty === DIFFICULTY_LEVELS.EXPERT && 'Complex questions (2-3 lines), for advanced learners'}
                    {difficulty === DIFFICULTY_LEVELS.MIX && 'Mix of all difficulty levels'}
                  </Text>
                </Box>
              </Box>
            </Box>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <Box>
              <Text fontSize="md" fontWeight="semibold" marginBottom={2} color="gray.700">
                How many questions would you like? ({QUIZ_CONSTANTS.MIN_QUESTIONS} - {QUIZ_CONSTANTS.MAX_QUESTIONS})
              </Text>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
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
                  borderRadius="xl"
                  borderWidth={2}
                  borderColor={isValidQuestionCount ? 'blue.200' : 'gray.200'}
                  _hover={{ borderColor: isValidQuestionCount ? 'blue.400' : 'gray.400' }}
                  _focus={{ borderColor: isValidQuestionCount ? 'blue.500' : 'red.500', boxShadow: isValidQuestionCount ? '0 0 0 3px rgba(66, 153, 225, 0.2)' : '0 0 0 3px rgba(229, 62, 62, 0.2)' }}
                  transition="all 0.2s"
                />
              </motion.div>
              <AnimatePresence mode="wait">
                {questionCount && !isValidQuestionCount && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Text fontSize="sm" color="red.500" marginTop={1} fontWeight="medium">
                      ⚠️ Please enter a number between {QUIZ_CONSTANTS.MIN_QUESTIONS} and {QUIZ_CONSTANTS.MAX_QUESTIONS}
                    </Text>
                  </motion.div>
                )}
                {isValidQuestionCount && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    key="time-estimate"
                  >
                    <Text fontSize="sm" color="blue.600" marginTop={1} fontWeight="semibold">
                      ⏱️ Estimated time: {Math.ceil((questionCountNum * QUIZ_CONSTANTS.TIME_PER_QUESTION_SECONDS) / 60)} minutes
                    </Text>
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
          >
            <Box>
              <Text fontSize="md" fontWeight="semibold" marginBottom={2} color="gray.700">
                Additional Instructions {subject && subject !== SUBJECTS.OTHER && selectedSubtopics.length === 0 ? '(Enter subtopic here if not selected above)' : '(Optional)'}:
              </Text>
              <Text fontSize="sm" color="gray.600" marginBottom={2}>
                {subject && subject !== SUBJECTS.OTHER && selectedSubtopics.length === 0
                  ? 'No subtopics selected. Enter a subtopic here, or provide specific instructions for question generation.'
                  : 'Provide specific instructions for question generation (e.g., focus on practical examples, include real-world scenarios, etc.)'}
              </Text>
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <Textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g., Focus on practical examples, include real-world scenarios, emphasize problem-solving..."
                  size="md"
                  rows={4}
                  borderRadius="xl"
                  borderWidth={2}
                  borderColor="blue.200"
                  _hover={{ borderColor: 'blue.400' }}
                  _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.2)' }}
                  transition="all 0.2s"
                  resize="vertical"
                />
              </motion.div>
            </Box>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            whileHover={isFormValid ? { scale: 1.02 } : {}}
            whileTap={isFormValid ? { scale: 0.98 } : {}}
          >
            <Button
              colorScheme="blue"
              size="lg"
              onClick={handleSubmit}
              isDisabled={!isFormValid}
              width="100%"
              borderRadius="xl"
              boxShadow={isFormValid ? 'lg' : 'none'}
              _hover={isFormValid ? { boxShadow: 'xl', transform: 'translateY(-2px)' } : {}}
              _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
              transition="all 0.3s"
              fontSize="lg"
              fontWeight="bold"
              padding={6}
            >
              {isFormValid ? (
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  Start Quiz! 🎉
                </motion.span>
              ) : (
                'Start Quiz! 🎉'
              )}
            </Button>
          </motion.div>
        </VStack>
      </CardBody>
    </Card>
    </motion.div>
  );
};
