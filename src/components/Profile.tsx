/**
 * Profile component - User profile management
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Card,
  CardBody,
  Heading,
  Select,
  Alert,
  AlertIcon,
  FormControl,
  FormLabel,
  Spinner,
} from '@/shared/design-system';
import { User } from '@/types';
import { LANGUAGES } from '@/constants/quiz';
import { QUIZ_CONSTANTS } from '@/constants/quiz';
import { Language } from '@/types/quiz';
import { profileApi } from '@/services/api';
import { PullToRefresh } from './PullToRefresh';
import { GRADES } from '@/constants/auth';

interface ProfileProps {
  user: User;
}

/**
 * Profile management component
 */
export const Profile: React.FC<ProfileProps> = ({ user: initialUser }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>(initialUser);
  const [name, setName] = useState(initialUser.name || '');
  const [age, setAge] = useState<string>(initialUser.age?.toString() || '');
  const [grade, setGrade] = useState(initialUser.grade || '');
  const [preferredLanguage, setPreferredLanguage] = useState<Language>(
    (initialUser.preferredLanguage as Language) || 'English'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Load latest profile from API
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { user: latestUser } = await profileApi.getProfile();
        setUser(latestUser);
        setName(latestUser.name || '');
        setAge(latestUser.age?.toString() || '');
        setGrade(latestUser.grade || '');
        setPreferredLanguage((latestUser.preferredLanguage as Language) || 'English');
      } catch (err) {
        // If API fails, use initial user data
        console.error('Failed to load profile:', err);
        setName(initialUser.name || '');
        setAge(initialUser.age?.toString() || '');
        setGrade(initialUser.grade || '');
        setPreferredLanguage((initialUser.preferredLanguage as Language) || 'English');
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [initialUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const ageNum = age ? parseInt(age, 10) : undefined;
      
      if (age && (ageNum! < QUIZ_CONSTANTS.MIN_AGE || ageNum! > QUIZ_CONSTANTS.MAX_AGE)) {
        setError(`Age must be between ${QUIZ_CONSTANTS.MIN_AGE} and ${QUIZ_CONSTANTS.MAX_AGE}`);
        setLoading(false);
        return;
      }

      // Update profile via API
      const result = await profileApi.updateProfile({
        name,
        age: ageNum,
        grade: grade || undefined,
        preferredLanguage: preferredLanguage,
      });

      setUser(result.user);
      setSuccess(true);
      
      // Trigger app-wide user update by dispatching custom event
      window.dispatchEvent(new CustomEvent('userProfileUpdated', { detail: result.user }));
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    const { user: latestUser } = await profileApi.getProfile();
    setUser(latestUser);
    setName(latestUser.name || '');
    setAge(latestUser.age?.toString() || '');
    setGrade(latestUser.grade || '');
    setPreferredLanguage((latestUser.preferredLanguage as Language) || 'English');
  };

  if (loadingProfile) {
    return (
      <PullToRefresh onRefresh={handleRefresh}>
        <Box padding={6} display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <VStack spacing={4}>
            <Spinner size="xl" color="blue.500" />
            <Text fontSize="lg">Loading profile...</Text>
          </VStack>
        </Box>
      </PullToRefresh>
    );
  }

  return (
    <PullToRefresh onRefresh={handleRefresh}>
    <Box padding={{ base: 4, md: 6 }} maxWidth="600px" margin="0 auto">
      <VStack spacing={{ base: 4, md: 6 }} align="stretch">
        <Heading size={{ base: 'md', md: 'lg' }} color="blue.600">
          My Profile 👤
        </Heading>

        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {success && (
          <Alert status="success" borderRadius="md">
            <AlertIcon />
            Profile updated successfully!
          </Alert>
        )}

        <Card>
          <CardBody>
            <Box as="form" onSubmit={handleSubmit}>
              <VStack spacing={5} align="stretch">
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={user.email}
                    isDisabled
                    bg="gray.100"
                    size="lg"
                  />
                  <Text fontSize="xs" color="gray.500" marginTop={1}>
                    Email cannot be changed
                  </Text>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    size="lg"
                    required
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Age</FormLabel>
                  <Input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder={`Enter age (${QUIZ_CONSTANTS.MIN_AGE}-${QUIZ_CONSTANTS.MAX_AGE})`}
                    min={QUIZ_CONSTANTS.MIN_AGE}
                    max={QUIZ_CONSTANTS.MAX_AGE}
                    size="lg"
                    required
                  />
                  <Text fontSize="xs" color="gray.500" marginTop={1}>
                    Your age helps us create age-appropriate content
                  </Text>
                </FormControl>

                <FormControl>
                  <FormLabel>Grade/Class</FormLabel>
                  <Select
                    value={grade || ''}
                    onChange={(e) => setGrade(e.target.value || '')}
                    placeholder="Select your grade/class"
                    size="lg"
                  >
                    {GRADES.map((gradeOption) => (
                      <option key={gradeOption} value={gradeOption}>
                        {gradeOption}
                      </option>
                    ))}
                  </Select>
                  <Text fontSize="xs" color="gray.500" marginTop={1}>
                    Optional: Your current grade or class
                  </Text>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Preferred Language</FormLabel>
                  <Select
                    value={preferredLanguage}
                    onChange={(e) => setPreferredLanguage(e.target.value as Language)}
                    size="lg"
                    required
                  >
                    {Object.values(LANGUAGES).map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </Select>
                  <Text fontSize="xs" color="gray.500" marginTop={1}>
                    This language will be used for all quizzes and lessons
                  </Text>
                </FormControl>

                <HStack
                  spacing={4}
                  justifyContent="flex-end"
                  marginTop={4}
                  flexWrap="wrap"
                  w="100%"
                >
                  <Button
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                    isDisabled={loading}
                    size={{ base: 'sm', md: 'md' }}
                    w={{ base: '100%', sm: 'auto' }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    colorScheme="blue"
                    isLoading={loading}
                    isDisabled={loading}
                    size={{ base: 'sm', md: 'md' }}
                    w={{ base: '100%', sm: 'auto' }}
                  >
                    Save Changes
                  </Button>
                </HStack>
              </VStack>
            </Box>
          </CardBody>
        </Card>
      </VStack>
    </Box>
    </PullToRefresh>
  );
};
