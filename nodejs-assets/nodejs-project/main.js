var rn_bridge = require('rn-bridge');
var Eos = require("oasisjs");
let {Keystore, Keygen} = require('eosjs-keygen');

let config = {
    chainId: "8a679bd6c011ff93eff0cb99d997bf72a69a0aaddc430d7e9c4b705f4de4d843", // 32 byte (64 char) hex string
    keyProvider: [], // WIF string or array of keys..
    httpEndpoint: 'http://192.168.1.186:8888',
    expireInSeconds: 60,
    broadcast: true,
    verbose: false, // API activity
    sign: true
};
var eos = Eos(config);

function callback(errorString, result) {
    console.log(errorString + "...." + result.toString());
    if (errorString) {
        try {
            let errorBean = JSON.parse(errorString);
            rn_bridge.channel.send(JSON.stringify({
                error: errorBean.message,
                message: errorBean.error.what,
                code: errorBean.code
            }))
        } catch (e) {
            rn_bridge.channel.send(JSON.stringify({error: errorString, message: '操作失败'}))
        }
    } else {
        rn_bridge.channel.send(JSON.stringify(result));
    }
}

// Echo every message received from react-native.
rn_bridge.channel.on('message', async (msg) => {
    var obj = JSON.parse(msg);
    switch (obj.category) {
        case 'transfer':
            eos.transfer(obj, (error, result) => {
                callback(error, result);
            });
            break;
        case 'createAccount':
            Keygen.generateMasterKeys().then(rel => {
                console.log(rel.publicKeys.owner);
                console.log(rel.privateKeys.owner);
                // eos.newaccount({
                //     creator: 'ayiuivl52fnq',
                //     name: obj.account,
                //     owner: {
                //         threshold: 1,
                //         keys: [{
                //             key: rel.publicKeys.owner,
                //             weight: 1
                //         }],
                //         accounts: [],
                //         waits: []
                //     },
                //     active: {
                //         threshold: 1,
                //         keys: [{
                //             key: rel.publicKey.owner,
                //             weight: 1
                //         }],
                //         accounts: [],
                //         waits: []
                //     },
                // }, (error, result) => {
                //     if (!error){
                //         var accountBean ={
                //             name: obj.account,
                //             privateKey: rel.privateKeys.owner,
                //             publicKey: rel.publicKeys.owner,
                //         }
                //     }
                //     callback(error, accountBean);
                // });
                eos.transaction({
                    actions: [
                        {
                            account: 'eosio',
                            name: 'newaccount',
                            authorization: [
                                {
                                    actor: 'ayiuivl52fnq',
                                    permission: 'active'
                                }
                            ],
                            data: {
                                creator: 'ayiuivl52fnq',
                                name: obj.account,

                                owner: {
                                    threshold: 1,
                                    keys: [
                                        {
                                            key: rel.publicKeys.owner,
                                            weight: 1
                                        }
                                    ],
                                    accounts: [],
                                    waits: []
                                },
                                active: {
                                    threshold: 1,
                                    keys: [
                                        {
                                            key: rel.publicKeys.owner,
                                            weight: 1
                                        }
                                    ],
                                    accounts: [],
                                    waits: []
                                }
                            }
                        },
                        {
                            account: 'eosio',
                            name: 'buyram',
                            authorization: [
                                {
                                    actor: 'ayiuivl52fnq',
                                    permission: 'active'
                                }
                            ],
                            data: {
                                payer: 'ayiuivl52fnq',
                                receiver: obj.account,
                                quant: '2.0000 EOS'
                            }
                        },
                        {
                            account: 'eosio',
                            name: 'delegatebw',
                            authorization: [
                                {
                                    actor: 'ayiuivl52fnq',
                                    permission: 'active'
                                }
                            ],
                            data: {
                                from: 'ayiuivl52fnq',
                                receiver: obj.account,
                                stake_net_quantity: '1.0000 EOS',
                                stake_cpu_quantity: '1.0000 EOS',
                                transfer: 1
                            }

                        }
                    ]
                }, (error, result) => {
                    if (!error) {
                        config.keyProvider.push(rel.privateKeys.owner);
                        eos = Eos(config);
                        result = {
                            name: obj.account,
                            privateKey: rel.privateKeys.owner,
                            publicKey: rel.publicKeys.owner,
                            category:'accountChange'
                        }
                    }
                    callback(error, result);
                });
            });

            break;
        case "importAccount":
            let account = obj.account;
            let pubkey = Eos.modules.ecc.privateToPublic(obj.pk);
            eos.getAccount({'account_name': account}, (error, result) => {
                let key = result.permissions[0].required_auth.keys[0].key;
                if (key === pubkey) {
                    var callbackObj = {
                        name: account,
                        privateKey: obj.pk,
                        publicKey: pubkey,
                        category:'accountChange'
                    };
                    callback("", callbackObj);
                }
            });
            break;

        case 'accountChange':
            config.keyProvider = obj.data;
            eos = Eos(config);
            break;
        case 'getAccountInfo':
            let currentAccount = obj.account;
            eos.getAccount({'account_name': currentAccount}, (error, result) => {
                result.category='getAccountInfo';
                callback(error, result);
            });
            break;
        case 'getBalance':
            let balanceAccount = obj.account;
            eos.getCurrencyBalance({code:'eosio.token',account: balanceAccount,'symbol':'EOS'}, (error, result) => {
                console.log(typeof  result);
                var resultObj ={category:'getBalance',balance:result.toString()};
                callback(error, resultObj);
            });
            break
        case 'block':
            MongoClient.connect(mongodburl, function (err, db) {
                if (err) {
                    throw err
                }
                var dbo = db.db('EOS')
                var quary = {
                    'action_traces': {
                        $elemMatch: {
                            'act.data.from': 'mukang123123',
                        }
                    }
                };
                dbo.collection('transaction_traces').find(quary).toArray(function (err, numDocs) {
                    if (err) {
                        throw err
                    }
                    var rel = {
                        trans2: numDocs,
                    };
                    rn_bridge.channel.send(JSON.stringify(rel));
                    db.close()

                });

            })
            break;
    }


});

// Inform react-native node is initialized.e
// rn_bridge.channel.send("Node was initialized.");