import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import { useMessageStore } from '../store/messageStore';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Search, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import { useErrorHandler, ErrorMessage } from '../utils/errorHandling';

const MessagesPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const { conversations, loading, error: storeError, fetchConversations } = useMessageStore();
  const [searchQuery, setSearchQuery] = useState('');
  const { error, handleError, clearError } = useErrorHandler();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    fetchConversations();
  }, [isAuthenticated, navigate, fetchConversations]);
  
  // Handle errors from store
  useEffect(() => {
    if (storeError) {
      handleError(storeError);
    }
  }, [storeError, handleError]);
  
  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conversation => 
    conversation.participantName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (conversation.listingTitle && conversation.listingTitle.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const handleConversationClick = (conversationId: string) => {
    navigate(`/messages/${conversationId}`);
  };
  
  return (
    <Layout>
      <div className="container p-6 mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Messages</h1>
        </div>
        
        {/* Display any errors */}
        {error && (
          <ErrorMessage 
            message={error.message} 
            onDismiss={clearError} 
          />
        )}
        
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full px-4 py-2 pl-10 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute left-3 top-2.5">
              <Search className="h-5 w-5 text-neutral-400" />
            </div>
          </div>
        </div>
        
        {/* Conversations List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-neutral-200">
            <AlertCircle className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No conversations yet</h3>
            <p className="mt-2 text-gray-500 max-w-md mx-auto mb-6">
              {searchQuery 
                ? "No conversations match your search." 
                : "You haven't started any conversations yet. Browse listings to message sellers."}
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/listings')}
            >
              Browse Listings
            </Button>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden divide-y divide-neutral-200 border border-neutral-200">
            {filteredConversations.map(conversation => (
              <div 
                key={conversation.id} 
                className={`p-4 hover:bg-neutral-50 cursor-pointer transition-colors ${
                  conversation.unreadCount > 0 ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleConversationClick(conversation.id)}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-4">
                    {conversation.participantAvatar ? (
                      <img 
                        src={conversation.participantAvatar} 
                        alt={conversation.participantName}
                        className="w-12 h-12 rounded-full object-cover" 
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 font-medium">
                        {conversation.participantName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-neutral-900 truncate">
                        {conversation.participantName}
                      </h3>
                      <span className="text-xs text-neutral-500">
                        {formatDistanceToNow(new Date(conversation.lastMessage.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    
                    {conversation.listingTitle && (
                      <div className="text-xs text-neutral-500 mb-1">
                        Re: {conversation.listingTitle}
                      </div>
                    )}
                    
                    <p className="text-sm text-neutral-600 truncate">
                      {conversation.lastMessage.senderId === conversation.participantId ? '' : 'You: '}
                      {conversation.lastMessage.content}
                    </p>
                  </div>
                  
                  {conversation.unreadCount > 0 && (
                    <div className="ml-4 flex-shrink-0">
                      <span className="bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {conversation.unreadCount}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MessagesPage;
