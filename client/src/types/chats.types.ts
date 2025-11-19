 export interface ChatMessage {
  id: number;
  user: string;
  message: string;
  time: string;
  avatar: string;
  isCode?: boolean;
}

 export interface ChatSidebarProps {
  chatMessages: ChatMessage[];
  onSendMessage: (message: string) => void;
}