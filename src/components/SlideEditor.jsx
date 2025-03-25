import { Box, Flex, useDisclosure, Button, HStack, useToast } from '@chakra-ui/react';
import { API_CONFIG } from '../config';
import { useState } from 'react';
import EditableSlide from './EditableSlide';
import ThemeSidebar from './ThemeSidebar';
import ToolbarPanel from './ToolbarPanel';
import TemplateSelector from './TemplateSelector';
import { useNavigate } from 'react-router-dom';

/**
 * SlideEditor Component
 * 
 * A comprehensive slide editor that allows users to create and edit presentation slides.
 * Features include:
 * - Text editing with rich formatting
 * - Image upload and manipulation
 * - Theme customization
 * - Template selection
 * - Auto-saving and navigation
 */
const SlideEditor = () => {
  // Hooks for navigation and UI state management
  const navigate = useNavigate();
  const [selectedElement, setSelectedElement] = useState(null);  // Tracks currently selected slide element
  const { isOpen, onOpen, onClose } = useDisclosure();  // Controls template selector modal
  const toast = useToast();  // For displaying status messages

  // Main slide content state including theme settings
  const [slideContent, setSlideContent] = useState({
    title: 'Click to edit title',
    subtitle: 'Click to edit subtitle',
    content: 'Click to edit content',
    images: [],
    selectedFiles: [],
    theme: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      fontFamily: 'Arial',
      titleFontSize: '32px',
      subtitleFontSize: '24px',
      contentFontSize: '16px'
    }
  });

  /**
   * Updates slide content for a specific field
   * @param {string} key - The field to update (title, subtitle, content, etc.)
   * @param {any} value - The new value for the field
   */
  const handleContentChange = (key, value) => {
    setSlideContent(prev => ({
      ...prev,
      [key]: value
    }));
  };

  /**
   * Updates theme settings while preserving other theme properties
   * @param {Object} themeUpdates - Object containing theme properties to update
   */
  const handleThemeChange = (themeUpdates) => {
    setSlideContent(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        ...themeUpdates
      }
    }));
  };

  /**
   * Updates the currently selected element for editing
   * @param {Object|string} element - The selected element or element identifier
   */
  const handleElementSelect = (element) => {
    setSelectedElement(element);
  };

  /**
   * Applies selected template to the current slide
   * @param {Object} template - Template containing layout and theme settings
   */
  const handleTemplateSelect = (template) => {
    setSlideContent(prev => ({
      ...prev,
      ...template.layout,
      theme: template.theme || prev.theme
    }));
    onClose();
  };

  /**
   * Saves the slide content and uploads any associated images
   * Handles both slide data persistence and image upload to server
   */
  const handleSaveSlide = async () => {
    const token = localStorage.getItem('token') ? localStorage.getItem('token') : "";
    try {
      const response = await fetch(`${API_CONFIG.baseURL}/slides`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(slideContent),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create slide');
      }
      
      const slideData = await response.json();
      const slideId = slideData.id;
      
      // Upload images one by one
      const newImages = slideContent.selectedFiles;
      const uploadedImageUrls = [];

      for (const file of newImages) {
        const formData = new FormData();
        formData.append('slideId', slideId);
        formData.append('file', file);

        const uploadResponse = await fetch(`${API_CONFIG.baseURL}/upload-image`, {
          method: 'POST',
          headers: {
            "Authorization": `Bearer ${token}`
          },
          body: formData
        });

        if (!uploadResponse.ok) {
          throw new Error(`Failed to upload image: ${file.name}`);
        }

        const uploadData = await uploadResponse.json();
        uploadedImageUrls.push(uploadData.image_data);
      }

      toast({
        title: 'Success',
        description: 'Slide and images saved successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Navigate to the slides list
      navigate('/slides');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex h="calc(100vh - 60px)">
      <Box flex="1" p={4}>
        <HStack spacing={4} mb={4}>
          <Button colorScheme="blue" onClick={onOpen}>Choose Template</Button>
          <Button colorScheme="green" onClick={handleSaveSlide}>Save Slide</Button>
        </HStack>
        <TemplateSelector isOpen={isOpen} onClose={onClose} onTemplateSelect={handleTemplateSelect} />
        <ToolbarPanel
          selectedElement={selectedElement}
          onContentChange={handleContentChange}
          onThemeChange={handleThemeChange}
        />
        <EditableSlide
          content={slideContent}
          onContentChange={handleContentChange}
          onElementSelect={handleElementSelect}
        />
      </Box>
      <ThemeSidebar
        theme={slideContent.theme}
        onThemeChange={handleThemeChange}
      />
    </Flex>
  );
};

export default SlideEditor;