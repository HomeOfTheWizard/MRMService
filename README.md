#Homework project written for Consensys blockchain developper hiring
#author: Özgün OZ
#date: 16/11/2018

The application is a node.js server that accepts http POST requests on the URL '/meetingroommanager'
publishing a REST API for communicating with ethereum smart contract that is handling a meeting room reservation system
based on ethereum public blockchain.

**?? HOW TO USE IT ??**
Install npm, go to project folder, and run following commands:
  npm init
  npm install
  node server.js


**?? HOW TO TEST IT ??**
To test the application, you can use the test files in the project folder /test repository
Go to the test folder, where we there is a test request payload (postRequestTestReserve.json), and execute commands below

1)Test with curl: (if you use docker, localhost should be overwritten by docker host IP)
  curl -d "@postRequestTestReserve.json" -H "Content-Type: application/json" -X POST http://localhost:8080/meetingroommanager/ReserveRoom

2)Test with nodeJS:
  node testAPI.js

3)Test with the functional blackbox testing present in the folder /test/end-to-end
  npm test test/end-to-end/testMRMApi.js

4)Test ethereum components
  npm test test/ethereum/MRManager.test.js
