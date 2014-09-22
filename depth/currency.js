var CURRENCY = exports.CURRENCY = {
    XRP : [{
        currency: 'XRP',
    }],
}

var setup = exports.setup =  function(currencies){
    currencies.forEach(function(v){
        if(!( v.currency in CURRENCY )){
            CURRENCY[v.currency] = [];
        }
        CURRENCY[v.currency].push(v);
    });
}

var getCurrency = exports.getCurrency = function(name, issuer){
    var filter;
    if(name === 'XRP') filter = function(v){return true;}
    else filter = function(v){ return v.issuer === issuer }
    return CURRENCY[name].filter(filter).shift();
}
