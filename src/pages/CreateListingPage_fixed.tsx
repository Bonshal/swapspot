import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/layout/Layout';
import { useNavigate } from 'react-router-dom';
import { Camera, X } from 'lucide-react';
import Button from '../components/ui/Button';
import { useListingStore } from '../store/listingStore';
import { categorySubcategories, ListingCategory } from '../types/listing';

const CreateListingPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [availableSubcategories, setAvailableSubcategories] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { addListing, loading } = useListingStore();
  const navigate = useNavigate();

  // Update subcategories when category changes
  useEffect(() => {
    if (category && Object.keys(categorySubcategories).includes(category)) {
      setAvailableSubcategories(categorySubcategories[category as ListingCategory]);
      setSubcategory(''); // Reset subcategory when category changes
    } else {
      setAvailableSubcategories([]);
      setSubcategory('');
    }
  }, [category]);

  // Handle image file selection
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles = Array.from(e.target.files);
    const remainingSlots = 10 - images.length;
    const filesToAdd = newFiles.slice(0, remainingSlots);
    
    // Create preview URLs for the new images
    const newPreviewUrls = filesToAdd.map(file => URL.createObjectURL(file));
    
    setImages(prev => [...prev, ...filesToAdd]);
    setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    // Revoke the object URL to avoid memory leaks
    if (imagePreviewUrls[index]) {
      URL.revokeObjectURL(imagePreviewUrls[index]);
    }
    
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!title || !description || !category || !price || !condition || !location || images.length === 0) {
      alert('Please fill in all required fields and add at least one image');
      return;
    }

    try {
      await addListing({
        title,
        description,
        category,
        subcategory,
        price: parseFloat(price),
        condition,
        location
      }, images);
      
      // Import here to avoid circular dependencies
      const { showToast } = await import('../components/ui/Toast');
      showToast.success('Listing created successfully!');
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating listing:', error);
      const { showToast } = await import('../components/ui/Toast');
      showToast.error('Failed to create listing. Please try again later.');
    }
  };

  return (
    <Layout>
      <div className="container p-6 mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold">Create New Listing</h1>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Listing Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. iPhone 13 Pro Max - 256GB - Mint Condition"
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your item in detail. Include information about the condition, features, and why you're selling it."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select a category</option>
                  <option value="electronics">Electronics</option>
                  <option value="furniture">Furniture</option>
                  <option value="clothing">Clothing</option>
                  <option value="vehicles">Vehicles</option>
                  <option value="real-estate">Real Estate</option>
                  <option value="services">Services</option>
                  <option value="jobs">Jobs</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              {availableSubcategories.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subcategory
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                  >
                    <option value="">Select a subcategory</option>
                    {availableSubcategories.map((subcat, index) => (
                      <option key={index} value={subcat}>
                        {subcat}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Condition *
                </label>
                <select
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                >
                  <option value="">Select condition</option>
                  <option value="new">New</option>
                  <option value="like-new">Like New</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, State"
                />
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Photos</h2>
            <p className="text-sm text-gray-500 mb-4">
              Add up to 10 photos. Clear, detailed images from multiple angles will help your listing sell faster.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {imagePreviewUrls.map((imageUrl, index) => (
                <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={imageUrl} 
                    alt={`Listing ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-100"
                  >
                    <X size={16} className="text-red-500" />
                  </button>
                </div>
              ))}
              
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                multiple
                className="hidden"
              />
              
              {images.length < 10 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Camera className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Add Photo</span>
                </button>
              )}
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={loading}
            >
              {loading ? 'Creating...' : 'Create Listing'}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateListingPage;
