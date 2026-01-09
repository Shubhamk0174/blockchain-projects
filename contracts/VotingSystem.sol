// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingSystem {
    // Contract owner
    address public owner;
    
    // Candidate structure
    struct Candidate {
        uint256 id;
        string name;
        string description;
        uint256 voteCount;
        bool exists;
    }
    
    // Voter structure to track if someone has voted
    struct Voter {
        bool hasVoted;
        uint256 votedCandidateId;
    }
    
    // Mapping from candidate ID to Candidate
    mapping(uint256 => Candidate) public candidates;
    
    // Mapping from voter address to Voter
    mapping(address => Voter) public voters;
    
    // Counter for candidates
    uint256 public candidatesCount;
    
    // Voting status
    bool public votingOpen;
    
    // Events
    event CandidateAdded(uint256 indexed candidateId, string name);
    event CandidateUpdated(uint256 indexed candidateId, string name);
    event CandidateRemoved(uint256 indexed candidateId);
    event VoteCast(address indexed voter, uint256 indexed candidateId);
    event VotingStatusChanged(bool isOpen);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }
    
    modifier votingIsOpen() {
        require(votingOpen, "Voting is currently closed");
        _;
    }
    
    // Constructor
    constructor() {
        owner = msg.sender;
        candidatesCount = 0;
        votingOpen = true;
    }
    
    // Add a new candidate (only owner)
    function addCandidate(string memory _name, string memory _description) public onlyOwner {
        require(bytes(_name).length > 0, "Candidate name cannot be empty");
        
        candidatesCount++;
        candidates[candidatesCount] = Candidate({
            id: candidatesCount,
            name: _name,
            description: _description,
            voteCount: 0,
            exists: true
        });
        
        emit CandidateAdded(candidatesCount, _name);
    }
    
    // Update candidate details (only owner)
    function updateCandidate(uint256 _candidateId, string memory _name, string memory _description) public onlyOwner {
        require(candidates[_candidateId].exists, "Candidate does not exist");
        require(bytes(_name).length > 0, "Candidate name cannot be empty");
        
        candidates[_candidateId].name = _name;
        candidates[_candidateId].description = _description;
        
        emit CandidateUpdated(_candidateId, _name);
    }
    
    // Remove a candidate (only owner)
    function removeCandidate(uint256 _candidateId) public onlyOwner {
        require(candidates[_candidateId].exists, "Candidate does not exist");
        
        candidates[_candidateId].exists = false;
        
        emit CandidateRemoved(_candidateId);
    }
    
    // Cast a vote
    function vote(uint256 _candidateId) public votingIsOpen {
        require(!voters[msg.sender].hasVoted, "You have already voted");
        require(candidates[_candidateId].exists, "Candidate does not exist");
        
        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedCandidateId = _candidateId;
        
        candidates[_candidateId].voteCount++;
        
        emit VoteCast(msg.sender, _candidateId);
    }
    
    // Toggle voting status (only owner)
    function toggleVoting() public onlyOwner {
        votingOpen = !votingOpen;
        emit VotingStatusChanged(votingOpen);
    }
    
    // Get candidate details
    function getCandidate(uint256 _candidateId) public view returns (
        uint256 id,
        string memory name,
        string memory description,
        uint256 voteCount,
        bool exists
    ) {
        Candidate memory candidate = candidates[_candidateId];
        return (
            candidate.id,
            candidate.name,
            candidate.description,
            candidate.voteCount,
            candidate.exists
        );
    }
    
    // Get all candidates
    function getAllCandidates() public view returns (Candidate[] memory) {
        uint256 activeCount = 0;
        
        // Count active candidates
        for (uint256 i = 1; i <= candidatesCount; i++) {
            if (candidates[i].exists) {
                activeCount++;
            }
        }
        
        // Create array of active candidates
        Candidate[] memory activeCandidates = new Candidate[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 1; i <= candidatesCount; i++) {
            if (candidates[i].exists) {
                activeCandidates[index] = candidates[i];
                index++;
            }
        }
        
        return activeCandidates;
    }
    
    // Check if address has voted
    function hasVoted(address _voter) public view returns (bool) {
        return voters[_voter].hasVoted;
    }
    
    // Get voter details
    function getVoterDetails(address _voter) public view returns (bool _hasVoted, uint256 _votedCandidateId) {
        Voter memory voter = voters[_voter];
        return (voter.hasVoted, voter.votedCandidateId);
    }
    
    // Transfer ownership (only owner)
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        owner = newOwner;
    }
}
