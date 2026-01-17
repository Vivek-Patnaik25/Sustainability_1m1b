import { ShieldCheck, Info, FileText, Layers } from 'lucide-react';

export default function ResponsibleAIPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold text-gray-900">Responsible AI & Ethics</h1>
                <p className="text-xl text-gray-600">
                    Understanding how our AI works, its limitations, and our commitment to fairness.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            <Layers className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">How It Works</h3>
                    </div>
                    <p className="text-gray-600">
                        This tool uses a Large Language Model (Google Gemini) to read text inputs.
                        It compares the text against the definitions of UN Sustainable Development Goals (SDGs 11, 6, 12, 13).
                        It looks for keywords and context to determine the most likely category.
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-green-100 rounded-lg text-green-600">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">No Data Persistence</h3>
                    </div>
                    <p className="text-gray-600">
                        To protect privacy, this application is **stateless**.
                        We do not save your inputs or the AI's analysis results in any database.
                        Once you close the specific session, the data is gone.
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
                            <Info className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">Limitations</h3>
                    </div>
                    <p className="text-gray-600">
                        AI can make mistakes ("hallucinations").
                        It might misclassify nuances or cultural contexts it hasn't seen before.
                        Always review the analysis with human judgment before taking real-world action.
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                            <FileText className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">Explainability</h3>
                    </div>
                    <p className="text-gray-600">
                        We enforced an "Explainability" rule.
                        The AI is required to provide a reason for every classification it makes,
                        so you are never left guessing why a decision was reached.
                    </p>
                </div>
            </div>
        </div>
    );
}
