import React from 'react';
import ChatApp from './components/ChatApp';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <div className="container mx-auto max-w-2xl py-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Bot Framework Chat</h1>
      <ErrorBoundary>
        <ChatApp />
      </ErrorBoundary>
    </div>
  );
}

export default App;