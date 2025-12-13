/**
 * Topic/Subtopic Selector Component
 * Handles both manual input and selection from existing topics/subtopics
 */

import React from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Radio,
  RadioGroup,
  Stack,
  Divider,
  Text,
} from '@/shared/design-system';
import { Topic, Subtopic } from '@/services/admin';

interface TopicSubtopicSelectorProps {
  useManualInput: boolean;
  setUseManualInput: (value: boolean) => void;
  manualTopicName: string;
  setManualTopicName: (value: string) => void;
  manualSubtopicName: string;
  setManualSubtopicName: (value: string) => void;
  selectedTopic: string;
  setSelectedTopic: (value: string) => void;
  selectedSubtopic: string;
  setSelectedSubtopic: (value: string) => void;
  topics: Topic[];
  subtopics: Subtopic[];
}

export const TopicSubtopicSelector: React.FC<TopicSubtopicSelectorProps> = ({
  useManualInput,
  setUseManualInput,
  manualTopicName,
  setManualTopicName,
  manualSubtopicName,
  setManualSubtopicName,
  selectedTopic,
  setSelectedTopic,
  selectedSubtopic,
  setSelectedSubtopic,
  topics,
  subtopics,
}) => {
  return (
    <>
      <FormControl>
        <FormLabel>Topic/Subtopic Selection</FormLabel>
        <RadioGroup value={useManualInput ? 'manual' : 'select'} onChange={(value) => setUseManualInput(value === 'manual')}>
          <Stack direction="row" spacing={4}>
            <Radio value="select">Select from existing</Radio>
            <Radio value="manual">Enter manually</Radio>
          </Stack>
        </RadioGroup>
      </FormControl>

      <Divider />

      {useManualInput ? (
        <>
          <FormControl isRequired>
            <FormLabel>Topic Name</FormLabel>
            <Input
              value={manualTopicName}
              onChange={(e) => setManualTopicName(e.target.value)}
              placeholder="Enter topic name"
            />
            <Text fontSize="sm" color="gray.500" mt={1}>
              A new topic will be created if it doesn't exist
            </Text>
          </FormControl>

          <FormControl>
            <FormLabel>Subtopic Name (Optional)</FormLabel>
            <Input
              value={manualSubtopicName}
              onChange={(e) => setManualSubtopicName(e.target.value)}
              placeholder="Enter subtopic name (optional)"
            />
            <Text fontSize="sm" color="gray.500" mt={1}>
              A new subtopic will be created if it doesn't exist
            </Text>
          </FormControl>
        </>
      ) : (
        <>
          <FormControl isRequired>
            <FormLabel>Topic</FormLabel>
            <Select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              placeholder="Select topic"
            >
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.title}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Subtopic (Optional)</FormLabel>
            <Select
              value={selectedSubtopic}
              onChange={(e) => setSelectedSubtopic(e.target.value)}
              placeholder="Select subtopic (optional)"
              disabled={!selectedTopic}
            >
              <option value="">None</option>
              {subtopics.map((subtopic) => (
                <option key={subtopic.id} value={subtopic.id}>
                  {subtopic.title}
                </option>
              ))}
            </Select>
          </FormControl>
        </>
      )}
    </>
  );
};

