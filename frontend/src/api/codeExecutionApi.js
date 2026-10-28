import axios from 'axios';

// We are pivoting to our own AI-simulated code execution backend
// to bypass Piston API whitelist restrictions.
const API_BASE_URL = 'http://localhost:8080/api/v1';

export const executeCode = async (language, sourceCode, mode = 'run') => {
  try {
    const response = await axios.post(`${API_BASE_URL}/code/execute`, {
      language: language,
      code: sourceCode,
      mode: mode
    });

    // Our backend will return { run: { output: "simulated output..." } }
    // or plain text, depending on how we structure CodeExecutionController.
    // Let's assume it returns { output: "..." } and we map it to match what the UI expects.
    return {
      run: {
        output: response.data.output || response.data
      }
    };
  } catch (error) {
    console.error('Code execution failed:', error);
    throw new Error(error.response?.data?.message || 'Failed to execute code');
  }
};

