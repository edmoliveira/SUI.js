//#Extends!important
if ([].forEach == undefined) {
    Array.prototype.forEach = function (action) {
        for (var index = 0; index < this.length; index++) {
            if (action != null) {
                action(this[index], index);
            }
        }
    }    
}

(function (win) {
    'use strict';

    var self_propertyName = '$sui';

    function factory() {
        
        var OBJECT_TYPE = {
            VALUE_TYPE: 0
            , REFERENCE_TYPE: 1
            , ARRAY_TYPE: 2
            , FORM_CHILD: 3
            , SUBMIT: 4
        };
        
        var self_instance;

        if (self_instance) {
            return self_instance;
        }

        this.ready = function (action) {
            this.func.addEvent('load', window, function () {
                if (action != null) {
                    action();
                }
            });
        }

        this.loadForm = function (selector, action) {
            var elementCollection = document.querySelectorAll('[sui-form="' + selector + '"]');

            if (elementCollection.length > 0) {
                var elementSuiForm = elementCollection[0];

                function formSuiJS(parentElement) {
                    var self = this;

                    var formModel = new Object();
                    var legendsRefArray = [];

                    this.__sui__ = new Object();

                    this.__sui__.$getprotoM = function () {
                        return formModel;
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

                    this.__sui__.$initialize = function () {
                        searchComponents(parentElement, formModel);
                        
                        legendsRefArray.forEach( function (item, index) {
                            searchPropertyRefLegend(formModel, item);
                        });

                        parentElement.removeAttribute('sui-form');
                    }

                    this.__sui__.$addLegendsRef = function (item) {
                        legendsRefArray.push(item);
                    }
                }

                Object.defineProperty(formSuiJS.prototype, "$model", {
                    get: function () {
                        return this.__sui__.$getprotoM();
                    }
                });

                var oFormSuiJS = null;

                if (action != null) {
                    oFormSuiJS = new formSuiJS(elementSuiForm);

                    oFormSuiJS.__sui__.$initialize();
                    
                    action(oFormSuiJS, oFormSuiJS.$model, oFormSuiJS.$model.$sub, oFormSuiJS.$model.$func);
                }

                function searchComponents(parentElement, formModel, parentFormModel) {
                    formModel.__sui__ = new Object();
                    formModel.__sui__.parentFormModel = parentFormModel;

                    formModel.$sub = new Object();
                    formModel.$sub.__sui__ = new Object();

                    formModel.$func = new Object();
                    formModel.$func.__sui__ = formModel.__sui__;

                    formModel.__sui__.$components = new Object();
                    formModel.__sui__.$components.items = [];
                    formModel.__sui__.$components.moveFocus = function (tabIndex) {
                        for (var index = 0; index < this.items.length; index++) {
                            if (this.items[index].tabIndex == $sui.func.textToInt(tabIndex)) {
                                this.items[index].__sui__.setFocus();
                                break;
                            }
                        }
                    }

                    var compCollection = querySelectorElements(parentElement, 'sui-comp');

                    for (var index = 0; index < compCollection.length; index++) {
                        var elementComp = compCollection[index];

                        var attr = elementComp.attributes;

                        var type = attr.getNamedItem('sui-comp');
                        var prop = attr.getNamedItem('sui-prop');

                        if (type != null && prop != null) {
                            var propName = prop.value;

                            var mask = attr.getNamedItem('sui-mask');
                            var tabIndex = attr.getNamedItem('sui-tabindex');
                            var nextTabIndex = attr.getNamedItem('sui-nexttabindex');

                            var typeValue = $sui.func.trim(type.value);

                            var funcName = findFunction($sui.components, 'create' + typeValue);

                            if (funcName == null) { throw 'This component type not exists [' + typeValue + ']'; }

                            var typeObj = $sui.components[funcName](true);

                            if (typeObj != OBJECT_TYPE.SUBMIT) {
                                if (formModel.__sui__[propName] != undefined) { throw 'This property already exists [' + propName + '][' + selector + ']'; }
                            }
                            else {
                                if (formModel.$sub.__sui__[propName] != undefined) { throw 'This button already exists [' + propName + '][' + selector + ']'; }
                            }

                            if (typeObj == OBJECT_TYPE.SUBMIT) {
                                var comp = $sui.components[funcName](null, elementComp);

                                var oPropertyButtonModel = new propertyButtonModel(formModel, propName);

                                formModel.$sub.__sui__[propName] = oPropertyButtonModel;

                                oPropertyButtonModel.setElement(comp);

                                createPropertyButton(formModel.$sub, propName);

                                if (tabIndex != null && nextTabIndex != null) {
                                    oPropertyButtonModel.setTabIndex(tabIndex.value, nextTabIndex.value);
                                    
                                    attr.removeNamedItem('sui-nexttabindex');
                                    attr.removeNamedItem('sui-tabindex');
                                }

                                formModel.__sui__.$components.items.push(comp);

                                attr.removeNamedItem('sui-prop');
                                attr.removeNamedItem('sui-comp'); 
                                
                                oPropertyButtonModel.addEvents();                             
                            }
                            else if (typeObj == OBJECT_TYPE.VALUE_TYPE) {
                                var comp = $sui.components[funcName]();

                                var oPropertyModel = new propertyModel(formModel, propName);

                                formModel.__sui__[propName] = oPropertyModel;

                                formModel.$func[propName] = new funcPropertyModel(formModel.__sui__[propName]);

                                if (mask != null) {
                                    funcName = findFunction($sui.masks, mask.value);

                                    if (funcName == null) { throw 'This mask name not exists [' + mask.value + ']'; }

                                    $sui.masks[funcName](comp);

                                    attr.removeNamedItem('sui-mask');
                                }

                                formModel.__sui__[propName].setElement(comp);
                                
                                createProperty(formModel, propName);
                                
                                if (tabIndex != null && nextTabIndex != null) {
                                    formModel.__sui__[propName].setTabIndex(tabIndex.value, nextTabIndex.value);
                                    
                                    attr.removeNamedItem('sui-nexttabindex');
                                    attr.removeNamedItem('sui-tabindex');
                                }

                                formModel.__sui__.$components.items.push(comp);

                                attr.removeNamedItem('sui-prop');
                                attr.removeNamedItem('sui-comp');

                                for (var iAttr = 0; iAttr < attr.length; iAttr++) {
                                    var elAttribute = document.createAttribute(attr[iAttr].name);
                                    elAttribute.value = attr[iAttr].value;

                                    comp.setAttributeNode(elAttribute);
                                }

                                elementComp.parentNode.replaceChild(comp, elementComp);

                                oPropertyModel.addEvents();
                            }
                            else if (typeObj == OBJECT_TYPE.REFERENCE_TYPE) {
                                var comp = $sui.components[funcName](null, elementComp);

                                formModel.__sui__[propName] = new propertyRefModel(formModel, propName);

                                formModel.$func[propName] = new funcPropertyRefModel(formModel.__sui__[propName]);

                                formModel.__sui__[propName].setElement(comp);
                                
                                createProperty(formModel, propName);

                                if (tabIndex != null && nextTabIndex != null) {
                                    formModel.__sui__[propName].setTabIndex(tabIndex.value, nextTabIndex.value);

                                    attr.removeNamedItem('sui-nexttabindex');
                                    attr.removeNamedItem('sui-tabindex');
                                }

                                formModel.__sui__.$components.items.push(comp);

                                attr.removeNamedItem('sui-prop');
                                attr.removeNamedItem('sui-comp');
                                
                                var componentChildren = searchComponents(comp, formModel[propName], formModel);

                                if (componentChildren.length > 0) {
                                    formModel.__sui__[propName].settings(componentChildren[0], componentChildren[componentChildren.length - 1]);
                                }
                            }
                            else if (typeObj == OBJECT_TYPE.ARRAY_TYPE) {
                                var comp = $sui.components[funcName]();

                                var oPropertyModel = new propertyArrayModel(formModel, propName);

                                formModel.__sui__[propName] = oPropertyModel;

                                formModel.$func[propName] = new funcPropertyArrayModel(formModel.__sui__[propName]);

                                formModel.__sui__[propName].setElement(comp, elementComp.innerHTML);

                                createProperty(formModel, propName);

                                if (tabIndex != null && nextTabIndex != null) {
                                    formModel.__sui__[propName].setTabIndex(tabIndex.value, nextTabIndex.value);

                                    attr.removeNamedItem('sui-nexttabindex');
                                    attr.removeNamedItem('sui-tabindex');
                                }

                                formModel.__sui__.$components.items.push(comp);

                                attr.removeNamedItem('sui-prop');
                                attr.removeNamedItem('sui-comp');

                                for (var iAttr = 0; iAttr < attr.length; iAttr++) {
                                    var elAttribute = document.createAttribute(attr[iAttr].name);
                                    elAttribute.value = attr[iAttr].value;

                                    comp.setAttributeNode(elAttribute);
                                }

                                elementComp.parentNode.replaceChild(comp, elementComp);
                            }
                            else if (typeObj == OBJECT_TYPE.FORM_CHILD) {
                                attr.removeNamedItem('sui-prop');
                                attr.removeNamedItem('sui-comp');     

                                var formIdTemp = '$__suiTemp__$';

                                var elAttribute = document.createAttribute('sui-form');
                                elAttribute.value = formIdTemp;

                                elementComp.setAttributeNode(elAttribute);      
                                
                                var parentFormSelf = oFormSuiJS;

                                $sui.loadForm(formIdTemp, function ($formChild) {
                                    formModel.__sui__[propName] = $formChild;
                                    formModel.__sui__[propName].$parentForm = parentFormSelf;
                                });          


                                (function(senderModel, propertyName){
                                    Object.defineProperty(senderModel, propertyName, {
                                        get: function () {
                                            return this.__sui__[propertyName];
                                        }
                                    });                                    
                                })(formModel, propName);
                                
                                elementComp.removeAttribute('sui-form');     
                            }
                        }
                    }

                    searchLegends(parentElement, formModel);

                    return formModel.__sui__.$components.items;
                }

                function searchLegends(parentElement, formModel) {
                    var legendCollection = querySelectorElements(parentElement, 'sui-value');

                    for (var index = 0; index < legendCollection.length; index++) {
                        var el = legendCollection[index];
                        var attr = legendCollection[index].attributes;

                        var value = attr.getNamedItem('sui-value').value;

                        el.__sui__ = new Object();
                        el.__sui__.properties = [];

                        searchPropertyLegend(el, formModel, value);
                        addPropertyRefLegend(el, value);

                        fillPropertyValueLegend(el, value);

                        legendCollection[index].removeAttribute('sui-value');
                    }
                }

                function querySelectorElements(elmPrt, attr){
                    var buffer = [];

                    searchQueSelecElements(elmPrt, buffer, attr);

                    return buffer;
                }

                function searchQueSelecElements(elmPrt, buffer, attr){
                    for (var index = 0; index < elmPrt.children.length; index++) {
                        var itemEl = elmPrt.children[index];

                        var suiComp = itemEl.attributes.getNamedItem(attr);
                        var isSearch = true;

                        if (suiComp != null) {
                            buffer.push(itemEl);

                            var funcName = findFunction($sui.components, 'create' + suiComp.value);

                            if (funcName != null) {
                                var typeObj = $sui.components[funcName](true);

                                isSearch = !(typeObj == OBJECT_TYPE.REFERENCE_TYPE || typeObj == OBJECT_TYPE.ARRAY_TYPE || typeObj == OBJECT_TYPE.FORM_CHILD);
                            }
                        }
                            
                        if (isSearch) {
                            searchQueSelecElements(itemEl, buffer, attr);
                        }
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

                function createPropertyButton(senderModel, propertyName) {
                    Object.defineProperty(senderModel, propertyName, {
                        get: function () {
                            return this.__sui__[propertyName].get();
                        }
                    });
                }

                function searchPropertyLegend(el, formModel, contentReg) {
                    var reg = new RegExp(/\$sui\.\w+/g);

                    var result;
                    while ((result = reg.exec(contentReg)) != null) {
                        var propName = result[0].replace('$sui.', '');

                        if (formModel.__sui__[propName] == undefined) {

                            var oPropertyReadOnlyModel = new propertyReadOnlyModel(formModel, propName);

                            formModel.__sui__[propName] = oPropertyReadOnlyModel;
                            
                            createProperty(formModel, propName);
                        }

                        var property = formModel.__sui__[propName];

                        (function (element, text, objProp) {
                            objProp.onChangeValue.push(function () {
                                fillPropertyValueLegend(element, text);
                            });
                        })(el, contentReg, property);

                        el.__sui__.properties.push({ key: '$sui.' + propName ,property: property });
                    }
                }

                function searchPropertyRefLegend(formModel, legendsRef) {
                    var properties = legendsRef.propName.split('.');

                    var parentMdl = formModel;
                    var property = null;
                    
                    for (var iProp = 0; iProp < properties.length; iProp++) {
                        var propName = properties[iProp];

                        if (parentMdl.__sui__[propName] == undefined) {
                            var oPropertyReadOnlyModel = new propertyReadOnlyModel(parentMdl, propName);

                            parentMdl.__sui__[propName] = oPropertyReadOnlyModel;
                            
                            createProperty(parentMdl, propName);

                            if (iProp < properties.length - 1) {
                                parentMdl[propName] = new Object();
                                parentMdl[propName].__sui__ = new Object();
                            }
                        }

                        property = parentMdl.__sui__[propName];

                        parentMdl = parentMdl[propName];                        
                    }
                    
                    (function (element, text, objProp) {
                        objProp.onChangeValue.push(function () {
                            fillPropertyValueLegend(element, text);
                        });
                    })(legendsRef.el, legendsRef.contentReg, property);
                    
                    legendsRef.el.__sui__.properties.push({ key: '$suiP.' + legendsRef.propName ,property: property });

                    fillPropertyValueLegend(legendsRef.el, legendsRef.contentReg);
                }

                function addPropertyRefLegend(el, contentReg) {
                    var reg = new RegExp(/\$suiP(\.\w+)+/g);

                    var result;
                    while ((result = reg.exec(contentReg)) != null) {
                        var propName = result[0].replace('$suiP.', '');

                        oFormSuiJS.__sui__.$addLegendsRef({ propName: propName, el: el, contentReg: contentReg });
                    }
                }

                function fillPropertyValueLegend(element, text) {
                    for (var iProp = 0; iProp < element.__sui__.properties.length; iProp++) {
                        var item = element.__sui__.properties[iProp];

                        var value = item.property.get();

                        text = text.replace(item.key, value == null ? '' : value);
                    }

                    element.innerHTML = text;
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

                function propertyButtonModel(formModel, prop) {
                    var self = this;
                    var obj = null;

                    var el = null;
                    var tbIn = 0;
                    var ntTbIn = 0;

                    this.propertyName = prop;

                    this.setElement = function (elem) {
                        el = elem;

                        obj = {
                            element: el
                            , on: function(event, func) {
                                $sui.func.addEvent(event, el, func);
                            }
                            , focus: function() {
                                el.focus();
                            }
                            , changeNextTabIndex: function(nextTabIndex) {
                                ntTbIn = nextTabIndex;                                
                            }
                        };
                    }
                    this.focus = function () {
                        el.__sui__.setFocus();
                    }

                    this.setTabIndex = function (tabIndex, nextTabIndex) {
                        el.__sui__.setTabIndex(tabIndex);

                        tbIn = tabIndex;
                        ntTbIn = nextTabIndex; 
                    }

                    this.get = function () {
                        return obj;
                    }

                    this.addEvents = function () {
                        $sui.func.addEvent('keydown', el, function (e) {
                            var key = e.charCode || e.keyCode || 0;

                            if (key == 9) {
                                e.preventDefault();

                                formModel.__sui__.$components.moveFocus(ntTbIn);
                            }
                        });
                    }
                }

                function propertyReadOnlyModel(formModel, prop) {
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

                    this.clear = function () {
                        propertyModel.clear();
                    }
                }

                function propertyModel(formModel, prop) {
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
                            if (oFormSuiJS.__sui__.$triggerChangePropertyArray(formModel, self.propertyName, this.__sui__.getValue(), this.__sui__.getNewValue())) {
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

                                formModel.__sui__.$components.moveFocus(ntTbIn);
                            }
                        });
                    }

                    this.focus = function () {
                        el.__sui__.setFocus();
                    }

                    this.clear = function () {
                        el.__sui__.clear();
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

                function propertyRefModel(formModel, prop) {
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

                                    formModel.__sui__.$components.moveFocus(ntTbIn);
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

                function propertyArrayModel(formModel, prop) {
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

                            searchComponents(parentElement, newModel, formModel);

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

        this.components = {
            createForm: function (isIni) {
                var type = OBJECT_TYPE.FORM_CHILD;

                if (isIni) { return type; }
            }
            , createButton: function (isIni, element) {
                var type = OBJECT_TYPE.SUBMIT;

                if (isIni) { return type; }

                var el = element;
                el.__sui__ = new Object();

			    el.__sui__.objectType = function () {
			        return type;
			    }

			    el.__sui__.setFocus = function () {
			        el.focus();
			    }

			    el.__sui__.setTabIndex = function (tabIndex) {
			        el.tabIndex = tabIndex;
			    }

			    return el;
            }
            , createText: function (isIni) {
                var type = OBJECT_TYPE.VALUE_TYPE;

                if (isIni) { return type; }

                var el = document.createElement('INPUT');
                var valueOf = null;

                el.type = 'text';
                el.__sui__ = new Object();

                el.__sui__.objectType = function () {
                    return type;
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

                el.__sui__.clear = function () {
                    el.__sui__.setValue('');
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
			, createRepeater: function (isIni) {
			    var type = OBJECT_TYPE.ARRAY_TYPE;

			    if (isIni) { return type; }

			    var el = document.createElement('DIV');
			    var valueOf = [];

			    el.__sui__ = new Object();

			    el.__sui__.objectType = function () {
			        return type;
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
			, createCustom: function (isIni, element) {
			    var type = OBJECT_TYPE.REFERENCE_TYPE;

			    if (isIni) { return type; }

			    var el = element;
                el.__sui__ = new Object();
			    el.__sui__.value = new Object();

			    el.__sui__.objectType = function () {
			        return type;
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

        this.func = {
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

        this.masks = {
            time: function (selector) {
                $sui.func.createMask(selector, '00:00:00');
            }
        }

        self_instance = this;
    }

    win.__sui_Properties__ = new Object();

    win.__sui_Properties__[self_propertyName] = new factory();

    Object.defineProperty(win, self_propertyName, {
        get: function () {
            return win.__sui_Properties__[self_propertyName];
        }
    });
})(window);