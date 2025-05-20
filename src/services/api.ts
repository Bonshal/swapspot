import { User } from '../store/authStore';
import { Listing, ListingFilters } from '../types/listing';
import { Conversation, Message } from '../types/message';
import { 
  auth, 
  db, 
  storage 
} from '../config/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp,
  setDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Convert Firestore timestamp to string
const formatTimestamp = (timestamp: Timestamp) => {
  return timestamp.toDate().toISOString();
};

/**
 * A utility function to handle API errors
 */
const handleApiError = (error: any): never => {
  if (error.code) {
    // Firebase error
    const errorMessage = getFirebaseErrorMessage(error.code);
    throw new Error(errorMessage);
  } else if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const message = error.response.data?.message || 'An error occurred';
    throw new Error(message);
  } else if (error.request) {
    // The request was made but no response was received
    throw new Error('No response from server. Please check your internet connection.');
  } else {
    // Something happened in setting up the request that triggered an Error
    throw new Error('Error making request: ' + (error.message || String(error)));
  }
};

/**
 * Map Firebase error codes to user-friendly messages
 */
const getFirebaseErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email is already in use by another account.';
    case 'auth/invalid-email':
      return 'The email address is not valid.';
    case 'auth/weak-password':
      return 'The password is too weak. Please use a stronger password.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please check your email or sign up.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many unsuccessful login attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'A network error has occurred. Please check your connection.';
    default:
      return 'An error occurred. Please try again.';
  }
};

/**
 * Authentication API endpoints
 */
