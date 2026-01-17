'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import IssueCard, { type AnalysisResult } from '@/components/IssueCard';
import { ArrowLeft } from 'lucide-react';

interface ResultItem {
    original_text: string;
    analysis?: AnalysisResult;
    error?: string;
}

export default function ResultsPage() {
    const [results, setResults] = useState<ResultItem[]>([]);
    const router = useRouter();

    useEffect(() => {
        const stored = sessionStorage.getItem('analysisResults');
        if (stored) {
            try {
                setResults(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse results", e);
            }
        } else {
            // Redirect back if no results
            // router.replace('/analyzer'); 
            // Or just show empty state
        }
    }, [router]);

    if (results.length === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-900">No results found.</h2>
                <p className="text-gray-500 mt-2">Go back and submit some text for analysis.</p>
                <Link href="/analyzer" className="mt-8 inline-flex items-center text-green-600 hover:text-green-700 font-medium">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Analyzer
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Analysis Results</h1>
                <Link href="/analyzer" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Analyze More
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.map((item, idx) => (
                    item.analysis ? (
                        <IssueCard key={idx} originalText={item.original_text} analysis={item.analysis} />
                    ) : (
                        <div key={idx} className="bg-red-50 p-6 rounded-lg border border-red-100">
                            <p className="text-red-800 font-medium">Error analyzing: "{item.original_text}"</p>
                            <p className="text-red-600 text-sm mt-1">{item.error || "Unknown error"}</p>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
}
