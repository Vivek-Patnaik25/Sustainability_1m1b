'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { Leaf } from 'lucide-react';

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
              <div className="p-1.5 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg text-white group-hover:scale-110 transition-transform">
                <Leaf className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                EcoAnalyzer
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-1">
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
        </div>
      </div>
    </nav>
  );
}
