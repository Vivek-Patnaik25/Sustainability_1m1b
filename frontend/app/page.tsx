import Link from 'next/link';
import { ArrowRight, Leaf, Globe, Zap, Heart } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="text-center space-y-6 pt-10">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight">
          AI for <span className="text-green-600">Sustainable</span> Cities
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
          Identify, classify, and solve local sustainability issues with the power of Explainable AI.
          Empowering communities to reach UN SDG 11.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/analyzer" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 transition-colors">
            Start Analysis <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link href="/responsible-ai" className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            Our Responsible AI Approach
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center space-y-3">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
            <Globe className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">SDG Alignment</h3>
          <p className="text-gray-500">
            Specifically tuned for SDG 11 (Cities), 6 (Water), 12 (Consumption), and 13 (Climate).
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center space-y-3">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto">
            <Zap className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Instant AI Analysis</h3>
          <p className="text-gray-500">
            Paste reports or complaints, and get instant classification, severity estimation, and actionable steps.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center space-y-3">
          <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto">
            <Heart className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Explainable & Fair</h3>
          <p className="text-gray-500">
            We prioritize transparency. Our AI explains <em>why</em> it made a decision, ensuring trust.
          </p>
        </div>
      </section>
    </div>
  );
}
