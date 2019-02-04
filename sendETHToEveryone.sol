pragma solidity ^0.5.0;


contract sendEthToEveryOne {
    
    address payable owner;
    uint256 public commission;
    uint256 public commissionAmount;
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    
    // id => struct
    mapping(bytes32 => deposit) public deposits;
    struct deposit {
        address sender;
        bytes32 hash;
        uint256 amount;
    }
    
    function changeOwner(address payable _newOwner) public onlyOwner {
        owner = _newOwner;
    }
    
    function chageCommission(uint256 _newCommission) public onlyOwner {
        commission = _newCommission;
    }
    
    function ownerWithdraw() public onlyOwner {
        owner.transfer(commissionAmount);
    }

    function makeDeposit(bytes32 id, bytes32 hash) public payable {
        require(deposits[id].amount == 0); // new id
        require(msg.value > commission); 
        deposits[id].sender = msg.sender;
        deposits[id].hash = hash;
        deposits[id].amount = msg.value - commission;
        commissionAmount += commission;
    }
    
    function withdraw(bytes32 id, bytes32 password, address payable receiver) public {
        require(deposits[id].amount != 0); // exists id
        require(deposits[id].hash == keccak256(abi.encodePacked(id,password)));
        uint256 depositAmount = deposits[id].amount;
        deposits[id].amount = 0;
        receiver.transfer(depositAmount);
    }
    
    function cancelDeposit(bytes32 id) public {
        require(deposits[id].amount != 0); // exists id
        require(deposits[id].sender == msg.sender);
        uint256 depositAmount = deposits[id].amount;
        deposits[id].amount = 0;
        msg.sender.transfer(depositAmount);
    }
    
}
