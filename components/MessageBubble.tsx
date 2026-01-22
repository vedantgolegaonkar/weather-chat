import { Message } from '../types/chat';
import ReactMarkdown from 'react-markdown';

type Props = {
  message: Message;
};

/**
 * Normalize and enhance AI text for chat-style rendering.
 * This mimics how real AI chat products format responses.
 */
function enhanceAgentText(text: string) {
  return (
    text
      // Normalize spacing after sentences
      .replace(/\. ([A-Z])/g, '.\n\n$1')

      // Force section headers onto new lines
      .replace(
        /(Current Conditions:|Hourly Forecast Highlights:|Summary:)/g,
        '\n\n## $1',
      )

      // Ensure bullet points are properly separated
      .replace(/- /g, '\n- ')

      // Remove excessive newlines
      .replace(/\n{3,}/g, '\n\n')

      .trim()
  );
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';

  const content =
    !isUser && message.content
      ? enhanceAgentText(message.content)
      : message.content;

  return (
    <div
      className={`mb-5 flex w-full animate-fade-in ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`max-w-[78%] rounded-2xl px-5 py-4 text-sm leading-relaxed ${
          isUser ? 'bg-gray-100 text-black' : 'bg-white text-black'
        }`}
      >
        {content ? (
          <ReactMarkdown
            components={{
              h2: ({ children }) => (
                <h2 className="mb-2 mt-4 text-sm font-semibold text-gray-900">
                  {children}
                </h2>
              ),
              p: ({ children }) => (
                <p className="mb-2 text-gray-800 last:mb-0">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="mb-3 list-disc space-y-1 pl-5 text-gray-800">
                  {children}
                </ul>
              ),
              li: ({ children }) => <li>{children}</li>,
              strong: ({ children }) => (
                <strong className="font-semibold text-gray-900">
                  {children}
                </strong>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        ) : (
          <div className="inline-flex items-center rounded-2xl border border-gray-400 bg-white px-4 py-2 shadow-sm">
            <span className="flex gap-1 opacity-50">
              <span className="animate-bounce">.</span>
              <span className="animate-bounce delay-150">.</span>
              <span className="animate-bounce delay-300">.</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
