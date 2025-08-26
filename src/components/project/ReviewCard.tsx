
'use client';

import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
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
        // No need to set isUpdating back to false, as the component will disappear
    }
  };

  return (
    <Card className="bg-black/20 border-gray-700 text-white">
      <CardHeader className="p-4">
        <Badge variant="secondary" className="w-fit">{review.category}</Badge>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        <p className="text-sm text-gray-300 italic">"{review.excerpt}"</p>
        <p className="font-semibold text-primary-foreground">{review.insight}</p>
      </CardContent>
      <CardFooter className="p-4 flex justify-end gap-2">
        <Button
          size="sm"
          variant="outline"
          className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
          onClick={() => handleUpdateStatus('rejected')}
          disabled={isUpdating}
        >
          <X className="mr-1 h-4 w-4" /> Reject
        </Button>
        <Button
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={() => handleUpdateStatus('accepted')}
          disabled={isUpdating}
        >
          <Check className="mr-1 h-4 w-4" /> Accept
        </Button>
      </CardFooter>
    </Card>
  );
}
