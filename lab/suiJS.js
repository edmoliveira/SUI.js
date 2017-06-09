'use strict';

function $sui() {
    if(!(this instanceof $sui)) return $sui();

    return this; 
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
}

$sui.ready = function (action) {
    this.func.addEvent('load', window, function () {
        if (action != null) {
            action();
        }
    });
}

$sui.masks = {
    time: function (selector) {
        $sui.func.createMask(selector, '00:00:00');
    }
}

$sui.components = {
    createText: function () {
        var el = document.createElement('INPUT');

        el.type = 'text';
        el.__sui__ = new Object();

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
}

$sui.form = function (selector, action) {
    var elementCollection = document.querySelectorAll('[sui-form="' + selector + '"]');

    if (elementCollection.length > 0) {
        var element = elementCollection[0];

        function formSuiJS() {
            var modelForm = null;

            this.___getprotoM = function () {
                return modelForm;
            }

            this.___setprotoM = function (m) {
                modelForm = createModelForm(m);

                searchComponents(modelForm);

                searchLegends(modelForm);
            }

            this.checkForm = null;

        }

        Object.defineProperty(formSuiJS.prototype, "Model", {
            get: function () {
                return this.___getprotoM();
            }
            , set: function (v) {
                return this.___setprotoM(v);
            }
        });

        if (action != null) {
            action(new formSuiJS());
        }

        function propertyModel(model, prop) {
            var self = this;

            var el = null;

            this.propertyName = prop;

            this.setElement = function (elem) {
                el = elem;
                $sui.func.addEvent('change', el, function () {
                    if (model.onChangeProperty != null) {
                        if (model.onChangeProperty(model, self.propertyName, this.__sui__.getOldValue(), this.__sui__.getValue())) {
                            this.__sui__.setValue(this.value);
                        }
                    }
                    else {
                        this.__sui__.setValue(this.value);
                    }
                });

                el.__sui__.valueChanged.push(function (obj) {
                    self.onChangeValue.forEach(function (item, index) {
                        item(obj);
                    });
                });
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

        function searchLegends(model) {
            var legendCollection = element.querySelectorAll('[sui-value]'); //

            for (var index = 0; index < legendCollection.length; index++) {
                var el = legendCollection[index];
                var attr = legendCollection[index].attributes;

                var value = attr.getNamedItem('sui-value').value;

                el.__sui__ = new Object();
                el.__sui__.properties = [];

                var reg = new RegExp(/\$sui\.\w+/g);

                var result;
                while ((result = reg.exec(value)) != null) {
                    var propName = result[0].replace('$sui.', '');

                    if (model.__sui__[propName] == undefined) { throw 'This property not exists [' + propName + '][' + el.innerHTML + ']'; }

                    var property = model.__sui__[propName];

                    (function (element, text, objProp) {
                        objProp.onChangeValue.push(function () {
                            fillLegendValue(element, text);
                        });
                    }
                    )(el, value, property);

                    el.__sui__.properties.push(property);
                }
                
                fillLegendValue(el, value);

                legendCollection[index].removeAttribute('sui-value');
            }

            function fillLegendValue(element, text) {
                for (var iProp = 0; iProp < element.__sui__.properties.length; iProp++) {
                    var item = element.__sui__.properties[iProp];

                    var code = '$sui.' + item.propertyName;

                    text = text.replace(code, item.get());
                }

                element.innerHTML = text;
            }

            function legendPropModel(el, text, objProp) {

            }
        }

        function createModelForm(model) {
            var newModel = new Object();

            newModel.__sui__ = new Object();
            newModel.noMask = new Object();

            for (var prop in model) {
                var value = model[prop];

                if (typeof value != 'array') {
                    newModel.__sui__[prop] = new propertyModel(newModel, prop);
                }
            }

            return newModel;
        }

        function searchComponents(model) {
            if (element.children.length > 0) {
                for (var index = 0; index < element.children.length; index++) {
                    if (element.children[index].tagName.toLowerCase() == 'sui-comp') {
                        var attr = element.children[index].attributes;

                        var type = attr.getNamedItem('type');

                        if (type != null) {
                            var prop = attr.getNamedItem('prop');
                            var mask = attr.getNamedItem('mask');
                            var tabIndex = attr.getNamedItem('tabIndex');
                            var nextTabIndex = attr.getNamedItem('nextTabIndex');

                            var funcName = findFunction($sui.components, 'create' + type.value);

                            if (funcName == null) { throw 'This component type not exists [' + type.value + ']'; }

                            var comp = $sui.components[funcName]();

                            if (mask != null) {
                                funcName = findFunction($sui.masks, mask.value);

                                if (funcName == null) { throw 'This mask name not exists [' + mask.value + ']'; }

                                $sui.masks[funcName](comp);

                                attr.removeNamedItem('mask');
                            }

                            if (prop != null) {

                                var propName = prop.value;

                                var objModel = model.__sui__;

                                if (objModel[propName] == undefined) { throw 'This property not exists [' + propName + ']'; }

                                objModel[prop.value].setElement(comp);

                                (function (senderModel, propertyName) {
                                    Object.defineProperty(senderModel, propertyName, {
                                        get: function () {
                                            return this.__sui__[propertyName].get();
                                        }
                                        , set: function (v) {
                                            return this.__sui__[propertyName].set(v);
                                        }
                                    });

                                    Object.defineProperty(senderModel.noMask, propertyName, {
                                        get: function () {
                                            return this.__sui__[propertyName].get();
                                        }
                                        , set: function (v) {
                                            return this.__sui__[propertyName].set(v);
                                        }
                                    });
                                })(model, propName);

                                attr.removeNamedItem('prop');
                            }

                            if (tabIndex != null && nextTabIndex != null) {


                                attr.removeNamedItem('nextTabIndex');
                                attr.removeNamedItem('tabIndex');
                            }

                            attr.removeNamedItem('type');

                            for (var iAttr = 0; iAttr < attr.length; iAttr++) {
                                var elAttribute = document.createAttribute(attr[iAttr].name);
                                elAttribute.value = attr[iAttr].value;

                                comp.setAttributeNode(elAttribute);
                            }

                            element.children[index].parentNode.replaceChild(comp, element.children[index]);
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
        }
    }
}



