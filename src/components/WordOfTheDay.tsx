/**
 * WordOfTheDay Component - Displays daily vocabulary word with definitions
 */

import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardBody,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Spinner,
  Divider,
  Button,
  IconButton,
} from '@/shared/design-system';
import { publicApi } from '@/services/api';
import { MESSAGES } from '@/constants/app';

interface WordData {
  word: string;
  phonetic: string;
  audioUrl: string | null;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example: string | null;
    }>;
    synonyms: string[];
    antonyms: string[];
    additionalExamples: string[];
  }>;
  sourceUrl: string | null;
}

/**
 * WordOfTheDay component shows daily vocabulary word with detailed information
 */
export const WordOfTheDay: React.FC = () => {
  const [wordData, setWordData] = useState<WordData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showMoreExamples, setShowMoreExamples] = useState(false);

  useEffect(() => {
    loadWordOfTheDay();
  }, []);

  const loadWordOfTheDay = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await publicApi.getWordOfTheDay();
      
      if (response.success && response.meanings.length > 0) {
        setWordData({
          word: response.word,
          phonetic: response.phonetic,
          audioUrl: response.audioUrl,
          meanings: response.meanings,
          sourceUrl: response.sourceUrl,
        });
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Error loading word of the day:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const playAudio = () => {
    if (wordData?.audioUrl) {
      const audio = new Audio(wordData.audioUrl);
      audio.play().catch((err) => console.error('Error playing audio:', err));
    }
  };

  if (loading) {
    return (
      <Card bg="purple.50" borderColor="purple.200" borderWidth={2}>
        <CardBody p={{ base: 3, md: 4 }}>
          <VStack spacing={3}>
            <Heading size={{ base: 'xs', md: 'sm' }} color="purple.700">
              {MESSAGES.WORD_OF_THE_DAY_TITLE}
            </Heading>
            <Spinner size="md" color="purple.500" />
            <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.600">
              {MESSAGES.WORD_OF_THE_DAY_LOADING}
            </Text>
          </VStack>
        </CardBody>
      </Card>
    );
  }

  if (error || !wordData) {
    return (
      <Card bg="purple.50" borderColor="purple.200" borderWidth={2}>
        <CardBody p={{ base: 3, md: 4 }}>
          <VStack spacing={2}>
            <Heading size={{ base: 'xs', md: 'sm' }} color="purple.700">
              {MESSAGES.WORD_OF_THE_DAY_TITLE}
            </Heading>
            <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.600">
              {MESSAGES.WORD_OF_THE_DAY_ERROR}
            </Text>
          </VStack>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card 
      bg="purple.50" 
      borderColor="purple.200" 
      borderWidth={2}
      boxShadow="md"
    >
      <CardBody p={{ base: 3, md: 4 }}>
        <VStack spacing={{ base: 3, md: 4 }} align="stretch">
          {/* Title */}
          <Heading size={{ base: 'xs', md: 'sm' }} color="purple.700">
            {MESSAGES.WORD_OF_THE_DAY_TITLE}
          </Heading>

          {/* Word and Phonetic */}
          <VStack spacing={1} align="start">
            <HStack spacing={2} flexWrap="wrap" alignItems="center">
              <Text
                fontSize={{ base: 'xl', md: '2xl' }}
                fontWeight="bold"
                color="purple.800"
                textTransform="capitalize"
              >
                {wordData.word}
              </Text>
              {wordData.phonetic && (
                <Text
                  fontSize={{ base: 'sm', md: 'md' }}
                  color="purple.600"
                  fontStyle="italic"
                >
                  {wordData.phonetic}
                </Text>
              )}
              {wordData.audioUrl && (
                <IconButton
                  aria-label="Play pronunciation"
                  icon={<Text fontSize="lg">🔊</Text>}
                  size="xs"
                  colorScheme="purple"
                  variant="ghost"
                  onClick={playAudio}
                  title="Listen to pronunciation"
                />
              )}
            </HStack>
          </VStack>

          <Divider borderColor="purple.200" />

          {/* Meanings */}
          {wordData.meanings.slice(0, 2).map((meaning, idx) => (
            <VStack key={idx} spacing={2} align="stretch">
              {/* Part of Speech */}
              <Badge
                colorScheme="purple"
                fontSize={{ base: '2xs', md: 'xs' }}
                width="fit-content"
                px={2}
                py={0.5}
                textTransform="capitalize"
              >
                {meaning.partOfSpeech}
              </Badge>

              {/* Definitions */}
              {meaning.definitions.map((def, defIdx) => (
                <VStack
                  key={defIdx}
                  spacing={1.5}
                  align="stretch"
                  pl={{ base: 2, md: 3 }}
                >
                  <HStack align="start" spacing={2}>
                    <Text
                      fontSize={{ base: 'xs', md: 'sm' }}
                      color="purple.600"
                      fontWeight="semibold"
                      flexShrink={0}
                      pt={0.5}
                    >
                      •
                    </Text>
                    <VStack spacing={1} align="stretch" flex={1}>
                      <Text
                        fontSize={{ base: 'xs', md: 'sm' }}
                        color="gray.700"
                        lineHeight="tall"
                      >
                        {def.definition}
                      </Text>
                      {def.example && (
                        <Box
                          bg="white"
                          p={2}
                          borderRadius="md"
                          borderLeft="3px solid"
                          borderLeftColor="purple.400"
                        >
                          <Text
                            fontSize={{ base: '2xs', md: 'xs' }}
                            color="gray.600"
                            fontStyle="italic"
                          >
                            "{def.example}"
                          </Text>
                        </Box>
                      )}
                    </VStack>
                  </HStack>
                </VStack>
              ))}

              {/* Synonyms */}
              {meaning.synonyms.length > 0 && (
                <HStack spacing={1} flexWrap="wrap" pl={{ base: 2, md: 3 }}>
                  <Text
                    fontSize={{ base: '2xs', md: 'xs' }}
                    color="purple.600"
                    fontWeight="semibold"
                  >
                    {MESSAGES.WORD_OF_THE_DAY_SYNONYMS}:
                  </Text>
                  {meaning.synonyms.map((synonym, synIdx) => (
                    <Badge
                      key={synIdx}
                      colorScheme="purple"
                      variant="outline"
                      fontSize={{ base: '2xs', md: 'xs' }}
                    >
                      {synonym}
                    </Badge>
                  ))}
                </HStack>
              )}

              {/* Antonyms */}
              {meaning.antonyms && meaning.antonyms.length > 0 && (
                <HStack spacing={1} flexWrap="wrap" pl={{ base: 2, md: 3 }}>
                  <Text
                    fontSize={{ base: '2xs', md: 'xs' }}
                    color="red.600"
                    fontWeight="semibold"
                  >
                    {MESSAGES.WORD_OF_THE_DAY_ANTONYMS}:
                  </Text>
                  {meaning.antonyms.map((antonym, antIdx) => (
                    <Badge
                      key={antIdx}
                      colorScheme="red"
                      variant="outline"
                      fontSize={{ base: '2xs', md: 'xs' }}
                    >
                      {antonym}
                    </Badge>
                  ))}
                </HStack>
              )}
            </VStack>
          ))}

          {/* Additional Example Sentences */}
          {wordData.meanings[0]?.additionalExamples &&
            wordData.meanings[0].additionalExamples.length > 0 && (
              <>
                <Divider borderColor="purple.200" />
                <VStack spacing={2} align="stretch">
                  <HStack justifyContent="space-between" alignItems="center">
                    <Text
                      fontSize={{ base: 'xs', md: 'sm' }}
                      fontWeight="bold"
                      color="purple.700"
                    >
                      📝 More Example Sentences
                    </Text>
                    {wordData.meanings[0].additionalExamples.length > 3 && (
                      <Button
                        size="xs"
                        variant="ghost"
                        colorScheme="purple"
                        onClick={() => setShowMoreExamples(!showMoreExamples)}
                      >
                        {showMoreExamples ? 'Show Less' : 'Show More'}
                      </Button>
                    )}
                  </HStack>
                  <VStack spacing={1.5} align="stretch">
                    {wordData.meanings[0].additionalExamples
                      .slice(0, showMoreExamples ? undefined : 3)
                      .map((example, idx) => (
                        <Box
                          key={idx}
                          bg="white"
                          p={{ base: 2, md: 2.5 }}
                          borderRadius="md"
                          borderLeft="3px solid"
                          borderLeftColor="purple.400"
                          boxShadow="sm"
                        >
                          <HStack align="start" spacing={2}>
                            <Text
                              fontSize={{ base: 'xs', md: 'sm' }}
                              color="purple.600"
                              fontWeight="semibold"
                              flexShrink={0}
                            >
                              {idx + 1}.
                            </Text>
                            <Text
                              fontSize={{ base: 'xs', md: 'sm' }}
                              color="gray.700"
                              lineHeight="tall"
                            >
                              {example}
                            </Text>
                          </HStack>
                        </Box>
                      ))}
                  </VStack>
                </VStack>
              </>
            )}
        </VStack>
      </CardBody>
    </Card>
  );
};

