import React, { useState } from 'react';
import { X } from 'lucide-react';
import Button from './Button';
import { useMessageStore } from '../../store/messageStore';
import { useNavigate } from 'react-router-dom';
import { showToast } from './Toast';

interface ContactSellerModalProps {
  isOpen: boolean;
  onClose: () => void;
  sellerId: string;
  sellerName: string;
  listingId: string;
  listingTitle: string;
}

const ContactSellerModal: React.FC<ContactSellerModalProps> = ({
  isOpen,
  onClose,
  sellerId,
  sellerName,
  listingId,
  listingTitle
}) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { startNewConversation } = useMessageStore();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      return;
    }
    
    setSending(true);
    
    try {
      const conversationId = await startNewConversation(
        sellerId,
        listingId,
        message.trim()
      );
      
      // Clear the form
      setMessage('');
      
      // Close the modal
      onClose();
      
      // Show success message
      showToast.success('Message sent successfully!');
      
      // Navigate to the conversation
      navigate(`/messages/${conversationId}`);
    } catch (error) {
      // Reference error to suppress unused warning - keeping for debugging context
      console.debug('Message send error:', error);
      showToast.error('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-neutral-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium leading-6 text-neutral-900">
                Contact {sellerName}
              </h3>
              <button
                onClick={onClose}
                className="text-neutral-400 hover:text-neutral-500 focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-neutral-500">
                About: <span className="font-medium text-neutral-700">{listingTitle}</span>
              </p>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Hi! I'm interested in your listing..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="mr-3"
                  disabled={sending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={sending}
                  disabled={!message.trim()}
                >
                  Send Message
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSellerModal;
