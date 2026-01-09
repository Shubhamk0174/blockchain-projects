'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Link from 'next/link';

const VOTING_CONTRACT_ABI = [
  "function owner() view returns (address)",
  "function candidatesCount() view returns (uint256)",
  "function votingOpen() view returns (bool)",
  "function addCandidate(string memory _name, string memory _description)",
  "function updateCandidate(uint256 _candidateId, string memory _name, string memory _description)",
  "function removeCandidate(uint256 _candidateId)",
  "function vote(uint256 _candidateId)",
  "function toggleVoting()",
  "function getAllCandidates() view returns (tuple(uint256 id, string name, string description, uint256 voteCount, bool exists)[])",
  "function hasVoted(address _voter) view returns (bool)",
  "function getVoterDetails(address _voter) view returns (bool _hasVoted, uint256 _votedCandidateId)",
  "event CandidateAdded(uint256 indexed candidateId, string name)",
  "event VoteCast(address indexed voter, uint256 indexed candidateId)"
];

export default function Votify() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedCandidateId, setVotedCandidateId] = useState(0);
  const [votingOpen, setVotingOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const isDark = localStorage.getItem('darkMode') === 'true';
      if (isDark) {
        document.documentElement.classList.add('dark');
      }
      return isDark;
    }
    return false;
  });
  
  // Form states
  const [newCandidateName, setNewCandidateName] = useState('');
  const [newCandidateDesc, setNewCandidateDesc] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    // This effect is now only for cleanup if needed
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        alert('Please install MetaMask to use this application!');
        return;
      }

      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      
      const contractAddress = process.env.NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS;
      if (!contractAddress) {
        alert('Contract address not configured. Please set NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS in .env.local');
        setLoading(false);
        return;
      }

      const votingContract = new ethers.Contract(contractAddress, VOTING_CONTRACT_ABI, signer);
      
      setAccount(accounts[0]);
      setContract(votingContract);
      
      // Check if user is owner
      const owner = await votingContract.owner();
      setIsOwner(owner.toLowerCase() === accounts[0].toLowerCase());
      
      // Load data
      await loadContractData(votingContract, accounts[0]);
      
      setLoading(false);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet: ' + error.message);
      setLoading(false);
    }
  };

  // Load contract data
  const loadContractData = async (contractInstance, userAddress) => {
    try {
      const [candidatesList, votingStatus, voterData] = await Promise.all([
        contractInstance.getAllCandidates(),
        contractInstance.votingOpen(),
        contractInstance.getVoterDetails(userAddress)
      ]);

      setCandidates(candidatesList);
      setVotingOpen(votingStatus);
      setHasVoted(voterData[0]);
      setVotedCandidateId(Number(voterData[1]));
    } catch (error) {
      console.error('Error loading contract data:', error);
    }
  };

  // Add candidate
  const addCandidate = async (e) => {
    e.preventDefault();
    if (!newCandidateName.trim()) {
      alert('Please enter a candidate name');
      return;
    }

    try {
      setLoading(true);
      const tx = await contract.addCandidate(newCandidateName, newCandidateDesc);
      await tx.wait();
      
      alert('Candidate added successfully!');
      setNewCandidateName('');
      setNewCandidateDesc('');
      setShowAddForm(false);
      
      await loadContractData(contract, account);
      setLoading(false);
    } catch (error) {
      console.error('Error adding candidate:', error);
      alert('Failed to add candidate: ' + error.message);
      setLoading(false);
    }
  };

  // Cast vote
  const castVote = async (candidateId) => {
    if (hasVoted) {
      alert('You have already voted!');
      return;
    }

    if (!votingOpen) {
      alert('Voting is currently closed!');
      return;
    }

    try {
      setLoading(true);
      const tx = await contract.vote(candidateId);
      await tx.wait();
      
      alert('Vote cast successfully!');
      await loadContractData(contract, account);
      setLoading(false);
    } catch (error) {
      console.error('Error casting vote:', error);
      alert('Failed to cast vote: ' + error.message);
      setLoading(false);
    }
  };

  // Toggle voting
  const toggleVoting = async () => {
    try {
      setLoading(true);
      const tx = await contract.toggleVoting();
      await tx.wait();
      
      await loadContractData(contract, account);
      setLoading(false);
    } catch (error) {
      console.error('Error toggling voting:', error);
      alert('Failed to toggle voting: ' + error.message);
      setLoading(false);
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          window.location.reload();
        } else {
          setAccount('');
          setContract(null);
        }
      });
    }
  }, []);

  return (
      <div className="min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-black">
        {/* Header */}
        <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black sticky top-0 z-50 shadow-sm dark:shadow-gray-900">
          <div className="container mx-auto px-6 py-4">
            <nav className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-green-500 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </Link>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 dark:bg-green-600 flex items-center justify-center">
                    <span className="text-xl">🗳️</span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Votify
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {account && (
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs font-medium text-gray-900 dark:text-gray-200">
                      {account.substring(0, 6)}...{account.substring(38)}
                    </span>
                  </div>
                )}
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

        <div className="container mx-auto px-6 py-8 max-w-7xl">
          {/* Hero Banner */}
          {!account && (
            <div className="mb-8 bg-blue-600 dark:bg-green-600 rounded-xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-2">Welcome to Votify</h2>
              <p className="text-blue-50 dark:text-green-50">Connect your wallet to participate in decentralized voting</p>
            </div>
          )}

          {/* Connect Wallet */}
          {!account ? (
            <div className="max-w-md mx-auto">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm dark:shadow-gray-950 border border-gray-200 dark:border-gray-800 p-8">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-xl bg-blue-600 dark:bg-green-600 flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Connect Wallet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Use MetaMask to connect to Sepolia testnet
                  </p>
                </div>
                <button
                  onClick={connectWallet}
                  disabled={loading}
                  className="w-full bg-blue-600 dark:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connecting...
                    </span>
                  ) : 'Connect MetaMask'}
                </button>
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-600 dark:text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Make sure MetaMask is installed and connected to Sepolia testnet</span>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Status Bar */}
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm dark:shadow-gray-950 border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {isOwner && (
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-sm font-semibold border border-yellow-200 dark:border-yellow-700">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Contract Owner
                      </span>
                    )}
                    {hasVoted && (
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm font-semibold border border-green-200 dark:border-green-700">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Already Voted
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Voting Status</p>
                      <p className={`text-lg font-bold ${votingOpen ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                        {votingOpen ? 'Open' : 'Closed'}
                      </p>
                    </div>
                    {isOwner && (
                      <button
                        onClick={toggleVoting}
                        disabled={loading}
                        className="px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-600 transition-all disabled:opacity-50"
                      >
                        Toggle
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Owner Controls */}
              {isOwner && (
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm dark:shadow-gray-950 border border-gray-200 dark:border-gray-800 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Manage Candidates
                    </h2>
                    <button
                      onClick={() => setShowAddForm(!showAddForm)}
                      className="px-4 py-2 bg-blue-600 dark:bg-green-600 text-white rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-green-700 transition-all"
                    >
                      {showAddForm ? 'Cancel' : '+ Add Candidate'}
                    </button>
                  </div>

                  {showAddForm && (
                    <form onSubmit={addCandidate} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                          Candidate Name *
                        </label>
                        <input
                          type="text"
                          value={newCandidateName}
                          onChange={(e) => setNewCandidateName(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-green-500 focus:border-transparent transition-all"
                          placeholder="Enter candidate name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                          Description
                        </label>
                        <textarea
                          value={newCandidateDesc}
                          onChange={(e) => setNewCandidateDesc(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-green-500 focus:border-transparent transition-all"
                          placeholder="Enter candidate description"
                          rows="3"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 dark:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-green-700 transition-all disabled:opacity-50"
                      >
                        {loading ? 'Adding...' : 'Add Candidate'}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Candidates List */}
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm dark:shadow-gray-950 border border-gray-200 dark:border-gray-800 p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Candidates ({candidates.length})
                </h2>

                {candidates.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-950 flex items-center justify-center">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      No candidates available yet.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {candidates.map((candidate) => (
                      <div
                        key={candidate.id.toString()}
                        className={`border-2 rounded-xl p-6 transition-all ${
                          hasVoted && votedCandidateId === Number(candidate.id)
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                            : 'border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-green-500 hover:shadow-lg dark:hover:shadow-green-500/20'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {candidate.name}
                          </h3>
                          <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-lg text-sm font-semibold border border-gray-200 dark:border-gray-700">
                            #{candidate.id.toString()}
                          </span>
                        </div>
                        
                        {candidate.description && (
                          <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {candidate.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Votes</p>
                            <p className="text-3xl font-bold text-blue-600 dark:text-green-500">
                              {candidate.voteCount.toString()}
                            </p>
                          </div>
                          
                          {!hasVoted && votingOpen && (
                            <button
                              onClick={() => castVote(candidate.id)}
                              disabled={loading}
                              className="px-6 py-2 bg-blue-600 dark:bg-green-600 text-white rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-green-700 transition-all disabled:opacity-50"
                            >
                              Vote
                            </button>
                          )}
                          
                          {hasVoted && votedCandidateId === Number(candidate.id) && (
                            <span className="text-green-600 dark:text-green-500 font-semibold flex items-center gap-2">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Your Vote
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black mt-12 py-6">
          <div className="container mx-auto px-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Powered by Ethereum Smart Contracts on Sepolia Testnet
            </p>
          </div>
        </footer>
      </div>
    );
  }
