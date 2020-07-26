pragma solidity ^0.6.0;

contract Counter {

    uint256 counter;

    function decrementCounter() public returns (uint256) {
        counter = counter - 1;
        return counter;
    }
    
    function incrementCounter() public returns (uint256) {
        counter = counter + 1;
        return counter;
    }
    
    function reset() public {
        counter = 0;
    }
    
    function getCounter() public view returns (uint256){
        return counter;
    }
}