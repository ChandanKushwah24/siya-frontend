import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const validateForm = () => {
    const newErrors = {};
    
    // Username validation
    if (formData.username.length < 3 || formData.username.length > 50) {
      newErrors.username = 'Username must be between 3 and 50 characters';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, underscores, and hyphens';
    }

    // Email validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password validation
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one lowercase letter';
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number';
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one special character';
    }

    // Phone validation
    if (!/^\+91[1-9][0-9]{9}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format. Please use Indian international format (e.g., +911234567890)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await signup(formData);
      toast({
        title: 'Account created successfully',
        description: 'Please login with your credentials',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Signup failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
// ... existing imports and code ...

return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <Text fontSize="2xl" fontWeight="bold" mb={4} color="black">Create Your Account</Text>

          <FormControl isInvalid={errors.username} isRequired>
            <FormLabel htmlFor="username" color="black">Username *</FormLabel>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="johndoe123"
              aria-describedby="username-helper"
            />
            <FormHelperText id="username-helper" color="black">
              {errors.username || "3-50 characters: letters, numbers, underscores, or hyphens only"}
            </FormHelperText>
          </FormControl>

          <FormControl isInvalid={errors.email} isRequired>
            <FormLabel htmlFor="email" color="black">Email Address *</FormLabel>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john.doe@example.com"
              aria-describedby="email-helper"
            />
            <FormHelperText id="email-helper" color="black">
              {errors.email || "Your email will be used for account verification"}
            </FormHelperText>
          </FormControl>

          <FormControl isInvalid={errors.password} isRequired>
            <FormLabel htmlFor="password" color="black">Password *</FormLabel>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              aria-describedby="password-helper"
            />
            <FormHelperText id="password-helper" color="black">
              {errors.password || "Minimum 8 characters with uppercase, lowercase, number, and special character"}
            </FormHelperText>
          </FormControl>

          <FormControl isInvalid={errors.phone} isRequired>
            <FormLabel htmlFor="phone" color="black">Phone Number *</FormLabel>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91XXXXXXXXXX"
              aria-describedby="phone-helper"
            />
            <FormHelperText id="phone-helper" color="black">
              {errors.phone || "Indian format: +91 followed by 10 digits"}
            </FormHelperText>
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            isLoading={isLoading}
          >
            Create Account
          </Button>
        </VStack>
      </form>
    </Box>
  );

// ... rest of the code


};

export default SignupForm;