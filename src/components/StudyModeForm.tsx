/**
 * StudyModeForm component - Simplified form for study mode topic selection
 * Focuses on Class 3 topics with kid-friendly interface
 */

import {
  VStack,
  Text,
  Input,
  Button,
  Card,
  CardBody,
  Heading,
  Select,
  FormControl,
  FormLabel,
} from '@/shared/design-system';
import { SUBJECTS } from '@/constants/quiz';
import { Subject } from '@/types/quiz';
import { useState, useCallback } from 'react';
import { STUDY_MODE_MESSAGES } from '@/constants/study';
import { isValidSubject } from '@/utils/validation';

interface StudyModeFormProps {
  onTopicSubmit: (config: {
    subject: Subject;
    topic: string;
    difficulty: string;
  }) => void;
  userGrade?: string;
  userAge?: number;
}

/**
 * Simplified form for study mode that allows kids to enter topics related to Class 3
 * @param onTopicSubmit - Callback when topic is submitted
 * @param userGrade - User's grade/class for display
 * @param userAge - User's age for personalization
 */
export const StudyModeForm: React.FC<StudyModeFormProps> = ({
  onTopicSubmit,
  userGrade,
  userAge,
}) => {
  const [subject, setSubject] = useState<Subject | ''>('');
  const [topic, setTopic] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('Basic');

  const handleSubmit = useCallback(() => {
    const trimmedTopic = topic.trim();
    if (isValidSubject(subject) && trimmedTopic.length > 0) {
      onTopicSubmit({
        subject,
        topic: trimmedTopic,
        difficulty,
      });
    }
  }, [subject, topic, difficulty, onTopicSubmit]);

  const isFormValid = isValidSubject(subject) && topic.trim().length > 0;

  const displayGrade = userGrade || (userAge ? `Class ${Math.floor(userAge / 2) + 1}` : 'Class 3');

  return (
    <Card width="100%" maxWidth="700px" margin="0 auto">
      <CardBody>
        <VStack spacing={6} align="stretch">
          <VStack spacing={2} align="stretch">
            <Heading size="lg" color="blue.600" textAlign="center">
              {STUDY_MODE_MESSAGES.GREETING}
            </Heading>
            <Text fontSize="md" color="gray.600" textAlign="center">
              {STUDY_MODE_MESSAGES.SUBTITLE.replace('{grade}', displayGrade)}
            </Text>
          </VStack>

          <FormControl isRequired>
            <FormLabel fontSize="md" fontWeight="semibold">
              {STUDY_MODE_MESSAGES.SUBJECT_PROMPT}
            </FormLabel>
            <Select
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value as Subject);
                setTopic('');
              }}
              placeholder="Choose a subject"
              size="lg"
            >
              {Object.values(SUBJECTS).map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontSize="md" fontWeight="semibold">
              {STUDY_MODE_MESSAGES.TOPIC_PROMPT}
            </FormLabel>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={STUDY_MODE_MESSAGES.TOPIC_PLACEHOLDER}
              size="lg"
            />
            <Text fontSize="sm" color="gray.500" marginTop={2}>
              {STUDY_MODE_MESSAGES.TOPIC_HINT}
            </Text>
          </FormControl>

          <FormControl>
            <FormLabel fontSize="md" fontWeight="semibold">
              {STUDY_MODE_MESSAGES.DIFFICULTY_PROMPT}
            </FormLabel>
            <Select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              size="lg"
            >
              <option value="Basic">Basic - Simple and easy to understand</option>
              <option value="Advanced">Advanced - More detailed explanation</option>
            </Select>
          </FormControl>

          <Button
            colorScheme="blue"
            size="lg"
            onClick={handleSubmit}
            isDisabled={!isFormValid}
            width="100%"
          >
            {STUDY_MODE_MESSAGES.START_STUDYING} 📚
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
};

