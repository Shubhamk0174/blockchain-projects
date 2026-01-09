// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CharityDonation {
    address public charityAddress;
    uint256 public totalDonations;
    
    struct Donation {
        address donor;
        uint256 amount;
        uint256 timestamp;
    }
    
    mapping(address => uint256) public donorContributions;
    Donation[] public donations;
    
    event DonationReceived(address indexed donor, uint256 amount, uint256 timestamp);
    event FundsWithdrawn(address indexed charity, uint256 amount, uint256 timestamp);
    event CharityAddressUpdated(address indexed oldAddress, address indexed newAddress);
    
    modifier onlyCharity() {
        require(msg.sender == charityAddress, "Only charity can call this function");
        _;
    }
    
    constructor(address _charityAddress) {
        require(_charityAddress != address(0), "Invalid charity address");
        charityAddress = _charityAddress;
    }
    
    // Function to donate ETH to the charity
    function donate() public payable {
        require(msg.value > 0, "Donation must be greater than 0");
        
        donorContributions[msg.sender] += msg.value;
        totalDonations += msg.value;
        
        donations.push(Donation({
            donor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp
        }));
        
        emit DonationReceived(msg.sender, msg.value, block.timestamp);
    }
    
    // Function for charity to withdraw all funds
    function withdrawFunds() public onlyCharity {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = charityAddress.call{value: balance}("");
        require(success, "Withdrawal failed");
        
        emit FundsWithdrawn(charityAddress, balance, block.timestamp);
    }
    
    // Function to withdraw a specific amount
    function withdrawAmount(uint256 _amount) public onlyCharity {
        require(_amount > 0, "Amount must be greater than 0");
        require(address(this).balance >= _amount, "Insufficient balance");
        
        (bool success, ) = charityAddress.call{value: _amount}("");
        require(success, "Withdrawal failed");
        
        emit FundsWithdrawn(charityAddress, _amount, block.timestamp);
    }
    
    // Function to update charity address (only current charity can do this)
    function updateCharityAddress(address _newCharityAddress) public onlyCharity {
        require(_newCharityAddress != address(0), "Invalid charity address");
        address oldAddress = charityAddress;
        charityAddress = _newCharityAddress;
        emit CharityAddressUpdated(oldAddress, _newCharityAddress);
    }
    
    // Get contract balance
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
    // Get total number of donations
    function getTotalDonations() public view returns (uint256) {
        return donations.length;
    }
    
    // Get donation by index
    function getDonation(uint256 _index) public view returns (address, uint256, uint256) {
        require(_index < donations.length, "Invalid donation index");
        Donation memory donation = donations[_index];
        return (donation.donor, donation.amount, donation.timestamp);
    }
    
    // Get all donations (use with caution for large arrays)
    function getAllDonations() public view returns (Donation[] memory) {
        return donations;
    }
    
    // Get donor's total contribution
    function getDonorContribution(address _donor) public view returns (uint256) {
        return donorContributions[_donor];
    }
}
