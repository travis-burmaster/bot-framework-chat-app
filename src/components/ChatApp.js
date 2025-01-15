import React, { useEffect, useState } from 'react';
import { DirectLine } from 'botframework-directlinejs';

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [directLineClient, setDirectLineClient] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeDirectLine = async () => {
      try {
        if (!process.env.REACT_APP_DIRECT_LINE_SECRET) {
          throw new Error('Direct Line secret is not configured');
        }

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
          },
          error => {
            console.error('Conversation start error:', error);
            setError('Failed to start conversation. Please check your Direct Line secret.');
          }
        );
      } catch (err) {
        console.error('Initialization error:', err);
        setError(err.message);
      }
    };

    initializeDirectLine();

    return () => {
      if (directLineClient) {
        // Cleanup subscriptions if needed
        directLineClient.end();
      }
    };
  }, []);

  useEffect(() => {
    if (!directLineClient) return;

    // Subscribe to incoming messages
    const subscription = directLineClient.activity$.subscribe(
      (activity) => {
        if (activity.type === 'message') {
          setMessages((prev) => [...prev, activity]);
        }
      },
      error => {
        console.error('Message subscription error:', error);
        setError('Failed to receive messages. Please refresh the page.');
      }
    );

    return () => subscription.unsubscribe();
  }, [directLineClient]);

  const sendUserToken = async (convId, client) => {
    try {
      if (!process.env.REACT_APP_USER_TOKEN) {
        console.warn('User token is not configured');
        return;
      }

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
      setError('Failed to send authentication token.');
    }
  };

  const sendMessage = (text) => {
    if (!directLineClient || !conversationId) {
      setError('Chat is not ready. Please wait or refresh the page.');
      return;
    }

    directLineClient
      .postActivity({
        from: { id: 'user17609', name: 'User' },
        type: 'message',
        text,
        conversation: { id: conversationId }
      })
      .subscribe(
        id => console.log('Message sent'),
        error => {
          console.error('Error sending message:', error);
          setError('Failed to send message. Please try again.');
        }
      );
  };

  if (error) {
    return (
      <div className="p-4 border border-red-500 rounded bg-red-50">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4 border rounded p-4 h-96 overflow-y-auto">
        {messages.map((msg, index) => (
          <p key={index} className="mb-2">
            <strong>{msg.from.name}:</strong> {msg.text}
          </p>
        ))}
        {messages.length === 0 && (
          <p className="text-gray-500 text-center">
            No messages yet. Start typing to chat!
          </p>
        )}
      </div>
      <input
        type="text"
        className="w-full p-2 border rounded"
        placeholder="Type a message and press Enter"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.target.value.trim()) {
            sendMessage(e.target.value);
            e.target.value = '';
          }
        }}
      />
    </div>
  );
};

export default ChatApp;