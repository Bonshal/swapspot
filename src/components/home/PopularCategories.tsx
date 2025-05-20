import React from 'react';
import { getPopularCategories } from '../../mockData';
import { Card, CardBody } from '../ui/Card';

const PopularCategories: React.FC = () => {
  const popularCategories = getPopularCategories();
  
  // Map icon name to emoji (simplified for example)
  const getEmoji = (iconName: string) => {
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
    <section id="popular-categories" className="py-12 bg-neutral-50">
      <div className="container-custom mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-8 text-center">
          Browse Popular Categories
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {popularCategories.map((category) => (
            <a href={`/category/${category.slug}`} key={category.id}>
              <Card className="h-full text-center transition-transform hover:-translate-y-1">
                <CardBody className="flex flex-col items-center justify-center py-6">
                  <div className="text-4xl mb-3">
                    {getEmoji(category.icon)}
                  </div>
                  <h3 className="font-medium text-neutral-900">
                    {category.name}
                  </h3>
                  <p className="text-sm text-neutral-500 mt-1">
                    {category.subCategories ? `${category.subCategories.length} subcategories` : ''}
                  </p>
                </CardBody>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;