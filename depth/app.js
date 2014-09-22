var currency = require('./currency');
var ripple = require('./ripple');
var WebSocket = require('ws');
var websocket = new WebSocket('wss://s1.ripple.com:443')

var RTJ = 'rMAz5ZnK73nyNUL4foAvaxdreczCkG3vA6';
var RIPPLETRADEJAPAN = [
    {
        currency: 'JPY',
        issuer: RTJ,
    },
];
currency.setup(RIPPLETRADEJAPAN);

var pair = [];
pair.push({
    base:currency.getCurrency('JPY', RTJ),
    counter:currency.getCurrency('XRP')
});

websocket.on('open', function(){
    websocket.send(ripple.bookSubscribe(RTJ))
    pair.forEach(function(v){
        websocket.send(ripple.wholeBookAsks(v.base, v.counter))
        websocket.send(ripple.wholeBookBids(v.base, v.counter))
    })
})
websocket.on('message', function(message){
    var m = JSON.parse(message);
    if(m.error){
        throw new Error(m.error);
    }
    if (m.type == 'transaction') {
        if (m.transaction.TransactionType == "OfferCreate") {
            var takerPays = ripple.getTakerPays(m.transaction).currency;
            var takerGets = ripple.getTakerGets(m.transaction).currency;
            pair.filter(function(v){
                return (takerGets == v.base.currency && takerPays == v.counter.currency)
            }).forEach(function(v){
                websocket.send(ripple.wholeBookAsks(v.base, v.counter))
                websocket.send(ripple.wholeBookBids(v.base, v.counter))
            });
        }
    }else{
        switch(m.id){
        case ripple.RPC.ASKS:
            var offers = m.result.offers;
            var asks = offers.
                map(function(v){return ripple.getTakerAsks(v)});
            var bestask = asks.slice(0, 1).shift();
bestask.value = Math.floor(bestask.value * 100000) / 100000;
console.log({ask:bestask})
            break;
        case ripple.RPC.BIDS:
            var offers = m.result.offers;
            var offers = m.result.offers;
            var bids = offers.
                map(function(v){return ripple.getTakerBids(v)});
            var bestbid = bids.slice(0, 1).shift();
bestbid.value = Math.floor(bestbid.value * 100000) / 100000;
console.log({bid:bestbid})
            break;
        }
    }
})
websocket.on('close', function(){
})

