'use client';

import Link from 'next/link';
import { ArrowRight, Globe, Zap, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Home() {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="space-y-24 pb-20 pt-20" // added pt-20 for fixed navbar clearance
    >
      <section className="text-center space-y-8 pt-10 px-4">
        <motion.div variants={item} className="space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-semibold tracking-wide uppercase">
            UN SDG Optimized Analysis
          </span>
          <h1 className="text-5xl sm:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight">
            AI for <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-500">Sustainable</span> Cities
          </h1>
        </motion.div>

        <motion.p variants={item} className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Identify, classify, and solve local sustainability issues with the power of Explainable AI.
          Empowering communities to reach <strong>UN SDG 11</strong>.
        </motion.p>

        <motion.div variants={item} className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link href="/analyzer" className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all duration-200 bg-green-600 rounded-full hover:bg-green-700 hover:shadow-lg hover:shadow-green-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600">
            Start Analysis
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/responsible-ai" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 transition-all duration-200 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200">
            Responsible AI Approach
          </Link>
        </motion.div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {[
          {
            icon: Globe,
            color: "blue",
            title: "SDG Alignment",
            desc: "Specifically tuned for SDG 11 (Cities), 6 (Water), 12 (Consumption), and 13 (Climate)."
          },
          {
            icon: Zap,
            color: "purple",
            title: "Instant Multimodal AI",
            desc: "Voice, Image, or Text. Get instant classification, severity estimation, and actionable steps."
          },
          {
            icon: Heart,
            color: "teal",
            title: "Explainable & Fair",
            desc: "We prioritize transparency. Our AI cites specific Knowledge Base documents for every decision."
          }
        ].map((feature, idx) => (
          <motion.div
            key={idx}
            variants={item}
            whileHover={{ y: -5 }}
            className="glass-card p-8 rounded-2xl transition-all duration-300 border border-white/60"
          >
            <div className={`w-14 h-14 bg-${feature.color}-50 text-${feature.color}-600 rounded-2xl flex items-center justify-center mb-6`}>
              <feature.icon className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
            <p className="text-gray-500 leading-relaxed">
              {feature.desc}
            </p>
          </motion.div>
        ))}
      </section>
    </motion.div>
  );
}
