'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { Leaf, Bot } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Analyzer', href: '/analyzer' },
    { name: 'Responsible AI', href: '/responsible-ai' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="glass rounded-2xl shadow-sm border border-white/50 px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                className="p-1.5 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg text-white"
              >
                <Leaf className="h-5 w-5" />
              </motion.div>
              <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                EcoAnalyzer
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-1 sm:gap-4">
            <div className="hidden sm:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={clsx(
                      "relative px-4 py-2 rounded-full text-sm font-medium transition-colors",
                      isActive ? "text-green-700" : "text-gray-600 hover:text-green-600"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-green-100 rounded-full mix-blend-multiply"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Cute EcoBot Avatar */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="relative group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-100 to-teal-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                <Bot className="h-5 w-5 text-teal-600" />
              </div>
              <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>

              {/* Tooltip */}
              <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-gray-100 p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none transform translate-y-2 group-hover:translate-y-0">
                <p className="text-xs text-center text-gray-600 font-medium">Hi! I'm EcoBot 🌱</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </nav>
  );
}
