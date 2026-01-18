export interface AnalysisResult {
    issue: string;
    sdg: string;
    severity: string;
    summary: string;
    recommendation: string;
    explanation: string;
    rag_sources?: string[];
}

interface IssueCardProps {
    originalText: string;
    analysis: AnalysisResult;
}

export default function IssueCard({ originalText, analysis }: IssueCardProps) {
    const getSeverityColor = (severity: string) => {
        const s = severity.toLowerCase();
        if (s.includes('high')) return 'bg-red-100 text-red-800 border-red-200';
        if (s.includes('medium')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        return 'bg-green-100 text-green-800 border-green-200';
    };

    return (
        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
            <div className="p-6 space-y-4">
                <div>
                    <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-1">Original Report</h3>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-md text-sm italic">"{originalText}"</p>
                </div>

                <div className="flex items-center justify-between">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(analysis.severity)}`}>
                        Severity: {analysis.severity}
                    </div>
                    <div className="text-sm font-bold text-teal-600">
                        {analysis.sdg}
                    </div>
                </div>

                <div>
                    <h4 className="text-md font-semibold text-gray-800">{analysis.issue}</h4>
                    <p className="text-sm text-gray-600 mt-1">{analysis.summary}</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                    <h5 className="text-xs font-bold text-blue-800 uppercase mb-1">Recommended Action</h5>
                    <p className="text-sm text-blue-900">{analysis.recommendation}</p>
                </div>

                <div className="border-t border-gray-100 pt-3">
                    <div className="mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase">AI Explanation (RAG):</span>
                        <p className="text-xs text-gray-600 mt-1">
                            {analysis.explanation}
                        </p>
                    </div>

                    {analysis.rag_sources && analysis.rag_sources.length > 0 && (
                        <div className="mt-2 text-xs text-gray-400">
                            <span className="font-semibold">Knowledge Sources: </span>
                            {analysis.rag_sources.join(", ")}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
