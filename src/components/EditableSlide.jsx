import { Box, Image, Text, VStack, useDisclosure } from '@chakra-ui/react';
import { API_CONFIG } from '../config';
import { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-resizable/css/styles.css';

const EditableSlide = ({ content, onContentChange, onElementSelect }) => {
  const [editingElement, setEditingElement] = useState(null);
  const quillRef = useRef();

  const handleTextClick = (element) => {
    setEditingElement(element);
    onElementSelect(element);
  };

  const handleTextChange = (value, element) => {
    onContentChange(element, value);
    setEditingElement(null);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch(`${API_CONFIG.baseURL}/upload-image`, {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        onContentChange('images', [...content.images, data.image_data]);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  return (
    <Box
      w="100%"
      h="600px"
      bg={content.theme.backgroundColor}
      color={content.theme.textColor}
      p={8}
      position="relative"
      boxShadow="lg"
      borderRadius="md"
    >
      <VStack spacing={6} align="stretch">
        {editingElement === 'title' ? (
          <ReactQuill
            ref={quillRef}
            value={content.title}
            onChange={(value) => handleTextChange(value, 'title')}
            style={{
              fontSize: content.theme.titleFontSize,
              fontFamily: content.theme.fontFamily,
            }}
          />
        ) : (
          <Text
            fontSize={content.theme.titleFontSize}
            fontFamily={content.theme.fontFamily}
            fontWeight="bold"
            onClick={() => handleTextClick('title')}
            cursor="pointer"
          >
            {content.title}
          </Text>
        )}

        {editingElement === 'subtitle' ? (
          <ReactQuill
            ref={quillRef}
            value={content.subtitle}
            onChange={(value) => handleTextChange(value, 'subtitle')}
            style={{
              fontSize: content.theme.subtitleFontSize,
              fontFamily: content.theme.fontFamily,
            }}
          />
        ) : (
          <Text
            fontSize={content.theme.subtitleFontSize}
            fontFamily={content.theme.fontFamily}
            onClick={() => handleTextClick('subtitle')}
            cursor="pointer"
          >
            {content.subtitle}
          </Text>
        )}

        {content.images.map((image, index) => (
          <Draggable key={index} bounds="parent">
            <ResizableBox
              width={200}
              height={200}
              minConstraints={[100, 100]}
              maxConstraints={[500, 500]}
            >
              <Image
                src={image}
                alt={`Slide image ${index + 1}`}
                objectFit="cover"
                w="100%"
                h="100%"
              />
            </ResizableBox>
          </Draggable>
        ))}

        {editingElement === 'content' ? (
          <ReactQuill
            ref={quillRef}
            value={content.content}
            onChange={(value) => handleTextChange(value, 'content')}
            style={{
              fontSize: content.theme.contentFontSize,
              fontFamily: content.theme.fontFamily,
            }}
          />
        ) : (
          <Text
            fontSize={content.theme.contentFontSize}
            fontFamily={content.theme.fontFamily}
            onClick={() => handleTextClick('content')}
            cursor="pointer"
          >
            {content.content}
          </Text>
        )}
      </VStack>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: 'none' }}
        id="image-upload"
      />
    </Box>
  );
};

export default EditableSlide;