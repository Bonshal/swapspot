import { User } from '../store/authStore';
import { Listing, ListingFilters } from '../types/listing';
import { Conversation, Message } from '../types/message';
import { supabase } from '../config/supabase';
import { SupabaseClient } from '@supabase/supabase-js';
import { getSimilarListings } from '../mockData/listings';

// Convert timestamp to string
const formatTimestamp = (timestamp: string) => {
  return new Date(timestamp).toISOString();
};

/**
 * A utility function to handle API errors
 */
const handleApiError = (error: any): never => {
  if (error.message) {
    throw new Error(error.message);
  } else if (error.response) {
    console.log("response received but we dont know why")
    const message = error.response.data?.message || 'An error occurred';
    throw new Error(message);
  } else if (error.request) {
    throw new Error('No response from server. Please check your internet connection.');
  } else {
    throw new Error('Error making request: ' + (error.message || String(error)));
  }
};

/**
 * Authentication API endpoints
 */
export const authService = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      const user: User = {
        id: data.user.id,
        name: profile?.name || data.user.user_metadata?.name || '',
        email: data.user.email || '',
        phone: profile?.phone || '',
        address: profile?.address || '',
        city: profile?.city || '',
        state: profile?.state || '',
        pincode: profile?.pincode || '',
        profileImage: profile?.profile_image || '',
        location: profile?.location || '',
        bio: profile?.bio || '',
        avatar: profile?.avatar || '',
        joinedDate: profile?.created_at || data.user.created_at,
      };
      
      return { user, token: data.session.access_token };
    } catch (error) {
      return handleApiError(error);
    }
  },

  signup: async (name: string, email: string, password: string): Promise<{ user: User; token: string }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });

      if (error) throw error;

      if (data.user) {
        await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name,
            email,
            created_at: new Date().toISOString(),
            phone: '',
            address: '',
            city: '',
            state: '',
            pincode: '',
            location: '',
            bio: '',
            avatar: '',
            profile_image: ''
          });

        const user: User = {
          id: data.user.id,
          name,
          email,
          joinedDate: data.user.created_at,
          phone: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          location: '',
          bio: '',
          avatar: '',
          profileImage: ''
        };
        
        return { user, token: data.session?.access_token || '' };
      }
      
      throw new Error('User creation failed');
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  completeProfile: async (profileData: FormData): Promise<User> => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
      
      let profileImageUrl = '';
      
      // Handle profile image upload if provided
      const profileImage = profileData.get('profileImage') as File;
      if (profileImage && profileImage instanceof File) {
        const fileExt = profileImage.name.split('.').pop();
        const fileName = `${currentUser.id}_${Date.now()}.${fileExt}`;
          const { error: uploadError } = await supabase.storage
          .from('profile-images')
          .upload(fileName, profileImage);
        
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('profile-images')
          .getPublicUrl(fileName);

        profileImageUrl = publicUrl;
      }
      
      // Extract other form data
      const userData: Record<string, any> = {};
      
      // Convert FormData to object
      profileData.forEach((value, key) => {
        if (key !== 'profileImage') {
          userData[key] = value;
        }
      });
      
      // Add profile image URL if uploaded
      if (profileImageUrl) {
        userData.profileImage = profileImageUrl;
        userData.avatar = profileImageUrl;
      }
      
      // Update user data in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          ...userData,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentUser.id);

      if (error) throw error;

      const { data: updatedProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      const user: User = {
        id: currentUser.id,
        name: updatedProfile?.name || '',
        email: currentUser.email || '',
        phone: updatedProfile?.phone || '',
        address: updatedProfile?.address || '',
        city: updatedProfile?.city || '',
        state: updatedProfile?.state || '',
        pincode: updatedProfile?.pincode || '',
        profileImage: updatedProfile?.profile_image || '',
        location: updatedProfile?.location || '',
        bio: updatedProfile?.bio || '',
        avatar: updatedProfile?.avatar || '',
        joinedDate: updatedProfile?.created_at || currentUser.created_at,
      };
      
      return user;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  getProfile: async (): Promise<User> => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (error) throw error;

      const user: User = {
        id: currentUser.id,
        name: profile?.name || currentUser.user_metadata?.name || '',
        email: currentUser.email || '',
        phone: profile?.phone || '',
        address: profile?.address || '',
        city: profile?.city || '',
        state: profile?.state || '',
        pincode: profile?.pincode || '',
        profileImage: profile?.profile_image || '',
        location: profile?.location || '',
        bio: profile?.bio || '',
        avatar: profile?.avatar || '',
        joinedDate: profile?.created_at || currentUser.created_at,
      };
      
      return user;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  updateProfile: async (profileData: Partial<User>): Promise<User> => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          name: profileData.name,
          phone: profileData.phone,
          address: profileData.address,
          city: profileData.city,
          state: profileData.state,
          pincode: profileData.pincode,
          location: profileData.location,
          bio: profileData.bio,
          avatar: profileData.avatar,
          profile_image: profileData.profileImage,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentUser.id);

      if (error) throw error;

      const { data: updatedProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      const user: User = {
        id: currentUser.id,
        name: updatedProfile?.name || '',
        email: currentUser.email || '',
        phone: updatedProfile?.phone || '',
        address: updatedProfile?.address || '',
        city: updatedProfile?.city || '',
        state: updatedProfile?.state || '',
        pincode: updatedProfile?.pincode || '',
        profileImage: updatedProfile?.profile_image || '',
        location: updatedProfile?.location || '',
        bio: updatedProfile?.bio || '',
        avatar: updatedProfile?.avatar || '',
        joinedDate: updatedProfile?.created_at || currentUser.created_at,
      };
      
      return user;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  changePassword: async (newPassword: string): Promise<{ success: boolean }> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      return handleApiError(error);
    }
  }
};

