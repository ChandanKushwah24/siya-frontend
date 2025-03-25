import { Box, Button, Flex, Spacer, Link as ChakraLink } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box p={4} bg="blue.500" color="white">
      <Flex align="center">
        <ChakraLink as={RouterLink} to="/" fontSize="xl" fontWeight="bold">
          Pitch Deck Editor
        </ChakraLink>
        <Spacer />
        {user ? (
          <Button colorScheme="whiteAlpha" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <Flex gap={4}>
            <ChakraLink as={RouterLink} to="/login">
              Login
            </ChakraLink>
            <ChakraLink as={RouterLink} to="/signup">
              Sign Up
            </ChakraLink>
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default Header;