export const authService = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const { uid, displayName, email: userEmail, photoURL } = userCredential.user;
      
      // Get additional user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', uid));
      const userData = userDoc.data() || {};
      
      // Get token for API calls
      const token = await userCredential.user.getIdToken();
      
      const user: User = {
        id: uid,
        name: displayName || userData.name || '',
        email: userEmail || '',
        phone: userData.phone || '',
        address: userData.address || '',
        city: userData.city || '',
        state: userData.state || '',
        pincode: userData.pincode || '',
        profileImage: photoURL || userData.profileImage || '',
        location: userData.location || '',
        bio: userData.bio || '',
        avatar: photoURL || userData.avatar || '',
        joinedDate: userData.joinedDate || new Date().toISOString(),
        isAadhaarVerified: userData.isAadhaarVerified || false
      };
      
      return { user, token };
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  signup: async (name: string, email: string, password: string): Promise<{ user: User; token: string }> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's display name
      await updateProfile(userCredential.user, {
        displayName: name
      });
      
      // Store additional user data in Firestore
      const userData = {
        name,
        email,
        joinedDate: new Date().toISOString(),
        isAadhaarVerified: false,
        createdAt: serverTimestamp()
      };
      
      await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      
      // Get token for API calls
      const token = await userCredential.user.getIdToken();
      
      const user: User = {
        id: userCredential.user.uid,
        name,
        email,
        joinedDate: userData.joinedDate,
        isAadhaarVerified: false
      };
      
      return { user, token };
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // New Aadhaar verification methods
  verifyAadhaar: async (aadhaarNumber: string): Promise<{ success: boolean; message: string }> => {
    try {
      // In a real implementation, this would call an Aadhaar verification API
      // For this implementation, we'll simulate a successful verification and store the verified status in Firestore
      
      // Store the Aadhaar number in a secure collection for verification
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
      
      await setDoc(doc(db, 'aadhaarVerifications', currentUser.uid), {
        aadhaarNumber,
        status: 'pending',
        requestedAt: serverTimestamp()
      });
      
      // In a real implementation, this would send an actual OTP
      // Here we're simulating a successful OTP send
      return { 
        success: true, 
        message: 'OTP sent to your registered mobile number' 
      };
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  verifyOtp: async (aadhaarNumber: string, otp: string): Promise<{ user: User; token: string }> => {
    try {
      // In a real implementation, this would verify the OTP with the Aadhaar service
      // For this implementation, we'll simulate a successful verification
      
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
      
      // For this demo, we'll accept any 6-digit OTP
      if (otp.length !== 6 || !/^\d+$/.test(otp)) {
        throw new Error('Invalid OTP');
      }
      
      // Check if Aadhaar number exists in verification table
      const aadhaarVerificationDoc = await getDoc(doc(db, 'aadhaarVerifications', currentUser.uid));
      if (!aadhaarVerificationDoc.exists()) {
        throw new Error('No Aadhaar verification request found. Please start the verification process again.');
      }
      
      // Update the verification status
      await updateDoc(doc(db, 'aadhaarVerifications', currentUser.uid), {
        status: 'verified',
        verifiedAt: serverTimestamp()
      });
      
      // Update the user's profile with verified status
      await updateDoc(doc(db, 'users', currentUser.uid), {
        isAadhaarVerified: true
      });
      
      // Get the updated user data
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      const userData = userDoc.data() || {};
      
      const token = await currentUser.getIdToken(true); // Force refresh token
      
      const user: User = {
        id: currentUser.uid,
        name: currentUser.displayName || userData.name || '',
        email: currentUser.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
        city: userData.city || '',
        state: userData.state || '',
        pincode: userData.pincode || '',
        profileImage: currentUser.photoURL || userData.profileImage || '',
        location: userData.location || '',
        bio: userData.bio || '',
        avatar: currentUser.photoURL || userData.avatar || '',
        joinedDate: userData.joinedDate || new Date().toISOString(),
        isAadhaarVerified: true
      };
      
      return { user, token };
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  completeProfile: async (profileData: FormData): Promise<User> => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
      
      let profileImageUrl = '';
      
      // Handle profile image upload if provided
      const profileImage = profileData.get('profileImage') as File;
      if (profileImage && profileImage instanceof File) {
        const storageRef = ref(storage, `profile-images/${currentUser.uid}/${Date.now()}_${profileImage.name}`);
        const uploadResult = await uploadBytes(storageRef, profileImage);
        profileImageUrl = await getDownloadURL(uploadResult.ref);
        
        // Update user profile in Firebase Auth
        await updateProfile(currentUser, { photoURL: profileImageUrl });
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
      
      // Update user data in Firestore
      await updateDoc(doc(db, 'users', currentUser.uid), {
        ...userData,
        updatedAt: serverTimestamp()
      });
      
      // Get the updated user data
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      const updatedUserData = userDoc.data() || {};
      
      const user: User = {
        id: currentUser.uid,
        name: currentUser.displayName || updatedUserData.name || '',
        email: currentUser.email || '',
        phone: updatedUserData.phone || '',
        address: updatedUserData.address || '',
        city: updatedUserData.city || '',
        state: updatedUserData.state || '',
        pincode: updatedUserData.pincode || '',
        profileImage: currentUser.photoURL || updatedUserData.profileImage || '',
        location: updatedUserData.location || '',
        bio: updatedUserData.bio || '',
        avatar: currentUser.photoURL || updatedUserData.avatar || '',
        joinedDate: updatedUserData.joinedDate || new Date().toISOString(),
        isAadhaarVerified: updatedUserData.isAadhaarVerified || false
      };
      
      return user;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  getProfile: async (): Promise<User> => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      const userData = userDoc.data() || {};
      
      const user: User = {
        id: currentUser.uid,
        name: currentUser.displayName || userData.name || '',
        email: currentUser.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
        city: userData.city || '',
        state: userData.state || '',
        pincode: userData.pincode || '',
        profileImage: currentUser.photoURL || userData.profileImage || '',
        location: userData.location || '',
        bio: userData.bio || '',
        avatar: currentUser.photoURL || userData.avatar || '',
        joinedDate: userData.joinedDate || new Date().toISOString(),
        isAadhaarVerified: userData.isAadhaarVerified || false
      };
      
      return user;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  updateProfile: async (profileData: Partial<User>): Promise<User> => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
      
      // Update name in Firebase Auth if provided
      if (profileData.name && profileData.name !== currentUser.displayName) {
        await updateProfile(currentUser, { displayName: profileData.name });
      }
      
      // Update avatar in Firebase Auth if provided
      if (profileData.avatar && profileData.avatar !== currentUser.photoURL) {
        await updateProfile(currentUser, { photoURL: profileData.avatar });
      }
      
      // Update user data in Firestore
      await updateDoc(doc(db, 'users', currentUser.uid), {
        ...profileData,
        updatedAt: serverTimestamp()
      });
      
      // Get the updated user data
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      const updatedUserData = userDoc.data() || {};
      
      const user: User = {
        id: currentUser.uid,
        name: currentUser.displayName || updatedUserData.name || '',
        email: currentUser.email || '',
        phone: updatedUserData.phone || '',
        address: updatedUserData.address || '',
        city: updatedUserData.city || '',
        state: updatedUserData.state || '',
        pincode: updatedUserData.pincode || '',
        profileImage: currentUser.photoURL || updatedUserData.profileImage || '',
        location: updatedUserData.location || '',
        bio: updatedUserData.bio || '',
        avatar: currentUser.photoURL || updatedUserData.avatar || '',
        joinedDate: updatedUserData.joinedDate || new Date().toISOString(),
        isAadhaarVerified: updatedUserData.isAadhaarVerified || false
      };
      
      return user;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  changePassword: async (currentPassword: string, newPassword: string): Promise<{ success: boolean }> => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.email) {
        throw new Error('User not authenticated');
      }
      
      // Re-authenticate the user
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);
      
      // Change the password
      await updatePassword(currentUser, newPassword);
      
      return { success: true };
    } catch (error) {
      return handleApiError(error);
    }
  }
};

