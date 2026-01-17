'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { analyzeTexts } from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function AnalyzerPage() {
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleAnalyze = async () => {
        if (!inputText.trim()) return;

        setIsLoading(true);
        setError(null);

        // Split text by newlines to simulate multiple entries, or just treat as one block depending on requirement
        // Prompt said "list of text entries". Let's support one per line or just assume input is one entry.
        // For better UX, let's treat newlines as separators.
        const texts = inputText.split('\n').filter(line => line.trim().length > 0);

        if (texts.length === 0) {
            setError("Please enter some text.");
            setIsLoading(false);
            return;
        }

        try {
            const result = await analyzeTexts(texts);
            // Save to sessionStorage to pass to Results page
            sessionStorage.setItem('analysisResults', JSON.stringify(result.results || []));
            router.push('/results');
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">Sustainability Issue Analyzer</h1>
                <p className="text-gray-500">
                    Paste one or more community issues below (one per line).
                    Our AI will identify the SDG, severity, and recommend actions.
                </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Example: \nThe trash bin on Main St is overflowing.\nThere is a water leak near the park entrance."
                    className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-gray-900 transition-all placeholder-gray-400"
                />

                {error && (
                    <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        onClick={handleAnalyze}
                        disabled={isLoading || !inputText.trim()}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                Analyzing...
                            </>
                        ) : (
                            'Analyze Issues'
                        )}
                    </button>
                </div>
            </div>

            <div className="text-center text-sm text-gray-400">
                <p>No data is stored. Your inputs are processed for analysis only.</p>
            </div>
        </div>
    );
}
