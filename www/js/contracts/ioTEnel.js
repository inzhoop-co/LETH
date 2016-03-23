var  ioTAddrE="0x4c8c81b73b67f51cd79c7352d999a337bf80028b"
var  ioTABIE = [{
    constant: true,
    inputs: [],
    name: "getMinBal",
    outputs: [{
        name: "bal",
        type: "uint256"
    }],
    type: "function"
}, {
    constant: true,
    inputs: [],
    name: "getState",
    outputs: [{
        name: "r",
        type: "uint256"
    }],
    type: "function"
}, {
    constant: true,
    inputs: [],
    name: "getEnabledCount",
    outputs: [{
        name: "r",
        type: "uint256"
    }],
    type: "function"
}, {
    constant: false,
    inputs: [],
    name: "close",
    outputs: [],
    type: "function"
}, {
    constant: true,
    inputs: [{
        name: "addr",
        type: "address"
    }],
    name: "getOpCount",
    outputs: [{
        name: "count",
        type: "uint256"
    }],
    type: "function"
}, {
    constant: false,
    inputs: [],
    name: "registerMe",
    outputs: [],
    type: "function"
}, {
    constant: true,
    inputs: [],
    name: "getRegCost",
    outputs: [{
        name: "cost",
        type: "uint256"
    }],
    type: "function"
}, {
    constant: false,
    inputs: [{
        name: "addr",
        type: "address"
    }],
    name: "registerAddr",
    outputs: [],
    type: "function"
}, {
    constant: false,
    inputs: [],
    name: "reset",
    outputs: [],
    type: "function"
}, {
    constant: true,
    inputs: [{
        name: "addr",
        type: "address"
    }],
    name: "itsEnabled",
    outputs: [{
        name: "enabledV",
        type: "bool"
    }],
    type: "function"
}, {
    constant: false,
    inputs: [{
        name: "mimBal",
        type: "uint256"
    }, {
        name: "regCost",
        type: "uint256"
    }, {
        name: "numOp",
        type: "uint256"
    }],
    name: "config",
    outputs: [],
    type: "function"
}, {
    constant: false,
    inputs: [],
    name: "open",
    outputs: [],
    type: "function"
}, {
    inputs: [],
    type: "constructor"
}, {
    anonymous: false,
    inputs: [{
        indexed: false,
        name: "state",
        type: "uint256"
    }],
    name: "State",
    type: "event"
}, {
    anonymous: false,
    inputs: [{
        indexed: false,
        name: "msg",
        type: "string"
    }],
    name: "Log",
    type: "event"
}]


var ioTDemoE= web3.eth.contract(ioTABIE).at(ioTAddrE)
var eventIoTE = ioTDemoE.State({}, '', function(error, result){if (!error)console.log("##### State Enel: " + result.args.state)});
var eventIoTEMsg = ioTDemoE.Log({}, '', function(error, result){if (!error)console.log("##### Log: " + result.args.msg)});