/**
 * Listings API endpoints
 */
export const listingService = {
  getListings: async (filters?: ListingFilters): Promise<Listing[]> => {
    try {
      let listingsQuery = collection(db, 'listings');
      
      // Apply filters
      if (filters) {
        // Start with a query
        let q = query(listingsQuery);
        
        // Apply category filter
        if (filters.category) {
          q = query(q, where('category', '==', filters.category));
        }
        
        // Apply subcategory filter
        if (filters.subcategory) {
          q = query(q, where('subcategory', '==', filters.subcategory));
        }
        
        // Apply price range filters
        if (filters.minPrice) {
          q = query(q, where('price', '>=', filters.minPrice));
        }
        
        if (filters.maxPrice) {
          q = query(q, where('price', '<=', filters.maxPrice));
        }
        
        // Apply location filter
        if (filters.location) {
          q = query(q, where('location', '==', filters.location));
        }
        
        // For condition filter, we need to handle it separately as Firestore doesn't support OR queries
        // This will be filtered in-memory after query results return
        
        // Apply sorting
        if (filters.sortBy) {
          switch (filters.sortBy) {
            case 'recent':
              q = query(q, orderBy('createdAt', 'desc'));
              break;
            case 'price-low':
              q = query(q, orderBy('price', 'asc'));
              break;
            case 'price-high':
              q = query(q, orderBy('price', 'desc'));
              break;
            case 'popularity':
              q = query(q, orderBy('views', 'desc'));
              break;
          }
        } else {
          // Default sort by most recent
          q = query(q, orderBy('createdAt', 'desc'));
        }
        
        // Execute the query
        const querySnapshot = await getDocs(q);
        
        // Process query results
        let listings = querySnapshot.docs.map(docSnapshot => {
          const data = docSnapshot.data();
          return {
            id: docSnapshot.id,
            ...data,
            price: data.price,
            createdAt: formatTimestamp(data.createdAt),
            updatedAt: formatTimestamp(data.updatedAt)
          } as Listing;
        });
        
        // Apply condition filter in-memory if specified
        if (filters.condition && filters.condition.length > 0) {
          listings = listings.filter(listing => 
            filters.condition!.includes(listing.condition)
          );
        }
        
        // Apply search term filter in-memory if specified
        if (filters.searchTerm) {
          const searchTermLower = filters.searchTerm.toLowerCase();
          listings = listings.filter(listing => 
            listing.title.toLowerCase().includes(searchTermLower) || 
            listing.description.toLowerCase().includes(searchTermLower)
          );
        }
        
        return listings;
      } else {
        // No filters, just get recent listings
        const q = query(listingsQuery, orderBy('createdAt', 'desc'), limit(50));
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(docSnapshot => {
          const data = docSnapshot.data();
          return {
            id: docSnapshot.id,
            ...data,
            price: data.price,
            createdAt: formatTimestamp(data.createdAt),
            updatedAt: formatTimestamp(data.updatedAt)
          } as Listing;
        });
      }
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  getListingById: async (id: string): Promise<Listing> => {
    try {
      const docRef = doc(db, 'listings', id);
      const listingSnapshot = await getDoc(docRef);
      
      if (!listingSnapshot.exists()) {
        throw new Error('Listing not found');
      }
      
      const data = listingSnapshot.data();
      
      // Increment views counter
      await updateDoc(docRef, {
        views: (data.views || 0) + 1
      });
      
      return {
        id: listingSnapshot.id,
        ...data,
        price: data.price,
        createdAt: formatTimestamp(data.createdAt),
        updatedAt: formatTimestamp(data.updatedAt)
      } as Listing;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  createListing: async (listingData: Partial<Listing>): Promise<Listing> => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
      
      // Get seller details from the current user
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      const userData = userDoc.data() || {};
      
      // Create listing document
      const newListing = {
        ...listingData,
        sellerId: currentUser.uid,
        sellerName: currentUser.displayName || userData.name || 'Unknown User',
        sellerAvatar: currentUser.photoURL || userData.avatar || '',
        sellerRating: userData.rating || 0,
        sellerVerified: userData.isAadhaarVerified || false,
        sellerJoinedDate: userData.joinedDate || new Date().toISOString(),
        views: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'listings'), newListing);
      
      return {
        id: docRef.id,
        ...newListing,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as Listing;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  updateListing: async (id: string, updatedListingData: Partial<Listing>): Promise<Listing> => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
      
      // Check if the listing belongs to the current user
      const listingRef = doc(db, 'listings', id);
      const listingSnapshot = await getDoc(listingRef);
      
      if (!listingSnapshot.exists()) {
        throw new Error('Listing not found');
      }
      
      const existingListingData = listingSnapshot.data();
      if (existingListingData.sellerId !== currentUser.uid) {
        throw new Error('Unauthorized: You can only update your own listings');
      }
      
      // Update the listing
      const updateData = {
        ...updatedListingData,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(listingRef, updateData);
      
      // Get the updated listing
      const updatedListingSnapshot = await getDoc(listingRef);
      const updatedListing = updatedListingSnapshot.data();
      
      if (!updatedListing) {
        throw new Error('Failed to update listing');
      }
      
      return {
        id: listingRef.id,
        ...updatedListing,
        createdAt: formatTimestamp(updatedListing.createdAt),
        updatedAt: formatTimestamp(updatedListing.updatedAt)
      } as Listing;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  deleteListing: async (id: string): Promise<{ success: boolean }> => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
      
      // Check if the listing belongs to the current user
      const listingRef = doc(db, 'listings', id);
      const listingSnapshot = await getDoc(listingRef);
      
      if (!listingSnapshot.exists()) {
        throw new Error('Listing not found');
      }
      
      const listingData = listingSnapshot.data();
      if (listingData.sellerId !== currentUser.uid) {
        throw new Error('Unauthorized: You can only delete your own listings');
      }
      
      // Delete the listing
      await deleteDoc(listingRef);
      
      return { success: true };
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  getUserListings: async (): Promise<Listing[]> => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
      
      // Query listings for the current user
      const q = query(
        collection(db, 'listings'),
        where('sellerId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          price: data.price,
          createdAt: formatTimestamp(data.createdAt),
          updatedAt: formatTimestamp(data.updatedAt)
        } as Listing;
      });
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
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
      
      // Query conversations where the current user is a participant
      const q = query(
        collection(db, 'conversations'),
        where('participants', 'array-contains', currentUser.uid),
        orderBy('lastMessage.createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      const conversations: Conversation[] = [];
      
      for (const conversationDoc of querySnapshot.docs) {
        const conversationData = conversationDoc.data();
        
        // Determine the other participant (not the current user)
        const otherParticipantId = conversationData.participants.find(
          (id: string) => id !== currentUser.uid
        );
        
        if (!otherParticipantId) continue;
        
        // Get the other participant's user data
        const participantDoc = await getDoc(doc(db, 'users', otherParticipantId));
        const participantData = participantDoc.data() || {};
        
        // Count unread messages
        const unreadQuery = query(
          collection(db, 'messages'),
          where('conversationId', '==', conversationDoc.id),
          where('receiverId', '==', currentUser.uid),
          where('read', '==', false)
        );
        
        const unreadSnapshot = await getDocs(unreadQuery);
        const unreadCount = unreadSnapshot.docs.length;
        
        // Create conversation object
        const conversation: Conversation = {
          id: conversationDoc.id,
          participantId: otherParticipantId,
          participantName: participantData.name || 'Unknown User',
          participantAvatar: participantData.avatar || '',
          lastMessage: {
            content: conversationData.lastMessage.content,
            createdAt: formatTimestamp(conversationData.lastMessage.createdAt),
            senderId: conversationData.lastMessage.senderId
          },
          unreadCount,
          listingId: conversationData.listingId,
          listingTitle: conversationData.listingTitle
        };
        
        conversations.push(conversation);
      }
      
      return conversations;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  getConversationMessages: async (conversationId: string): Promise<Message[]> => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
      
      // Get conversation to verify the user is a participant
      const conversationDoc = await getDoc(doc(db, 'conversations', conversationId));
      if (!conversationDoc.exists()) {
        throw new Error('Conversation not found');
      }
      
      const conversationData = conversationDoc.data();
      if (!conversationData.participants.includes(currentUser.uid)) {
        throw new Error('Unauthorized: You are not a participant in this conversation');
      }
      
      // Query messages for this conversation
      const q = query(
        collection(db, 'messages'),
        where('conversationId', '==', conversationId),
        orderBy('createdAt', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      
      // Mark messages as read if they are for the current user
      const batch: Promise<void>[] = [];
      
      const messages = await Promise.all(querySnapshot.docs.map(async (messageDoc) => {
        const messageData = messageDoc.data();
        
        // Get sender user data
        const senderDoc = await getDoc(doc(db, 'users', messageData.senderId));
        const senderData = senderDoc.data() || {};
        
        // Get receiver user data
        const receiverDoc = await getDoc(doc(db, 'users', messageData.receiverId));
        const receiverData = receiverDoc.data() || {};
        
        // Mark as read if it's for the current user and not read yet
        if (messageData.receiverId === currentUser.uid && !messageData.read) {
          batch.push(updateDoc(doc(db, 'messages', messageDoc.id), { read: true }));
        }
        
        return {
          id: messageDoc.id,
          senderId: messageData.senderId,
          senderName: senderData.name || 'Unknown User',
          senderAvatar: senderData.avatar || '',
          receiverId: messageData.receiverId,
          receiverName: receiverData.name || 'Unknown User',
          receiverAvatar: receiverData.avatar || '',
          content: messageData.content,
          createdAt: formatTimestamp(messageData.createdAt),
          read: messageData.read || messageData.receiverId === currentUser.uid,
          listingId: messageData.listingId,
          listingTitle: messageData.listingTitle
        } as Message;
      }));
      
      // Execute all the batch updates
      await Promise.all(batch);
      
      return messages;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  sendMessage: async (receiverId: string, content: string, listingId?: string): Promise<Message> => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
      
      // First, find or create the conversation
      let conversationId = '';
      let listingTitle = '';
      
      // Try to find existing conversation
      const conversationsQuery = query(
        collection(db, 'conversations'),
        where('participants', 'array-contains', currentUser.uid)
      );
      
      const conversationsSnapshot = await getDocs(conversationsQuery);
      
      for (const conversationDoc of conversationsSnapshot.docs) {
        const participants = conversationDoc.data().participants;
        if (participants.includes(receiverId)) {
          conversationId = conversationDoc.id;
          listingTitle = conversationDoc.data().listingTitle || '';
          break;
        }
      }
      
      // If no conversation exists, create a new one
      if (!conversationId) {
        if (listingId) {
          // Get listing details
          const listingDoc = await getDoc(doc(db, 'listings', listingId));
          if (listingDoc.exists()) {
            listingTitle = listingDoc.data().title || '';
          }
        }
        
        const newConversationRef = await addDoc(collection(db, 'conversations'), {
          participants: [currentUser.uid, receiverId],
          listingId,
          listingTitle,
          createdAt: serverTimestamp(),
          lastMessage: {
            content,
            senderId: currentUser.uid,
            createdAt: serverTimestamp()
          }
        });
        
        conversationId = newConversationRef.id;
      } else {
        // Update the existing conversation with the new last message
        await updateDoc(doc(db, 'conversations', conversationId), {
          lastMessage: {
            content,
            senderId: currentUser.uid,
            createdAt: serverTimestamp()
          },
          updatedAt: serverTimestamp()
        });
      }
      
      // Create the message
      const messageRef = await addDoc(collection(db, 'messages'), {
        conversationId,
        senderId: currentUser.uid,
        receiverId,
        content,
        listingId,
        listingTitle,
        read: false,
        createdAt: serverTimestamp()
      });
      
      // Get user data for the sender and receiver
      const senderDoc = await getDoc(doc(db, 'users', currentUser.uid));
      const senderData = senderDoc.data() || {};
      
      const receiverDoc = await getDoc(doc(db, 'users', receiverId));
      const receiverData = receiverDoc.data() || {};
      
      return {
        id: messageRef.id,
        senderId: currentUser.uid,
        senderName: currentUser.displayName || senderData.name || 'Unknown User',
        senderAvatar: currentUser.photoURL || senderData.avatar || '',
        receiverId,
        receiverName: receiverData.name || 'Unknown User',
        receiverAvatar: receiverData.avatar || '',
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
  
  markAsRead: async (messageId: string): Promise<{ success: boolean }> => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
      
      // Get the message to check if the current user is the receiver
      const messageDoc = await getDoc(doc(db, 'messages', messageId));
      if (!messageDoc.exists()) {
        throw new Error('Message not found');
      }
      
      const messageData = messageDoc.data();
      if (messageData.receiverId !== currentUser.uid) {
        throw new Error('Unauthorized: You can only mark messages sent to you as read');
      }
      
      // Mark the message as read
      await updateDoc(doc(db, 'messages', messageId), { read: true });
      
      return { success: true };
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
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
      
      // Get listing details
      const listingDoc = await getDoc(doc(db, 'listings', listingId));
      if (!listingDoc.exists()) {
        throw new Error('Listing not found');
      }
      
      const listingData = listingDoc.data();
      const listingTitle = listingData.title || '';
      
      // Create a new conversation
      const conversationRef = await addDoc(collection(db, 'conversations'), {
        participants: [currentUser.uid, sellerId],
        listingId,
        listingTitle,
        createdAt: serverTimestamp(),
        lastMessage: {
          content: initialMessage,
          senderId: currentUser.uid,
          createdAt: serverTimestamp()
        }
      });
      
      // Create the first message
      const messageRef = await addDoc(collection(db, 'messages'), {
        conversationId: conversationRef.id,
        senderId: currentUser.uid,
        receiverId: sellerId,
        content: initialMessage,
        listingId,
        listingTitle,
        read: false,
        createdAt: serverTimestamp()
      });
      
      // Get user data for the sender and receiver
      const senderDoc = await getDoc(doc(db, 'users', currentUser.uid));
      const senderData = senderDoc.data() || {};
      
      const receiverDoc = await getDoc(doc(db, 'users', sellerId));
      const receiverData = receiverDoc.data() || {};
      
      const message: Message = {
        id: messageRef.id,
        senderId: currentUser.uid,
        senderName: currentUser.displayName || senderData.name || 'Unknown User',
        senderAvatar: currentUser.photoURL || senderData.avatar || '',
        receiverId: sellerId,
        receiverName: receiverData.name || 'Unknown User',
        receiverAvatar: receiverData.avatar || '',
        content: initialMessage,
        createdAt: new Date().toISOString(),
        read: false,
        listingId,
        listingTitle
      };
      
      return {
        conversationId: conversationRef.id,
        message
      };
    } catch (error) {
      return handleApiError(error);
    }
  }
};
