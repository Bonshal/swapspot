import React from 'react';
import { categories } from '../../mockData';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

const CategoryBar: React.FC = () => {
  return (
    <div className="bg-white border-b border-neutral-200 hidden md:block">
      <div className="container-custom mx-auto">
        <div className="flex items-center overflow-x-auto scrollbar-hide py-3 space-x-8">
          {categories.map((category) => (
            <CategoryItem key={category.id} {...category} />
          ))}
        </div>
      </div>
    </div>
  );
};

interface CategoryItemProps {
  name: string;
  icon: string;
  slug: string;
  subCategories?: Array<{ id: string; name: string; slug: string }>;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ name, icon, slug, subCategories }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const handleMouseEnter = () => {
    if (subCategories && subCategories.length > 0) {
      setIsOpen(true);
    }
  };
  
  const handleMouseLeave = () => {
    setIsOpen(false);
  };
  
  // Map icon name to Lucide icon
  const getLucideIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'smartphone':
        return '📱';
      case 'car':
        return '🚗';
      case 'home':
        return '🏠';
      case 'couch':
        return '🛋️';
      case 'shirt':
        return '👕';
      case 'book-open':
        return '📚';
      case 'briefcase':
        return '💼';
      case 'tool':
        return '🔧';
      default:
        return '📦';
    }
  };
  
  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <a
        href={`/category/${slug}`}
        className={cn(
          "flex items-center text-sm font-medium whitespace-nowrap transition-colors duration-200",
          isOpen ? "text-primary-600" : "text-neutral-700 hover:text-primary-600"
        )}
      >
        <span className="mr-1.5">{getLucideIcon(icon)}</span>
        {name}
        {subCategories && subCategories.length > 0 && (
          <ChevronDown className={cn(
            "ml-1 h-4 w-4 transition-transform duration-200",
            isOpen && "transform rotate-180"
          )} />
        )}
      </a>
      
      {isOpen && subCategories && subCategories.length > 0 && (
        <div className="absolute left-0 mt-1 w-48 bg-white rounded-lg shadow-dropdown py-2 z-50 animate-fade-in">
          {subCategories.map((subCategory) => (
            <a
              key={subCategory.id}
              href={`/category/${slug}/${subCategory.slug}`}
              className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary-600"
            >
              {subCategory.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryBar;