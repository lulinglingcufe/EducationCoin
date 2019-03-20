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
const logger = require('../../../src/comm/util').getLogger('token-network.js');
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
	
    //let assetRegistry = await busNetConnections.get('admin').getAssetRegistry(namespace + '.SampleAsset');
    //let assets = Array();

    try {
        factory = busNetConnections.get('admin').getBusinessNetwork().getFactory();

		
		let participant2 = factory.newResource(namespace, 'User', 'user2@qq.com' + uuid);
            participant2.accountBalance = 0;
            await participantRegistry.add(participant2);
			
			
        let exists = await participantRegistry.exists('user@qq.com' + uuid);
        if (exists) {
			
            // Example for creating multiple participants for test use
            // Create & add participant
			
            let participant = factory.newResource(namespace, 'User', 'user@qq.com' + uuid);
            participant.accountBalance = 0;
            await participantRegistry.add(participant);

            logger.debug('About to create new participant card');
            let userName = 'User1_' + uuid;
            let newConnection = await composerUtils.obtainConnectionForParticipant(busNetConnections.get('admin'), busNetName, participant, userName);
            busNetConnections.set(userName, newConnection);
        }
		
		
    } catch (error) { 
        logger.error('error in test init(): ', error);
        return Promise.reject(error);
    }
};

module.exports.run = function() {
    let transaction = factory.newTransaction(namespace, 'UserRecharge');
    transaction.rechargeID = 'Recharge_' + uuid + '_' + --testAssetNum;
	transaction.tokenNum = 100;
    transaction.user = factory.newRelationship(namespace, 'User', 'user2@qq.com' + uuid);

    return bc.bcObj.submitTransaction(busNetConnections.get('admin'), transaction);
};

module.exports.end = function() {
    return Promise.resolve(true);
};