import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  stars: number; // 0 to 3
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const StarRating: React.FC<StarRatingProps> = ({ stars, maxStars = 3, size = 'md' }) => {
  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-7 h-7'
  };

  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: maxStars }).map((_, index) => {
        const isFilled = index < stars;
        return (
          <div
            key={index}
            className={`transition-all duration-300 ${
              isFilled
                ? 'text-[#FFB300] drop-shadow-[0_0_8px_rgba(255,179,0,0.7)] scale-105'
                : 'text-[#64748B]/40'
            }`}
          >
            <Star
              className={`${iconSizes[size]} ${isFilled ? 'fill-[#FFB300]' : 'fill-transparent'}`}
            />
          </div>
        );
      })}
    </div>
  );
};
