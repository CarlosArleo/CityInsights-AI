
'use client';

import ReviewCardComponent, { Review } from './ReviewCard'; // Renamed to avoid conflict
import type { ReviewCard } from '@/lib/types';

interface ReviewListProps {
  reviews: ReviewCard[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  const pendingReviews = reviews.filter(r => r.status === 'pending');

  if (pendingReviews.length === 0) {
    return (
      <div className="flex items-center justify-center p-4 bg-black/20 rounded-md">
        <p className="text-sm text-gray-400 text-center">No insights are pending review.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2 -mr-2">
      {pendingReviews.map(review => <ReviewCardComponent key={review.id} review={review as Review} />)}
    </div>
  );
}
