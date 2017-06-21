//######################### Array
Array.prototype.firstOrDefault = function () {
    if (this.length > 0) {
        return this[0];
    }
    else {
        return null;
    }
}

Array.prototype.lastOrDefault = function () {
    if (this.length > 0) {
        return this[this.length - 1];
    }
    else {
        return null;
    }
}

Array.prototype.where = function (predicate) {
    var array = [];

    if (predicate != null) {
        for (var index = 0; index < this.length; index++) {
            if (predicate(this[index])) {
                array.push(this[index]);
            }
        }
    }
    else {
        for (var index = 0; index < this.length; index++) {
            array.push(this[index]);
        }
    }

    return array;
}
//######################### Array

//######################### String
///<summary>
/// Function that count occurrences of a word in a string 
///</summary>
String.prototype.occur = function (word) {
    var oRegExp = new RegExp(word, 'g');

    return (this.toString().match(oRegExp) || []).length;
}

//######################### String