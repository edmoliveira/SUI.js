'use strict';

var OBJECT_TYPE = {
    VALUE_TYPE: 0
    , REFERENCE_TYPE: 1
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
            var crtlModel = new Object();

            this.___getprotoM = function () {
                return crtlModel;
            }

            this.checkForm = null;

            searchComponents(parentElement, crtlModel, 0);
        }

        Object.defineProperty(formSuiJS.prototype, "Model", {
            get: function () {
                return this.___getprotoM();
            }
        });

        var oFormSuiJS = null;

        if (action != null) {
            oFormSuiJS = new formSuiJS(elementSuiForm);

            action(oFormSuiJS, oFormSuiJS.Model, oFormSuiJS.Model.$func);
        }

        function searchComponents(parentElement, crtlModel, level) {
            var posLevel = '';

            if (level > 0) {
                posLevel = '-' + level;
            }

            crtlModel.__sui__ = new Object();

            crtlModel.$func = new Object();
            crtlModel.$func.__sui__ = crtlModel.__sui__;

            crtlModel.__sui__.$components = new Object();
            crtlModel.__sui__.$components.items = [];
            crtlModel.__sui__.$components.moveFocus = function (tabIndex) {
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

                    var mask = attr.getNamedItem('mask');
                    var tabIndex = attr.getNamedItem('tabIndex');
                    var nextTabIndex = attr.getNamedItem('nextTabIndex');

                    var typeValue = $sui.func.trim(type.value);

                    var funcName = findFunction($sui.components, 'create' + typeValue);

                    if (funcName == null) { throw 'This component type not exists [' + typeValue + ']'; }

                    var comp = $sui.components[funcName]();

                    if (comp.__sui__.objectType() == OBJECT_TYPE.VALUE_TYPE) {
                        crtlModel.__sui__[propName] = new propertyModel(crtlModel, propName);

                        crtlModel.$func[propName] = new funcPropertyModel(crtlModel.__sui__[prop.value]);

                        if (mask != null) {
                            funcName = findFunction($sui.masks, mask.value);

                            if (funcName == null) { throw 'This mask name not exists [' + mask.value + ']'; }

                            $sui.masks[funcName](comp);

                            attr.removeNamedItem('mask');
                        }

                        if (crtlModel.__sui__[propName] == undefined) { throw 'This property not exists [' + propName + ']'; }

                        crtlModel.__sui__[prop.value].setElement(comp);

                        (function (senderModel, propertyName) {
                            Object.defineProperty(senderModel, propertyName, {
                                get: function () {
                                    return this.__sui__[propertyName].get();
                                }
                                , set: function (v) {
                                    return this.__sui__[propertyName].set(v);
                                }
                            });
                        })(crtlModel, propName);

                        if (tabIndex != null && nextTabIndex != null) {
                            crtlModel.__sui__[propName].setTabIndex(tabIndex.value, nextTabIndex.value);

                            attr.removeNamedItem('nextTabIndex');
                            attr.removeNamedItem('tabIndex');
                        }

                        crtlModel.__sui__.$components.items.push(comp);

                        attr.removeNamedItem('prop');
                        attr.removeNamedItem('sui-comp' + posLevel);

                        for (var iAttr = 0; iAttr < attr.length; iAttr++) {
                            var elAttribute = document.createAttribute(attr[iAttr].name);
                            elAttribute.value = attr[iAttr].value;

                            comp.setAttributeNode(elAttribute);
                        }

                        elementComp.parentNode.replaceChild(comp, elementComp);
                    }
                    else if (comp.__sui__.objectType() == OBJECT_TYPE.REFERENCE_TYPE) {
                        if (comp.__sui__.isElementNull) { comp = $sui.components[funcName](elementComp); }

                        crtlModel.__sui__[propName] = new propertyRefModel(crtlModel, propName);

                        crtlModel.$func[propName] = new funcPropertyRefModel(crtlModel.__sui__[prop.value]);

                        if (crtlModel.__sui__[propName] == undefined) { throw 'This property not exists [' + propName + ']'; }

                        crtlModel.__sui__[prop.value].setElement(comp);

                        (function (senderModel, propertyName) {
                            Object.defineProperty(senderModel, propertyName, {
                                get: function () {
                                    return this.__sui__[propertyName].get();
                                }
                                , set: function (v) {
                                    return this.__sui__[propertyName].set(v);
                                }
                            });
                        })(crtlModel, propName);

                        if (tabIndex != null && nextTabIndex != null) {
                            crtlModel.__sui__[propName].setTabIndex(tabIndex.value, nextTabIndex.value);

                            attr.removeNamedItem('nextTabIndex');
                        }

                        crtlModel.__sui__.$components.items.push(comp);

                        attr.removeNamedItem('prop');
                        attr.removeNamedItem('sui-comp' + posLevel);

                        for (var iAttr = 0; iAttr < attr.length; iAttr++) {
                            var elAttribute = document.createAttribute(attr[iAttr].name);
                            elAttribute.value = attr[iAttr].value;

                            comp.setAttributeNode(elAttribute);
                        }

                        var componentChildren = searchComponents(comp, crtlModel[propName], level + 1);

                        if (componentChildren.length > 0) {
                            crtlModel.__sui__[propName].settings(componentChildren[0], componentChildren[componentChildren.length - 1]);
                        }
                    }
                }
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

            searchLegends(parentElement, crtlModel, level);

            return crtlModel.__sui__.$components.items;
        }

        function searchLegends(parentElement, crtlModel, level) {
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

                    if (crtlModel.__sui__[propName] == undefined) { throw 'This property not exists [' + propName + '][' + parentElement.innerHTML + ']'; }

                    var property = crtlModel.__sui__[propName];

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

            function fillLegendValue(element, text) {
                for (var iProp = 0; iProp < element.__sui__.properties.length; iProp++) {
                    var item = element.__sui__.properties[iProp];

                    var code = '$sui.' + item.propertyName;

                    text = text.replace(code, item.get());
                }

                element.innerHTML = text;
            }
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

        function propertyModel(crtlModel, prop) {
            var self = this;

            var el = null;
            var tbIn = 0;
            var ntTbIn = 0;

            this.propertyName = prop;

            this.setElement = function (elem) {
                el = elem;
                $sui.func.addEvent('change', el, function () {
                    if (crtlModel.onChangeProperty != null) {
                        if (crtlModel.onChangeProperty(crtlModel, self.propertyName, this.__sui__.getOldValue(), this.__sui__.getValue())) {
                            this.__sui__.setValue(this.value);
                        }
                    }
                    else {
                        this.__sui__.setValue(this.value);
                    }
                });

                $sui.func.addEvent('keydown', el, function (e) {
                    var key = e.charCode || e.keyCode || 0;

                    if (key == 9) {
                        e.preventDefault();

                        crtlModel.__sui__.$components.moveFocus(ntTbIn);
                    }
                });

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

        function propertyRefModel(crtlModel, prop) {
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

                if (lastComponent != null) {
                    $sui.func.addEvent('keydown', lastComponent, function (e) {
                        var key = e.charCode || e.keyCode || 0;

                        if (key == 9) {
                            e.preventDefault();

                            crtlModel.__sui__.$components.moveFocus(ntTbIn);
                        }
                    });
                }
            }

            this.onChangeValue = [];
        }
    }
}

$sui.components = {
    createText: function () {
        var el = document.createElement('INPUT');

        el.type = 'text';
        el.__sui__ = new Object();

        el.__sui__.objectType = function () {
            return OBJECT_TYPE.VALUE_TYPE;
        }

        el.__sui__.getValue = function () {
            return el.value;
        }

        el.__sui__.setValue = function (v) {
            el.value = v;

            triggerValueChanged();
        }

        el.__sui__.getValueNoMask = function () {
            return el.value;
        }

        el.__sui__.setValueNoMask = function (v) {
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