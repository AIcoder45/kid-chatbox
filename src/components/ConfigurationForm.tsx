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
  FormControl,
  FormLabel,
  FormHelperText,
  Badge,
  Divider,
} from '@/shared/design-system';
import {
  SUBJECTS,
  DIFFICULTY_LEVELS,
  HINDI_SUBTOPICS,
  ENGLISH_SUBTOPICS,
  MATHS_SUBTOPICS,
  EVS_SCIENCE_SUBTOPICS,
  SOCIAL_STUDIES_SUBTOPICS,
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
    timeLimit: number; // Required time limit in minutes (default: 10)
    gradeLevel?: string; // Optional class/grade level
    sampleQuestion?: string; // Optional sample question or pattern
    examStyle?: string; // Optional exam style (CBSE, NCERT, Olympiad, competitive)
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
  const [timeLimit, setTimeLimit] = useState<string>('10');
  const [gradeLevel, setGradeLevel] = useState<string>('');
  const [sampleQuestion, setSampleQuestion] = useState<string>('');
  const [examStyle, setExamStyle] = useState<string>('');
  
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
      case SUBJECTS.SOCIAL_STUDIES:
        return SOCIAL_STUDIES_SUBTOPICS;
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

  /**
   * Get subject-specific smart suggestions for instructions
   */
  const getSubjectSuggestions = useCallback((selectedSubject: Subject): string[] => {
    const baseSuggestions = [
      'Choose question type (MCQ, fill in the blanks, true/false)',
      'Ask for scenario-based or story-based questions',
      'Mention class/grade level',
      'Add exam style (CBSE, NCERT, Olympiad, competitive)',
      'Add Bloom\'s level (remember → create)',
    ];

    switch (selectedSubject) {
      case SUBJECTS.HINDI:
        return [
          'Focus on grammar topics (Sangya, Kriya, Visheshan, etc.)',
          'Include reading comprehension passages',
          'Add poetry (Kavita) questions',
          'Include story (Kahani) based questions',
          'Focus on vocabulary (Shabd Rachna)',
          'Add Muhavare / Lokoktiyan questions',
          ...baseSuggestions,
        ];
      case SUBJECTS.ENGLISH:
        return [
          'Focus on grammar (nouns, verbs, tenses, punctuation)',
          'Include reading comprehension',
          'Add vocabulary and spelling questions',
          'Include creative writing prompts',
          'Focus on parts of speech',
          'Add sentence structure questions',
          ...baseSuggestions,
        ];
      case SUBJECTS.MATHS:
        return [
          'Focus on problem-solving techniques',
          'Include word problems',
          'Add step-by-step solution questions',
          'Focus on specific topics (addition, multiplication, fractions, etc.)',
          'Include real-world application problems',
          'Add mental math questions',
          ...baseSuggestions,
        ];
      case SUBJECTS.EVS_SCIENCE:
        return [
          'Focus on environmental awareness',
          'Include science experiments and observations',
          'Add questions about plants, animals, and nature',
          'Focus on health and hygiene',
          'Include questions about seasons and weather',
          'Add questions about our body and senses',
          ...baseSuggestions,
        ];
      case SUBJECTS.SOCIAL_STUDIES:
        return [
          'Focus on Indian history and freedom struggle',
          'Include geography (rivers, mountains, states)',
          'Add civics and government questions',
          'Include Indian Constitution basics',
          'Focus on culture, traditions, and festivals',
          'Add questions on monuments and heritage',
          'Include natural resources and agriculture',
          'Add transportation and communication topics',
          ...baseSuggestions,
        ];
      case SUBJECTS.GENERAL_KNOWLEDGE:
        return [
          'Focus on current events',
          'Include questions about India and world',
          'Add questions about famous personalities',
          'Focus on history and geography',
          'Include questions about sports and games',
          'Add questions about festivals and culture',
          ...baseSuggestions,
        ];
      case SUBJECTS.CURRENT_AFFAIRS:
        return [
          'Focus on recent news (last 1-2 years)',
          'Include questions about recent sports events',
          'Add questions about science discoveries',
          'Focus on space missions and achievements',
          'Include questions about awards and honors',
          'Add questions about recent developments',
          ...baseSuggestions,
        ];
      case SUBJECTS.CHESS:
        return [
          'Focus on chess strategies and tactics',
          'Include board position questions',
          'Add questions about chess notation',
          'Focus on opening principles',
          'Include endgame scenarios',
          'Add questions about famous chess games',
          ...baseSuggestions,
        ];
      default:
        return baseSuggestions;
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
      // Time limit is mandatory, default to 10 if not provided or invalid
      const timeLimitNum = timeLimit.trim() ? parseInt(timeLimit, 10) : 10;
      const finalTimeLimit = !isNaN(timeLimitNum) && timeLimitNum > 0 ? timeLimitNum : 10;
      
      onConfigComplete({
        subject,
        subtopics: finalSubtopics,
        questionCount: questionCountNum,
        difficulty,
        instructions: finalInstructions,
        timeLimit: finalTimeLimit,
        gradeLevel: gradeLevel.trim() || undefined,
        sampleQuestion: sampleQuestion.trim() || undefined,
        examStyle: examStyle.trim() || undefined,
      });
    }
  }, [subject, selectedSubtopics, customSubtopic, questionCount, difficulty, instructions, timeLimit, gradeLevel, sampleQuestion, examStyle, onConfigComplete]);
  
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

  const timeLimitNum = parseInt(timeLimit, 10);
  const isValidTimeLimit = !isNaN(timeLimitNum) && timeLimitNum > 0;

  const isFormValid =
    isValidSubject(subject) &&
    (subject === SUBJECTS.OTHER
      ? customSubtopic.trim().length > 0
      : selectedSubtopics.length > 0 || instructions.trim().length > 0) &&
    isValidQuestionCount &&
    isValidTimeLimit;

  const subtopics = subject ? getSubtopicsForSubject(subject) : [];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card width="100%" maxWidth="1200px" margin="0 auto" boxShadow="xl" borderRadius="2xl" overflow="hidden">
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
                          {subtopics.map((st, index) => {
                            const isSelected = selectedSubtopics.includes(st);
                            return (
                              <motion.div
                                key={st}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 + index * 0.02 }}
                                whileHover={{ scale: 1.02 }}
                              >
                                <Box
                                  as="label"
                                  display="flex"
                                  alignItems="center"
                                  cursor="pointer"
                                  padding={3}
                                  borderRadius="md"
                                  borderWidth={isSelected ? 2 : 1}
                                  borderColor={isSelected ? 'blue.400' : 'gray.300'}
                                  bg={isSelected ? 'blue.50' : 'white'}
                                  _hover={{
                                    borderColor: isSelected ? 'blue.500' : 'blue.300',
                                    bg: isSelected ? 'blue.100' : 'blue.50',
                                  }}
                                  transition="all 0.2s"
                                  width="100%"
                                >
                                  <Checkbox
                                    value={st}
                                    isChecked={isSelected}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                      handleSubtopicToggle(st, e.target.checked)
                                    }
                                    size="lg"
                                    colorScheme="blue"
                                    marginRight={3}
                                    flexShrink={0}
                                    sx={{
                                      '& .chakra-checkbox__control': {
                                        borderWidth: '2px',
                                        borderColor: isSelected ? 'blue.500' : 'gray.400',
                                        _checked: {
                                          bg: 'blue.500',
                                          borderColor: 'blue.500',
                                        },
                                      },
                                    }}
                                  />
                                  <Text
                                    fontWeight="medium"
                                    fontSize="sm"
                                    color={isSelected ? 'blue.700' : 'gray.700'}
                                    flex={1}
                                    userSelect="none"
                                  >
                                    {st}
                                  </Text>
                                </Box>
                              </motion.div>
                            );
                          })}
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

          {/* Number of Questions and Time Limit - Two Column Layout */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {/* Number of Questions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <FormControl>
                <FormLabel fontSize="md" fontWeight="semibold" color="gray.700">
                  Number of Questions
                </FormLabel>
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
                <FormHelperText fontSize="sm" color="gray.600" marginTop={1}>
                  You can generate up to 40 questions at a time.
                </FormHelperText>
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
              </FormControl>
            </motion.div>

            {/* Time Limit */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.4 }}
            >
              <FormControl isRequired>
                <FormLabel fontSize="md" fontWeight="semibold" color="gray.700">
                  Time Limit (in minutes) <Text as="span" color="red.500">*</Text>
                </FormLabel>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Input
                    type="number"
                    value={timeLimit}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || (!isNaN(parseInt(value, 10)) && parseInt(value, 10) > 0)) {
                        setTimeLimit(value);
                      }
                    }}
                    placeholder="10"
                    size="lg"
                    min={1}
                    borderRadius="xl"
                    borderWidth={2}
                    borderColor={isValidTimeLimit ? 'blue.200' : 'red.300'}
                    _hover={{ borderColor: isValidTimeLimit ? 'blue.400' : 'red.400' }}
                    _focus={{ 
                      borderColor: isValidTimeLimit ? 'blue.500' : 'red.500', 
                      boxShadow: isValidTimeLimit ? '0 0 0 3px rgba(66, 153, 225, 0.2)' : '0 0 0 3px rgba(229, 62, 62, 0.2)' 
                    }}
                    transition="all 0.2s"
                  />
                </motion.div>
                <FormHelperText fontSize="sm" color="gray.600" marginTop={1}>
                  Set quiz duration in minutes (default: 10 minutes).
                </FormHelperText>
                <AnimatePresence mode="wait">
                  {timeLimit && !isValidTimeLimit && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Text fontSize="sm" color="red.500" marginTop={1} fontWeight="medium">
                        ⚠️ Please enter a valid time limit (minimum 1 minute)
                      </Text>
                    </motion.div>
                  )}
                </AnimatePresence>
              </FormControl>
            </motion.div>
          </SimpleGrid>

          {/* Instructions / Custom Prompt */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
          >
            <FormControl>
              <FormLabel fontSize="md" fontWeight="semibold" color="gray.700">
                Instructions / Custom Prompt {subject && subject !== SUBJECTS.OTHER && selectedSubtopics.length === 0 ? '(Enter subtopic here if not selected above)' : '(Optional)'}
              </FormLabel>
              <Text fontSize="sm" color="gray.600" marginBottom={3}>
                {subject && subject !== SUBJECTS.OTHER && selectedSubtopics.length === 0
                  ? 'No subtopics selected. Enter a subtopic here, or provide specific instructions for question generation.'
                  : 'Provide specific instructions for question generation. Examples: MCQ, lengthy questions, tricky questions, scenario-based, fill in the blanks, true/false, and more. Use the suggestions below as guidance.'}
              </Text>
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <Textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g., Generate MCQ questions, create lengthy questions, include tricky questions, add scenario-based questions, fill in the blanks, true/false questions, problem-solving questions, application-based questions, and more..."
                  size="md"
                  rows={5}
                  borderRadius="xl"
                  borderWidth={2}
                  borderColor="blue.200"
                  _hover={{ borderColor: 'blue.400' }}
                  _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.2)' }}
                  transition="all 0.2s"
                  resize="vertical"
                />
              </motion.div>
              
              {/* Smart Suggestions - Only show if subject is selected */}
              {subject && subject !== SUBJECTS.OTHER && (
                <Box marginTop={3} padding={4} bg="blue.50" borderRadius="lg" borderWidth={1} borderColor="blue.200">
                  <Text fontSize="sm" fontWeight="semibold" color="blue.800" marginBottom={3}>
                    💡 Smart Suggestions for {subject} (click to add):
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={2}>
                    {getSubjectSuggestions(subject).map((suggestion, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Badge
                        as="button"
                        onClick={() => {
                          const currentText = instructions.trim();
                          const newText = currentText
                            ? `${currentText}\n• ${suggestion}`
                            : `• ${suggestion}`;
                          setInstructions(newText);
                        }}
                        colorScheme="blue"
                        variant="outline"
                        padding={2}
                        borderRadius="md"
                        cursor="pointer"
                        fontSize="xs"
                        whiteSpace="normal"
                        textAlign="left"
                        width="100%"
                        _hover={{ bg: 'blue.100', borderColor: 'blue.400' }}
                        transition="all 0.2s"
                      >
                        {suggestion}
                      </Badge>
                    </motion.div>
                    ))}
                  </SimpleGrid>
                </Box>
              )}
            </FormControl>
          </motion.div>

          {/* Additional Optional Fields - Two Column Layout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.4 }}
          >
            <Divider marginY={4} />
            <Box>
              <Text fontSize="lg" fontWeight="bold" color="gray.700" marginBottom={4}>
                Additional Options
              </Text>
              
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {/* Class/Grade Level */}
                <FormControl>
                  <FormLabel fontSize="md" fontWeight="semibold" color="gray.700">
                    Class/Grade Level
                  </FormLabel>
                  <Select
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    placeholder="Select class/grade (optional)"
                    size="lg"
                    borderRadius="xl"
                    borderWidth={2}
                    borderColor="blue.200"
                    _hover={{ borderColor: 'blue.400' }}
                    _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.2)' }}
                    transition="all 0.2s"
                  >
                    <option value="Class 1">Class 1</option>
                    <option value="Class 2">Class 2</option>
                    <option value="Class 3">Class 3</option>
                    <option value="Class 4">Class 4</option>
                    <option value="Class 5">Class 5</option>
                    <option value="Class 6">Class 6</option>
                    <option value="Class 7">Class 7</option>
                    <option value="Class 8">Class 8</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                  </Select>
                  <FormHelperText fontSize="sm" color="gray.600" marginTop={1}>
                    Specify the target class/grade level (optional)
                  </FormHelperText>
                </FormControl>

                {/* Exam Style */}
                <FormControl>
                  <FormLabel fontSize="md" fontWeight="semibold" color="gray.700">
                    Exam Style
                  </FormLabel>
                  <Select
                    value={examStyle}
                    onChange={(e) => setExamStyle(e.target.value)}
                    placeholder="Select exam style (optional)"
                    size="lg"
                    borderRadius="xl"
                    borderWidth={2}
                    borderColor="blue.200"
                    _hover={{ borderColor: 'blue.400' }}
                    _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.2)' }}
                    transition="all 0.2s"
                  >
                    <option value="CBSE">CBSE</option>
                    <option value="NCERT">NCERT</option>
                    <option value="Olympiad">Olympiad</option>
                    <option value="Competitive">Competitive</option>
                    <option value="State Board">State Board</option>
                    <option value="ICSE">ICSE</option>
                  </Select>
                  <FormHelperText fontSize="sm" color="gray.600" marginTop={1}>
                    Choose exam style format (optional)
                  </FormHelperText>
                </FormControl>
              </SimpleGrid>

              {/* Sample Question or Pattern - Full Width */}
              <FormControl marginTop={6}>
                <FormLabel fontSize="md" fontWeight="semibold" color="gray.700">
                  Sample Question or Pattern
                </FormLabel>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <Textarea
                    value={sampleQuestion}
                    onChange={(e) => setSampleQuestion(e.target.value)}
                    placeholder="e.g., What is the capital of India? (A) Mumbai (B) Delhi (C) Kolkata (D) Chennai"
                    size="md"
                    rows={3}
                    borderRadius="xl"
                    borderWidth={2}
                    borderColor="blue.200"
                    _hover={{ borderColor: 'blue.400' }}
                    _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.2)' }}
                    transition="all 0.2s"
                    resize="vertical"
                  />
                </motion.div>
                <FormHelperText fontSize="sm" color="gray.600" marginTop={1}>
                  Provide a sample question or pattern to guide question generation (optional)
                </FormHelperText>
              </FormControl>
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
