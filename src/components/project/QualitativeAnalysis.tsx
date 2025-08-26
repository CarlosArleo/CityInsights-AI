
'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import ReviewCard, { Review } from './ReviewCard';
import { Skeleton } from '@/components/ui/skeleton';

interface QualitativeAnalysisProps {
  projectId: string;
}

export default function QualitativeAnalysis({ projectId }: QualitativeAnalysisProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;

    setLoading(true);
    const reviewsQuery = query(
      collection(db, 'projects', projectId, 'reviews'),
      where('status', '==', 'pending')
    );

    const unsubscribe = onSnapshot(reviewsQuery, (querySnapshot) => {
      const reviewsData: Review[] = [];
      querySnapshot.forEach((doc) => {
        reviewsData.push({ id: doc.id, ...doc.data() } as Review);
      });
      setReviews(reviewsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [projectId]);

  if (loading) {
    return (
        <div className="space-y-4">
            <Skeleton className="h-24 w-full bg-gray-700" />
            <Skeleton className="h-24 w-full bg-gray-700" />
        </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10 border-2 border-dashed border-gray-600 rounded-lg bg-black/20">
        <h3 className="text-lg font-semibold">No Pending Reviews</h3>
        <p className="mt-2 text-sm text-gray-400">
          Upload a document to see AI-generated insights for review.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}
