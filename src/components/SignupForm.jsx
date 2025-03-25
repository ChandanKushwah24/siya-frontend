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
  FormHelperText
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const validateField = (name, value, errors) => {
    switch (name) {
      case 'username':
        if (value.length < 3 || value.length > 50) {
          errors.username = 'Username must be between 3 and 50 characters';
        } else if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
          errors.username = 'Username can only contain letters, numbers, underscores, and hyphens';
        }
        break;
      
      case 'email':
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(value)) {
          errors.email = 'Invalid email format';
        }
        break;
      
      case 'password':
        if (value.length < 8) {
          errors.password = 'Password must be at least 8 characters long';
        } else if (!/[A-Z]/.test(value)) {
          errors.password = 'Password must contain at least one uppercase letter';
        } else if (!/[a-z]/.test(value)) {
          errors.password = 'Password must contain at least one lowercase letter';
        } else if (!/\d/.test(value)) {
          errors.password = 'Password must contain at least one number';
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
          errors.password = 'Password must contain at least one special character';
        }
        break;

    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      validateField(field, formData[field], newErrors);
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (!isSubmitted) return;
    
    const newErrors = {};
    validateField(name, value, newErrors);
    setErrors(prev => ({
      ...prev,
      [name]: newErrors[name]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
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

return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <Text fontSize="2xl" fontWeight="bold" mb={4} color="black">Create Your Account</Text>

          <FormControl isInvalid={isSubmitted && errors.username} isRequired>
            <FormLabel htmlFor="username" color="black">Username *</FormLabel>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="johndoe123"
              aria-describedby="username-helper"
              color="black"
              _placeholder={{ color: 'gray.500' }}
            />
            <FormHelperText id="username-helper" color={errors.username ? 'red.500' : 'gray.600'}>
              {errors.username && isSubmitted ? errors.username : ""}
            </FormHelperText>
          </FormControl>

          <FormControl isInvalid={isSubmitted && errors.email} isRequired>
            <FormLabel htmlFor="email" color="black">Email Address *</FormLabel>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john.doe@example.com"
              aria-describedby="email-helper"
              color="black"
              _placeholder={{ color: 'gray.500' }}
            />
            <FormHelperText id="email-helper" color={errors.email ? 'red.500' : 'gray.600'}>
              {errors.email && isSubmitted ? errors.email : ""}
            </FormHelperText>
          </FormControl>

          <FormControl isInvalid={isSubmitted && errors.password} isRequired>
            <FormLabel htmlFor="password" color="black">Password *</FormLabel>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              aria-describedby="password-helper"
              color="black"
              _placeholder={{ color: 'gray.500' }}
            />
            <FormHelperText id="password-helper" color={errors.password ? 'red.500' : 'gray.600'}>
              {errors.password && isSubmitted ? errors.password : ""}
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

};

export default SignupForm;