/**
 * Upload image to Supabase storage
 */
export const uploadListingImage = async (
  file: File,
  listingId: string
): Promise<string> => {
  try {
    // Create a unique file path using the listing ID and timestamp
    const fileExt = file.name.split('.').pop();
    const fileName = `${listingId}/${Date.now()}.${fileExt}`;

    // Upload the file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('listing-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) throw uploadError;

    // Get the public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from('listing-images')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Listings API endpoints
 */
export const listingService = {
  getListings: async (filters?: ListingFilters): Promise<Listing[]> => {
    try {
      let query = supabase.from('listings').select('*');
      
      if(filters?.featured){
        query =query.eq('featured',true)
      }

      if (filters) {
        if (filters.category) {
          query = query.eq('category', filters.category);
        }
        if (filters.subcategory) {
          query = query.eq('subcategory', filters.subcategory);
        }
        if (filters.minPrice) {
          query = query.gte('price', filters.minPrice);
        }
        if (filters.maxPrice) {
          query = query.lte('price', filters.maxPrice);
        }
        if (filters.location) {
          query = query.eq('location', filters.location);
        }
        
        if (filters.sortBy) {
          switch (filters.sortBy) {
            case 'recent':
              query = query.order('created_at', { ascending: false });
              break;
            case 'price-low':
              query = query.order('price', { ascending: true });
              break;
            case 'price-high':
              query = query.order('price', { ascending: false });
              break;
            case 'popularity':
              query = query.order('views', { ascending: false });
              break;
          }
        } else {
          query = query.order('created_at', { ascending: false });
        }
      } else {
        query = query.order('created_at', { ascending: false }).limit(50);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      // Map seller fields for all listings
      const mappedData = data.map(listing => ({
        ...listing,
        sellerName: listing.sellername,
        sellerAvatar: listing.selleravatar,
        sellerJoinedDate: listing.sellerjoineddate,
        sellerVerified: listing.sellerverified,
        sellerRating: listing.sellerrating,
        createdAt: formatTimestamp(listing.created_at),
        updatedAt: formatTimestamp(listing.updated_at)
      }));
      
      return mappedData as Listing[];
    } catch (error) {
      return handleApiError(error);
    }
  },

  getFeaturedListings: async(): Promise<Listing[]> =>{
    try{
      const {data, error } = await supabase 
      .from('listings')
      .select(`*`)
      .eq('featured', true)
      .eq('status','active')
      .order('created_at',{ascending: false})
      .limit(8)

      if(error) throw error;

      return data.map(listing=>({
        id: listing.id,
        ...listing,
         createdAt: formatTimestamp(listing.created_at),
        updatedAt: formatTimestamp(listing.updated_at),
        // Map seller information from joined profile
        sellerName: listing.profiles?.full_name || listing.sellername || 'Unknown User',
        sellerAvatar: listing.profiles?.avatar_url || listing.selleravatar || '',
        sellerRating: listing.sellerrating || 0,
        sellerVerified: listing.sellerverified || false,
        sellerJoinedDate: listing.sellerjoineddate || listing.created_at

      })) as Listing[]
    } catch(error){
      console.error('Error fetching listings:', error)
      throw handleApiError(error)
    }
  },

  getSimilarListings: async( listingId: string, category: string, limit: number=4): Promise<Listing[]>=>{
    try{
      const {data, error} = await supabase
      .from('listings')
      .select('*')
      .eq('category', category)
      .eq('status','active')
      .neq('id',listingId)
      .order('created_at',{ascending: false})
      .limit(limit)

      if(error) throw error
      return data.map(listing => ({
        id: listing.id,
        ...listing,
        createdAt: formatTimestamp(listing.created_at),
        updatedAt: formatTimestamp(listing.updated_at),
        // Map seller information
        sellerName: listing.profiles?.full_name || listing.sellername || 'Unknown User',
        sellerAvatar: listing.profiles?.avatar_url || listing.selleravatar || '',
        sellerRating: listing.sellerrating || 0,
        sellerVerified: listing.sellerverified || false,
        sellerJoinedDate: listing.sellerjoineddate || listing.created_at
      })) as Listing[];
    }
   catch(error){
    console.error('Error fetching similar listings:', error)
    throw handleApiError(error)
  }
},


getRecentListings: async(): Promise<Listing[]>=>{
  try{
    const {data, error}= await supabase
    .from('listings')
    .select('*')
    .eq('status','active')
    .order('created_at',{ascending: false})
    .limit(8)

    if(error) throw error
    return data.map(listing => ({
        id: listing.id,
        ...listing,
        createdAt: formatTimestamp(listing.created_at),
        updatedAt: formatTimestamp(listing.updated_at),
        // Map seller information
        sellerName: listing.profiles?.full_name || listing.sellername || 'Unknown User',
        sellerAvatar: listing.profiles?.avatar_url || listing.selleravatar || '',
        sellerRating: listing.sellerrating || 0,
        sellerVerified: listing.sellerverified || false,
        sellerJoinedDate: listing.sellerjoineddate || listing.created_at
      })) as Listing[];
  }catch(error)
  {
    console.error('error fetching recent listings:', error)
    throw handleApiError(error)
  }
},


getListingById: async (id: string): Promise<Listing> => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      // Increment views counter
      await supabase
        .from('listings')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', id);
      
      return {
        id: data.id,
        ...data,
        price: data.price,
        createdAt: formatTimestamp(data.created_at),
        updatedAt: formatTimestamp(data.updated_at),
        // Map seller fields to expected names
        sellerName: data.sellername,
        sellerAvatar: data.selleravatar,
        sellerJoinedDate: data.sellerjoineddate,
        sellerVerified: data.sellerverified,
        sellerRating: data.sellerrating
      } as Listing;
    } catch (error) {
      return handleApiError(error);
    }
  },   
   createListing: async (listingData: Partial<Listing>): Promise<Listing> => {
  try {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    // Get user profile information for seller details
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', currentUser.id)
      .single();



    if (profileError) {
      console.warn('Profile not found, using basic user data');
    }

    // Create listing document with seller information
const { data, error } = await supabase
  .from('listings')
  .insert({
    title: listingData.title,
    description: listingData.description,
    category: listingData.category,
    price: listingData.price,
    location: listingData.location,
    user_id: currentUser.id,
    // Store seller information from profile
    sellername: profile?.name || currentUser.user_metadata?.name || 'Unknown User',
    selleravatar: profile?.avatar || profile?.profile_image || '',
    sellerverified: false,
    sellerrating: null,
    sellerjoineddate: profile?.created_at || currentUser.created_at,
    views: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  })
  .select()
  .single();

if (error) throw error;

return {
  id: data.id,
  ...data,
  createdAt: data.created_at,
  updatedAt: data.updated_at,
  // Map to the expected frontend field names
  sellerName: data.sellername,
  sellerAvatar: data.selleravatar,
  sellerLocation: data.sellerlocation,
  sellerJoinedDate: data.sellerjoineddate,
  sellerVerified: data.sellerverified,
  sellerRating: data.sellerrating
} as Listing;
  } catch (error) {
    return handleApiError(error);
  }
},
  updateListing: async (id: string, updatedListingData: Partial<Listing>): Promise<Listing> => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
        // Check if the listing belongs to the current user
      const { data: listingData, error: listingError } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();
      
      if (listingError) throw listingError;
      if (listingData.user_id !== currentUser.id) {
        throw new Error('Unauthorized: You can only update your own listings');
      }
        // Update the listing
      const { error } = await supabase
        .from('listings')
        .update({
          ...updatedListingData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Fetch the updated listing
      const { data: updatedListing, error: fetchError } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      
      return {
        id: updatedListing.id,
        ...updatedListing,
        createdAt: formatTimestamp(updatedListing.created_at),
        updatedAt: formatTimestamp(updatedListing.updated_at)
      } as Listing;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  deleteListing: async (id: string): Promise<{ success: boolean }> => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
        // Check if the listing belongs to the current user
      const { data: listingData, error: listingError } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();
      
      if (listingError) throw listingError;
      if (listingData.user_id !== currentUser.id) {
        throw new Error('Unauthorized: You can only delete your own listings');
      }
      
      // Delete the listing
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      return handleApiError(error);
    }
  },
    getUserListings: async (): Promise<Listing[]> => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
      
      // Query listings for the current user
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Map seller fields for user listings
      const mappedData = data.map(listing => ({
        ...listing,
        sellerName: listing.sellername,
        sellerAvatar: listing.selleravatar,
        sellerJoinedDate: listing.sellerjoineddate,
        sellerVerified: listing.sellerverified,
        sellerRating: listing.sellerrating,
        createdAt: formatTimestamp(listing.created_at),
        updatedAt: formatTimestamp(listing.updated_at)
      }));
      
      return mappedData as Listing[];
    } catch (error) {
      return handleApiError(error);
    }
  }
};

