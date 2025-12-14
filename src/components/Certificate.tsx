/**
 * Certificate Component
 * Displays an intuitive certificate with green background after test completion
 */

import { motion } from 'framer-motion';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Card,
  CardBody,
  Button,
  Badge,
} from '@/shared/design-system';

interface CertificateProps {
  studentName: string;
  quizName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  date: string;
  onDownload?: () => void;
}

export const Certificate: React.FC<CertificateProps> = ({
  studentName,
  quizName,
  score,
  totalQuestions,
  percentage,
  date,
  onDownload,
}) => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, type: 'spring', stiffness: 150 }}
      style={{ width: '100%' }}
    >
      <Card
        width="100%"
        bgGradient="linear(to-br, green.50, green.100, green.50)"
        boxShadow="2xl"
        borderRadius="2xl"
        borderWidth="4px"
        borderColor="green.300"
        position="relative"
        overflow="hidden"
      >
        {/* Decorative corner elements */}
        <Box
          position="absolute"
          top="0"
          left="0"
          width="60px"
          height="60px"
          borderTopWidth="4px"
          borderLeftWidth="4px"
          borderColor="green.400"
          borderTopLeftRadius="xl"
        />
        <Box
          position="absolute"
          top="0"
          right="0"
          width="60px"
          height="60px"
          borderTopWidth="4px"
          borderRightWidth="4px"
          borderColor="green.400"
          borderTopRightRadius="xl"
        />
        <Box
          position="absolute"
          bottom="0"
          left="0"
          width="60px"
          height="60px"
          borderBottomWidth="4px"
          borderLeftWidth="4px"
          borderColor="green.400"
          borderBottomLeftRadius="xl"
        />
        <Box
          position="absolute"
          bottom="0"
          right="0"
          width="60px"
          height="60px"
          borderBottomWidth="4px"
          borderRightWidth="4px"
          borderColor="green.400"
          borderBottomRightRadius="xl"
        />

        {/* Decorative pattern overlay */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          opacity={0.05}
          backgroundImage="radial-gradient(circle, green.600 1px, transparent 1px)"
          backgroundSize="30px 30px"
          pointerEvents="none"
        />

        <CardBody p={{ base: 6, md: 8 }}>
          <VStack spacing={6} align="center">
            {/* Header with decorative elements */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <HStack spacing={2} mb={2}>
                <Text fontSize="4xl">🎓</Text>
                <Text fontSize="2xl" fontWeight="bold" color="green.700">
                  Certificate of Achievement
                </Text>
                <Text fontSize="4xl">🏆</Text>
              </HStack>
            </motion.div>

            {/* Decorative line */}
            <Box width="200px" height="2px" bg="green.400" borderRadius="full" />

            {/* Congratulations message */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
            >
              <Heading
                size="2xl"
                color="green.700"
                textAlign="center"
                textShadow="1px 1px 2px rgba(0,0,0,0.1)"
              >
                🎊 Congratulations! 🎊
              </Heading>
            </motion.div>

            {/* This is to certify */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Text fontSize="lg" color="green.800" fontWeight="medium" textAlign="center">
                This is to certify that
              </Text>
            </motion.div>

            {/* Student Name */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, type: 'spring', stiffness: 150 }}
            >
              <Heading
                size="xl"
                color="green.800"
                textAlign="center"
                fontWeight="bold"
                textTransform="uppercase"
                letterSpacing="wide"
                px={4}
                py={2}
                bg="white"
                borderRadius="lg"
                boxShadow="md"
                borderWidth="2px"
                borderColor="green.300"
              >
                {studentName}
              </Heading>
            </motion.div>

            {/* Achievement text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              <Text fontSize="lg" color="green.800" fontWeight="medium" textAlign="center">
                has successfully completed
              </Text>
            </motion.div>

            {/* Quiz Name */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <Badge
                fontSize="xl"
                px={6}
                py={3}
                colorScheme="green"
                borderRadius="full"
                variant="solid"
                boxShadow="lg"
              >
                {quizName}
              </Badge>
            </motion.div>

            {/* Score details */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4 }}
            >
              <Box
                bg="white"
                borderRadius="xl"
                p={6}
                boxShadow="lg"
                borderWidth="2px"
                borderColor="green.300"
                minW={{ base: '100%', md: '400px' }}
              >
                <VStack spacing={3}>
                  <HStack spacing={4} justify="center" flexWrap="wrap">
                    <VStack spacing={1}>
                      <Text fontSize="sm" color="gray.600" fontWeight="medium">
                        Score
                      </Text>
                      <Text fontSize="2xl" fontWeight="bold" color="green.700">
                        {score}/{totalQuestions}
                      </Text>
                    </VStack>
                    <Box width="1px" height="40px" bg="green.300" />
                    <VStack spacing={1}>
                      <Text fontSize="sm" color="gray.600" fontWeight="medium">
                        Percentage
                      </Text>
                      <Text fontSize="2xl" fontWeight="bold" color="green.700">
                        {percentage}%
                      </Text>
                    </VStack>
                  </HStack>
                </VStack>
              </Box>
            </motion.div>

            {/* Date */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
            >
              <Text fontSize="md" color="green.700" fontWeight="medium" textAlign="center">
                Issued on: {formattedDate}
              </Text>
            </motion.div>

            {/* Decorative line */}
            <Box width="200px" height="2px" bg="green.400" borderRadius="full" />

            {/* Download button */}
            {onDownload && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 }}
              >
                <Button
                  colorScheme="green"
                  size="lg"
                  onClick={onDownload}
                  leftIcon={<Text fontSize="xl">📥</Text>}
                  boxShadow="lg"
                  _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
                  transition="all 0.2s"
                >
                  Download Certificate
                </Button>
              </motion.div>
            )}

            {/* Decorative stars */}
            <HStack spacing={8} mt={2}>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Text fontSize="3xl">⭐</Text>
              </motion.div>
              <motion.div
                animate={{ rotate: [360, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              >
                <Text fontSize="3xl">✨</Text>
              </motion.div>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              >
                <Text fontSize="3xl">🌟</Text>
              </motion.div>
            </HStack>
          </VStack>
        </CardBody>
      </Card>
    </motion.div>
  );
};

