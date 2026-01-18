'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { analyzeTexts } from '@/lib/api';
import { Loader2, Mic, Image as ImageIcon, Type, X, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

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
        recognitionRef.current.interimResults = true; // Changed to true for visuals, but we rely on final

        recognitionRef.current.onstart = () => setIsRecording(true);
        recognitionRef.current.onend = () => setIsRecording(false);
        recognitionRef.current.onerror = (event: any) => {
            console.error("Speech error", event);
            setIsRecording(false);
        };

        recognitionRef.current.onresult = (event: any) => {
            const lastResult = event.results[event.results.length - 1];
            const transcript = lastResult[0].transcript;

            if (lastResult.isFinal) {
                setInputText((prev) => {
                    const cleanPrev = prev.trim();
                    return cleanPrev ? cleanPrev + ' ' + transcript : transcript;
                });
            }
        };

        recognitionRef.current.start();
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };

    const tabs = [
        { id: 'text', icon: Type, label: 'Text Input' },
        { id: 'voice', icon: Mic, label: 'Voice Input' },
        { id: 'image', icon: ImageIcon, label: 'Image Upload' }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto space-y-8 pt-20 pb-20"
        >
            <div className="text-center space-y-3">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Sustainability Issue Analyzer</h1>
                <p className="text-gray-500 text-lg">
                    Report issues using Text, Voice, or Images. Our AI will classify and analyze them instantly.
                </p>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden shadow-xl border border-white/60">
                {/* Custom Tabs */}
                <div className="bg-gray-50/50 border-b border-gray-200 p-2">
                    <div className="flex space-x-1 bg-gray-200/50 p-1 rounded-xl">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={clsx(
                                        "relative flex-1 flex items-center justify-center py-2.5 text-sm font-semibold rounded-lg transition-all duration-200",
                                        isActive ? "text-green-700" : "text-gray-500 hover:text-gray-700"
                                    )}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-white shadow-sm rounded-lg"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10 flex items-center gap-2">
                                        <tab.icon className="h-4 w-4" />
                                        {tab.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="p-8 min-h-[320px]">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="h-full"
                        >
                            {activeTab === 'text' && (
                                <textarea
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Describe the issue here...&#10;Example: 'The trash bin on Main St is overflowing.'"
                                    className="w-full h-64 p-5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-400 text-lg leading-relaxed shadow-inner"
                                />
                            )}

                            {activeTab === 'voice' && (
                                <div className="flex flex-col items-center justify-center h-64 space-y-6">
                                    <button
                                        onClick={isRecording ? stopListening : startListening}
                                        className={clsx(
                                            "p-8 rounded-full transition-all duration-300 shadow-lg",
                                            isRecording
                                                ? "bg-red-50 text-red-600 ring-4 ring-red-100 animate-pulse"
                                                : "bg-green-600 text-white hover:bg-green-700 hover:scale-110 hover:shadow-green-500/30"
                                        )}
                                    >
                                        <Mic className={clsx("h-10 w-10", isRecording && "animate-bounce")} />
                                    </button>
                                    <div className="text-center space-y-1">
                                        <p className="text-gray-900 font-medium text-lg">
                                            {isRecording ? "Listening..." : "Click to Start Recording"}
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                            Speak clearly about the issue.
                                        </p>
                                    </div>
                                    {inputText && (
                                        <div className="w-full max-w-lg bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                                            <p className="text-gray-700 italic">"{inputText}"</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'image' && (
                                <div className="h-64 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors relative group">
                                    {imageFile ? (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-3">
                                                <ImageIcon className="h-8 w-8" />
                                            </div>
                                            <p className="text-gray-900 font-medium text-lg truncate max-w-xs">
                                                {imageFile.name}
                                            </p>
                                            <p className="text-gray-500 text-sm mb-4">
                                                {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                            <button
                                                onClick={() => setImageFile(null)}
                                                className="px-4 py-2 bg-white text-red-500 text-sm font-semibold rounded-lg shadow-sm border border-gray-200 hover:bg-red-50 transition-colors"
                                            >
                                                Change Image
                                            </button>
                                        </div>
                                    ) : (
                                        <label htmlFor="file-upload" className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center">
                                            <div className="p-4 bg-white rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform duration-200">
                                                <Upload className="h-8 w-8 text-green-600" />
                                            </div>
                                            <p className="text-lg font-medium text-gray-900">Click to upload or drag and drop</p>
                                            <p className="text-sm text-gray-500 mt-1">SVG, PNG, JPG or GIF (max 5MB)</p>
                                            <input
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                className="sr-only"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    if (e.target.files?.[0]) setImageFile(e.target.files[0]);
                                                }}
                                            />
                                        </label>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="px-8 pb-4"
                    >
                        <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm flex items-center gap-2 border border-red-100">
                            <X className="h-4 w-4" />
                            {error}
                        </div>
                    </motion.div>
                )}

                <div className="bg-gray-50 px-8 py-5 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-medium">
                        Powered by Gemini 2.5 Flash
                    </span>
                    <button
                        onClick={handleAnalyze}
                        disabled={isLoading || (!inputText.trim() && !imageFile)}
                        className="inline-flex items-center px-8 py-3.5 border border-transparent text-lg font-bold rounded-xl text-white bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-green-600/20"
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
        </motion.div>
    );
}
