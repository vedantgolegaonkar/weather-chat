'use client';

import { useState } from 'react';

type Props = {
  onSend: (message: string) => void;
  disabled?: boolean;
};

export default function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState('');

  const handleSend = () => {
    if (!value.trim()) return;
    onSend(value);
    setValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-3">
      <input
        type="text"
        placeholder="Ask about the weather..."
        className="flex-1 rounded-full border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100 disabled:text-gray-400"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />

      <button
        onClick={handleSend}
        disabled={disabled}
        className="rounded-full bg-black px-4 py-3 text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {disabled ? '…' : '➤'}
      </button>
    </div>
  );
}
