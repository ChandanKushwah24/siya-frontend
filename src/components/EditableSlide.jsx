import { Box, Image, Text, VStack, tokenToCSSVar, useDisclosure } from '@chakra-ui/react';
import { API_CONFIG } from '../config';
import { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-resizable/css/styles.css';

/**
 * EditableSlide Component
 * 
 * A dynamic slide component that supports rich text editing, image handling, and interactive elements.
 * Features:
 * - Rich text editing for title, subtitle, and content
 * - Drag and drop image placement
 * - Resizable image containers
 * - Click-to-edit functionality
 * 
 * @param {Object} content - The slide content including text and images
 * @param {Function} onContentChange - Callback for content updates
 * @param {Function} onElementSelect - Callback when an element is selected
 */
const EditableSlide = ({ content, onContentChange, onElementSelect }) => {
  // State and refs for managing editing state
  const [editingElement, setEditingElement] = useState(null);  // Tracks which element is being edited
  const quillRef = useRef();  // Reference to the Quill editor instance

  // Setup click-outside detection for editor
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /**
   * Handles click events on text elements to enable editing
   * @param {string} element - The element identifier (title, subtitle, content)
   */
  const handleTextClick = (element) => {
    setEditingElement(element);
    onElementSelect(element);
  };

  /**
   * Updates the content when text is changed in the editor
   * @param {string} value - The new text content
   * @param {string} element - The element being edited
   */
  const handleTextChange = (value, element) => {
    onContentChange(element, value);
  };

  const handleSaveClick = () => {
    setEditingElement(null);
  };

  /**
   * Handles clicks outside the editor to exit editing mode
   * @param {Event} event - The click event
   */
  const handleClickOutside = (event) => {
    const isClickInsideEditor = event.target.closest('.ql-editor') || event.target.closest('.ql-toolbar');
    const isClickOnText = event.target.closest('[data-element]');
    
    if (!isClickInsideEditor && !isClickOnText) {
      setEditingElement(null);
    }
  };

  const [selectedFiles, setSelectedFiles] = useState([]);

  /**
   * Handles image file uploads and creates preview URLs
   * @param {Event} e - The file input change event
   */
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles([...selectedFiles, ...files]);
    
    // Create temporary URLs for preview
    const tempUrls = files.map(file => URL.createObjectURL(file));
    console.log('tempUrls, files', content.selectedFiles);
    onContentChange('images', [...content.images, ...tempUrls]);
    onContentChange('selectedFiles', [...content.selectedFiles, ...files]);
  };

  // Expose selected files to parent component
  useEffect(() => {
    onElementSelect({ type: 'images', files: selectedFiles });
  }, [selectedFiles]);

  // Cleanup URLs when component unmounts
  useEffect(() => {
    return () => {
      content.images.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);


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
            dangerouslySetInnerHTML={{ __html: content.title }}
            data-element="title"
          />
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
            dangerouslySetInnerHTML={{ __html: content.subtitle }}
            data-element="subtitle"
          />
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
            dangerouslySetInnerHTML={{ __html: content.content }}
            data-element="content"
          />
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