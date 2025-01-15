import React, { useEffect, useState } from 'react';
import { DirectLine } from 'botframework-directlinejs';

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [directLineClient, setDirectLineClient] = useState(null);

  useEffect(() => {
    // Initialize DirectLine client
    const client = new DirectLine({ 
      token: process.env.REACT_APP_DIRECT_LINE_SECRET 
    });
    setDirectLineClient(client);

    // Start conversation and get conversation ID
    client.conversations.startConversation().subscribe(
      conversation => {
        setConversationId(conversation.conversationId);
        // Send user token after conversation starts
        sendUserToken(conversation.conversationId, client);
      }
    );
  }, []);

  useEffect(() => {
    if (!directLineClient) return;

    // Subscribe to incoming messages
    const subscription = directLineClient.activity$.subscribe((activity) => {
      if (activity.type === 'message') {
        setMessages((prev) => [...prev, activity]);
      }
    });

    return () => subscription.unsubscribe();
  }, [directLineClient]);

  const sendUserToken = async (convId, client) => {
    try {
      const tokenActivity = {
        type: 'event',
        name: 'tokens/response',
        value: {
          token: process.env.REACT_APP_USER_TOKEN
        },
        from: { 
          id: 'user17609',
          name: 'User'
        },
        conversation: { 
          id: convId 
        }
      };

      // Send token using DirectLine postActivity
      await client.postActivity(tokenActivity).toPromise();
      console.log('Token sent successfully!');
    } catch (error) {
      console.error('Error sending token:', error);
    }
  };

  const sendMessage = (text) => {
    if (!directLineClient || !conversationId) return;

    directLineClient
      .postActivity({
        from: { id: 'user17609', name: 'User' },
        type: 'message',
        text,
        conversation: { id: conversationId }
      })
      .subscribe(
        id => console.log('Message sent'),
        error => console.error('Error sending message:', error)
      );
  };

  return (
    <div className="p-4">
      <div className="mb-4 border rounded p-4 h-96 overflow-y-auto">
        {messages.map((msg, index) => (
          <p key={index} className="mb-2">
            <strong>{msg.from.name}:</strong> {msg.text}
          </p>
        ))}
      </div>
      <input
        type="text"
        className="w-full p-2 border rounded"
        placeholder="Type a message and press Enter"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            sendMessage(e.target.value);
            e.target.value = '';
          }
        }}
      />
    </div>
  );
};

export default ChatApp;