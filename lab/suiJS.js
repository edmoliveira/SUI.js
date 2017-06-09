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
    , textToInt: function (value) {
        var number = parseInt(value);

        if (!isNaN(number)) {
            return number;
        }
        else {
            return 0;
        }
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

$sui.loadControl = function (selector, model, action) {
    if (model == null) { throw 'Model is null [form(selector, model, action)]'; }

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

        var oFormSuiJS = null;

        if (action != null) {
            oFormSuiJS = new formSuiJS();
            oFormSuiJS.Model = model;

            action(oFormSuiJS, oFormSuiJS.Model, oFormSuiJS.Model.$func);
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
                el.focus();
            }

            this.setTabIndex = function (tabIndex, nextTabIndex) {
                el.tabIndex = tabIndex;

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

        function searchLegends(crtlModel) {
            var legendCollection = element.querySelectorAll('[sui-value]');

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

                    if (crtlModel.__sui__[propName] == undefined) { throw 'This property not exists [' + propName + '][' + el.innerHTML + ']'; }

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
        }

        function createModelForm(crtlModel) {
            var newModel = new Object();

            newModel.__sui__ = new Object();

            newModel.$func = new Object();
            newModel.$func.__sui__ = newModel.__sui__;

            newModel.__sui__.$components = new Object();
            newModel.__sui__.$components.items = [];
            newModel.__sui__.$components.moveFocus = function (tabIndex) {
                for (var index = 0; index < this.items.length; index++) {
                    if (this.items[index].tabIndex == $sui.func.textToInt(tabIndex)) {
                        this.items[index].focus();
                        break;
                    }
                }
            }

            for (var prop in crtlModel) {
                var value = crtlModel[prop];

                if (typeof value != 'array') {
                    newModel.__sui__[prop] = new propertyModel(newModel, prop);
                }
            }

            return newModel;
        }

        function searchComponents(crtlModel) {
            var compCollection = element.querySelectorAll('[sui-comp]');

            for (var index = 0; index < compCollection.length; index++) {
                var elementComp = compCollection[index];

                var attr = elementComp.attributes;

                var type = attr.getNamedItem('sui-comp');

                if (type != null) {
                    var prop = attr.getNamedItem('prop');
                    var mask = attr.getNamedItem('mask');
                    var tabIndex = attr.getNamedItem('tabIndex');
                    var nextTabIndex = attr.getNamedItem('nextTabIndex');

                    var funcName = findFunction($sui.components, 'create' + type.value);

                    if (funcName == null) { throw 'This component type not exists [' + type.value + ']'; }

                    var comp = $sui.components[funcName]();

                    crtlModel.__sui__.$components.items.push(comp);

                    if (mask != null) {
                        funcName = findFunction($sui.masks, mask.value);

                        if (funcName == null) { throw 'This mask name not exists [' + mask.value + ']'; }

                        $sui.masks[funcName](comp);

                        attr.removeNamedItem('mask');
                    }

                    if (prop != null) {

                        var propName = prop.value;

                        var objModel = crtlModel.__sui__;

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
                        })(crtlModel, propName);

                        crtlModel.$func[propName] = new funcPropertyModel(objModel[prop.value]);

                        if (tabIndex != null && nextTabIndex != null) {
                            objModel[propName].setTabIndex(tabIndex.value, nextTabIndex.value);

                            attr.removeNamedItem('nextTabIndex');
                            attr.removeNamedItem('tabIndex');
                        }

                        attr.removeNamedItem('prop');
                    }

                    attr.removeNamedItem('sui-comp');

                    for (var iAttr = 0; iAttr < attr.length; iAttr++) {
                        var elAttribute = document.createAttribute(attr[iAttr].name);
                        elAttribute.value = attr[iAttr].value;

                        comp.setAttributeNode(elAttribute);
                    }

                    elementComp.parentNode.replaceChild(comp, elementComp);
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



