import React from 'react';
import { useMessage } from './MessageProvider';

const MessageBox = () => {
  const { message } = useMessage();

  if (!message) return null;

  const bgColor = message.type === 'success' ? 'bg-success' : 'bg-danger';

  return (
    <div
      className={`alert ${bgColor} text-white position-fixed top-0 start-50 translate-middle-x mt-3 px-4 py-2 shadow rounded`}
      style={{ zIndex: 9999 }}
    >
      {message.text}
    </div>
  );
};

export default MessageBox;