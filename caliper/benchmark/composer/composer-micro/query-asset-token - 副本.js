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
*  Query of Asset
*  Queries for a specific Asset using a pre-defined query, built from vehicle-lifecycle-network
*  - Example test round (txn <= testAssets)
*      {
*        "label" : "vehicle-lifecycle-network",
*        "txNumber" : [50],
*        "rateControl" : [{"type": "fixed-rate", "opts": {"tps" : 10}}],
*        "arguments": {"testAssets": 10, "testMatches": 5},
*        "callback" : "benchmark/composer/composer-micro/query-asset.js"
*      }
*  - Init:
*    - Test specified number of Assets created, with color RED (based on how many matches in the query to return), the remaining Assets being created BLUE
*  - Run:
*    - Transactions run to query for created assets that are RED
*
*/

'use strict';

const Util = require('../../../src/comm/util');
const logger = Util.getLogger('query-asset.js');
const TxStatus = require('../../../src/comm/transaction');

module.exports.info  = 'Query Asset Performance Test';

let busNetConnection;
let testAssetNum;
let testMatches;
let factory;
let matchColor = 'R';

let qryRef = 0;

const namespace = 'token';

module.exports.init = async function(blockchain, context, args) {
    // Create Assets to use in main query test
    busNetConnection = context;
    testAssetNum = args.testAssets;
    testMatches = args.testMatches;

    factory = busNetConnection.getBusinessNetwork().getFactory();

    let userTokenRecharges = [];
    let createdMatches = 0;
    let missColor = 'N';
	
	let participantRegistry = await busNetConnection.getParticipantRegistry(namespace + '.User');
	
	let participant = factory.newResource(namespace, 'User', 'user3@qq.com');
    participant.accountBalance = 100;
    await participantRegistry.add(participant);
	
	
    for(let i = 0; i < testAssetNum; i ++){
        let userTokenRecharge = factory.newResource(namespace, 'UserTokenRecharge', 'Recharge2_' + i);
        
		userTokenRecharge.user = factory.newRelationship(namespace, 'User', 'user3@qq.com');
		userTokenRecharge.tokenNum = 20;

        if(createdMatches<testMatches){
            userTokenRecharge.confirmBank = matchColor;
            createdMatches++;
        } else {
            userTokenRecharge.confirmBank = missColor;
        }

        userTokenRecharges.push(userTokenRecharge);
    }

    logger.debug(`About to add ${userTokenRecharges.length} userTokenRecharges to Asset Registry`);
	
    let UserTokenRechargeRegistry = await busNetConnection.getAssetRegistry(namespace + '.UserTokenRecharge');
    await UserTokenRechargeRegistry.addAll(userTokenRecharges);
};

module.exports.run = function() {
    let invoke_status = new TxStatus(qryRef++);

    if(busNetConnection.engine) {
        busNetConnection.engine.submitCallback(1);
    }
    // use the pre-compiled query named 'selectAllCarsByColour' that is within the business
    // network queries file
    return busNetConnection.query('GetUserTokenRechargeUserR', { user: 'resource:token.User#user3@qq.com'})
        .then((result) => {
            invoke_status.SetStatusSuccess();
            invoke_status.SetResult(result);
            return Promise.resolve(invoke_status);
        })
        .catch((err) => {
            invoke_status.SetStatusFail();
            invoke_status.SetResult([]);
            return Promise.resolve(invoke_status);
        });
};

module.exports.end = function() {
    return Promise.resolve(true);
};