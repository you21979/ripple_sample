var RPC = exports.RPC = {
    SUBSCRIBE : 1,
    ASKS : 1001,
    BIDS : 1002,
}
var XRPDEC = 0.000001;
var XRPENC = 1000000;
var getTakerPays = exports.getTakerPays = function(data){
    return {
        currency: data.TakerPays.currency ? data.TakerPays.currency : 'XRP',
        value: data.TakerPays.value ? parseFloat(data.TakerPays.value) : parseFloat(data.TakerPays) * XRPDEC,
        account: data.Account,
    };
}
var getTakerGets = exports.getTakerGets = function(data){
    return {
        currency: data.TakerGets.currency ? data.TakerGets.currency : 'XRP',
        value: data.TakerGets.value ? parseFloat(data.TakerGets.value) : parseFloat(data.TakerGets) * XRPDEC,
        account: data.Account,
    };
}
var getTakerAsks = exports.getTakerAsks = function(data){
    var pays = getTakerPays(data);
    var gets = getTakerGets(data);
    return {
        pair:gets.currency + '_' + pays.currency,
        value:pays.value/gets.value,
        account:pays.account,
        //pays:pays,
        //gets:gets,
    }
}
var getTakerBids = exports.getTakerBids = function(data){
    var pays = getTakerPays(data);
    var gets = getTakerGets(data);
    return {
        pair:pays.currency + '_' + gets.currency,
        value:gets.value / pays.value,
        account:pays.account,
        //pays:pays,
        //gets:gets,
    }
}
var bookSubscribe = exports.bookSubscribe = function(issuer){
    return JSON.stringify({
        command: "subscribe",
        id: RPC.SUBSCRIBE,
        accounts:[issuer]
    });
}
var wholeBookAsks = exports.wholeBookAsks = function(base, counter){
    var gets = counter;
    var pays = base;
    var data = {
        command: "book_offers",
        id: RPC.ASKS,
        taker_gets: {
            currency: gets.currency,
        },
        taker_pays: {
            currency: pays.currency,
        },
    };
    if(data.taker_gets.currency !== "XRP")  data.taker_gets.issuer = gets.issuer;
    if(data.taker_pays.currency !== "XRP")  data.taker_pays.issuer = pays.issuer;
    
    return JSON.stringify(data);
}
var wholeBookBids = exports.wholeBookBids = function(base, counter){
    var gets = base;
    var pays = counter;
    var data = {
        command: "book_offers",
        id: RPC.BIDS,
        taker_gets: {
            currency: gets.currency,
        },
        taker_pays: {
            currency: pays.currency,
        },
    };
    if(data.taker_gets.currency !== "XRP")  data.taker_gets.issuer = gets.issuer;
    if(data.taker_pays.currency !== "XRP")  data.taker_pays.issuer = pays.issuer;

    return JSON.stringify(data);
}
