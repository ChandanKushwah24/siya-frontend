import { Box, SimpleGrid, Text, useColorMode, Image, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { API_CONFIG } from '../config';
import { useState, useEffect } from 'react';
const TemplateSelector = ({ onTemplateSelect, isOpen, onClose }) => {
  const [templates, setTemplates] = useState([]);
  const { colorMode } = useColorMode();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    const token = localStorage.getItem('token') ? localStorage.getItem('token') : "";

    try {
      const response = await fetch(`${API_CONFIG.baseURL}/templates`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}` 
        },
      });
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent
        bg={colorMode === 'dark' ? 'gray.700' : 'white'}
        maxW="900px"
      >
        <ModalHeader>Select Template</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
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
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TemplateSelector;