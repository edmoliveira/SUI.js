'use strict';

var OBJECT_TYPE = {
    VALUE_TYPE: 0
    , REFERENCE_TYPE: 1
    , ARRAY_TYPE: 2
};

function $sui() {
    if(!(this instanceof $sui)) return $sui();

    return this; 
}

$sui.ready = function (action) {
    this.func.addEvent('load', window, function () {
        if (action != null) {
            action();
        }
    });
}

$sui.loadControl = function (selector, action) {
    var elementCollection = document.querySelectorAll('[sui-form="' + selector + '"]');

    if (elementCollection.length > 0) {
        var elementSuiForm = elementCollection[0];

        function formSuiJS(parentElement) {
            var self = this;

            var ctrlModel = new Object();
            var changePropertyArray = [];

            this.__sui__ = new Object();

            this.__sui__.$getprotoM = function () {
                return ctrlModel;
            }

            this.onChangeProperty = null;

            this.__sui__.$triggerChangePropertyArray = function (sender, propertyName, oldValue, newValue) {
                if (self.onChangeProperty != null) {
                    return self.onChangeProperty(sender, propertyName, oldValue, newValue);
                }
                else {
                    return true;
                }
            };

            searchComponents(parentElement, ctrlModel, 0);
        }

        Object.defineProperty(formSuiJS.prototype, "$model", {
            get: function () {
                return this.__sui__.$getprotoM();
            }
        });

        var oFormSuiJS = null;

        if (action != null) {
            oFormSuiJS = new formSuiJS(elementSuiForm);

            action(oFormSuiJS, oFormSuiJS.$model, oFormSuiJS.$model.$func);
        }

        function searchComponents(parentElement, ctrlModel, level, parentCtrlModel) {
            var posLevel = '';

            if (level > 0) {
                posLevel = '-' + level;
            }

            ctrlModel.__sui__ = new Object();
            ctrlModel.__sui__.parentCtrlModel = parentCtrlModel;

            ctrlModel.$func = new Object();
            ctrlModel.$func.__sui__ = ctrlModel.__sui__;

            ctrlModel.__sui__.$components = new Object();
            ctrlModel.__sui__.$components.items = [];
            ctrlModel.__sui__.$components.moveFocus = function (tabIndex) {
                for (var index = 0; index < this.items.length; index++) {
                    if (this.items[index].tabIndex == $sui.func.textToInt(tabIndex)) {
                        this.items[index].__sui__.setFocus();
                        break;
                    }
                }
            }

            var compCollection = parentElement.querySelectorAll('[sui-comp' + posLevel + ']');

            for (var index = 0; index < compCollection.length; index++) {
                var elementComp = compCollection[index];

                var attr = elementComp.attributes;

                var type = attr.getNamedItem('sui-comp' + posLevel);
                var prop = attr.getNamedItem('prop');

                if (type != null && prop != null) {
                    var propName = prop.value;

                    if (ctrlModel.__sui__[propName] != undefined) { throw 'This property already exists [' + propName + '][' + selector + ']'; }

                    var mask = attr.getNamedItem('mask');
                    var tabIndex = attr.getNamedItem('tabIndex');
                    var nextTabIndex = attr.getNamedItem('nextTabIndex');

                    var typeValue = $sui.func.trim(type.value);

                    var funcName = findFunction($sui.components, 'create' + typeValue);

                    if (funcName == null) { throw 'This component type not exists [' + typeValue + ']'; }

                    var comp = $sui.components[funcName]();

                    if (comp.__sui__.objectType() == OBJECT_TYPE.VALUE_TYPE) {
                        var opropertyModel = new propertyModel(ctrlModel, propName);

                        ctrlModel.__sui__[propName] = opropertyModel;

                        ctrlModel.$func[propName] = new funcPropertyModel(ctrlModel.__sui__[propName]);

                        if (mask != null) {
                            funcName = findFunction($sui.masks, mask.value);

                            if (funcName == null) { throw 'This mask name not exists [' + mask.value + ']'; }

                            $sui.masks[funcName](comp);

                            attr.removeNamedItem('mask');
                        }

                        ctrlModel.__sui__[prop.value].setElement(comp);

                        createProperty(ctrlModel, propName);

                        if (tabIndex != null && nextTabIndex != null) {
                            ctrlModel.__sui__[propName].setTabIndex(tabIndex.value, nextTabIndex.value);

                            attr.removeNamedItem('nextTabIndex');
                            attr.removeNamedItem('tabIndex');
                        }

                        ctrlModel.__sui__.$components.items.push(comp);

                        attr.removeNamedItem('prop');
                        attr.removeNamedItem('sui-comp' + posLevel);

                        for (var iAttr = 0; iAttr < attr.length; iAttr++) {
                            var elAttribute = document.createAttribute(attr[iAttr].name);
                            elAttribute.value = attr[iAttr].value;

                            comp.setAttributeNode(elAttribute);
                        }

                        elementComp.parentNode.replaceChild(comp, elementComp);

                        opropertyModel.addEvents();
                    }
                    else if (comp.__sui__.objectType() == OBJECT_TYPE.REFERENCE_TYPE) {
                        if (comp.__sui__.isElementNull) { comp = $sui.components[funcName](elementComp); }

                        ctrlModel.__sui__[propName] = new propertyRefModel(ctrlModel, propName);

                        ctrlModel.$func[propName] = new funcPropertyRefModel(ctrlModel.__sui__[propName]);

                        ctrlModel.__sui__[prop.value].setElement(comp);

                        createProperty(ctrlModel, propName);

                        if (tabIndex != null && nextTabIndex != null) {
                            ctrlModel.__sui__[propName].setTabIndex(tabIndex.value, nextTabIndex.value);

                            attr.removeNamedItem('nextTabIndex');
                        }

                        ctrlModel.__sui__.$components.items.push(comp);

                        attr.removeNamedItem('prop');
                        attr.removeNamedItem('sui-comp' + posLevel);

                        for (var iAttr = 0; iAttr < attr.length; iAttr++) {
                            var elAttribute = document.createAttribute(attr[iAttr].name);
                            elAttribute.value = attr[iAttr].value;

                            comp.setAttributeNode(elAttribute);
                        }

                        var componentChildren = searchComponents(comp, ctrlModel[propName], level + 1, ctrlModel);

                        if (componentChildren.length > 0) {
                            ctrlModel.__sui__[propName].settings(componentChildren[0], componentChildren[componentChildren.length - 1]);
                        }
                    }
                    else if (comp.__sui__.objectType() == OBJECT_TYPE.ARRAY_TYPE) {
                        var opropertyModel = new propertyArrayModel(ctrlModel, propName);

                        ctrlModel.__sui__[propName] = opropertyModel;

                        ctrlModel.$func[propName] = new funcPropertyArrayModel(ctrlModel.__sui__[propName]);

                        ctrlModel.__sui__[prop.value].setElement(comp, elementComp.innerHTML);

                        createProperty(ctrlModel, propName);

                        if (tabIndex != null && nextTabIndex != null) {
                            ctrlModel.__sui__[propName].setTabIndex(tabIndex.value, nextTabIndex.value);

                            attr.removeNamedItem('nextTabIndex');
                            attr.removeNamedItem('tabIndex');
                        }

                        ctrlModel.__sui__.$components.items.push(comp);

                        attr.removeNamedItem('prop');
                        attr.removeNamedItem('sui-comp' + posLevel);

                        for (var iAttr = 0; iAttr < attr.length; iAttr++) {
                            var elAttribute = document.createAttribute(attr[iAttr].name);
                            elAttribute.value = attr[iAttr].value;

                            comp.setAttributeNode(elAttribute);
                        }

                        elementComp.parentNode.replaceChild(comp, elementComp);
                    }
                }
            }

            searchLegends(parentElement, ctrlModel, level);

            return ctrlModel.__sui__.$components.items;
        }

        function searchLegends(parentElement, ctrlModel, level) {
            var posLevel = '';

            if (level > 0) {
                posLevel = '-' + level;
            }

            var legendCollection = parentElement.querySelectorAll('[sui-value' + posLevel + ']');

            for (var index = 0; index < legendCollection.length; index++) {
                var el = legendCollection[index];
                var attr = legendCollection[index].attributes;

                var value = attr.getNamedItem('sui-value' + posLevel).value;

                el.__sui__ = new Object();
                el.__sui__.properties = [];

                var reg = new RegExp(/\$sui\.\w+/g);

                var result;
                while ((result = reg.exec(value)) != null) {
                    var propName = result[0].replace('$sui.', '');

                    if (ctrlModel.__sui__[propName] == undefined) {

                        var oPropertyReadOnlyModel = new propertyReadOnlyModel(ctrlModel, propName);

                        ctrlModel.__sui__[propName] = oPropertyReadOnlyModel;

                        createProperty(ctrlModel, propName);
                    }

                    var property = ctrlModel.__sui__[propName];

                    (function (element, text, objProp) {
                        objProp.onChangeValue.push(function () {
                            fillLegendValue(element, text);
                        });
                    }
                    )(el, value, property);

                    el.__sui__.properties.push(property);
                }

                fillLegendValue(el, value);

                legendCollection[index].removeAttribute('sui-value' + posLevel);
            }
        }

        function createProperty(senderModel, propertyName) {
            Object.defineProperty(senderModel, propertyName, {
                get: function () {
                    return this.__sui__[propertyName].get();
                }
                , set: function (v) {
                    this.__sui__[propertyName].set(v);
                }
            });
        }

        function findFunction(obj, functionName) {
            var name = null;

            for (var item in obj) {
                if (typeof obj[item] == "function" && item.toLowerCase() == functionName.toLowerCase()) {
                    name = item;
                }
            }

            return name;
        }

        function fillLegendValue(element, text) {
            for (var iProp = 0; iProp < element.__sui__.properties.length; iProp++) {
                var item = element.__sui__.properties[iProp];

                var code = '$sui.' + item.propertyName;

                var value = item.get();

                text = text.replace(code, value == null ? '' : value);
            }

            element.innerHTML = text;
        }

        function propertyReadOnlyModel(ctrlModel, prop) {
            var self = this;

            var value = null;

            this.propertyName = prop;

            this.setElement = function (elem) {
                el = elem;
            }

            this.get = function () {
                return value;
            }

            this.set = function (v) {
                value = v;

                self.onChangeValue.forEach(function (item, index) {
                    item(value);
                });
            }

            this.onChangeValue = [];
        }

        function funcPropertyModel(propertyModel) {
            this.changeNextTabIndex = function (newNextTabIndex) {
                propertyModel.changeNextTabIndex(newNextTabIndex);
            }

            this.getValueNoMask = function () {
                return propertyModel.getNoMask();
            }

            this.setValueNoMask = function (v) {
                propertyModel.setNoMask(v);
            }

            this.focus = function () {
                propertyModel.focus();
            }
        }

        function propertyModel(ctrlModel, prop) {
            var self = this;

            var el = null;
            var tbIn = 0;
            var ntTbIn = 0;

            this.propertyName = prop;

            this.setElement = function (elem) {
                el = elem;

                el.__sui__.valueChanged.push(function (obj) {
                    self.onChangeValue.forEach(function (item, index) {
                        item(obj);
                    });
                });
            }

            this.addEvents = function () {
                $sui.func.addEvent('change', el, function () {
                    if (oFormSuiJS.__sui__.$triggerChangePropertyArray(ctrlModel, self.propertyName, this.__sui__.getValue(), this.__sui__.getNewValue())) {
                        this.__sui__.setValue(this.__sui__.getNewValue());
                    }
                    else {
                        this.__sui__.setValue(this.__sui__.getValue());
                    }
                });

                $sui.func.addEvent('keydown', el, function (e) {
                    var key = e.charCode || e.keyCode || 0;

                    if (key == 9) {
                        e.preventDefault();

                        ctrlModel.__sui__.$components.moveFocus(ntTbIn);
                    }
                });
            }

            this.focus = function () {
                el.__sui__.setFocus();
            }

            this.setTabIndex = function (tabIndex, nextTabIndex) {
                el.__sui__.setTabIndex(tabIndex);

                tbIn = tabIndex;
                ntTbIn = nextTabIndex;
            }

            this.changeNextTabIndex = function (newNextTabIndex) {
                ntTbIn = newNextTabIndex;
            }

            this.get = function () {
                return el.__sui__.getValue();
            }

            this.set = function (v) {
                el.__sui__.setValue(v);
            }

            this.getNoMask = function () {
                return el.__sui__.getValueNoMask();
            }

            this.setNoMask = function (v) {
                el.__sui__.setValueNoMask(v);
            }

            this.onChangeValue = [];
        }

        function funcPropertyRefModel(propertyRefModel) {
            this.changeNextTabIndex = function (newNextTabIndex) {
                propertyRefModel.changeNextTabIndex(newNextTabIndex);
            }

            this.focus = function () {
                propertyRefModel.focus();
            }
        }

        function propertyRefModel(ctrlModel, prop) {
            var self = this;

            var firstComponent = null;
            var lastComponent = null;

            var el = null;
            var tbIn = 0;
            var ntTbIn = 0;

            this.propertyName = prop;

            this.setElement = function (elem) {
                el = elem;

                el.__sui__.valueChanged.push(function (obj) {
                    self.onChangeValue.forEach(function (item, index) {
                        item(obj);
                    });
                });

                $sui.func.addEvent('focus', el, function () {
                    if (firstComponent != null) {
                        firstComponent.__sui__.setFocus();
                    }
                });
            }

            this.focus = function () {
                el.__sui__.setFocus();
            }

            this.setTabIndex = function (tabIndex, nextTabIndex) {
                el.__sui__.setTabIndex(tabIndex);

                tbIn = tabIndex;
                ntTbIn = nextTabIndex;
            }

            this.changeNextTabIndex = function (newNextTabIndex) {
                ntTbIn = newNextTabIndex;
            }

            this.get = function () {
                return el.__sui__.getValue();
            }

            this.set = function (v) {
                el.__sui__.setValue(v);
            }

            this.settings = function (fComp, lComp) {
                firstComponent = fComp;
                lastComponent = lComp;

                if (lastComponent != null && lastComponent.__sui__.objectType() != OBJECT_TYPE.REFERENCE_TYPE) {
                    $sui.func.addEvent('keydown', lastComponent, function (e) {
                        var key = e.charCode || e.keyCode || 0;

                        if (key == 9) {
                            e.preventDefault();

                            ctrlModel.__sui__.$components.moveFocus(ntTbIn);
                        }
                    });
                }
            }

            this.onChangeValue = [];
        }

        function funcPropertyArrayModel(propertyArrayModel) {
            this.changeNextTabIndex = function (newNextTabIndex) {
                propertyArrayModel.changeNextTabIndex(newNextTabIndex);
            }

            this.focus = function () {
                propertyArrayModel.focus();
            }
        }

        function propertyArrayModel(ctrlModel, prop) {
            var self = this;

            var el = null;
            var tbIn = 0;
            var ntTbIn = 0;

            var elementModel = null;
            var oArrayClass = null;

            this.propertyName = prop;

            this.get = function () {
                return oArrayClass;
            }

            this.set = function (v) {
                throw 'This property is read only'
            }

            this.setElement = function (elem, innerHTML) {
                el = elem;

                oArrayClass = new arrayClass(elem);

                elementModel = document.createElement('DIV');

                elementModel.innerHTML = innerHTML;

                el.__sui__.createModel = function () {
                    var newModel = new Object();

                    var parentElement = document.createElement('tt');

                    var elementDiv = elementModel.cloneNode(true);

                    parentElement.appendChild(elementDiv);

                    searchComponents(parentElement, newModel, 1, ctrlModel);

                    parentElement.removeChild(elementDiv);

                    newModel.__sui__.element = elementDiv;

                    return newModel;
                }

                el.__sui__.getElementOfModel = function (itemModel) {
                    return itemModel.__sui__.element;
                }

                el.__sui__.valueChanged.push(function (obj) {
                    self.onChangeValue.forEach(function (item, index) {
                        item(obj);
                    });
                });
            }

            this.focus = function () {
                el.__sui__.setFocus();
            }

            this.setTabIndex = function (tabIndex, nextTabIndex) {
                el.__sui__.setTabIndex(tabIndex);

                tbIn = tabIndex;
                ntTbIn = nextTabIndex;
            }

            this.changeNextTabIndex = function (newNextTabIndex) {
                ntTbIn = newNextTabIndex;
            }

            function arrayClass(elementArray) {
                this.createItem = function () {
                    return elementArray.__sui__.createItem();
                }

                this.add = function (item) {
                    elementArray.__sui__.add(item);
                }

                this.get = function (index) {
                    return elementArray.__sui__.get();
                }

                this.removeAt = function (index) {
                    elementArray.__sui__.removeAt(item);
                }

                this.remove = function (predicate) {
                    elementArray.__sui__.remove(predicate);
                }

                this.where = function (predicate) {
                    return elementArray.__sui__.where(predicate);
                }

                this.update = function (predicate, result) {
                    elementArray.__sui__.update(predicate, result);
                }
            }

            this.onChangeValue = [];
        }
    }
}

