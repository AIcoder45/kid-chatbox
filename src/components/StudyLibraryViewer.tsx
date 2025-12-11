/**
 * Study Library Viewer Component
 * Displays a study session from the library in read-only mode
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Card,
  CardBody,
  Spinner,
  Alert,
  AlertIcon,
  Badge,
  Divider,
  IconButton,
  SimpleGrid,
} from '@/shared/design-system';
import { studyApi } from '@/services/api';
import { AnimatedSection } from './study/AnimatedSection';
import { AnimatedListItem } from './study/AnimatedListItem';
import { KeyPointCard } from './study/KeyPointCard';

/**
 * Study Library Viewer component
 */
export const StudyLibraryViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadStudySession();
    }
  }, [id]);

  const loadStudySession = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studyApi.getStudySession(id!);
      setSession(data.session);
    } catch (err) {
      setError('Failed to load study session');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
        <Text mt={4}>Loading study material...</Text>
      </Box>
    );
  }

  if (error || !session) {
    return (
      <Box p={6}>
        <Alert status="error">
          <AlertIcon />
          {error || 'Study session not found'}
        </Alert>
        <Button mt={4} onClick={() => navigate('/study-library')}>
          Back to Library
        </Button>
      </Box>
    );
  }

  return (
    <Box p={6} maxW="1200px" mx="auto">
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <HStack justify="space-between">
          <VStack align="start" spacing={2}>
            <HStack>
              <IconButton
                aria-label="Back"
                icon={<Text>←</Text>}
                onClick={() => navigate('/study-library')}
                variant="ghost"
              />
              <Heading size="lg">{session.lesson_title}</Heading>
            </HStack>
            <HStack spacing={2}>
              <Badge colorScheme="blue">{session.subject || 'General'}</Badge>
              {session.content_source === 'admin_content' && session.contentType && (
                <Badge colorScheme={session.contentType === 'pdf' ? 'red' : session.contentType === 'ppt' ? 'blue' : 'green'}>
                  {session.contentType.toUpperCase()}
                </Badge>
              )}
              {session.difficulty && (
                <Badge colorScheme="purple">{session.difficulty}</Badge>
              )}
              {session.age && <Badge>{session.age} years</Badge>}
              {session.language && <Badge>{session.language}</Badge>}
            </HStack>
            <Text fontSize="sm" color="gray.600">
              Created by {session.created_by_name} •{' '}
              {new Date(session.timestamp).toLocaleDateString()}
            </Text>
          </VStack>
        </HStack>

        <Divider />

        {/* Admin Content Display (PPT, PDF, Text) */}
        {session.content_source === 'admin_content' && (
          <>
            {session.contentType === 'pdf' && session.fileUrl && (
              <AnimatedSection title="PDF Document">
                <Card>
                  <CardBody>
                    <VStack spacing={4}>
                      <Text fontSize="lg">{session.lesson_summary || session.description}</Text>
                      <Box w="100%" h="600px">
                        <iframe
                          src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}${session.fileUrl}`}
                          width="100%"
                          height="100%"
                          style={{ border: 'none' }}
                          title={session.fileName || session.lesson_title}
                        />
                      </Box>
                      <Button
                        as="a"
                        href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}${session.fileUrl}`}
                        download
                        colorScheme="blue"
                      >
                        Download PDF
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              </AnimatedSection>
            )}

            {session.contentType === 'ppt' && session.fileUrl && (
              <AnimatedSection title="PowerPoint Presentation">
                <Card>
                  <CardBody>
                    <VStack spacing={4}>
                      <Text fontSize="lg">{session.lesson_summary || session.description}</Text>
                      <Alert status="info">
                        <AlertIcon />
                        <Text>
                          PowerPoint files cannot be displayed in the browser. Please download to view.
                        </Text>
                      </Alert>
                      <Button
                        as="a"
                        href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}${session.fileUrl}`}
                        download
                        colorScheme="blue"
                        size="lg"
                      >
                        📥 Download {session.fileName || 'Presentation'}
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              </AnimatedSection>
            )}

            {session.contentType === 'text' && (
              <AnimatedSection title="Text Content">
                <Card>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      {session.lesson_summary && (
                        <Text fontSize="lg" fontWeight="bold">{session.lesson_summary}</Text>
                      )}
                      {session.textContent && (
                        <Box
                          p={4}
                          bg="gray.50"
                          borderRadius="md"
                          whiteSpace="pre-wrap"
                          fontFamily="mono"
                        >
                          <Text>{session.textContent}</Text>
                        </Box>
                      )}
                      {session.fileUrl && (
                        <Button
                          as="a"
                          href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}${session.fileUrl}`}
                          download
                          colorScheme="blue"
                        >
                          Download Text File
                        </Button>
                      )}
                    </VStack>
                  </CardBody>
                </Card>
              </AnimatedSection>
            )}
          </>
        )}

        {/* Regular Study Session Content */}
        {session.content_source !== 'admin_content' && (
          <>
            {/* Introduction */}
            <AnimatedSection title="Introduction">
              <Card>
                <CardBody>
                  <Text fontSize="lg">{session.lesson_introduction}</Text>
                </CardBody>
              </Card>
            </AnimatedSection>

        {/* Explanation */}
        {session.lesson_explanation && (
          <AnimatedSection title="Explanation">
            <Card>
              <CardBody>
                {Array.isArray(session.lesson_explanation) ? (
                  <VStack align="stretch" spacing={3}>
                    {session.lesson_explanation.map((item: any, index: number) => (
                      <AnimatedListItem
                        key={index}
                        index={index}
                        text={typeof item === 'string' ? item : item.text || item.content || ''}
                      />
                    ))}
                  </VStack>
                ) : (
                  <Text>{session.lesson_explanation}</Text>
                )}
              </CardBody>
            </Card>
          </AnimatedSection>
        )}

        {/* Key Points */}
        {session.lesson_key_points && Array.isArray(session.lesson_key_points) && (
          <AnimatedSection title="Key Points">
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {session.lesson_key_points.map((point: any, index: number) => (
                <KeyPointCard
                  key={index}
                  index={index}
                  point={typeof point === 'string' ? point : point.text || ''}
                />
              ))}
            </SimpleGrid>
          </AnimatedSection>
        )}

        {/* Examples */}
        {session.lesson_examples && Array.isArray(session.lesson_examples) && (
          <AnimatedSection title="Examples">
            <Card>
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  {session.lesson_examples.map((example: any, index: number) => (
                    <Box key={index} p={4} bg="blue.50" borderRadius="md">
                      <Text fontWeight="bold" mb={2}>
                        Example {index + 1}:
                      </Text>
                      <Text>{typeof example === 'string' ? example : example.text}</Text>
                    </Box>
                  ))}
                </VStack>
              </CardBody>
            </Card>
          </AnimatedSection>
        )}

        {/* Summary */}
        {session.lesson_summary && session.content_source !== 'admin_content' && (
          <AnimatedSection title="Summary">
            <Card bg="green.50">
              <CardBody>
                <Text fontSize="lg">{session.lesson_summary}</Text>
              </CardBody>
            </Card>
          </AnimatedSection>
        )}
          </>
        )}

        {/* Actions */}
        <HStack justify="center" spacing={4}>
          <Button onClick={() => navigate('/study-library')}>Back to Library</Button>
          <Button colorScheme="blue" onClick={() => navigate('/study')}>
            Create New Study
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

