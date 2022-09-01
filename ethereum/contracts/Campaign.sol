// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract CampaignFactory {
    address payable[] public deployedContracts;

    function createCampaign(uint256 minimum) public {
        address newCampaign = address(new Campaign(minimum, msg.sender));
        deployedContracts.push(payable(newCampaign));
    }

    function getDeployedCampaigns()
        public
        view
        returns (address payable[] memory)
    {
        return deployedContracts;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address recipient;
        bool complete;
        uint256 approvalCount;
        mapping(address => bool) approvals;
    }

    address public manager;
    uint256 public minimumContribution;
    mapping(address => bool) public approvers;
    Request[] public requests;
    uint256 public contributorsCount;
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(uint256 minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        contributorsCount++;
    }

    function createRequest(
        string memory description,
        uint256 value,
        address recipient
    ) public restricted {
        Request storage newRequest = requests.push();
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint256 index) public {
        require(approvers[msg.sender]);
        require(!requests[index].approvals[msg.sender]);
        requests[index].approvals[msg.sender] = true;
        requests[index].approvalCount++;
    }

    function finalizeRequest(uint256 index) public restricted {
        require(requests[index].approvalCount > (contributorsCount / 2));
        require(!requests[index].complete);
        payable(requests[index].recipient).transfer(requests[index].value);
        requests[index].complete = true;
    }

    function getSummary() public view returns (
            uint256,
            uint256,
            uint256,
            uint256,
            address
        )
    {
        return (
            address(this).balance,
            minimumContribution,
            requests.length,
            contributorsCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint256) {
        return requests.length;
    }
}
