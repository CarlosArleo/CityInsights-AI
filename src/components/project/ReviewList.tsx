
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

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-24 w-full bg-gray-700/50 rounded-md" />
        <Skeleton className="h-24 w-full bg-gray-700/50 rounded-md" />
      </div>
    );
  }
  
  if (reviews.length === 0) {
    return (
      <div className="flex items-center justify-center p-4 bg-black/20 rounded-md">
        <p className="text-sm text-gray-400 text-center">No insights are pending review.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2 -mr-2">
      {reviews.map(review => <ReviewCard key={review.id} review={review} />)}
    </div>
  );
}
