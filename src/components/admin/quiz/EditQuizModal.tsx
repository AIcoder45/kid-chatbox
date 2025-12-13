/**
 * Edit Quiz Modal Component
 */

import React from 'react';
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
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  HStack as HStackType,
} from '@/shared/design-system';
import { downloadJSONTemplate } from './fileTemplates';

interface EditQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: any) => Promise<void>;
  onUpdateFromJSON: (jsonContent: string) => Promise<void>;
  formData: {
    name: string;
    description: string;
    ageGroup: string;
    difficulty: string;
    numberOfQuestions: number;
    passingPercentage: number;
    timeLimit: string;
    isActive: boolean;
  };
  setFormData: (data: any) => void;
  jsonContent: string;
  setJsonContent: (content: string) => void;
  activeTab: number;
  setActiveTab: (tab: number) => void;
  loading: boolean;
}

export const EditQuizModal: React.FC<EditQuizModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  onUpdateFromJSON,
  formData,
  setFormData,
  jsonContent,
  setJsonContent,
  activeTab,
  setActiveTab,
  loading,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxW="90vw" maxH="90vh">
        <ModalHeader>Edit Quiz</ModalHeader>
        <ModalCloseButton />
        <ModalBody overflowY="auto" maxH="calc(90vh - 140px)">
          <Tabs index={activeTab} onChange={setActiveTab}>
            <TabList>
              <Tab>Manual Edit</Tab>
              <Tab>JSON/CSV Upload</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <FormControl isRequired>
                    <FormLabel>Quiz Name</FormLabel>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter quiz name"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Description</FormLabel>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter quiz description"
                      rows={3}
                    />
                  </FormControl>

                  <HStack>
                    <FormControl isRequired>
                      <FormLabel>Age Group</FormLabel>
                      <Select
                        value={formData.ageGroup}
                        onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
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
                        value={formData.difficulty}
                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
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
                    <FormControl>
                      <FormLabel>Number of Questions</FormLabel>
                      <NumberInput
                        value={formData.numberOfQuestions}
                        onChange={(_, value) =>
                          setFormData({ ...formData, numberOfQuestions: value || 15 })
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
                        value={formData.passingPercentage}
                        onChange={(_, value) =>
                          setFormData({ ...formData, passingPercentage: value || 60 })
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
                        value={formData.timeLimit}
                        onChange={(e) => setFormData({ ...formData, timeLimit: e.target.value })}
                        placeholder="Optional"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Status</FormLabel>
                      <Select
                        value={formData.isActive ? 'active' : 'inactive'}
                        onChange={(e) =>
                          setFormData({ ...formData, isActive: e.target.value === 'active' })
                        }
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </Select>
                    </FormControl>
                  </HStack>
                </VStack>
              </TabPanel>

              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <Alert status="info">
                    <AlertIcon />
                    <Box>
                      <AlertTitle>Update Quiz from JSON</AlertTitle>
                      <AlertDescription>
                        Paste JSON content to update quiz details and questions. The JSON should contain quiz metadata and a questions array.
                      </AlertDescription>
                    </Box>
                  </Alert>

                  <FormControl isRequired>
                    <HStackType justify="space-between" mb={2}>
                      <FormLabel mb={0}>JSON Content</FormLabel>
                      <Button
                        size="sm"
                        variant="outline"
                        colorScheme="blue"
                        onClick={downloadJSONTemplate}
                      >
                        📥 Download Template
                      </Button>
                    </HStackType>
                    <Textarea
                      value={jsonContent}
                      onChange={(e) => setJsonContent(e.target.value)}
                      placeholder={`{\n  "name": "Quiz Name",\n  "description": "Description",\n  "ageGroup": "6-8",\n  "difficulty": "Basic",\n  "passingPercentage": 60,\n  "timeLimit": 30,\n  "questions": [\n    {\n      "question": "Question text",\n      "options": {"A": "...", "B": "...", "C": "...", "D": "..."},\n      "correctAnswer": "A",\n      "explanation": "Explanation text"\n    }\n  ]\n}`}
                      height="300px"
                      fontFamily="mono"
                    />
                  </FormControl>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={activeTab === 0 ? () => onUpdate(formData) : () => onUpdateFromJSON(jsonContent)}
            isLoading={loading}
          >
            {activeTab === 0 ? 'Update Quiz' : 'Update from JSON'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

