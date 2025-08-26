
'use client';

import { useState } from 'react';
import { AnalyzeEquityRiskOutput } from '@/ai/flows/equity-risk-analysis';
import DisparateImpactAnalysis from "./DisparateImpactAnalysis";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { AlertTriangle, ListChecks, ThumbsUp } from 'lucide-react';


export default function StrategicAnalysis() {
    const [analysisResult, setAnalysisResult] = useState<AnalyzeEquityRiskOutput | null>(null);
    const [isAlertOpen, setAlertOpen] = useState(false);

    const handleAnalysisComplete = (result: AnalyzeEquityRiskOutput) => {
        setAnalysisResult(result);
        setAlertOpen(true);
    };

    return (
        <div>
           <DisparateImpactAnalysis onAnalysisComplete={handleAnalysisComplete} />

           {analysisResult && (
            <AlertDialog open={isAlertOpen} onOpenChange={setAlertOpen}>
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
        </div>
    );
}
