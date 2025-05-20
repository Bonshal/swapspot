import { create } from 'zustand';
import { Conversation, Message } from '../types/message';
import { messageService } from '../services/api';

interface MessageStore {
  conversations: Conversation[];
  currentConversation: {
    data: Conversation | null;
    messages: Message[];
  };
  unreadCount: number;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchConversations: () => Promise<void>;
  fetchConversationMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  startNewConversation: (sellerId: string, listingId: string, initialMessage: string) => Promise<string>;
  markAsRead: (messageId: string) => Promise<void>;
  getUnreadCount: () => Promise<void>;
}

export const useMessageStore = create<MessageStore>((set, get) => ({
  conversations: [],
  currentConversation: {
    data: null,
    messages: []
  },
  unreadCount: 0,
  loading: false,
  error: null,
  
  fetchConversations: async () => {
    set({ loading: true, error: null });
    
    try {
      const conversations = await messageService.getConversations();
      
      // Calculate total unread messages
      const unreadCount = conversations.reduce((total, conv) => total + conv.unreadCount, 0);
      
      set({ 
        conversations, 
        unreadCount,
        loading: false 
      });
    } catch (error) {
      console.error('Error fetching conversations:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch conversations', 
        loading: false 
      });
    }
  },
  
  fetchConversationMessages: async (conversationId: string) => {
    set({ loading: true, error: null });
    
    try {
      // Find the conversation in the current state
      const conversation = get().conversations.find(c => c.id === conversationId) || null;
      
      // Fetch messages for this conversation
      const messages = await messageService.getConversationMessages(conversationId);
      
      set({ 
        currentConversation: {
          data: conversation,
          messages
        },
        loading: false 
      });
      
      // Mark new messages as read here if needed
      const unreadMessages = messages.filter(m => !m.read);
      if (unreadMessages.length > 0) {
        // Update unread count
        get().getUnreadCount();
      }
    } catch (error) {
      console.error('Error fetching conversation messages:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch messages', 
        loading: false 
      });
    }
  },
  
  sendMessage: async (conversationId: string, content: string) => {
    set({ loading: true, error: null });
    
    try {
      // Get the receiver ID from the current conversation
      const conversation = get().conversations.find(c => c.id === conversationId);
      if (!conversation) {
        throw new Error('Conversation not found');
      }
      
      // Send the message
      const newMessage = await messageService.sendMessage(
        conversation.participantId, 
        content,
        conversation.listingId
      );
      
      // Update the local state
      set(state => ({
        currentConversation: {
          ...state.currentConversation,
          messages: [...state.currentConversation.messages, newMessage]
        },
        loading: false
      }));
      
      // Update the conversation list with the new last message
      get().fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to send message', 
        loading: false 
      });
    }
  },
  
  startNewConversation: async (sellerId: string, listingId: string, initialMessage: string) => {
    set({ loading: true, error: null });
    
    try {
      const result = await messageService.startConversationAboutListing(
        sellerId,
        listingId,
        initialMessage
      );
      
      // Update conversations list
      get().fetchConversations();
      
      set({ loading: false });
      return result.conversationId;
    } catch (error) {
      console.error('Error starting conversation:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to start conversation', 
        loading: false 
      });
      throw error;
    }
  },
  
  markAsRead: async (messageId: string) => {
    try {
      await messageService.markAsRead(messageId);
      
      // Update the message in the current conversation
      set(state => ({
        currentConversation: {
          ...state.currentConversation,
          messages: state.currentConversation.messages.map(msg => 
            msg.id === messageId ? { ...msg, read: true } : msg
          )
        }
      }));
      
      // Update unread count
      get().getUnreadCount();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  },
  
  getUnreadCount: async () => {
    try {
      const conversations = await messageService.getConversations();
      const unreadCount = conversations.reduce((total, conv) => total + conv.unreadCount, 0);
      
      set({ unreadCount });
    } catch (error) {
      console.error('Error getting unread count:', error);
    }
  }
}));
