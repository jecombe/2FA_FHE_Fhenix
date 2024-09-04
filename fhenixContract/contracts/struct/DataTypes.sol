pragma solidity >=0.8.13 <0.9.0;

import "@fhenixprotocol/contracts/FHE.sol";

library DataTypes {
  struct User {
    uint256 lastRequestTime; // Heure du dernier accès
    uint256 timeInterval; // Intervalle de temps pour les accès successifs
    eaddress secondaryAddress; // Adresse secondaire pour la signature
    bool secondaryApproved; // Booléen indiquant si la deuxième signature a approuvé
    uint256 lastApprovalTime; // Heure de la dernière approbation par l'adresse secondaire
    euint32 tempPassword;
  }
}
