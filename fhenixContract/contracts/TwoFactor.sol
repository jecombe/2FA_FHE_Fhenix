// SPDX-License-Identifier: MIT

pragma solidity >=0.8.13 <0.9.0;

import "@fhenixprotocol/contracts/FHE.sol";
import {Permissioned, Permission} from "@fhenixprotocol/contracts/access/Permissioned.sol";

import "./lib/RandomMock.sol";

contract TwoFactor is Permissioned {
    using RandomMock for uint256;

  constructor() {
  }

   function generateRandomU32() public view returns (uint32) {
        return RandomMock.getFakeRandomU32();
    }

}
