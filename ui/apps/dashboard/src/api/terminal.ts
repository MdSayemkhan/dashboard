import axios from 'axios'

export const requestWebTerminal = async () => {
  try {
    const response = await axios.post('/api/v1/misc/terminal');
    return response.data;
  } catch (error) {
    throw new Error('Error creating web terminal: ' + error);
  }
};