import axios from 'axios';

export const fetchPictures = async picture => {
  const filterParams =
    '&image_type=photo&orientation=horizontal&safesearch=true';
  const API_KEY = '?key=23189800-058574acc8566088f091aab47';
  const BASE_URL = 'https://pixabay.com/api/';

  try {
    const response = await axios.get(
      `${BASE_URL}${API_KEY}&q=${picture}${filterParams}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};


