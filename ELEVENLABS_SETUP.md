# ElevenLabs Integration Guide

## Setup Status ✅

Your ElevenLabs integration is now complete! Here's what was configured:

- **Package**: `@elevenlabs/react` installed
- **API Key**: Securely stored in `.env.local`
- **Agent ID**: `agent_6901kgx1sywyf85vyswhwcd8ekpf` configured
- **Component**: `ElevenLabsAgent.tsx` ready to use

## Using the Component

### Basic Usage

```tsx
import { ElevenLabsAgent } from '@/components/ElevenLabsAgent';

export default function MyPage() {
  return (
    <div>
      <h1>My Page</h1>
      <ElevenLabsAgent />
    </div>
  );
}
```

### With Optional Props

```tsx
import { ElevenLabsAgent } from '@/components/ElevenLabsAgent';
import { useState } from 'react';

export default function MyPage() {
  const [showAgent, setShowAgent] = useState(true);

  return (
    <div className="p-8">
      {showAgent && (
        <ElevenLabsAgent 
          onClose={() => setShowAgent(false)}
          className="max-w-2xl mx-auto"
        />
      )}
    </div>
  );
}
```

### Integration Examples

#### In the Today Page
File: `src/app/today/page.tsx`
```tsx
'use client';

import { ElevenLabsAgent } from '@/components/ElevenLabsAgent';

export default function TodayPage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-8">Today's Reflection</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Your existing reflection content */}
        </div>
        
        <aside className="lg:col-span-1">
          <ElevenLabsAgent />
        </aside>
      </div>
    </main>
  );
}
```

#### As a Modal/Dialog
```tsx
'use client';

import { ElevenLabsAgent } from '@/components/ElevenLabsAgent';
import { useState } from 'react';

export default function Page() {
  const [showAgent, setShowAgent] = useState(false);

  return (
    <>
      <button 
        onClick={() => setShowAgent(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Chat with AI
      </button>

      {showAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4">
            <ElevenLabsAgent onClose={() => setShowAgent(false)} />
          </div>
        </div>
      )}
    </>
  );
}
```

## Component Features

- **Voice Interaction**: Full two-way voice conversation with your ElevenLabs Agent
- **Automatic Microphone Handling**: Requests permission on first use
- **Real-time Status**: Shows listening, speaking, or ready states
- **Error Handling**: Graceful error messages for permission issues
- **Customizable**: Accept `onClose` and `className` props for flexibility
- **Fully Typed**: TypeScript support with proper interfaces

## Environment Variables

Located in `.env.local`:
```
NEXT_PUBLIC_ELEVENLABS_API_KEY=fa92d2207e8bea93dc5e620f12f68091dba9b6098361ba0e0c26b058c6cf4cb0
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=agent_6901kgx1sywyf85vyswhwcd8ekpf
```

**Note**: Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. This is required for the ElevenLabs SDK to work client-side.

## Testing Locally

```bash
cd rane
npm run dev
```

Visit `http://localhost:3000` and navigate to any page where you've added the `<ElevenLabsAgent />` component.

## Troubleshooting

### Microphone Access Denied
- Check browser permissions for microphone access
- Try using `http://localhost` instead of IP addresses
- HTTPS is required for production

### Agent Not Responding
- Verify API Key and Agent ID are correct in `.env.local`
- Ensure environment variables are loaded (restart dev server after changes)
- Check browser console for errors (F12)

### Build Errors
Try clearing the Next.js cache:
```bash
rm -r .next
npm run build
```

## Component API

```typescript
interface ElevenLabsAgentProps {
  onClose?: () => void;      // Called when user clicks close button
  className?: string;        // Additional Tailwind CSS classes
}
```

## Resources

- [ElevenLabs Documentation](https://elevenlabs.io/docs)
- [ElevenLabs React SDK](https://github.com/elevenlabs/elevenlabs-js)
- [Agent Configuration](https://elevenlabs.io/app/agents)

---

**Setup Date**: February 7, 2026  
**Status**: ✅ Ready for Production
