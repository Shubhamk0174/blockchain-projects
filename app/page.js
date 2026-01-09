'use client';

import { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import dynamic from 'next/dynamic';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
import animationData from '../public/homepageanimation.json';

export default function Home() {
  const [darkMode, setDarkMode] = useState(() => {
    // Initialize from localStorage on client-side only
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });
  const mountedRef = useRef(false);

  useEffect(() => {
    // Mark as mounted
    mountedRef.current = true;
  }, []);

  useEffect(() => {
    // Apply the dark class to document element when darkMode changes
    if (mountedRef.current) {
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
  };

  return (
      <div className="min-h-screen transition-colors duration-300 bg-white dark:bg-black">
        {/* Header */}
        <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black sticky top-0 z-50 shadow-sm dark:shadow-gray-900">
          <div className="container mx-auto px-6 py-4">
            <nav className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600 dark:bg-green-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  BlockChain Projects
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="hidden sm:inline-flex px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-green-400 border border-gray-200 dark:border-gray-800">
                  Sepolia Testnet
                </span>
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? (
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  )}
                </button>
              </div>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Powered by Ethereum</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Build on
                <span className="block text-blue-600 dark:text-green-500 mt-2">Blockchain</span>
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Explore decentralized applications powered by Ethereum smart contracts. Secure, transparent, and immutable.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 dark:bg-green-600 text-white rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-green-700 transition-all"
                >
                  View Projects
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <Lottie animationData={animationData} loop={true} />
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="bg-gray-50 dark:bg-gray-950 py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Available Projects
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Explore our collection of blockchain-based applications
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* Votify Project */}
              <Link href="/Votify" className="group">
                <div className="bg-white dark:bg-gray-900 p-8 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-green-500 hover:shadow-lg dark:hover:shadow-green-500/20 transition-all h-full">
                  <div className="w-14 h-14 rounded-lg bg-blue-600 dark:bg-green-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">🗳️</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Votify</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Decentralized voting system with transparent, tamper-proof results on the blockchain.</p>
                  <div className="flex items-center text-blue-600 dark:text-green-500 font-semibold group-hover:gap-2 transition-all">
                    Launch App
                    <svg className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </Link>

              {/* Charity Donation Tracker Project */}
              <Link href="/CharityDonation" className="group">
                <div className="bg-white dark:bg-gray-900 p-8 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-green-500 hover:shadow-lg dark:hover:shadow-green-500/20 transition-all h-full">
                  <div className="w-14 h-14 rounded-lg bg-purple-600 dark:bg-purple-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">💝</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Charity Donation Tracker</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Donate ETH to verified charities with full transparency and secure fund management.</p>
                  <div className="flex items-center text-blue-600 dark:text-green-500 font-semibold group-hover:gap-2 transition-all">
                    Launch App
                    <svg className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </Link>

              {/* Placeholder Cards */}
              <div className="bg-white dark:bg-gray-900 p-8 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-800 h-full flex flex-col items-center justify-center text-center opacity-60">
                <div className="w-14 h-14 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2">More Projects</h3>
                <p className="text-sm text-gray-400 dark:text-gray-500">Coming Soon</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white dark:bg-black py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Why Blockchain?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Built on Ethereum for unmatched security and transparency
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-14 h-14 rounded-lg bg-gray-100 dark:bg-gray-900 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-blue-600 dark:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Secure</h3>
                <p className="text-gray-600 dark:text-gray-400">Cryptographically secured transactions on the blockchain</p>
              </div>

              <div className="text-center">
                <div className="w-14 h-14 rounded-lg bg-gray-100 dark:bg-gray-900 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-blue-600 dark:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Transparent</h3>
                <p className="text-gray-600 dark:text-gray-400">All transactions are publicly verifiable on the blockchain</p>
              </div>

              <div className="text-center">
                <div className="w-14 h-14 rounded-lg bg-gray-100 dark:bg-gray-900 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-blue-600 dark:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Immutable</h3>
                <p className="text-gray-600 dark:text-gray-400">Once recorded, data cannot be altered or deleted</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black py-8">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                © 2026 BlockChain Projects. Built on Sepolia Testnet
              </p>
              <div className="flex items-center gap-6">
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-green-500 transition-colors text-sm">Documentation</a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-green-500 transition-colors text-sm">GitHub</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }
