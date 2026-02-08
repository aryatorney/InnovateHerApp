'use client';

import { useConversation } from '@elevenlabs/react';
import { useState } from 'react';

interface ElevenLabsAgentProps {
  onClose?: () => void;
  className?: string;
}

export const ElevenLabsAgent = ({ onClose, className = '' }: ElevenLabsAgentProps) => {
  const [error, setError] = useState<string | null>(null);

  const conversation = useConversation({
    agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || '',
    clientTools: {
      displayMessage: (parameters: { text: string }) => {
        console.log('Agent message:', parameters.text);
        return 'Message received and displayed';
      },
    },
  });

  const handleStartConversation = async () => {
    try {
      // Request microphone access
      await navigator.mediaDevices.getUserMedia({ audio: true });
      // The hook handles starting the session automatically after access is granted
      setError(null);
    } catch (err) {
      setError('Microphone access denied. Please check your browser permissions.');
      console.error('Microphone access error:', err);
    }
  };

  const handleStopConversation = () => {
    conversation.endSession();
  };

  const getStatusText = () => {
    if (conversation.isSpeaking) return 'Agent speaking...';
    if (conversation.status) return 'Listening...';
    return 'Ready';
  };

  return (
    <div className={`flex flex-col gap-4 p-4 border rounded-lg bg-white ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">AI Agent</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-100 text-red-800 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleStartConversation}
          disabled={!!conversation.status}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
        >
          {conversation.status ? 'Listening...' : 'Start Conversation'}
        </button>

        {conversation.status && (
          <button
            onClick={handleStopConversation}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
          >
            Stop
          </button>
        )}
      </div>

      <div className="text-sm text-gray-600">
        Status: <span className="font-medium text-blue-600">{getStatusText()}</span>
      </div>

      <div className="p-3 bg-gray-50 rounded-md border border-gray-200 min-h-20 max-h-48 overflow-y-auto">
        <div className="text-sm text-gray-700">
          {conversation.isSpeaking ? (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <span className="text-blue-600">Agent is speaking...</span>
            </div>
          ) : conversation.status ? (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
              <span className="text-gray-600">Listening for your message...</span>
            </div>
          ) : (
            <span className="text-gray-500">Click "Start Conversation" to begin</span>
          )}
        </div>
      </div>

      <div className="text-xs text-gray-500 border-t pt-2">
        Powered by ElevenLabs AI Agent
      </div>
    </div>
  );
};

export default ElevenLabsAgent;
