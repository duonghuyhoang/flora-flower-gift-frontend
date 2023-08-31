import { useState } from "react";
import { Button, Input } from "antd";
import { MessageOutlined } from "@ant-design/icons";

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const toggleChatBox = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() !== "") {
      const newMessage = {
        text: inputValue,
        timestamp: new Date().getTime(),
        sender: "user",
      };
      setMessages([...messages, newMessage]);
      setInputValue("");
    }
  };

  return (
    <div className={`chat-box ${isOpen ? "open" : ""}`}>
      <Button
        type='primary'
        shape='circle'
        size='large'
        icon={<MessageOutlined />}
        onClick={toggleChatBox}
      />
      <div className='chat-messages'>
        {messages.map((message, index) => (
          <div key={index} className={`chat-message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className='chat-input'>
        <Input
          placeholder='Type your message...'
          value={inputValue}
          onChange={handleInputChange}
          onPressEnter={handleSendMessage}
        />
        <Button type='primary' onClick={handleSendMessage}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatBox;
