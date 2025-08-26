
'use client';

import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Check, X } from 'lucide-react';
import { useState } from 'react';

export interface Review {
  id: string;
  projectId: string;
  excerpt: string;
  insight: string;
  category: string;
  status: 'pending' | 'accepted' | 'rejected';
}

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateStatus = async (newStatus: 'accepted' | 'rejected') => {
    setIsUpdating(true);
    const reviewRef = doc(db, 'projects', review.projectId, 'reviews', review.id);
    try {
      await updateDoc(reviewRef, { status: newStatus });
      toast({
        title: `Insight ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating review status:', error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Could not update the insight status.',
      });
    } finally {
        // Component will disappear, no need to setIsUpdating(false)
    }
  };

  return (
    <div className="bg-black/20 p-3 rounded-md border border-sidebar-border/50 text-sm">
      <p className="text-gray-400 italic mb-2">&quot;{review.excerpt}&quot;</p>
      <p className="font-semibold text-gray-200 mb-3">{review.insight}</p>
      <div className="flex justify-between items-center">
        <Badge variant="secondary" className="bg-gray-600/50 text-gray-300">{review.category}</Badge>
        <div className="flex gap-2">
            <Button
            size="icon"
            variant="ghost"
            className="text-red-400 hover:bg-red-900/50 hover:text-red-300 h-7 w-7"
            onClick={() => handleUpdateStatus('rejected')}
            disabled={isUpdating}
            >
            <X className="h-4 w-4" />
            </Button>
            <Button
            size="icon"
            variant="ghost"
            className="text-green-400 hover:bg-green-900/50 hover:text-green-300 h-7 w-7"
            onClick={() => handleUpdateStatus('accepted')}
            disabled={isUpdating}
            >
            <Check className="h-4 w-4" />
            </Button>
        </div>
      </div>
    </div>
  );
}