$sui.components = {
    createText: function () {
        var el = document.createElement('INPUT');
        var valueOf = null;

        el.type = 'text';
        el.__sui__ = new Object();

        el.__sui__.objectType = function () {
            return OBJECT_TYPE.VALUE_TYPE;
        }

        el.__sui__.getNewValue = function () {
            return el.value;
        }

        el.__sui__.getValue = function () {
            return valueOf;
        }

        el.__sui__.setValue = function (v) {
            valueOf = v;
            el.value = v;

            triggerValueChanged();
        }

        el.__sui__.getValueNoMask = function () {
            return valueOf;
        }

        el.__sui__.setValueNoMask = function (v) {
            valueOf = v;
            el.value = v;

            triggerValueChanged();
        }

        el.__sui__.setFocus = function () {
            el.focus();
        }

        el.__sui__.setTabIndex = function (tabIndex) {
            el.tabIndex = tabIndex;
        }

        el.__sui__.valueChanged = [];

        function triggerValueChanged() {
            if (el.__sui__.valueChanged.length) {
                el.__sui__.valueChanged.forEach(function (item, index) {
                    item({ value: el.value, valueNoMask: el.value });
                });
            }
        }

        return el;
    }
    , createRepeater: function () {
        var el = document.createElement('DIV');
        var valueOf = [];

        el.__sui__ = new Object();

        el.__sui__.objectType = function () {
            return OBJECT_TYPE.ARRAY_TYPE;
        }

        el.__sui__.toString = function () {
            return valueOf.length + ' element' + (valueOf.length > 0 ? 's' : '');
        }

        el.__sui__.count = function () {
            return valueOf.length;
        }

        el.__sui__.createItem = function () {
            var model = el.__sui__.createModel();

            model.__idm__ = new Object();
            model.__idm__.$id = '$isok$'

            return model;
        }

        el.__sui__.add = function (item) {
            if (item.__idm__.$id != '$isok$') { throw 'Use the method createItem to create a new object'; }

            valueOf.push(item);

            el.appendChild(el.__sui__.getElementOfModel(item));

            triggerValueChanged(item);
        }

        el.__sui__.get = function (index) {
            return valueOf[index];
        }

        el.__sui__.removeAt = function (index) {
            var item = valueOf[index];

            valueOf.splice(index, 1);

            el.removeChild(el.__sui__.getElementOfModel(item));

            triggerValueChanged(item);
        }

        el.__sui__.remove = function (predicate) {
            if (predicate != null) {
                for (var index = valueOf.length - 1; index >= 0; index--) {
                    if (predicate(valueOf[index])) {
                        var item = valueOf[index];

                        valueOf.splice(index, 1);

                        el.removeChild(el.__sui__.getElementOfModel(item));

                        triggerValueChanged(item);
                    }
                }
            }
        }

        el.__sui__.where = function (predicate) {
            var array = [];

            if (predicate != null) {
                for (var index = 0; index < valueOf.length; index++) {
                    if (predicate(valueOf[index])) {
                        array.push(valueOf[index]);
                    }
                }
            }
            else {
                for (var index = 0; index < valueOf.length; index++) {
                    array.push(valueOf[index]);
                }
            }

            return array;
        }

        el.__sui__.update = function (predicate, result) {
            if (predicate != null) {
                for (var index = 0; index < valueOf.length; index++) {
                    if (predicate(valueOf[index])) {
                        result(valueOf[index]);
                    }
                }
            }
            else {
                for (var index = 0; index < valueOf.length; index++) {
                    result(valueOf[index]);
                }
            }
        }

        el.__sui__.setFocus = function () {
            el.focus();
        }

        el.__sui__.setTabIndex = function (tabIndex) {
            el.tabIndex = tabIndex;
        }

        el.__sui__.valueChanged = [];
        el.__sui__.createModel = null;
        el.__sui__.getElementOfModel = null;

        function triggerValueChanged(itemValue) {
            if (el.__sui__.valueChanged.length) {
                el.__sui__.valueChanged.forEach(function (item, index) {
                    item(itemValue);
                });
            }
        }

        return el;
    }
    , createCustom: function (element) {
        var el = null;

        if (element == null) {
            el = document.createElement('tt');

            el.__sui__ = new Object();
            el.__sui__.isElementNull = true;
        }
        else {
            el = element;

            el.__sui__ = new Object();
        }

        el.__sui__.value = new Object();

        el.__sui__.objectType = function () {
            return OBJECT_TYPE.REFERENCE_TYPE;
        }

        el.__sui__.getValue = function () {
            return el.__sui__.value;
        }

        el.__sui__.setValue = function (v) {
            el.__sui__.value = v;

            triggerValueChanged();
        }

        el.__sui__.setFocus = function () {
            el.focus();
        }

        el.__sui__.setTabIndex = function (tabIndex) {
            el.tabIndex = tabIndex;
        }

        el.__sui__.valueChanged = [];

        function triggerValueChanged() {
            if (el.__sui__.valueChanged.length) {
                el.__sui__.valueChanged.forEach(function (item, index) {
                    item(el.__sui__.value);
                });
            }
        }

        return el;
    }
}

$sui.func = {
    addEvent: function (evnt, elem, func) {
        if (elem.addEventListener) {
            elem.addEventListener(evnt, func, false);
        }
        else if (elem.attachEvent) {
            elem.attachEvent("on" + evnt, func);
        }
        else {
            elem[evnt] = func;
        }
    }
    , createMask: function (el, format, opt) {
        el.__sui__.objMask = new Object();
    }
    , textToInt: function (value) {
        var number = parseInt(value);

        if (!isNaN(number)) {
            return number;
        }
        else {
            return 0;
        }
    }
    , trim: function (value) {
        return value.replace(/^[\s]+|[\s]+$/g, "");
    }
}

$sui.masks = {
    time: function (selector) {
        $sui.func.createMask(selector, '00:00:00');
    }
}