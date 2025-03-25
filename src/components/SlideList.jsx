import { Box, SimpleGrid, Image, Text, VStack, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { API_CONFIG } from '../config';
// import DOMPurify from 'dompurify';

const SlideList = () => {
  const [slides, setSlides] = useState([]);
  const toast = useToast();

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_CONFIG.baseURL}/slides`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch slides');
      }

      const data = await response.json();
      setSlides(data);
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
    <Box p={8}>
      <SimpleGrid columns={[1, 2, 3, 4]} spacing={6}>
        {slides.map((slide) => (
          <VStack
            key={slide.id}
            p={4}
            bg="white"
            borderRadius="md"
            boxShadow="md"
            spacing={3}
          >
            <Box
              w="100%"
              h="200px"
              bg={slide.theme.backgroundColor}
              borderRadius="md"
              p={4}
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <Text
                fontSize={slide.theme.titleFontSize}
                color={slide.theme.textColor}
                fontFamily={slide.theme.fontFamily}
                textAlign="center"
              >
                {stripHtmlTags(slide.title || '')}
              </Text>
              <Text
                fontSize={slide.theme.subtitleFontSize}
                color={slide.theme.textColor}
                fontFamily={slide.theme.fontFamily}
                textAlign="center"
                mt={2}
              >
                {slide.subtitle}
              </Text>
            </Box>
            {slide.images && slide.images.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt={`Slide image ${index + 1}`}
                maxH="100px"
                objectFit="contain"
              />
            ))}
          </VStack>
        ))}

        { !slides.length &&
          <Text
          fontSize={30}
          color={'black'}
          textAlign="center"
        >
          {"No Slider Found"}
        </Text>
        }
      </SimpleGrid>
    </Box>
  );
};

export default SlideList;

const stripHtmlTags = (html) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};