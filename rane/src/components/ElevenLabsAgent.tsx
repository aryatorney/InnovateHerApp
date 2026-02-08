'use client';

import { useState } from 'react';
import { useConversation } from '@elevenlabs/react';

export const ElevenLabsAgent = () => {
  const { status, isSpeaking, startSession, endSession } = useConversation();
  const connected = status === 'connected';
  const [unavailable, setUnavailable] = useState(false);

  const handleStart = async () => {
    if (connected) return;
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Try signed URL first, fall back to public agent ID
      const response = await fetch("/api/elevenlabs");
      const data = await response.json();

      if (data.signedUrl) {
        await startSession({ signedUrl: data.signedUrl });
      } else if (data.agentId) {
        await startSession({ agentId: data.agentId });
      } else {
        setUnavailable(true);
      }
    } catch (e) {
      console.error('startSession error', e);
    }
  };

  const handleStop = async () => {
    if (!connected) return;
    try {
      await endSession();
    } catch (e) {
      console.error('endSession error', e);
    }
  };

  // Hide entirely if ElevenLabs isn't configured
  if (unavailable) return null;

  return (
    <div className="flex flex-col gap-3 p-4 border border-indigo/10 rounded-2xl bg-gradient-to-br from-white/95 to-indigo/5 backdrop-blur-md fixed bottom-24 right-6 w-72 shadow-2xl z-50 transition-all hover:shadow-indigo/20">
      <h3 className="font-semibold text-foreground">Voice Assistant</h3>
      <div className="flex gap-2">
        <button
          onClick={handleStart}
          disabled={connected}
          className="flex-1 px-4 py-2 bg-violet text-white rounded-md hover:bg-violet/90 disabled:bg-gray-400 transition-colors"
        >
          {connected ? 'Active' : 'Start Chat'}
        </button>
        <button
          onClick={handleStop}
          disabled={!connected}
          className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          End
        </button>
      </div>
      <p className="text-xs text-muted text-center">
        {isSpeaking ? '🔴 Speaking...' : connected ? '🟢 Listening...' : 'Tap to start conversation'}
      </p>
    </div>
  );
};

export default ElevenLabsAgent;
