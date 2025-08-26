
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Lightbulb, Loader2, Plus } from 'lucide-react';
import { analyzeEquityRiskAction } from '@/app/actions';
import { type AnalyzeEquityRiskOutput } from '@/ai/flows/equity-risk-analysis';
import { useParams } from 'next/navigation';

interface DisparateImpactAnalysisProps {
    onAnalysisComplete: (result: AnalyzeEquityRiskOutput) => void;
}

export default function DisparateImpactAnalysis({ onAnalysisComplete }: DisparateImpactAnalysisProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [policyText, setPolicyText] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { projectId } = useParams() as { projectId: string };

  const handleAnalyze = async () => {
    if (!policyText.trim()) {
      toast({
        variant: 'destructive',
        title: 'Policy text is required.',
      });
      return;
    }
    setLoading(true);
    try {
      const result = await analyzeEquityRiskAction({ projectId, policyText });
      onAnalysisComplete(result);
      setDialogOpen(false);
      setPolicyText('');
    } catch (error) {
      console.error('Error analyzing equity risk:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'An unexpected error occurred while running the analysis.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
              <Button className="w-full justify-start bg-[var(--button-secondary-background)] hover:bg-[var(--button-secondary-hover)] text-sidebar-foreground">
                <Plus className="mr-2 h-4 w-4" />
                New DIIS Analysis
              </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px] bg-sidebar-background text-sidebar-foreground border-sidebar-border">
              <DialogHeader>
              <DialogTitle>New Disparate Impact Analysis</DialogTitle>
              <DialogDescription>
                  Enter the text of a proposed policy or plan. The AI will analyze it using your project&apos;s accepted insights and geospatial data as context.
              </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                  <div className="grid w-full gap-1.5">
                      <Label htmlFor="policy-text">Policy Text</Label>
                      <Textarea
                      id="policy-text"
                      value={policyText}
                      onChange={(e) => setPolicyText(e.target.value)}
                      placeholder="e.g., Rezone the industrial corridor for market-rate housing."
                      className="min-h-[150px] bg-sidebar-panel-background border-sidebar-border focus:ring-primary"
                      disabled={loading}
                      />
                  </div>
              </div>
              <DialogFooter>
              <Button type="submit" onClick={handleAnalyze} disabled={loading} className="bg-primary hover:bg-primary/90">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
                  Generate Analysis
              </Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
  );
}
