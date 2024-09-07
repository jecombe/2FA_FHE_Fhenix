// SPDX-License-Identifier: MIT
pragma solidity >=0.8.13 <0.9.0;

import "@fhenixprotocol/contracts/FHE.sol";
import {Permissioned, Permission} from "@fhenixprotocol/contracts/access/Permissioned.sol";

import "./struct/DataTypes.sol";
import {RandomMock} from "./RandomMock.sol";

contract TwoFactor is Permissioned {
  //Types / Struct
  DataTypes.User public USER;
  eaddress zeroAddr;

  //Mapping
  mapping(address => DataTypes.User) public authRecords;

  //Event
  event SecondaryAddressAssigned(
    address indexed primary,
    address indexed secondary
  );

  event AuthSuccess(address indexed primary);
  event RequestTwoFactor(address indexed primary);
  event Connect(address indexed primary);

  constructor() {
    zeroAddr = FHE.asEaddress((0));
  }

  function generateRandomU32() private returns (euint32) {
    return RandomMock.getFakeRandomU32();
  }

  function connexion(
    inEaddress calldata _secondaryAddress,
    uint256 _timeInterval
  ) external {
    require(_timeInterval >= 0, "No time interval");

    eaddress secondAddress = FHE.asEaddress(_secondaryAddress);

    FHE.req(zeroAddr.ne(secondAddress));

    DataTypes.User storage authInfo = authRecords[msg.sender];

    FHE.req(authInfo.secondaryAddress.ne(secondAddress));

    authInfo.secondaryAddress = secondAddress;
    authInfo.timeInterval = _timeInterval;
    emit Connect(msg.sender);
  }

  function requestTwoFactor() external {
    DataTypes.User storage authInfo = authRecords[msg.sender];
    FHE.req(zeroAddr.ne(authInfo.secondaryAddress));

    uint256 currentTime = block.timestamp;

    require(
      currentTime >= authInfo.lastRequestTime + authInfo.timeInterval,
      "Wait for the interval"
    );

    authInfo.lastRequestTime = currentTime;
    authInfo.secondaryApproved = false;

    emit RequestTwoFactor(msg.sender);
  }

  function approveTwoFactor(address primaryAddress) external {
    DataTypes.User storage authInfo = authRecords[primaryAddress];

    FHE.req(zeroAddr.ne(FHE.asEaddress((primaryAddress))));
    FHE.req(zeroAddr.ne(FHE.asEaddress((msg.sender))));
    FHE.req(authInfo.secondaryAddress.ne(FHE.asEaddress((primaryAddress))));
    FHE.req(authInfo.secondaryAddress.eq(FHE.asEaddress((msg.sender))));

    authInfo.secondaryApproved = true;
    authInfo.lastApprovalTime = block.timestamp;
  }

  function checkPassword(inEuint32 calldata password) external returns (bool) {
    DataTypes.User storage authInfo = authRecords[msg.sender];

    FHE.req(zeroAddr.ne(authInfo.secondaryAddress));

    require(authInfo.secondaryApproved, "Secondary approval required");

    euint32 tempPassword = FHE.asEuint32(password);

    FHE.req(authInfo.tempPassword.eq(tempPassword)); //      "Not the secondary address"

    emit AuthSuccess(msg.sender);

    return true;
  }

  function getPassword(
    Permission memory permission
  ) external onlySender(permission) returns (string memory) {
    DataTypes.User storage authInfo = authRecords[msg.sender];

    uint256 currentTime = block.timestamp;

    require(
      currentTime >= authInfo.lastRequestTime + authInfo.timeInterval,
      "time is over, please restart request"
    );

    require(authInfo.secondaryApproved, "Secondary approval required");

    authInfo.tempPassword = generateRandomU32();
    
    return FHE.sealoutput(authInfo.tempPassword, permission.publicKey);
  }
}
