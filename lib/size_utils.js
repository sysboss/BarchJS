// Size util

var sizeUtils = {
    "parse": function (str) {
        var regEx = new RegExp(/([0-9\.]+)\s*([a-zA-Z])/),
            parse = str.match(regEx);

        return {'size': parse[1], 'unit': parse[2]};
    },
    "toMB": function (str) {
        var parse = this.parse(str);
        
        switch(parse.unit.toLowerCase()) {
            case 'm':
                return parse.size;
                break;
            case 'mb':
                return parse.size;
                break;
            case 'g':
                return parse.size * 1000;
                break;
            case 'gb':
                return parse.size * 1000;
                break;
            case 't':
                return parse.size * 1000000;
                break;
            case 'tb':
                return parse.size * 1000000;
                break;
            default:
                console.log("sizeUtils.toMB failed to parse string");
                return;
                break;
        }
    },
    "isBigger": function (str1, str2) {
        var first  = this.toMB(str1),
            second = this.toMB(str2);

        return first > second ? true : false;
    }
};

module.exports = sizeUtils;
