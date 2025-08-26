
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
import { Lightbulb, Loader2 } from 'lucide-react';
import { analyzeEquityRisk, AnalyzeEquityRiskOutput } from '@/ai/flows/equity-risk-analysis';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
      const result = await analyzeEquityRisk({ projectId, policyText });
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
    <div className="space-y-4 text-center">
        <Card className="bg-transparent border-gray-700 text-white">
            <CardHeader className="p-4">
                <CardTitle className="text-md flex items-center gap-2"><Lightbulb className="text-accent"/> Disparate Impact Identification</CardTitle>
                <CardDescription className="text-gray-400">Analyze a proposed policy to identify potential equity risks based on your project&apos;s curated data.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full">New DIIS Analysis</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[625px] bg-gray-900 text-white border-gray-700">
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
                                className="min-h-[150px] bg-gray-800 border-gray-600 focus:ring-primary"
                                disabled={loading}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                        <Button type="submit" onClick={handleAnalyze} disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
                            Generate Analysis
                        </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    </div>
  );
}
