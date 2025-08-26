
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
        <div className="space-y-4">
           <DisparateImpactAnalysis onAnalysisComplete={handleAnalysisComplete} />

           {/* Add other strategic tools here */}

           {analysisResult && (
            <AlertDialog open={isAlertOpen} onOpenChange={setAlertOpen}>
              <AlertDialogContent className="bg-sidebar-background text-sidebar-foreground border-sidebar-border">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2"><AlertTriangle className="text-amber-400" /> Equity Risk Analysis Report</AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-400 pt-2">
                    {analysisResult.summary}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-4">
                    <div>
                        <h3 className="font-semibold flex items-center gap-2 mb-2 text-gray-200"><ListChecks /> Key Risks</h3>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-300">
                            {analysisResult.keyRisks.map((risk, i) => <li key={i}>{risk}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold flex items-center gap-2 mb-2 text-gray-200"><ThumbsUp /> Recommendations</h3>
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
