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
    <div className="fixed inset-x-0 bottom-6 flex justify-center">
      <div className="flex w-full max-w-[760px] items-center gap-3 rounded-2xl bg-white px-4 py-10 shadow-xl">
        <input
          type="text"
          placeholder="Ask anything…"
          className="flex-1 bg-transparent text-sm outline-none"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />

        <button
          onClick={handleSend}
          disabled={disabled}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white disabled:opacity-50"
        >
          ↗
        </button>
      </div>
    </div>
  );
}
