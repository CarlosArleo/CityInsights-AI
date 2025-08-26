
'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Skeleton } from '@/components/ui/skeleton';
import ReviewCard, { Review } from './ReviewCard';

interface ReviewListProps {
  projectId: string;
}

export default function ReviewList({ projectId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;

    setLoading(true);
    const reviewsQuery = query(
        collection(db, `projects/${projectId}/reviews`),
        where('status', '==', 'pending')
    );

    const unsubscribe = onSnapshot(reviewsQuery, (snapshot) => {
        const reviewsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
        setReviews(reviewsData);
        setLoading(false);
    }, (error) => {
        console.error("Error fetching reviews:", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [projectId]);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Analysis Review</h2>
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-20 w-full bg-gray-700/50" />
          <Skeleton className="h-20 w-full bg-gray-700/50" />
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
          {reviews.map(review => <ReviewCard key={review.id} review={review} />)}
        </div>
      ) : (
        <p className="text-sm text-gray-400 text-center py-4">No pending reviews.</p>
      )}
    </div>
  );
}
