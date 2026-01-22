export type MessageRole = "user" | "agent";

export type Message = {
  id: string;
  role: MessageRole;
  content: string;
  timestamp?: Date;
};
