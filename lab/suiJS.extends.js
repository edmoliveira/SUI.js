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

Array.prototype.where = function (action) {
    var array = [];

    if (action != null) {
        for (var index = 0; index < this.length; index++) {
            if (action(this[index])) {
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
