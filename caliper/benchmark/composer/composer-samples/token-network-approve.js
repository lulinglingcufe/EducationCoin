/*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
*  Basic Sample Network
*  Updates the value of an Asset through a Transaction.
*  - Example test round (txn <= testAssets)
*      {
*        "label" : "token-network",
*        "txNumber" : [50],
*        "trim" : 0,
*        "rateControl" : [{"type": "fixed-rate", "opts": {"tps" : 10}}],
*        "arguments": {"testAssets": 50},
*        "callback" : "benchmark/composer/composer-samples/token-network.js"
*      }
*  - Init:
*    - Single Participant created (PARTICIPANT_0)
*    - Test specified number of Assets created, belonging to a PARTICIPANT_0
*  - Run:
*    - Transactions run against all created assets to update their values
*
*/

'use strict';

module.exports.info  = 'Basic Sample Network Performance Test';

const composerUtils = require('../../../src/composer/composer_utils');
const removeExisting = require('../composer-test-utils').clearAll;
const logger = require('../../../src/comm/util').getLogger('token-network-approve.js');
const os = require('os');

const namespace = 'token';
const busNetName = 'token-network';
const uuid = os.hostname() + process.pid; // UUID for client within test

let bc;                 // The blockchain main (Composer)
let busNetConnections;  // Global map of all business network connections to be used
let testAssetNum;       // Number of test assets to create
let factory;            // Global Factory

module.exports.init = async function(blockchain, context, args) {
    // Create Participants and Assets to use in main test
	
    bc = blockchain;
    busNetConnections = new Map();
    busNetConnections.set('admin', context);
    testAssetNum = args.testAssets;
	

    let participantRegistry = await busNetConnections.get('admin').getParticipantRegistry(namespace + '.User');
	//let bankRegistry = await busNetConnections.get('admin').getParticipantRegistry(namespace + '.CentralBank');
	let participants = Array();
	
	let regulatorRegistry = await busNetConnections.get('admin').getParticipantRegistry(namespace + '.Regulator');	
	
    //let assetRegistry = await busNetConnections.get('admin').getAssetRegistry(namespace + '.UserTokenRecharge');
    //let assets = Array();

    try {
        factory = busNetConnections.get('admin').getBusinessNetwork().getFactory();

        //let exists = await participantRegistry.exists('user6@qq.com' + uuid);
        //let centralbank = factory.newResource(namespace, 'CentralBank', 'centralbank@email.com');
		//centralbank.totalIssueToken = 0;
		//centralbank.accountBalance = 0;
		//await bankRegistry.add(centralbank);
		//logger.debug('Finish create new bank account');
		
            // Example for creating multiple participants for test use
            // Create & add participant
			//新建多个participant
		for (let i=0; i<(testAssetNum*2 +2); i++) {
			let participant = factory.newResource(namespace, 'User', 'user6@qq.com' + uuid + '_' + i);
			participant.accountBalance = 100;
            //participants.push(participant);
			await participantRegistry.add(participant);
        }
		
		let exists = await participantRegistry.exists('user@qq.com' + uuid);
        if (exists) {
        let regulator = factory.newResource(namespace, 'Regulator', 'regulator@qq.com' + uuid);
		regulator.accountBalance = 100;  //以这个participant的身份来提交transaction
        await regulatorRegistry.add(regulator);
		
		logger.debug('About to create new regulator card');
        let userName = 'Regulator_' + uuid ;
        let newConnection = await composerUtils.obtainConnectionForParticipant(busNetConnections.get('admin'), busNetName, regulator, userName);
        busNetConnections.set(userName, newConnection);	
		
		}		
		
    } catch (error) {
        logger.error('error in test init(): ', error);
        return Promise.reject(error);
    }
};

module.exports.run = function() {
    let transaction = factory.newTransaction(namespace, 'TokenTransferU_U');
	--testAssetNum;
    transaction.fromuser = factory.newRelationship(namespace, 'User', 'user6@qq.com' + uuid + '_' + (testAssetNum*2 + 1) );
	transaction.to = factory.newRelationship(namespace, 'User', 'user6@qq.com' + uuid + '_' +  (testAssetNum* 2) );
	
	transaction.transferNum = 20;
	transaction.transferID = 'RechargeID_' + uuid + '_' + testAssetNum; 

    return bc.bcObj.submitTransaction(busNetConnections.get('admin'), transaction);
};

module.exports.end = function() {
    return Promise.resolve(true);
};