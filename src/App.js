import React from 'react';
import ChatApp from './components/ChatApp';

function App() {
  return (
    <div className="container mx-auto max-w-2xl py-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Bot Framework Chat</h1>
      <ChatApp />
    </div>
  );
}

export default App;