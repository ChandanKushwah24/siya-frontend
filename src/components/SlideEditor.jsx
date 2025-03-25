import { Box, Flex, useDisclosure, Button, HStack, useToast } from '@chakra-ui/react';
import { API_CONFIG } from '../config';
import { useState } from 'react';
import EditableSlide from './EditableSlide';
import ThemeSidebar from './ThemeSidebar';
import ToolbarPanel from './ToolbarPanel';
import TemplateSelector from './TemplateSelector';

const SlideEditor = () => {
  const [selectedElement, setSelectedElement] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [slideContent, setSlideContent] = useState({
    title: 'Click to edit title',
    subtitle: 'Click to edit subtitle',
    content: 'Click to edit content',
    images: [],
    theme: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      fontFamily: 'Arial',
      titleFontSize: '32px',
      subtitleFontSize: '24px',
      contentFontSize: '16px'
    }
  });

  const handleContentChange = (key, value) => {
    setSlideContent(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleThemeChange = (themeUpdates) => {
    setSlideContent(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        ...themeUpdates
      }
    }));
  };

  const handleElementSelect = (element) => {
    setSelectedElement(element);
  };

  const handleTemplateSelect = (template) => {
    setSlideContent(prev => ({
      ...prev,
      ...template.layout,
      theme: template.theme || prev.theme
    }));
    onClose();
  };

  const handleSaveSlide = async () => {
    try {
      const response = await fetch(`${API_CONFIG.baseURL}/slides`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(slideContent),
      });
      
      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Slide saved successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error('Failed to save slide');
      }
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
        {isOpen && <TemplateSelector onTemplateSelect={handleTemplateSelect} />}
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