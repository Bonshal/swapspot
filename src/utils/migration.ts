import { supabase } from '../config/supabase';

/**
 * This utility helps migrate existing listings to include subcategory field
 * It should be run once to update existing data
 */
export const migrateListingsToIncludeSubcategory = async () => {
  try {
    console.log('Starting migration: Adding subcategory to listings...');
    
    // Get all listings
    const { data: listings, error } = await supabase
      .from('listings')
      .select('*');
    
    if (error) throw error;
    
    // Count for statistics
    let totalProcessed = 0;
    let totalUpdated = 0;
    let errors = 0;
      // Process each listing
    const updatePromises = listings.map(async (listing: any) => {
      try {
        totalProcessed++;
        
        // Skip if subcategory already exists
        if (listing.subcategory) {
          return;
        }
        
        // Assign default subcategory based on category
        let subcategory = '';
        
        if (listing.category === 'electronics') {
          subcategory = 'Other Electronics';
        } else if (listing.category === 'furniture') {
          subcategory = 'Other Furniture';
        } else if (listing.category === 'clothing') {
          subcategory = 'Other Clothing';
        } else if (listing.category === 'vehicles') {
          subcategory = 'Other Vehicles';
        } else if (listing.category === 'real-estate') {
          subcategory = 'Other Real Estate';
        } else if (listing.category === 'services') {
          subcategory = 'Other Services';
        } else if (listing.category === 'jobs') {
          subcategory = 'Other Jobs';
        } else {
          subcategory = 'Miscellaneous';        }
        
        // Update the document with subcategory
        const { error: updateError } = await supabase
          .from('listings')
          .update({ subcategory })
          .eq('id', listing.id);
        
        if (updateError) throw updateError;
        
        totalUpdated++;
      } catch (error) {
        console.error(`Error updating listing ${listing.id}:`, error);
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
