'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CHARITY_CONTRACT_ADDRESS || '0xYourContractAddress';
const CONTRACT_ABI = [
  "function donate() public payable",
  "function withdrawFunds() public",
  "function withdrawAmount(uint256 _amount) public",
  "function updateCharityAddress(address _newCharityAddress) public",
  "function getContractBalance() public view returns (uint256)",
  "function getTotalDonations() public view returns (uint256)",
  "function getAllDonations() public view returns (tuple(address donor, uint256 amount, uint256 timestamp)[])",
  "function getDonorContribution(address _donor) public view returns (uint256)",
  "function charityAddress() public view returns (address)",
  "function totalDonations() public view returns (uint256)",
  "event DonationReceived(address indexed donor, uint256 amount, uint256 timestamp)",
  "event FundsWithdrawn(address indexed charity, uint256 amount, uint256 timestamp)"
];

export default function CharityDonation() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [contractBalance, setContractBalance] = useState('0');
  const [totalDonationsCount, setTotalDonationsCount] = useState('0');
  const [totalDonationsAmount, setTotalDonationsAmount] = useState('0');
  const [myContribution, setMyContribution] = useState('0');
  const [donations, setDonations] = useState([]);
  const [charityAddress, setCharityAddress] = useState('');
  const [newCharityAddress, setNewCharityAddress] = useState('');
  const [isCharity, setIsCharity] = useState(false);
  const [loading, setLoading] = useState(false);

  // Connect wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('Please install MetaMask!');
        return;
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      setAccount(accounts[0]);

      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);

      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );
      setContract(contractInstance);

      // Load initial data
      await loadContractData(contractInstance, accounts[0]);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet');
    }
  };

  // Load contract data
  const loadContractData = async (contractInstance, userAccount) => {
    try {
      const balance = await contractInstance.getContractBalance();
      setContractBalance(ethers.formatEther(balance));

      const donationsCount = await contractInstance.getTotalDonations();
      setTotalDonationsCount(donationsCount.toString());

      const totalAmount = await contractInstance.totalDonations();
      setTotalDonationsAmount(ethers.formatEther(totalAmount));

      const charity = await contractInstance.charityAddress();
      setCharityAddress(charity);
      setIsCharity(charity.toLowerCase() === userAccount.toLowerCase());

      const myDonation = await contractInstance.getDonorContribution(userAccount);
      setMyContribution(ethers.formatEther(myDonation));

      const allDonations = await contractInstance.getAllDonations();
      const formattedDonations = allDonations.map((d) => ({
        donor: d.donor,
        amount: ethers.formatEther(d.amount),
        timestamp: new Date(Number(d.timestamp) * 1000).toLocaleString(),
      }));
      setDonations(formattedDonations);
    } catch (error) {
      console.error('Error loading contract data:', error);
    }
  };

  // Donate function
  const handleDonate = async () => {
    if (!contract || !donationAmount) return;

    try {
      setLoading(true);
      const tx = await contract.donate({
        value: ethers.parseEther(donationAmount),
      });
      await tx.wait();
      alert('Donation successful!');
      setDonationAmount('');
      await loadContractData(contract, account);
    } catch (error) {
      console.error('Error donating:', error);
      alert('Failed to donate: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Withdraw all funds
  const handleWithdrawAll = async () => {
    if (!contract) return;

    try {
      setLoading(true);
      const tx = await contract.withdrawFunds();
      await tx.wait();
      alert('Withdrawal successful!');
      await loadContractData(contract, account);
    } catch (error) {
      console.error('Error withdrawing:', error);
      alert('Failed to withdraw: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Withdraw specific amount
  const handleWithdrawAmount = async () => {
    if (!contract || !withdrawAmount) return;

    try {
      setLoading(true);
      const tx = await contract.withdrawAmount(ethers.parseEther(withdrawAmount));
      await tx.wait();
      alert('Withdrawal successful!');
      setWithdrawAmount('');
      await loadContractData(contract, account);
    } catch (error) {
      console.error('Error withdrawing:', error);
      alert('Failed to withdraw: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Update charity address
  const handleUpdateCharityAddress = async () => {
    if (!contract || !newCharityAddress) return;

    try {
      setLoading(true);
      const tx = await contract.updateCharityAddress(newCharityAddress);
      await tx.wait();
      alert('Charity address updated successfully!');
      setNewCharityAddress('');
      await loadContractData(contract, account);
    } catch (error) {
      console.error('Error updating charity address:', error);
      alert('Failed to update charity address: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          if (contract) {
            loadContractData(contract, accounts[0]);
          }
        } else {
          setAccount('');
        }
      });
    }
  }, [contract]);

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-purple-900">
          💝 Charity Donation Tracker
        </h1>

        {/* Connect Wallet */}
        {!account ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <button
              onClick={connectWallet}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <div>
            {/* Account Info */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Connected Account</p>
                  <p className="font-mono text-sm truncate">{account}</p>
                  {isCharity && (
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-1">
                      Charity Account
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Charity Address</p>
                  <p className="font-mono text-sm truncate">{charityAddress}</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <p className="text-sm text-gray-600 mb-2">Contract Balance</p>
                <p className="text-2xl font-bold text-purple-600">{contractBalance} ETH</p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <p className="text-sm text-gray-600 mb-2">Total Donations</p>
                <p className="text-2xl font-bold text-blue-600">{totalDonationsAmount} ETH</p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <p className="text-sm text-gray-600 mb-2">Number of Donors</p>
                <p className="text-2xl font-bold text-green-600">{totalDonationsCount}</p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <p className="text-sm text-gray-600 mb-2">My Contribution</p>
                <p className="text-2xl font-bold text-orange-600">{myContribution} ETH</p>
              </div>
            </div>

            {/* Donation Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4 text-purple-900">Make a Donation</h2>
              <div className="flex gap-4">
                <input
                  type="number"
                  step="0.001"
                  placeholder="Amount in ETH"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleDonate}
                  disabled={loading || !donationAmount}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Donate'}
                </button>
              </div>
            </div>

            {/* Charity Controls */}
            {isCharity && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4 text-purple-900">Charity Controls</h2>
                
                {/* Withdraw All */}
                <div className="mb-4">
                  <button
                    onClick={handleWithdrawAll}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : 'Withdraw All Funds'}
                  </button>
                </div>

                {/* Withdraw Specific Amount */}
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Withdraw Specific Amount</h3>
                  <div className="flex gap-4">
                    <input
                      type="number"
                      step="0.001"
                      placeholder="Amount in ETH"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      onClick={handleWithdrawAmount}
                      disabled={loading || !withdrawAmount}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Processing...' : 'Withdraw'}
                    </button>
                  </div>
                </div>

                {/* Update Charity Address */}
                <div>
                  <h3 className="font-semibold mb-2">Update Charity Address</h3>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      placeholder="New charity address"
                      value={newCharityAddress}
                      onChange={(e) => setNewCharityAddress(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                      onClick={handleUpdateCharityAddress}
                      disabled={loading || !newCharityAddress}
                      className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Processing...' : 'Update'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Donations List */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-purple-900">Recent Donations</h2>
              {donations.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No donations yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Donor</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donations.map((donation, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-mono text-sm">{donation.donor}</td>
                          <td className="py-3 px-4 font-semibold text-purple-600">
                            {donation.amount} ETH
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{donation.timestamp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
