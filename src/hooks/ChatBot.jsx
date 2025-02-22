import React, { useState, useEffect, useRef } from 'react';
import { useUser } from './userContext';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const user = useUser();
  // Referință pentru containerul de mesaje
  const messagesEndRef = useRef(null);

  // Funcție pentru scroll automat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Efect pentru scroll automat la fiecare schimbare a listei de mesaje
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    // Adăugăm mesajul utilizatorului în lista de mesaje
    const userMessage = {
      text: inputValue,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages([...messages, userMessage]);
    setInputValue('');

    // Trimitem mesajul la API-ul DeepSeek
    try {
      const response = await fetch('https://api.deepseek.com/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${process.env.REACT_APP_DEEPSEEK}`, // Înlocuiește cu cheia ta API
        },
        body: JSON.stringify({
          message: inputValue,
        }),
        
      });

      const data = await response.json();
      const botMessage = {
        text: data.response,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages([...messages, userMessage, botMessage]);
    } catch (error) {
      console.error('Error sending message to DeepSeek:', error);
      const errorMessage = {
        text: 'Chatbot is not available in this moment. Please try again tomorrow.',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages([...messages, userMessage, errorMessage]);
    }
  };

  return (
    <div className="fixed bottom-4 right-4">
      {/* Butonul cu bubble head */}
      <button
        onClick={toggleChat}
        className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-blue-600 transition duration-300"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          ></path>
        </svg>
      </button>

      {/* Panoul de chat */}
      {isOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-80 h-[500px] flex flex-col absolute bottom-16 right-0">
          {/* Header */}
          <div className="bg-blue-500 text-white p-4 rounded-t-lg flex justify-between items-center">
            <img
              className="w-10 h-10 rounded-full"
              src="https://plus.unsplash.com/premium_photo-1739538269027-7c69b6cc83a7?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="User Avatar"
            />
            <h2 className="text-lg font-semibold">Chatbot</h2>
            <button
              onClick={toggleChat}
              className="text-white hover:text-gray-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          {/* Mesajele */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-2.5 ${
                  message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar */}
                <img
                  className="w-8 h-8 rounded-full"
                  src={
                    message.sender === 'user'
                      ? user?.photoURL || 'https://flowbite.com/docs/images/people/profile-picture-2.jpg'
                      : 'https://plus.unsplash.com/premium_photo-1739538269027-7c69b6cc83a7?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                  }
                  alt={`${message.sender} image`}
                />
                {/* Container pentru mesaj și timestamp */}
                <div
                  className={`flex flex-col gap-1 w-full max-w-[320px] ${
                    message.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  {/* Nume și timestamp */}
                  <div className="flex mt-1 items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {message.sender === 'user' ? 'You' : 'Chatbot'}
                    </span>
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                      {message.timestamp}
                    </span>
                  </div>
                  {/* Mesajul */}
                  <div
                    className={`flex flex-col leading-1.5 px-4 py-2 border-gray-200 rounded-e-xl rounded-es-xl ${
                      message.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    <p className="text-sm font-normal">{message.text}</p>
                  </div>
                  {/* Status (opțional) */}
                  {message.sender === 'user' && (
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                      Delivered
                    </span>
                  )}
                </div>
              </div>
            ))}
            {/* Element gol pentru scroll automat */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input pentru mesaje */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Type a message..."
              />
              <button
                onClick={handleSendMessage}
                className="ml-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;