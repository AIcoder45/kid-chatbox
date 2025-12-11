/**
 * Registration form component for modal usage
 */

import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Radio,
  RadioGroup,
  Stack,
} from '@/shared/design-system';
import { authApi, getErrorMessage } from '@/services/api';
import { RegisterData } from '@/types';
import { LANGUAGES, QUIZ_CONSTANTS } from '@/constants/quiz';
import { Language } from '@/types/quiz';
import { REGISTER_CONSTANTS } from '@/constants/auth';

interface RegisterFormProps {
  onRegisterSuccess: () => void;
  onSwitchToLogin: () => void;
  onError?: (error: string) => void;
}

/**
 * Registration form component
 */
export const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegisterSuccess,
  onSwitchToLogin,
  onError,
}) => {
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    name: '',
    age: undefined,
    grade: '',
    preferredLanguage: undefined,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (onError) onError('');
    setLoading(true);

    try {
      await authApi.register(formData);
      onRegisterSuccess();
    } catch (err) {
      const errorMessage = getErrorMessage(err) || 'Registration failed. Please try again.';
      if (onError) onError(errorMessage);
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack spacing={5} align="stretch">
      <Box as="form" width="100%" onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <Box width="100%">
            <Text fontSize="sm" fontWeight="semibold" marginBottom={2} color="gray.700">
              {REGISTER_CONSTANTS.NAME_LABEL} *
            </Text>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={REGISTER_CONSTANTS.NAME_PLACEHOLDER}
              size="lg"
              required
              borderRadius="lg"
              borderColor="gray.300"
              _hover={{ borderColor: 'blue.400' }}
              _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
            />
          </Box>

          <Box width="100%">
            <Text fontSize="sm" fontWeight="semibold" marginBottom={2} color="gray.700">
              {REGISTER_CONSTANTS.EMAIL_LABEL} *
            </Text>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder={REGISTER_CONSTANTS.EMAIL_PLACEHOLDER}
              size="lg"
              required
              autoComplete="email"
              borderRadius="lg"
              borderColor="gray.300"
              _hover={{ borderColor: 'blue.400' }}
              _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
            />
          </Box>

          <Box width="100%">
            <Text fontSize="sm" fontWeight="semibold" marginBottom={2} color="gray.700">
              {REGISTER_CONSTANTS.PASSWORD_LABEL} *
            </Text>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder={REGISTER_CONSTANTS.PASSWORD_PLACEHOLDER}
              size="lg"
              required
              minLength={6}
              autoComplete="new-password"
              borderRadius="lg"
              borderColor="gray.300"
              _hover={{ borderColor: 'blue.400' }}
              _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
            />
          </Box>

          <Box width="100%">
            <Text fontSize="sm" fontWeight="semibold" marginBottom={2} color="gray.700">
              Age (optional)
            </Text>
            <Input
              type="number"
              value={formData.age || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  age: e.target.value ? parseInt(e.target.value, 10) : undefined,
                })
              }
              placeholder={`Age (${QUIZ_CONSTANTS.MIN_AGE}-${QUIZ_CONSTANTS.MAX_AGE})`}
              size="lg"
              min={QUIZ_CONSTANTS.MIN_AGE}
              max={QUIZ_CONSTANTS.MAX_AGE}
              borderRadius="lg"
              borderColor="gray.300"
              _hover={{ borderColor: 'blue.400' }}
              _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
            />
          </Box>

          <Box width="100%">
            <Text fontSize="sm" fontWeight="semibold" marginBottom={2} color="gray.700">
              Grade/Class (optional)
            </Text>
            <Input
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              placeholder="e.g., Class 3, Grade 5"
              size="lg"
              borderRadius="lg"
              borderColor="gray.300"
              _hover={{ borderColor: 'blue.400' }}
              _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
            />
          </Box>

          <Box width="100%">
            <Text fontSize="sm" fontWeight="semibold" marginBottom={2} color="gray.700">
              Preferred Language (optional)
            </Text>
            <RadioGroup
              value={formData.preferredLanguage || ''}
              onChange={(value) =>
                setFormData({ ...formData, preferredLanguage: value as Language })
              }
            >
              <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
                {Object.values(LANGUAGES).map((lang) => (
                  <Radio key={lang} value={lang} size="md">
                    {lang}
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
          </Box>

          <Button
            type="submit"
            colorScheme="purple"
            size="lg"
            width="100%"
            isLoading={loading}
            isDisabled={loading}
            borderRadius="lg"
            fontWeight="bold"
            fontSize="md"
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
            transition="all 0.2s"
          >
            {REGISTER_CONSTANTS.REGISTER_BUTTON}
          </Button>
        </VStack>
      </Box>

      <HStack spacing={2} justifyContent="center" pt={2}>
        <Text fontSize="sm" color="gray.600">
          {REGISTER_CONSTANTS.HAVE_ACCOUNT_TEXT}
        </Text>
        <Button
          variant="link"
          colorScheme="purple"
          size="sm"
          onClick={onSwitchToLogin}
          fontWeight="semibold"
        >
          {REGISTER_CONSTANTS.SIGN_IN_LINK}
        </Button>
      </HStack>
    </VStack>
  );
};

