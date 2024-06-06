// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

contract Assessment {
    address payable public owner;
    uint256 public balance;
    string  public _tokenName = "NIKHIL KUMAR";
    string  public _tokenAbbrv = "NK";
    uint256 public  _totalSupply = 0;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);

    constructor() payable {
        owner = payable(msg.sender);
        // balance = initBalance;
    }

    function getBalance() public view returns(uint256){
        return balance;
    }
    function getTokenName() public view returns(string memory) {
        return _tokenName;
    }

    function getTokenAbbrv() public view returns(string memory) {
        return _tokenAbbrv;
    }

    function getTotal() public view returns(uint256) {
        return _totalSupply;
    }
    function mint(uint256 _amount) public payable {
        uint _previousBalance = balance;

        // make sure this is the owner
        require(msg.sender == owner, "You are not the owner of this account");

        // perform transaction
        balance += _amount;

        // assert transaction completed successfully
        assert(balance == _previousBalance + _amount);

        // emit the event
        emit Deposit(_amount);
    }

    // custom error
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function burn(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        // withdraw the given amount
        balance -= _withdrawAmount;

        // assert the balance is correct
        assert(balance == (_previousBalance - _withdrawAmount));

        // emit the event
        emit Withdraw(_withdrawAmount);
    }
}
