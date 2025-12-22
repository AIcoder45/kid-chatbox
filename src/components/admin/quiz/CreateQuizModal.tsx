/**
 * Create Quiz Modal Component
 * Handles both AI generation and JSON/CSV upload
 */

import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Textarea,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Radio,
  RadioGroup,
  Stack,
  Divider,
  Text,
  useToast,
} from '@/shared/design-system';
import { Topic, Subtopic } from '@/services/admin';
import { countLines, MAX_LINES } from './csvParsing';
import { downloadJSONTemplate, downloadCSVTemplate } from './fileTemplates';
import { TopicSubtopicSelector } from './TopicSubtopicSelector';

interface AIGenerateData {
  useManualInput: boolean;
  manualTopicName: string;
  manualSubtopicName: string;
  selectedTopic: string;
  selectedSubtopic: string;
  name: string;
  description: string;
  ageGroup: string;
  difficulty: string;
  numberOfQuestions: number;
  passingPercentage: number;
  timeLimit: string;
  topics: string[];
  language: string;
  gradeLevel?: string;
  sampleQuestion?: string;
  examStyle?: string;
}

interface JSONUploadData {
  useManualInput: boolean;
  manualTopicName: string;
  manualSubtopicName: string;
  selectedTopic: string;
  selectedSubtopic: string;
  name: string;
  description: string;
  ageGroup: string;
  difficulty: string;
  passingPercentage: number;
  timeLimit: string;
  jsonContent?: string;
  uploadMethod?: 'text' | 'file';
  uploadedFile?: File | null;
}

interface CreateQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (type: 'ai' | 'json', data: AIGenerateData | JSONUploadData) => Promise<void>;
  topics: Topic[];
  subtopics: Subtopic[];
  onTopicChange: (topicId: string) => void;
  loading: boolean;
}

