import { Box, SimpleGrid, Text, useColorMode, Image } from '@chakra-ui/react';
import { API_CONFIG } from '../config';
import { useState, useEffect } from 'react';

const TemplateSelector = ({ onTemplateSelect }) => {
  const [templates, setTemplates] = useState([]);
  const { colorMode } = useColorMode();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch(`${API_CONFIG.baseURL}/templates`);
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  return (
    <Box
      bg={colorMode === 'dark' ? 'gray.700' : 'white'}
      p={4}
      borderRadius="md"
      boxShadow="sm"
      mb={4}
    >
      <Text fontSize="lg" fontWeight="bold" mb={4}>
        Select Template
      </Text>
      <SimpleGrid columns={3} spacing={4}>
        {templates.map((template) => (
          <Box
            key={template.id}
            bg={colorMode === 'dark' ? 'gray.600' : 'gray.50'}
            p={3}
            borderRadius="md"
            cursor="pointer"
            onClick={() => onTemplateSelect(template)}
            _hover={{ transform: 'scale(1.02)', transition: 'transform 0.2s' }}
          >
            <Image
              src={template.preview_image || 'default-template.svg'}
              alt={template.name}
              mb={2}
              borderRadius="sm"
            />
            <Text fontSize="sm" fontWeight="medium">
              {template.name}
            </Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default TemplateSelector;