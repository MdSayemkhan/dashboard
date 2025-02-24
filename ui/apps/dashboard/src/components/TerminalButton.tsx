import { FC } from 'react';
import { requestWebTerminal } from '../api/terminal';  // Import API function
import { CodeOutlined } from '@ant-design/icons'; // Use an existing icon

const TerminalButton: FC = () => {
  const handleClick = async () => {
    try {
      const response = await requestWebTerminal(); // Call the API function
      if (response.message) {
        console.log('Web Terminal Created:', response.message);
        const userUUID = response.message.split('-')[1]; // Extract UUID from the message
        openWebSocket(userUUID); // Call the function to open WebSocket
      } else {
        console.error('Failed to create terminal');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const openWebSocket = (userUUID: string) => {
    const ws = new WebSocket(`ws://<kubernetes-cluster-url>/ttyd-${userUUID}/ws`); // Replace with your cluster URL

    ws.onopen = () => {
      console.log('WebSocket connection established');
      // You can send initial messages or commands here if needed
    };

    ws.onmessage = (event) => {
      console.log('Message from server:', event.data);
      // Handle incoming messages from the terminal
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };
  };

  return (
    <div onClick={handleClick} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
      <CodeOutlined style={{ fontSize: '20px', marginRight: '8px' }} />
      Open Web Terminal
    </div>
  );
};

export default TerminalButton;