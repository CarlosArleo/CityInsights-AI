
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
import { AlertTriangle, Lightbulb, Loader2, ListChecks, ThumbsUp } from 'lucide-react';
import { analyzeEquityRisk, AnalyzeEquityRiskOutput } from '@/ai/flows/equity-risk-analysis';
import { useParams } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';


export default function DisparateImpactAnalysis() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [policyText, setPolicyText] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeEquityRiskOutput | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
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
      setAnalysisResult(result);
      setAlertOpen(true);
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
    <>
      <div className="space-y-4 text-center">
        <Card className="bg-transparent border-gray-700 text-white">
            <CardHeader className="p-4">
                <CardTitle className="text-md flex items-center gap-2"><Lightbulb className="text-accent"/> Disparate Impact Identification</CardTitle>
                <CardDescription className="text-gray-400">Analyze a proposed policy to identify potential equity risks based on your project's curated data.</CardDescription>
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
                            Enter the text of a proposed policy or plan. The AI will analyze it using your project's accepted insights and geospatial data as context.
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

      {analysisResult && (
        <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
          <AlertDialogContent className="bg-gray-900 text-white border-gray-700">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-primary-foreground"><AlertTriangle className="text-accent" /> Equity Risk Analysis Report</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400 pt-2">
                {analysisResult.summary}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-4">
                <div>
                    <h3 className="font-semibold flex items-center gap-2 mb-2"><ListChecks /> Key Risks</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-300">
                        {analysisResult.keyRisks.map((risk, i) => <li key={i}>{risk}</li>)}
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold flex items-center gap-2 mb-2"><ThumbsUp /> Recommendations</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-300">
                        {analysisResult.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                    </ul>
                </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setAlertOpen(false)} className="bg-primary hover:bg-primary/90">
                Close
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}

// Add Card components to the file scope
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
