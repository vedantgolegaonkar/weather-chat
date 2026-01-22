'use client';

import { useEffect, useRef, useState } from 'react';
import ChatInput from './ChatInput';
import MessageBubble from './MessageBubble';
import { Message } from '../types/chat';
import { streamProvueAgentResponse } from "../utils/provueAgentApi";

export default function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'agent',
      content: 'Hello! I’m your weather assistant. 🌤️',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async (text: string) => {
    setError(null);
    setIsLoading(true);

    // 1. Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
    };

    // 2. Create agent message shell
    const agentMessageId = crypto.randomUUID();
    const agentMessage: Message = {
      id: agentMessageId,
      role: 'agent',
      content: '',
    };

    setMessages((prev) => [...prev, userMessage, agentMessage]);

    try {
      // 3. Call streaming API
      await streamProvueAgentResponse(text, (chunk) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === agentMessageId
              ? { ...msg, content: msg.content + chunk }
              : msg,
          ),
        );
      });
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex min-h-screen justify-center bg-white">
      <div className="flex w-full max-w-3xl flex-col">
        {error && (
          <div className="mx-4 mb-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div className="border-t px-4 py-4">
          <ChatInput onSend={handleSend} disabled={isLoading} />{' '}
        </div>
      </div>
    </div>
  );
}
