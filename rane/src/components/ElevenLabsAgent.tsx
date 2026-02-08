'use client';

import { useConversation } from '@elevenlabs/react';

export const ElevenLabsAgent = () => {
  const { status, isSpeaking, startSession, endSession } = useConversation();
  const connected = status === 'connected';

  const handleStart = async () => {
    if (connected) return;
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await startSession({
        agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || '',
        connectionType: 'webrtc',
      });
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

  return (
    <div className="flex flex-col gap-3 p-4 border rounded-lg">
      <h3 className="font-semibold">ElevenLabs Agent</h3>
      <div className="flex gap-2">
        <button
          onClick={handleStart}
          disabled={connected}
          className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet/90 disabled:bg-gray-400"
        >
          {connected ? 'Connected' : 'Start'}
        </button>
        <button
          onClick={handleStop}
          disabled={!connected}
          className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
        >
          Stop
        </button>
      </div>
      <p className="text-sm text-gray-600">
        {isSpeaking ? '🔴 Agent speaking...' : connected ? '🟢 Listening...' : 'Ready'}
      </p>
    </div>
  );
};

export default ElevenLabsAgent;
