import { db } from '../config/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

/**
 * This utility helps migrate existing listings to include subcategory field
 * It should be run once to update existing data
 */
export const migrateListingsToIncludeSubcategory = async () => {
  try {
    console.log('Starting migration: Adding subcategory to listings...');
    
    // Get all listings
    const listingsSnapshot = await getDocs(collection(db, 'listings'));
    
    // Count for statistics
    let totalProcessed = 0;
    let totalUpdated = 0;
    let errors = 0;
    
    // Process each listing
    const updatePromises = listingsSnapshot.docs.map(async (listingDoc) => {
      try {
        const listingData = listingDoc.data();
        totalProcessed++;
        
        // Skip if subcategory already exists
        if (listingData.subcategory) {
          return;
        }
        
        // Assign default subcategory based on category
        let subcategory = '';
        
        if (listingData.category === 'electronics') {
          subcategory = 'Other Electronics';
        } else if (listingData.category === 'furniture') {
          subcategory = 'Other Furniture';
        } else if (listingData.category === 'clothing') {
          subcategory = 'Other Clothing';
        } else if (listingData.category === 'vehicles') {
          subcategory = 'Other Vehicles';
        } else if (listingData.category === 'real-estate') {
          subcategory = 'Other Real Estate';
        } else if (listingData.category === 'services') {
          subcategory = 'Other Services';
        } else if (listingData.category === 'jobs') {
          subcategory = 'Other Jobs';
        } else {
          subcategory = 'Miscellaneous';
        }
        
        // Update the document with subcategory
        await updateDoc(doc(db, 'listings', listingDoc.id), {
          subcategory
        });
        
        totalUpdated++;
      } catch (error) {
        console.error(`Error updating listing ${listingDoc.id}:`, error);
        errors++;
      }
    });
    
    // Wait for all updates to complete
    await Promise.all(updatePromises);
    
    console.log(`Migration complete. Processed: ${totalProcessed}, Updated: ${totalUpdated}, Errors: ${errors}`);
    
    return {
      success: true,
      totalProcessed,
      totalUpdated,
      errors
    };
  } catch (error) {
    console.error('Migration failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
};
