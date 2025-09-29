// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract CarbonCreditLedger {

    struct Company {
        string name;
        uint256 totalCredits; 
    }

    struct VerifiedData {
        string projectName;
        string location;
        uint256 treesPlanted;
        uint256 verificationTimestamp;
    }
    mapping(string => Company) private companies;
    uint256 private companyCount = 0;
    VerifiedData[] public verifiedDataRecords;

    event CreditsClaimed(string indexed companyCode, uint256 creditsAmount, address indexed claimer);
    event CreditsTransferred(string indexed fromCode, string indexed toCode, uint256 creditsAmount, address indexed initiator);
    event DataVerified(string projectName, string location, uint256 treesPlanted);



    constructor() {}

    function claimCredits(
        string memory _code,
        string memory _name,
        uint256 _credits
    ) public {

        if (companies[_code].totalCredits == 0 && bytes(companies[_code].name).length == 0) {
            companies[_code] = Company({
                name: _name,
                totalCredits: 0
            });
            companyCount++; 
        }
        
        companies[_code].totalCredits += _credits;

        emit CreditsClaimed(_code, _credits, msg.sender);
    }

    function transferCredits(
        string memory _sellerCode,
        string memory _buyerCode,
        uint256 _amount
    ) public {

        require(_amount > 0, "Amount must be positive.");
        require(companies[_sellerCode].totalCredits >= _amount, "Insufficient credits for transaction.");
        require(bytes(companies[_buyerCode].name).length > 0, "Buyer company must be registered.");
        companies[_sellerCode].totalCredits -= _amount;
        companies[_buyerCode].totalCredits += _amount;

        emit CreditsTransferred(_sellerCode, _buyerCode, _amount, msg.sender);
    }

    function saveVerifiedData(
        string memory _projectName,
        string memory _location,
        uint256 _treesPlanted
    ) public {
        verifiedDataRecords.push(
            VerifiedData({
                projectName: _projectName,
                location: _location,
                treesPlanted: _treesPlanted,
                verificationTimestamp: block.timestamp
            })
        );
        
        emit DataVerified(_projectName, _location, _treesPlanted);
    }
    function getCompanyCredits(string memory _code) public view returns (uint256) {
        return companies[_code].totalCredits;
    }

    
     
    function getCompanyName(string memory _code) public view returns (string memory) {
        return companies[_code].name;
    }

    function getVerifiedDataRecord(uint256 _index) public view returns (VerifiedData memory) {
        return verifiedDataRecords[_index];
    }
    function getVerifiedDataCount() public view returns (uint256) {
        return verifiedDataRecords.length;
    }
    }