/**
 * Messaging API endpoints
 */
export const messageService = {
  getConversations: async (): Promise<Conversation[]> => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
      
      // Query conversations where the current user is a participant
      const { data: conversations, error } = await supabase
        .from('conversations')
        .select('*')
        .contains('participants', [currentUser.id])
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      
      const result: Conversation[] = [];
      
      for (const conversation of conversations || []) {
        // Find the other participant
        const otherParticipantId = conversation.participants.find((id: string) => id !== currentUser.id);
        
        if (!otherParticipantId) continue;
        
        // Get the other participant's user data
        const { data: participantData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', otherParticipantId)
          .single();
        
        // Count unread messages
        const { data: unreadMessages } = await supabase
          .from('messages')
          .select('*')
          .eq('conversationId', conversation.id)
          .eq('receiverId', currentUser.id)
          .eq('read', false);
        
        // Create conversation object
        const conv: Conversation = {
          id: conversation.id,
          participantId: otherParticipantId,
          participantName: participantData?.name || 'Unknown User',
          participantAvatar: participantData?.avatar || '',
          lastMessage: {
            content: conversation.lastMessage?.content || '',
            createdAt: formatTimestamp(conversation.lastMessage?.createdAt || conversation.updated_at),
            senderId: conversation.lastMessage?.senderId || ''
          },
          unreadCount: unreadMessages?.length || 0,
          listingId: conversation.listingId,
          listingTitle: conversation.listingTitle
        };
        
        result.push(conv);
      }
      
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  sendMessage: async (receiverId: string, content: string, listingId?: string): Promise<Message> => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
      
      // First, find or create the conversation
      let conversationId = '';
      let listingTitle = '';
      
      // Try to find existing conversation
      const { data: conversations } = await supabase
        .from('conversations')
        .select('*')
        .contains('participants', [currentUser.id]);
      
      const existingConversation = conversations?.find(conv => 
        conv.participants.includes(receiverId)
      );
      
      if (existingConversation) {
        conversationId = existingConversation.id;
        listingTitle = existingConversation.listingTitle || '';
      } else {
        // Create new conversation
        if (listingId) {
          const { data: listingDoc } = await supabase
            .from('listings')
            .select('*')
            .eq('id', listingId)
            .single();
          if (listingDoc) {
            listingTitle = listingDoc.title || '';
          }
        }
        
        const { data: newConversation, error } = await supabase
          .from('conversations')
          .insert({
            participants: [currentUser.id, receiverId],
            listingId,
            listingTitle,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            lastMessage: {
              content,
              senderId: currentUser.id,
              createdAt: new Date().toISOString()
            }
          })
          .select()
          .single();
        
        if (error) throw error;
        conversationId = newConversation.id;
      }
      
      // Update conversation with new last message
      await supabase
        .from('conversations')
        .update({
          lastMessage: {
            content,
            senderId: currentUser.id,
            createdAt: new Date().toISOString()
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId);
      
      // Create the message
      const { data: messageData, error } = await supabase
        .from('messages')
        .insert({
          conversationId,
          senderId: currentUser.id,
          receiverId,
          content,
          listingId,
          listingTitle,
          read: false,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Get user data for the sender and receiver
      const { data: senderData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();
      
      const { data: receiverData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', receiverId)
        .single();
      
      return {
        id: messageData.id,
        senderId: currentUser.id,
        senderName: currentUser.user_metadata?.name || senderData?.name || 'Unknown User',
        senderAvatar: currentUser.user_metadata?.avatar || senderData?.avatar || '',
        receiverId,
        receiverName: receiverData?.name || 'Unknown User',
        receiverAvatar: receiverData?.avatar || '',
        content,
        createdAt: new Date().toISOString(),
        read: false,
        listingId,
        listingTitle
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  startConversationAboutListing: async (
    sellerId: string, 
    listingId: string, 
    initialMessage: string
  ): Promise<{ conversationId: string; message: Message }> => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
      
      // Get listing details
      const { data: listingDoc, error: listingError } = await supabase
        .from('listings')
        .select('*')
        .eq('id', listingId)
        .single();
      if (listingError) throw listingError;
      
      const listingTitle = listingDoc.title || '';
      
      // Create a new conversation
      const { data: conversationData, error } = await supabase
        .from('conversations')
        .insert({
          participants: [currentUser.id, sellerId],
          listingId,
          listingTitle,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          lastMessage: {
            content: initialMessage,
            senderId: currentUser.id,
            createdAt: new Date().toISOString()
          }
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Create the first message
      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .insert({
          conversationId: conversationData.id,
          senderId: currentUser.id,
          receiverId: sellerId,
          content: initialMessage,
          listingId,
          listingTitle,
          read: false,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (messageError) throw messageError;
      
      // Get user data for the sender and receiver
      const { data: senderData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();
      
      const { data: receiverData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sellerId)
        .single();
      
      const message: Message = {
        id: messageData.id,
        senderId: currentUser.id,
        senderName: currentUser.user_metadata?.name || senderData?.name || 'Unknown User',
        senderAvatar: currentUser.user_metadata?.avatar || senderData?.avatar || '',
        receiverId: sellerId,
        receiverName: receiverData?.name || 'Unknown User',
        receiverAvatar: receiverData?.avatar || '',
        content: initialMessage,
        createdAt: new Date().toISOString(),
        read: false,
        listingId,
        listingTitle
      };
        return {
        conversationId: conversationData.id,
        message
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  getConversationMessages: async (conversationId: string): Promise<Message[]> => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
      
      // Query messages for the conversation
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversationId', conversationId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      const result: Message[] = [];
      
      for (const message of messages || []) {
        // Get sender and receiver data
        const { data: senderData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', message.senderId)
          .single();
        
        const { data: receiverData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', message.receiverId)
          .single();
        
        result.push({
          id: message.id,
          senderId: message.senderId,
          senderName: senderData?.name || 'Unknown User',
          senderAvatar: senderData?.avatar || '',
          receiverId: message.receiverId,
          receiverName: receiverData?.name || 'Unknown User',
          receiverAvatar: receiverData?.avatar || '',
          content: message.content,
          createdAt: formatTimestamp(message.created_at),
          read: message.read,
          listingId: message.listingId,
          listingTitle: message.listingTitle
        });
      }
      
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  markAsRead: async (messageId: string): Promise<{ success: boolean }> => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
      
      // Get the message to check if the current user is the receiver
      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .select('*')
        .eq('id', messageId)
        .single();
      
      if (messageError) throw messageError;
      
      if (messageData.receiverId !== currentUser.id) {
        throw new Error('Unauthorized: You can only mark messages sent to you as read');
      }
      
      // Mark the message as read
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId);
      
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      return handleApiError(error);
    }
  }
};