export const CreateQuizModal: React.FC<CreateQuizModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  topics,
  subtopics,
  onTopicChange,
  loading,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [useManualInput, setUseManualInput] = useState(false);
  const [manualTopicName, setManualTopicName] = useState('');
  const [manualSubtopicName, setManualSubtopicName] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedSubtopic, setSelectedSubtopic] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'text' | 'file'>('file');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const toast = useToast();

  const [aiFormData, setAiFormData] = useState({
    name: '',
    description: '',
    ageGroup: '',
    difficulty: '',
    numberOfQuestions: 15,
    passingPercentage: 60,
    timeLimit: '',
    topics: [] as string[],
    language: 'English',
    gradeLevel: '',
    sampleQuestion: '',
    examStyle: '',
  });

  const [jsonFormData, setJsonFormData] = useState({
    name: '',
    description: '',
    ageGroup: '',
    difficulty: '',
    passingPercentage: 60,
    timeLimit: '',
    jsonContent: '',
  });

  useEffect(() => {
    if (selectedTopic) {
      onTopicChange(selectedTopic);
    } else {
      setSelectedSubtopic('');
    }
  }, [selectedTopic, onTopicChange]);

  const handleClose = () => {
    setUseManualInput(false);
    setManualTopicName('');
    setManualSubtopicName('');
    setSelectedTopic('');
    setSelectedSubtopic('');
    setUploadMethod('file');
    setUploadedFile(null);
    setAiFormData({
      name: '',
      description: '',
      ageGroup: '',
      difficulty: '',
      numberOfQuestions: 15,
      passingPercentage: 60,
      timeLimit: '',
      topics: [],
      language: 'English',
      gradeLevel: '',
      sampleQuestion: '',
      examStyle: '',
    });
    setJsonFormData({
      name: '',
      description: '',
      ageGroup: '',
      difficulty: '',
      passingPercentage: 60,
      timeLimit: '',
      jsonContent: '',
    });
    onClose();
  };

  const handleAIGenerate = async () => {
    if (!aiFormData.name || !aiFormData.ageGroup || !aiFormData.difficulty) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    if (useManualInput && !manualTopicName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a topic name when using manual input',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    await onCreate('ai', {
      useManualInput,
      manualTopicName,
      manualSubtopicName,
      selectedTopic,
      selectedSubtopic,
      ...aiFormData,
    });
    handleClose();
  };

  const handleJSONUpload = async () => {
    if (!jsonFormData.name || !jsonFormData.ageGroup || !jsonFormData.difficulty) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    if (uploadMethod === 'text' && !jsonFormData.jsonContent.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please provide JSON content or upload a file',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    if (uploadMethod === 'file' && !uploadedFile) {
      toast({
        title: 'Validation Error',
        description: 'Please upload a CSV or JSON file',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    if (useManualInput && !manualTopicName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a topic name when using manual input',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    await onCreate('json', {
      useManualInput,
      manualTopicName,
      manualSubtopicName,
      selectedTopic,
      selectedSubtopic,
      uploadMethod,
      uploadedFile,
      ...jsonFormData,
    });
    handleClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const lineCount = countLines(content);
          
          if (lineCount > MAX_LINES) {
            toast({
              title: 'File Too Large',
              description: `File has ${lineCount} lines, which exceeds the maximum limit of ${MAX_LINES} lines. Please choose a file with fewer lines.`,
              status: 'error',
              duration: 5000,
            });
            e.target.value = '';
            setUploadedFile(null);
            return;
          }
          
          setUploadedFile(file);
        } catch (error) {
          toast({
            title: 'Error Reading File',
            description: 'Failed to read file. Please try again.',
            status: 'error',
            duration: 3000,
          });
          e.target.value = '';
          setUploadedFile(null);
        }
      };
      reader.onerror = () => {
        toast({
          title: 'Error Reading File',
          description: 'Failed to read file. Please try again.',
          status: 'error',
          duration: 3000,
        });
        e.target.value = '';
        setUploadedFile(null);
      };
      reader.readAsText(file);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="3xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxW="90vw" maxH="90vh">
        <ModalHeader>Create Quiz</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs index={activeTab} onChange={setActiveTab}>
            <TabList>
              <Tab>AI Generation</Tab>
              <Tab>JSON/CSV Upload</Tab>
            </TabList>
            <TabPanels>
              {/* AI Generation Tab */}
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <TopicSubtopicSelector
                    useManualInput={useManualInput}
                    setUseManualInput={setUseManualInput}
                    manualTopicName={manualTopicName}
                    setManualTopicName={setManualTopicName}
                    manualSubtopicName={manualSubtopicName}
                    setManualSubtopicName={setManualSubtopicName}
                    selectedTopic={selectedTopic}
                    setSelectedTopic={setSelectedTopic}
                    selectedSubtopic={selectedSubtopic}
                    setSelectedSubtopic={setSelectedSubtopic}
                    topics={topics}
                    subtopics={subtopics}
                  />

                  <FormControl isRequired>
                    <FormLabel>Quiz Name</FormLabel>
                    <Input
                      value={aiFormData.name}
                      onChange={(e) => setAiFormData({ ...aiFormData, name: e.target.value })}
                      placeholder="Enter quiz name"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Description</FormLabel>
                    <Textarea
                      value={aiFormData.description}
                      onChange={(e) => setAiFormData({ ...aiFormData, description: e.target.value })}
                      placeholder="Enter quiz description"
                    />
                  </FormControl>

                  <HStack>
                    <FormControl isRequired>
                      <FormLabel>Age Group</FormLabel>
                      <Select
                        value={aiFormData.ageGroup}
                        onChange={(e) => setAiFormData({ ...aiFormData, ageGroup: e.target.value })}
                        placeholder="Select age group"
                      >
                        <option value="4-6">4-6 years</option>
                        <option value="6-8">6-8 years</option>
                        <option value="9-11">9-11 years</option>
                        <option value="12-14">12-14 years</option>
                        <option value="15-17">15-17 years</option>
                        <option value="18-20">18-20 years</option>
                        <option value="20+">20+ years</option>
                      </Select>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Difficulty</FormLabel>
                      <Select
                        value={aiFormData.difficulty}
                        onChange={(e) => setAiFormData({ ...aiFormData, difficulty: e.target.value })}
                        placeholder="Select difficulty"
                      >
                        <option value="Basic">Basic</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                        <option value="Mix">Mix</option>
                      </Select>
                    </FormControl>
                  </HStack>

                  <HStack>
                    <FormControl isRequired>
                      <FormLabel>Number of Questions</FormLabel>
                      <NumberInput
                        value={aiFormData.numberOfQuestions}
                        onChange={(_, value) =>
                          setAiFormData({ ...aiFormData, numberOfQuestions: value || 15 })
                        }
                        min={1}
                        max={50}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Passing Percentage</FormLabel>
                      <NumberInput
                        value={aiFormData.passingPercentage}
                        onChange={(_, value) =>
                          setAiFormData({ ...aiFormData, passingPercentage: value || 60 })
                        }
                        min={0}
                        max={100}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  </HStack>

                  <HStack>
                    <FormControl>
                      <FormLabel>Time Limit (minutes)</FormLabel>
                      <Input
                        type="number"
                        value={aiFormData.timeLimit}
                        onChange={(e) => setAiFormData({ ...aiFormData, timeLimit: e.target.value })}
                        placeholder="Optional"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Language</FormLabel>
                      <Select
                        value={aiFormData.language}
                        onChange={(e) => setAiFormData({ ...aiFormData, language: e.target.value })}
                      >
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Hinglish">Hinglish</option>
                      </Select>
                    </FormControl>
                  </HStack>

                  <HStack>
                    <FormControl>
                      <FormLabel>Grade/Class Level</FormLabel>
                      <Input
                        value={aiFormData.gradeLevel}
                        onChange={(e) => setAiFormData({ ...aiFormData, gradeLevel: e.target.value })}
                        placeholder="e.g., Class 5, Grade 3"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Exam Style</FormLabel>
                      <Select
                        value={aiFormData.examStyle}
                        onChange={(e) => setAiFormData({ ...aiFormData, examStyle: e.target.value })}
                        placeholder="Select exam style (optional)"
                      >
                        <option value="">None</option>
                        <option value="CBSE">CBSE</option>
                        <option value="NCERT">NCERT</option>
                        <option value="Olympiad">Olympiad</option>
                        <option value="Competitive">Competitive</option>
                      </Select>
                    </FormControl>
                  </HStack>

                  <FormControl>
                    <FormLabel>Sample Question Pattern (Optional)</FormLabel>
                    <Textarea
                      value={aiFormData.sampleQuestion}
                      onChange={(e) => setAiFormData({ ...aiFormData, sampleQuestion: e.target.value })}
                      placeholder="Enter a sample question or pattern to guide AI generation style..."
                      rows={3}
                    />
                    <FormHelperText>
                      Provide a sample question to help AI understand the desired question style, format, and complexity
                    </FormHelperText>
                  </FormControl>
                </VStack>
              </TabPanel>

              {/* JSON/CSV Upload Tab */}
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <TopicSubtopicSelector
                    useManualInput={useManualInput}
                    setUseManualInput={setUseManualInput}
                    manualTopicName={manualTopicName}
                    setManualTopicName={setManualTopicName}
                    manualSubtopicName={manualSubtopicName}
                    setManualSubtopicName={setManualSubtopicName}
                    selectedTopic={selectedTopic}
                    setSelectedTopic={setSelectedTopic}
                    selectedSubtopic={selectedSubtopic}
                    setSelectedSubtopic={setSelectedSubtopic}
                    topics={topics}
                    subtopics={subtopics}
                  />

                  <FormControl isRequired>
                    <FormLabel>Quiz Name</FormLabel>
                    <Input
                      value={jsonFormData.name}
                      onChange={(e) => setJsonFormData({ ...jsonFormData, name: e.target.value })}
                      placeholder="Enter quiz name"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Description</FormLabel>
                    <Textarea
                      value={jsonFormData.description}
                      onChange={(e) => setJsonFormData({ ...jsonFormData, description: e.target.value })}
                      placeholder="Enter quiz description"
                    />
                  </FormControl>

                  <HStack>
                    <FormControl isRequired>
                      <FormLabel>Age Group</FormLabel>
                      <Select
                        value={jsonFormData.ageGroup}
                        onChange={(e) => setJsonFormData({ ...jsonFormData, ageGroup: e.target.value })}
                        placeholder="Select age group"
                      >
                        <option value="4-6">4-6 years</option>
                        <option value="6-8">6-8 years</option>
                        <option value="9-11">9-11 years</option>
                        <option value="12-14">12-14 years</option>
                        <option value="15-17">15-17 years</option>
                        <option value="18-20">18-20 years</option>
                        <option value="20+">20+ years</option>
                      </Select>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Difficulty</FormLabel>
                      <Select
                        value={jsonFormData.difficulty}
                        onChange={(e) => setJsonFormData({ ...jsonFormData, difficulty: e.target.value })}
                        placeholder="Select difficulty"
                      >
                        <option value="Basic">Basic</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                        <option value="Mix">Mix</option>
                      </Select>
                    </FormControl>
                  </HStack>

                  <FormControl>
                    <FormLabel>Upload Method</FormLabel>
                    <RadioGroup value={uploadMethod} onChange={(value) => {
                      setUploadMethod(value as 'text' | 'file');
                      if (value === 'file') {
                        setJsonFormData({ ...jsonFormData, jsonContent: '' });
                      } else {
                        setUploadedFile(null);
                      }
                    }}>
                      <Stack direction="row" spacing={4}>
                        <Radio value="text">Enter manually (JSON)</Radio>
                        <Radio value="file">Upload CSV/JSON file</Radio>
                      </Stack>
                    </RadioGroup>
                  </FormControl>

                  <Divider />

                  {uploadMethod === 'file' ? (
                    <FormControl isRequired>
                      <FormLabel>Upload File (CSV or JSON)</FormLabel>
                      <Input
                        type="file"
                        accept=".csv,.json"
                        onChange={handleFileChange}
                      />
                      {uploadedFile && (
                        <VStack align="start" spacing={1} mt={2}>
                          <Text fontSize="sm" color="green.500">
                            ✓ File selected: {uploadedFile.name}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            Max {MAX_LINES} lines allowed
                          </Text>
                        </VStack>
                      )}
                      <HStack mt={2} spacing={2}>
                        <Button
                          size="sm"
                          variant="outline"
                          colorScheme="blue"
                          onClick={downloadJSONTemplate}
                        >
                          📥 Download JSON Template
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          colorScheme="green"
                          onClick={downloadCSVTemplate}
                        >
                          📥 Download CSV Template
                        </Button>
                      </HStack>
                      <Text fontSize="sm" color="gray.500" mt={2}>
                        Supported formats: CSV or JSON (max {MAX_LINES} lines). CSV should have columns: question, optionA, optionB, optionC, optionD, correctAnswer, explanation, hint, questionType, points
                      </Text>
                    </FormControl>
                  ) : (
                    <FormControl isRequired>
                      <HStack justify="space-between" mb={2}>
                        <FormLabel mb={0}>JSON Questions</FormLabel>
                        <Button
                          size="sm"
                          variant="outline"
                          colorScheme="blue"
                          onClick={downloadJSONTemplate}
                        >
                          📥 Download Template
                        </Button>
                      </HStack>
                      <Textarea
                        value={jsonFormData.jsonContent}
                        onChange={(e) => setJsonFormData({ ...jsonFormData, jsonContent: e.target.value })}
                        placeholder={`[\n  {\n    "question": "Question text",\n    "options": {"A": "...", "B": "...", "C": "...", "D": "..."},\n    "correctAnswer": "A",\n    "explanation": "Explanation text"\n  }\n]`}
                        height="200px"
                        fontFamily="mono"
                      />
                      <Text fontSize="sm" color="gray.500" mt={1}>
                        Format: Array of question objects with question, options, correctAnswer, and explanation/justification (max {MAX_LINES} questions)
                      </Text>
                    </FormControl>
                  )}
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={activeTab === 0 ? handleAIGenerate : handleJSONUpload}
            isLoading={loading}
          >
            {activeTab === 0 ? 'Generate with AI' : 'Upload Quiz (JSON/CSV)'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

