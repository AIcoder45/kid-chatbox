/**
 * Quiz History Management Component
 * View and manage all quiz history entries in the admin panel
 */

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Text,
  useToast,
  Flex,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@/shared/design-system';
import { adminApi, User } from '@/services/admin';

interface QuizHistoryItem {
  id: string;
  user_id: string;
  timestamp: string;
  subject: string;
  subtopic: string;
  age: number;
  language: string;
  correct_count: number;
  wrong_count: number;
  time_taken: number;
  score_percentage: number;
  explanation_of_mistakes: string;
  user_name: string;
  user_email: string;
  answer_count: number;
}

interface QuizHistoryDetails extends QuizHistoryItem {
  answers: Array<{
    questionNumber: number;
    question: string;
    childAnswer: string;
    correctAnswer: string;
    explanation: string;
    isCorrect: boolean;
    options: unknown;
  }>;
}

/**
 * Quiz History Management component
 */
export const QuizHistoryManagement: React.FC = () => {
  const [history, setHistory] = useState<QuizHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedHistory, setSelectedHistory] = useState<QuizHistoryDetails | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isUserMenuOpen, onOpen: onUserMenuOpen, onClose: onUserMenuClose } = useDisclosure();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [filters, setFilters] = useState({
    userId: '',
    subject: '',
    subtopic: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0,
  });
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [subjectSearchQuery, setSubjectSearchQuery] = useState('');
  const [userPagination, setUserPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [userSortBy, setUserSortBy] = useState<'name' | 'email' | 'created_at'>('name');
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedUserInfo, setSelectedUserInfo] = useState<User | null>(null);
  const toast = useToast();

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.getQuizHistory({
        userId: filters.userId || undefined,
        subject: filters.subject || undefined,
        subtopic: filters.subtopic || undefined,
        page: pagination.page,
        limit: pagination.limit,
      });
      // Normalize score_percentage to ensure it's always a number
      const normalizedHistory = response.results.map((item) => ({
        ...item,
        score_percentage:
          typeof item.score_percentage === 'number'
            ? item.score_percentage
            : Number(item.score_percentage || 0),
        time_taken:
          typeof item.time_taken === 'number' ? item.time_taken : Number(item.time_taken || 0),
        correct_count:
          typeof item.correct_count === 'number' ? item.correct_count : Number(item.correct_count || 0),
        wrong_count:
          typeof item.wrong_count === 'number' ? item.wrong_count : Number(item.wrong_count || 0),
      }));
      setHistory(normalizedHistory);
      setPagination(response.pagination);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load quiz history';
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters.userId, filters.subject, filters.subtopic, pagination.page, pagination.limit]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    loadSubjects();
  }, []);

  useEffect(() => {
    loadUsers();
  }, [userSearchQuery, userPagination.page, userSortBy]);

  const loadSubjects = async () => {
    try {
      const data = await adminApi.getQuizHistoryFilters();
      setAvailableSubjects(data.subjects);
    } catch (err: unknown) {
      console.error('Failed to load subjects:', err);
    }
  };

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const data = await adminApi.getUsers({
        search: userSearchQuery || undefined,
        page: userPagination.page,
        limit: userPagination.limit,
      });
      
      // Sort users based on selected sort option
      let sortedUsers = [...data.users];
      if (userSortBy === 'name') {
        sortedUsers.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      } else if (userSortBy === 'email') {
        sortedUsers.sort((a, b) => (a.email || '').localeCompare(b.email || ''));
      } else if (userSortBy === 'created_at') {
        sortedUsers.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA; // Newest first
        });
      }
      
      setAvailableUsers(sortedUsers);
      const paginationData = data.pagination as { total: number; pages: number };
      setUserPagination({
        ...userPagination,
        total: paginationData.total,
        pages: paginationData.pages,
      });
    } catch (err: unknown) {
      console.error('Failed to load users:', err);
      toast({
        title: 'Error',
        description: 'Failed to load users',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleViewDetails = async (id: string) => {
    try {
      const response = await adminApi.getQuizHistoryDetails(id);
      // Normalize score_percentage and other numeric fields
      const normalizedResult: QuizHistoryDetails = {
        ...response.result,
        answer_count: response.result.answers?.length || 0,
        score_percentage:
          typeof response.result.score_percentage === 'number'
            ? response.result.score_percentage
            : Number(response.result.score_percentage || 0),
        time_taken:
          typeof response.result.time_taken === 'number'
            ? response.result.time_taken
            : Number(response.result.time_taken || 0),
        correct_count:
          typeof response.result.correct_count === 'number'
            ? response.result.correct_count
            : Number(response.result.correct_count || 0),
        wrong_count:
          typeof response.result.wrong_count === 'number'
            ? response.result.wrong_count
            : Number(response.result.wrong_count || 0),
      };
      setSelectedHistory(normalizedResult);
      onOpen();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load quiz details';
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    onDeleteOpen();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);
      await adminApi.deleteQuizHistory(deleteId);
      toast({
        title: 'Success',
        description: 'Quiz history deleted successfully',
        status: 'success',
        duration: 3000,
      });
      onDeleteClose();
      setDeleteId(null);
      loadHistory();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete quiz history';
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 3000,
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && history.length === 0) {
    return (
      <Box textAlign="center" padding={8}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box padding={{ base: 4, md: 6 }}>
      <VStack spacing={{ base: 4, md: 6 }} align="stretch">
        <Heading size={{ base: 'md', md: 'lg' }}>Quiz History Management</Heading>

        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {/* Filters */}
        <Box>
          <VStack spacing={3} align="stretch">
            <HStack spacing={3} flexWrap="wrap">
              {/* User Dropdown */}
              <Box w={{ base: '100%', sm: '280px' }}>
                <Menu isOpen={isUserMenuOpen} onOpen={onUserMenuOpen} onClose={onUserMenuClose} closeOnSelect={false}>
                  <MenuButton
                    as={Button}
                    rightIcon={<Text>▼</Text>}
                    w="100%"
                    textAlign="left"
                    size={{ base: 'sm', md: 'md' }}
                    variant="outline"
                  >
                    {filters.userId
                      ? selectedUserInfo?.name ||
                        availableUsers.find((u) => u.id === filters.userId)?.name ||
                        filters.userId
                      : 'Select User'}
                  </MenuButton>
                  <MenuList maxH="400px" overflowY="auto" w="400px">
                    {/* Search Input */}
                    <Box px={3} py={2} borderBottom="1px" borderColor="gray.200">
                      <Input
                        placeholder="Search users..."
                        value={userSearchQuery}
                        onChange={(e) => {
                          setUserSearchQuery(e.target.value);
                          setUserPagination((prev) => ({ ...prev, page: 1 }));
                        }}
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Box>

                    {/* Sort Options */}
                    <Box px={3} py={2} borderBottom="1px" borderColor="gray.200">
                      <HStack spacing={2}>
                        <Text fontSize="xs" color="gray.600" fontWeight="medium">
                          Sort by:
                        </Text>
                        <Button
                          size="xs"
                          variant={userSortBy === 'name' ? 'solid' : 'ghost'}
                          colorScheme={userSortBy === 'name' ? 'blue' : 'gray'}
                          onClick={() => {
                            setUserSortBy('name');
                            setUserPagination((prev) => ({ ...prev, page: 1 }));
                          }}
                        >
                          Name
                        </Button>
                        <Button
                          size="xs"
                          variant={userSortBy === 'email' ? 'solid' : 'ghost'}
                          colorScheme={userSortBy === 'email' ? 'blue' : 'gray'}
                          onClick={() => {
                            setUserSortBy('email');
                            setUserPagination((prev) => ({ ...prev, page: 1 }));
                          }}
                        >
                          Email
                        </Button>
                        <Button
                          size="xs"
                          variant={userSortBy === 'created_at' ? 'solid' : 'ghost'}
                          colorScheme={userSortBy === 'created_at' ? 'blue' : 'gray'}
                          onClick={() => {
                            setUserSortBy('created_at');
                            setUserPagination((prev) => ({ ...prev, page: 1 }));
                          }}
                        >
                          Date
                        </Button>
                      </HStack>
                    </Box>

                    {/* All Users Option */}
                    <MenuItem
                      onClick={() => {
                        handleFilterChange('userId', '');
                        setUserSearchQuery('');
                        setSelectedUserInfo(null);
                        onUserMenuClose();
                      }}
                    >
                      <Text color="gray.500" fontWeight="medium">All Users</Text>
                    </MenuItem>

                    <Divider />

                    {/* Users List */}
                    {loadingUsers ? (
                      <Box px={3} py={4} textAlign="center">
                        <Spinner size="sm" />
                      </Box>
                    ) : availableUsers.length === 0 ? (
                      <Box px={3} py={4} textAlign="center">
                        <Text color="gray.500" fontSize="sm">No users found</Text>
                      </Box>
                    ) : (
                      <>
                        {availableUsers.map((user) => (
                          <MenuItem
                            key={user.id}
                            onClick={() => {
                              handleFilterChange('userId', user.id);
                              setSelectedUserInfo(user);
                              onUserMenuClose();
                            }}
                          >
                            <VStack align="start" spacing={0} w="100%">
                              <Text fontWeight="medium">{user.name || 'Unknown'}</Text>
                              <Text fontSize="xs" color="gray.500">
                                {user.email}
                              </Text>
                              {user.createdAt && (
                                <Text fontSize="xs" color="gray.400">
                                  Joined: {new Date(user.createdAt).toLocaleDateString()}
                                </Text>
                              )}
                            </VStack>
                          </MenuItem>
                        ))}

                        {/* Pagination Controls */}
                        {userPagination.pages > 1 && (
                          <>
                            <Divider />
                            <Box px={3} py={2}>
                              <HStack justify="space-between" spacing={2}>
                                <Button
                                  size="xs"
                                  onClick={() =>
                                    setUserPagination((prev) => ({
                                      ...prev,
                                      page: Math.max(1, prev.page - 1),
                                    }))
                                  }
                                  isDisabled={userPagination.page === 1}
                                >
                                  Previous
                                </Button>
                                <Text fontSize="xs" color="gray.600">
                                  Page {userPagination.page} of {userPagination.pages}
                                </Text>
                                <Button
                                  size="xs"
                                  onClick={() =>
                                    setUserPagination((prev) => ({
                                      ...prev,
                                      page: Math.min(prev.pages, prev.page + 1),
                                    }))
                                  }
                                  isDisabled={userPagination.page === userPagination.pages}
                                >
                                  Next
                                </Button>
                              </HStack>
                            </Box>
                          </>
                        )}
                      </>
                    )}
                  </MenuList>
                </Menu>
              </Box>

              {/* Subject Dropdown */}
              <Box w={{ base: '100%', sm: '200px' }}>
                <Menu closeOnSelect={true}>
                  <MenuButton
                    as={Button}
                    rightIcon={<Text>▼</Text>}
                    w="100%"
                    textAlign="left"
                    size={{ base: 'sm', md: 'md' }}
                    variant="outline"
                  >
                    {filters.subject || 'Select Subject'}
                  </MenuButton>
                  <MenuList maxH="300px" overflowY="auto">
                    <Box px={3} py={2}>
                      <Input
                        placeholder="Search subjects..."
                        value={subjectSearchQuery}
                        onChange={(e) => setSubjectSearchQuery(e.target.value)}
                        size="sm"
                        mb={2}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Box>
                    <MenuItem
                      onClick={() => {
                        handleFilterChange('subject', '');
                        setSubjectSearchQuery('');
                      }}
                    >
                      <Text color="gray.500">All Subjects</Text>
                    </MenuItem>
                    {availableSubjects
                      .filter(
                        (subject) =>
                          !subjectSearchQuery ||
                          subject.toLowerCase().includes(subjectSearchQuery.toLowerCase())
                      )
                      .map((subject) => (
                        <MenuItem
                          key={subject}
                          onClick={() => {
                            handleFilterChange('subject', subject);
                            setSubjectSearchQuery('');
                          }}
                        >
                          {subject}
                        </MenuItem>
                      ))}
                  </MenuList>
                </Menu>
              </Box>

              {/* Subtopic Input (keeping as text input) */}
              <Input
                placeholder="Filter by Subtopic"
                value={filters.subtopic}
                onChange={(e) => handleFilterChange('subtopic', e.target.value)}
                size={{ base: 'sm', md: 'md' }}
                w={{ base: '100%', sm: '200px' }}
              />
              <Button
                onClick={() => {
                  setFilters({ userId: '', subject: '', subtopic: '' });
                  setUserSearchQuery('');
                  setSubjectSearchQuery('');
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                size={{ base: 'sm', md: 'md' }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </HStack>
          </VStack>
        </Box>

        {/* Table */}
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>User</Th>
                <Th>Subject</Th>
                <Th>Subtopic</Th>
                <Th>Score</Th>
                <Th>Correct/Wrong</Th>
                <Th>Time</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {history.length === 0 ? (
                <Tr>
                  <Td colSpan={8} textAlign="center" py={8}>
                    <Text color="gray.500">No quiz history found</Text>
                  </Td>
                </Tr>
              ) : (
                history.map((item) => (
                  <Tr key={item.id}>
                    <Td>{formatDate(item.timestamp)}</Td>
                    <Td>
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="medium">{item.user_name || 'Unknown'}</Text>
                        <Text fontSize="xs" color="gray.500">
                          {item.user_email}
                        </Text>
                      </VStack>
                    </Td>
                    <Td>{item.subject}</Td>
                    <Td>{item.subtopic}</Td>
                    <Td>
                      <Badge
                        colorScheme={
                          item.score_percentage >= 80
                            ? 'green'
                            : item.score_percentage >= 60
                            ? 'yellow'
                            : 'red'
                        }
                      >
                        {item.score_percentage.toFixed(1)}%
                      </Badge>
                    </Td>
                    <Td>
                      <Text>
                        {item.correct_count}/{item.correct_count + item.wrong_count}
                      </Text>
                    </Td>
                    <Td>{formatTime(item.time_taken)}</Td>
                    <Td>
                      <HStack spacing={2}>
                        <Button
                          size={{ base: 'xs', md: 'sm' }}
                          onClick={() => handleViewDetails(item.id)}
                        >
                          View
                        </Button>
                        <Button
                          size={{ base: 'xs', md: 'sm' }}
                          colorScheme="red"
                          variant="outline"
                          onClick={() => handleDeleteClick(item.id)}
                        >
                          Delete
                        </Button>
                      </HStack>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </Box>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <Flex justify="center" align="center" gap={2}>
            <Button
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              isDisabled={pagination.page === 1}
            >
              Previous
            </Button>
            <Text>
              Page {pagination.page} of {pagination.pages} (Total: {pagination.total})
            </Text>
            <Button
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              isDisabled={pagination.page === pagination.pages}
            >
              Next
            </Button>
          </Flex>
        )}

        {/* View Details Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'full', md: 'xl' }} scrollBehavior="inside">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Quiz History Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedHistory && (
                <VStack spacing={4} align="stretch">
                  <Box>
                    <Text fontWeight="bold" mb={2}>
                      User Information
                    </Text>
                    <Text>
                      <strong>Name:</strong> {selectedHistory.user_name || 'Unknown'}
                    </Text>
                    <Text>
                      <strong>Email:</strong> {selectedHistory.user_email}
                    </Text>
                    <Text>
                      <strong>Date:</strong> {formatDate(selectedHistory.timestamp)}
                    </Text>
                  </Box>

                  <Divider />

                  <Box>
                    <Text fontWeight="bold" mb={2}>
                      Quiz Information
                    </Text>
                    <Text>
                      <strong>Subject:</strong> {selectedHistory.subject}
                    </Text>
                    <Text>
                      <strong>Subtopic:</strong> {selectedHistory.subtopic}
                    </Text>
                    <Text>
                      <strong>Age:</strong> {selectedHistory.age}
                    </Text>
                    <Text>
                      <strong>Language:</strong> {selectedHistory.language}
                    </Text>
                  </Box>

                  <Divider />

                  <Box>
                    <Text fontWeight="bold" mb={2}>
                      Results
                    </Text>
                    <HStack spacing={4}>
                      <Text>
                        <strong>Score:</strong>{' '}
                        <Badge
                          colorScheme={
                            selectedHistory.score_percentage >= 80
                              ? 'green'
                              : selectedHistory.score_percentage >= 60
                              ? 'yellow'
                              : 'red'
                          }
                        >
                          {selectedHistory.score_percentage.toFixed(1)}%
                        </Badge>
                      </Text>
                      <Text>
                        <strong>Correct:</strong> {selectedHistory.correct_count}
                      </Text>
                      <Text>
                        <strong>Wrong:</strong> {selectedHistory.wrong_count}
                      </Text>
                      <Text>
                        <strong>Time:</strong> {formatTime(selectedHistory.time_taken)}
                      </Text>
                    </HStack>
                  </Box>

                  {selectedHistory.explanation_of_mistakes && (
                    <>
                      <Divider />
                      <Box>
                        <Text fontWeight="bold" mb={2}>
                          Explanation of Mistakes
                        </Text>
                        <Text whiteSpace="pre-wrap">{selectedHistory.explanation_of_mistakes}</Text>
                      </Box>
                    </>
                  )}

                  {selectedHistory.answers && selectedHistory.answers.length > 0 && (
                    <>
                      <Divider />
                      <Box>
                        <Text fontWeight="bold" mb={2}>
                          Answers ({selectedHistory.answers.length} questions)
                        </Text>
                        <VStack spacing={3} align="stretch">
                          {selectedHistory.answers
                            .sort((a, b) => a.questionNumber - b.questionNumber)
                            .map((answer, idx) => (
                              <Box
                                key={idx}
                                p={3}
                                border="1px"
                                borderColor={answer.isCorrect ? 'green.200' : 'red.200'}
                                borderRadius="md"
                                bg={answer.isCorrect ? 'green.50' : 'red.50'}
                              >
                                <HStack justify="space-between" mb={2}>
                                  <Text fontWeight="bold">Question {answer.questionNumber}</Text>
                                  <Badge colorScheme={answer.isCorrect ? 'green' : 'red'}>
                                    {answer.isCorrect ? 'Correct' : 'Wrong'}
                                  </Badge>
                                </HStack>
                                <Text mb={1}>
                                  <strong>Q:</strong> {answer.question}
                                </Text>
                                <Text mb={1}>
                                  <strong>Child's Answer:</strong> {answer.childAnswer || 'N/A'}
                                </Text>
                                <Text mb={1}>
                                  <strong>Correct Answer:</strong> {answer.correctAnswer}
                                </Text>
                                {answer.explanation && (
                                  <Text fontSize="sm" color="gray.600" mt={1}>
                                    <strong>Explanation:</strong> {answer.explanation}
                                  </Text>
                                )}
                              </Box>
                            ))}
                        </VStack>
                      </Box>
                    </>
                  )}
                </VStack>
              )}
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Delete Quiz History</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>Are you sure you want to delete this quiz history entry? This action cannot be undone.</Text>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onDeleteClose} isDisabled={deleting}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteConfirm} isLoading={deleting}>
                Delete
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
};

