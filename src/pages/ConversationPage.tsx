import React, { useEffect, useState, useRef } from 'react';
import Layout from '../components/layout/Layout';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMessageStore } from '../store/messageStore';
import { useAuthStore } from '../store/authStore';
import { format } from 'date-fns';
import { Send, ArrowLeft, ShoppingBag, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import { showToast } from '../components/ui/Toast';
import { useErrorHandler, ErrorMessage } from '../utils/errorHandling';

const ConversationPage: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { isAuthenticated, user } = useAuthStore();
  const {
    currentConversation,
    loading,
    error: storeError,
    fetchConversationMessages,
    sendMessage,
    markAsRead
  } = useMessageStore();
  const [messageContent, setMessageContent] = useState('');
  const [sending, setSending] = useState(false);
  const { error, handleError, clearError } = useErrorHandler();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (conversationId) {
      fetchConversationMessages(conversationId);
    }
  }, [isAuthenticated, conversationId, navigate, fetchConversationMessages]);
  
  // Handle errors from store
  useEffect(() => {
    if (storeError) {
      handleError(storeError);
    }
  }, [storeError, handleError]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    // Mark unread messages as read
    if (currentConversation.messages.length) {
      currentConversation.messages.forEach(message => {
        if (!message.read && message.senderId !== user?.id) {
          markAsRead(message.id);
        }
      });
    }
  }, [currentConversation.messages, markAsRead, user?.id]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageContent.trim() || !conversationId) {
      return;
    }
    
    setSending(true);
    
    try {
      await sendMessage(conversationId, messageContent.trim());
      setMessageContent('');
      // Clear any previous errors on successful send
      clearError();
    } catch (error) {
      handleError(error);
      showToast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };
  
  return (
    <Layout>
      <div className="container p-6 mx-auto max-w-4xl">
        {/* Header with back button and participant name */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/messages')}
            className="mr-3 text-neutral-500 hover:text-neutral-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold">
            {currentConversation.data?.participantName || 'Conversation'}
          </h1>
        </div>
        
        {/* Display any errors */}
        {error && (
          <ErrorMessage 
            message={error.message} 
            onDismiss={clearError} 
          />
        )}
        
        {loading && currentConversation.messages.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <>
            {/* Listing reference if available */}
            {currentConversation.data?.listingId && (
              <div className="bg-neutral-50 p-4 rounded-lg mb-6 border border-neutral-200">
                <div className="flex items-center">
                  <ShoppingBag className="h-5 w-5 text-neutral-500 mr-2" />
                  <span className="text-sm text-neutral-600">
                    Conversation about: 
                  </span>
                  <Link 
                    to={`/listings/${currentConversation.data.listingId}`}
                    className="text-sm text-primary-600 font-medium ml-1 hover:text-primary-700"
                  >
                    {currentConversation.data.listingTitle || 'View Listing'}
                  </Link>
                </div>
              </div>
            )}
            
            {/* Messages container */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden mb-4">
              <div className="h-[400px] overflow-y-auto p-4">
                {currentConversation.messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-neutral-500">
                    <p>Start the conversation by sending a message</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentConversation.messages.map((message) => {
                      const isCurrentUser = message.senderId === user?.id;
                      
                      return (
                        <div 
                          key={message.id} 
                          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`max-w-[70%] rounded-lg px-4 py-2 ${
                              isCurrentUser 
                                ? 'bg-primary-100 text-primary-800' 
                                : 'bg-neutral-100 text-neutral-800'
                            }`}
                          >
                            <p className="break-words">{message.content}</p>
                            <p className="text-xs mt-1 opacity-70">
                              {format(new Date(message.createdAt), 'p')}
                              {isCurrentUser && (
                                <span className="ml-2">
                                  {message.read ? '✓✓' : '✓'}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
              
              {/* Message input */}
              <div className="border-t border-neutral-200 p-4">
                <form onSubmit={handleSendMessage} className="flex">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-grow px-4 py-2 border border-neutral-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    disabled={sending}
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={sending}
                    icon={<Send size={16} />}
                    className="rounded-l-none"
                    disabled={!messageContent.trim()}
                  >
                    <span className="hidden sm:inline">Send</span>
                  </Button>
                </form>
              </div>
            </div>
          </>
        )}
        
        {/* Error message display */}
        {error && (
          <div className="mt-4">
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    {error.message}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ConversationPage;
