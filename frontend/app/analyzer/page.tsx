'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { analyzeTexts } from '@/lib/api';
import { Loader2, Mic, Image as ImageIcon, Type, X, Upload } from 'lucide-react';

export default function AnalyzerPage() {
    const [activeTab, setActiveTab] = useState<'text' | 'voice' | 'image'>('text');
    const [inputText, setInputText] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Voice Recognition Ref
    const recognitionRef = useRef<any>(null);

    const handleAnalyze = async () => {
        setIsLoading(true);
        setError(null);

        let texts: string[] = [];
        let fileToSend: File | undefined = undefined;

        // Only process the ACTIVE tab's input
        if (activeTab === 'text' || activeTab === 'voice') {
            if (!inputText.trim()) {
                setError("Please enter or record some text.");
                setIsLoading(false);
                return;
            }
            texts = inputText.split('\n').filter(line => line.trim().length > 0);
        }

        if (activeTab === 'image') {
            if (!imageFile) {
                setError("Please upload an image.");
                setIsLoading(false);
                return;
            }
            fileToSend = imageFile;
        }

        try {
            const result = await analyzeTexts(texts, fileToSend);
            sessionStorage.setItem('analysisResults', JSON.stringify(result.results || []));
            router.push('/results');
        } catch (err: any) {
            console.error("Analysis error:", err);
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert("Your browser does not support speech recognition. Please type instead.");
            return;
        }

        // @ts-ignore
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;

        recognitionRef.current.onstart = () => setIsRecording(true);
        recognitionRef.current.onend = () => setIsRecording(false);
        recognitionRef.current.onerror = (event: any) => {
            console.error("Speech error", event);
            setIsRecording(false);
        };

        recognitionRef.current.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInputText((prev) => prev ? prev + '\n' + transcript : transcript);
        };

        recognitionRef.current.start();
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">Sustainability Issue Analyzer</h1>
                <p className="text-gray-500">
                    Report issues using Text, Voice, or Images. AI will analyze and classify them.
                </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-gray-100">
                    <button
                        onClick={() => setActiveTab('text')}
                        className={`flex-1 py-4 text-sm font-medium flex items-center justify-center transition-colors ${activeTab === 'text' ? 'text-green-600 border-b-2 border-green-600 bg-green-50' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Type className="h-4 w-4 mr-2" /> Text Input
                    </button>
                    <button
                        onClick={() => setActiveTab('voice')}
                        className={`flex-1 py-4 text-sm font-medium flex items-center justify-center transition-colors ${activeTab === 'voice' ? 'text-green-600 border-b-2 border-green-600 bg-green-50' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Mic className="h-4 w-4 mr-2" /> Voice Input
                    </button>
                    <button
                        onClick={() => setActiveTab('image')}
                        className={`flex-1 py-4 text-sm font-medium flex items-center justify-center transition-colors ${activeTab === 'image' ? 'text-green-600 border-b-2 border-green-600 bg-green-50' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <ImageIcon className="h-4 w-4 mr-2" /> Image Upload
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {/* Content Area */}
                    {activeTab === 'text' && (
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Type your issue here. Example: 'The trash bin on Main St is overflowing.'"
                            className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-400"
                        />
                    )}

                    {activeTab === 'voice' && (
                        <div className="flex flex-col items-center justify-center h-48 space-y-4 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                            <button
                                onClick={isRecording ? stopListening : startListening}
                                className={`p-6 rounded-full transition-all ${isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-green-600 hover:bg-green-700'}`}
                            >
                                <Mic className="h-8 w-8 text-white" />
                            </button>
                            <p className="text-gray-500 text-sm">
                                {isRecording ? "Listening... Click to stop." : "Click microphone to speak."}
                            </p>
                            {inputText && (
                                <div className="w-full px-4 text-center">
                                    <p className="text-xs text-gray-400 uppercase font-bold">Transcribed Text:</p>
                                    <p className="text-gray-700 italic mt-1">"{inputText}"</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'image' && (
                        <div className="flex flex-col items-center justify-center h-48 space-y-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 relative">
                            {imageFile ? (
                                <div className="relative w-full h-full flex flex-col items-center justify-center">
                                    <p className="text-green-600 font-medium flex items-center">
                                        <ImageIcon className="h-5 w-5 mr-2" />
                                        {imageFile.name}
                                    </p>
                                    <button
                                        onClick={() => setImageFile(null)}
                                        className="mt-2 text-sm text-red-500 hover:text-red-700"
                                    >
                                        Remove Image
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <Upload className="h-10 w-10 text-gray-400" />
                                    <div className="text-center">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                                            <span>Upload a file</span>
                                            <input
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                className="sr-only"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    if (e.target.files?.[0]) {
                                                        setImageFile(e.target.files[0]);
                                                    }
                                                }}
                                            />
                                        </label>
                                        <p className="pl-1 text-gray-500">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                                </>
                            )}
                        </div>
                    )}

                    {error && (
                        <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-between items-center pt-2">
                        <span className="text-xs text-gray-400">
                            AI-assisted analysis may vary. Please review results.
                        </span>
                        <button
                            onClick={handleAnalyze}
                            disabled={isLoading || (!inputText.trim() && !imageFile)}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                    Analyzing...
                                </>
                            ) : (
                                'Analyze Issue'
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="text-center text-sm text-gray-400">
                <p>Voice and Image inputs are processed to text for transparent analysis.</p>
            </div>
        </div>
    );
}
