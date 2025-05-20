export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  receiverId: string;
  receiverName: string;
  receiverAvatar?: string;
  content: string;
  createdAt: string;
  read: boolean;
  listingId?: string;
  listingTitle?: string;
}

export interface Conversation {
  id: string;
  participantId: string;  // The other participant's ID (not the current user)
  participantName: string;
  participantAvatar?: string;
  lastMessage: {
    content: string;
    createdAt: string;
    senderId: string;
  };
  unreadCount: number;
  listingId?: string;
  listingTitle?: string;
}
