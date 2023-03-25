import axios from 'axios';

export const fetchPictures = async query => {
  const axiosParams = {
    method: 'get',
    baseURL: 'https://pixabay.com/api/',
    params: {
      key: '23189800-058574acc8566088f091aab47',
      q: `${query}`,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    },
  };

  try {
    const response = await axios(axiosParams);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
