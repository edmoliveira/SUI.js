﻿//#Extends!important
String.prototype.replaceLast = function (reg, replacement) {
    return this.split('').reverse().join('').replace(reg, replacement).split('').reverse().join('');
};

if (typeof( [].forEach ) == 'undefined') {
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
    var $self_sui;

    function factory() {       
        if ($self_sui) {
            return $self_sui;
        }

        $self_sui = this;

        $self_sui.__protoSui__ = new Object();

        var OBJECT_TYPE = {
            VALUE_TYPE: 0
            , REFERENCE_TYPE: 1
            , ARRAY_TYPE: 2
            , CUSTOM_TYPE: 3
            , FORM_CHILD: 4
            , SUBMIT: 5
        };

        var MESSAGE_VALIDATION = {
            ERROR: 0
            , WARNING: 1
            , INFO: 2
        };

        var AJAX_METHOD = {
            GET: 0
            , POST: 1
            , PUT: 2
            , DELETE: 3
        };

        (function () {
            var objFn = new $fn();

            var fn_propertyName = 'fn';

            $self_sui.__protoSui__[fn_propertyName] = objFn;

            Object.defineProperty($self_sui, fn_propertyName, {
                get: function () {
                    return this.__protoSui__[fn_propertyName];
                }
            });

            var components_propertyName = 'components';

            $self_sui.__protoSui__[components_propertyName] = new $components(objFn);

            Object.defineProperty($self_sui, components_propertyName, {
                get: function () {
                    return this.__protoSui__[components_propertyName];
                }
            });

            var masks_propertyName = 'masks';

            $self_sui.__protoSui__[masks_propertyName] = new $masks(objFn);

            Object.defineProperty($self_sui, masks_propertyName, {
                get: function () {
                    return this.__protoSui__[masks_propertyName];
                }
            });

            var extends_propertyName = 'extends';

            $self_sui.__protoSui__[extends_propertyName] = new $extends(objFn);

            Object.defineProperty($self_sui, extends_propertyName, {
                get: function () {
                    return this.__protoSui__[extends_propertyName];
                }
            });

            var dataTypes_propertyName = 'dataTypes';

            $self_sui.__protoSui__[dataTypes_propertyName] = new $dataTypes();

            Object.defineProperty($self_sui, dataTypes_propertyName, {
                get: function () {
                    return this.__protoSui__[dataTypes_propertyName];
                }
            });
        })();

        $self_sui.ready = function (action) {
            $self_sui.fn.addEvent('load', window, function () {
                if (action != null) {
                    action();
                }
            });
        }

        $self_sui.get = function (options) {
            ajaxExecute(AJAX_METHOD.GET, options);
        }

        $self_sui.post = function (options) {
            ajaxExecute(AJAX_METHOD.POST, options);
        }

        $self_sui.put = function (options) {
            ajaxExecute(AJAX_METHOD.PUT, options);
        }

        $self_sui.delete = function (options) {
            ajaxExecute(AJAX_METHOD.DELETE, options);
        }

        $self_sui.loadForm = function (selector, action) {
            checkClassList();

            var elementCollection = document.querySelectorAll('[sui-form="' + selector + '"]');

            if (elementCollection.length > 0) {
                var elementSuiForm = elementCollection[0];

                if (action != null) {
                    var oFormSuiJS = new formSuiJS(elementSuiForm);

                    oFormSuiJS.__protoSui__.$initialize();

                    action(oFormSuiJS, oFormSuiJS.$viewModel);
                }
            }
        }

        function formSuiJS(parentElement) {
            var self = this;

            var formModel = new Object();
            var legendsRefArray = [];
            var propertyCollection = [];

            this.onChangeProperty = null;

            this.__protoSui__ = new Object();

            this.__protoSui__.formName = null;

            this.__protoSui__.ctrl = null;

            this.__protoSui__.$getprotoM = function () {
                return formModel;
            }

            this.__protoSui__.$triggerChangePropertyArray = function (sender, propertyName, oldValue, newValue) {
                if (self.onChangeProperty != null) {
                    return self.onChangeProperty(sender, propertyName, oldValue, newValue);
                }
                else {
                    return true;
                }
            };

            this.__protoSui__.$initialize = function () {
                self.__protoSui__.formName =  parentElement.attributes.getNamedItem('sui-form').value;

                searchComponents(self, parentElement, formModel);
                        
                legendsRefArray.forEach( function (item, index) {
                    searchPropertyRefLegend(formModel, item);
                });

                parentElement.removeAttribute('sui-form');

                legendsRefArray = null;
            }

            this.__protoSui__.$addLegendsRef = function (item) {
                legendsRefArray.push(item);
            }

            this.__protoSui__.$addProperty = function (item) {
                propertyCollection.push(item);
            }

            this.validateForm = function () {
                var isOk = true;

                propertyCollection.forEach(function (item, index) {
                    item.removeValidationMessage();

                    if (isOk) {
                        isOk = item.validate();
                    }
                    else {
                        item.validate();
                    }
                });

                return isOk;
            }

            this.loadCtrl = function(controller) {
                var $base = new baseController();

                if (typeof( controller ) == 'function') {
                    self.__protoSui__.ctrl = new controller($base);
                }
                else {
                    self.__protoSui__.ctrl = new window[controller]($base);
                }                        
            }

            Object.defineProperty(self, "$viewModel", {
                get: function () {
                    return self.__protoSui__.$getprotoM();
                }
            });

            Object.defineProperty(self, 'formName', {
                get: function () {
                    return self.__protoSui__.formName;
                }
            });

            Object.defineProperty(self, '$ctrl', {
                get: function () {
                    return self.__protoSui__.ctrl;
                }
            });
        }

        function searchComponents($form, parentElement, formModel, parentFormModel) {
            formModel.__protoSui__ = new Object();
            formModel.__protoSui__.parentFormModel = parentFormModel;
            formModel.__protoSui__.$form = $form;

            formModel.__protoSui__.$sub = new Object();
            formModel.__protoSui__.$sub.__protoSui__ = formModel.__protoSui__;

            formModel.__protoSui__.$fn = new Object();
            formModel.__protoSui__.$fn.__protoSui__ = formModel.__protoSui__;

            formModel.__protoSui__.$components = new Object();
            formModel.__protoSui__.$components.items = [];
            formModel.__protoSui__.$components.moveFocus = function (tabIndex) {
                for (var index = 0; index < this.items.length; index++) {
                    if (this.items[index].tabIndex == $self_sui.fn.textToInt(tabIndex)) {
                        this.items[index].__protoSui__.setFocus();
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
                var groupName = attr.getNamedItem('sui-group');

                var groupNameValue = null;

                if (groupName != null) {
                    groupNameValue = $form.formName + '_' + groupName.value;
                }
                        
                if (type != null && prop != null ) {
                    var propName = prop.value;

                    if($self_sui.fn.trim(propName) == '') { 
                        throw 'Property name is empty [' + elementComp.tagName + '][' + selector + ']'; 
                    } 
                    else { 
                        var carP = $self_sui.fn.trim(propName).substr(0, 1);

                        if(carP == '$') { 
                            throw 'Property name cannot start with "$" [' + propName + '][' + selector + ']'; 
                        }
                        else if(carP == '_') { 
                            throw 'Property name cannot start with "_" [' + propName + '][' + selector + ']'; 
                        }
                    } 
                            
                    var mask = attr.getNamedItem('sui-mask');
                    var tabIndex = attr.getNamedItem('sui-tabindex');
                    var nextTabIndex = attr.getNamedItem('sui-nexttabindex');

                    var typeValue = $self_sui.fn.trim(type.value);

                    var fnName = findFunction($self_sui.components, 'create' + typeValue);

                    if (fnName == null) { throw 'This component type not exists [' + typeValue + ']'; }

                    var typeObj = $self_sui.components[fnName](true);

                    if (typeObj != OBJECT_TYPE.SUBMIT) {
                        if (typeof( formModel.__protoSui__[propName] ) != 'undefined') { throw 'This property already exists [' + propName + '][' + selector + ']'; }
                    }
                    else {
                        if (typeof( formModel.__protoSui__.$sub.__protoSui__[propName] ) != 'undefined') { throw 'This button already exists [' + propName + '][' + selector + ']'; }
                    }

                    if (typeObj == OBJECT_TYPE.SUBMIT) {
                        var comp = $self_sui.components[fnName](null, elementComp);

                        if(groupNameValue != null) {
                            comp.__protoSui__.setGroupName(groupNameValue);
                            attr.removeNamedItem('sui-group');
                        }

                        var oPropertyButtonModel = new propertyButtonModel(formModel, propName);

                        formModel.__protoSui__.$sub[propName] = oPropertyButtonModel;

                        oPropertyButtonModel.setElement(comp);
                                
                        createPropertyButton(formModel, propName);

                        if (tabIndex != null && nextTabIndex != null) {
                            oPropertyButtonModel.setTabIndex(tabIndex.value, nextTabIndex.value);
                                    
                            attr.removeNamedItem('sui-nexttabindex');
                            attr.removeNamedItem('sui-tabindex');
                        }

                        formModel.__protoSui__.$components.items.push(comp);

                        attr.removeNamedItem('sui-prop');
                        attr.removeNamedItem('sui-comp'); 

                        oPropertyButtonModel.addEvents();                             
                    }
                    else if (typeObj == OBJECT_TYPE.VALUE_TYPE) {
                        var comp = $self_sui.components[fnName]();

                        if(groupNameValue != null) {
                            comp.__protoSui__.setGroupName(groupNameValue);
                            attr.removeNamedItem('sui-group');
                        }

                        var oPropertyModel = new propertyModel(formModel, propName);

                        formModel.__protoSui__[propName] = oPropertyModel;
                            
                        formModel.__protoSui__.$fn[propName] = new fnPropertyModel(formModel.__protoSui__[propName]);

                        if (mask != null) {
                            fnName = findFunction($self_sui.masks, mask.value);
                            
                            if (fnName == null) { throw 'This mask name not exists [' + mask.value + ']'; }

                            $self_sui.masks[fnName](comp);

                            attr.removeNamedItem('sui-mask');
                        }

                        formModel.__protoSui__[propName].setElement(comp);
                                
                        createProperty(formModel, propName);
                        createPropertyFunc(formModel, propName);
                                
                        if (tabIndex != null && nextTabIndex != null) {
                            formModel.__protoSui__[propName].setTabIndex(tabIndex.value, nextTabIndex.value);
                                    
                            attr.removeNamedItem('sui-nexttabindex');
                            attr.removeNamedItem('sui-tabindex');
                        }

                        formModel.__protoSui__.$components.items.push(comp);

                        attr.removeNamedItem('sui-prop');
                        attr.removeNamedItem('sui-comp');

                        for (var iAttr = 0; iAttr < attr.length; iAttr++) {
                            var elAttribute = document.createAttribute(attr[iAttr].name);
                            elAttribute.value = attr[iAttr].value;

                            comp.setAttributeNode(elAttribute);
                        }

                        if(comp.__protoSui__.CanRemoveValidation)
                        {
                            oPropertyModel.removeValidationMessage = function () { };
                            oPropertyModel.validate = function () { return true };

                            elementComp.parentNode.replaceChild(comp, elementComp);                            
                        }
                        else {
                            var containerValidation = oPropertyModel.createValidation();

                            elementComp.parentNode.replaceChild(containerValidation, elementComp);                            
                        }

                        oPropertyModel.addEvents();

                        $form.__protoSui__.$addProperty(oPropertyModel);
                    }
                    else if (typeObj == OBJECT_TYPE.CUSTOM_TYPE) {
                        var comp = $self_sui.components[fnName]();

                        if(groupNameValue != null) {
                            comp.__protoSui__.setGroupName(groupNameValue);
                            attr.removeNamedItem('sui-group');
                        }

                        var oPropertyCustomModel = new propertyCustomModel(formModel, propName);

                        formModel.__protoSui__[propName] = oPropertyCustomModel;

                        formModel.__protoSui__.$fn[propName] = new fnPropertyCustomModel(formModel.__protoSui__[propName]);

                        formModel.__protoSui__[propName].setElement(comp);

                        createProperty(formModel, propName);
                        createPropertyFunc(formModel, propName);

                        if (tabIndex != null && nextTabIndex != null) {
                            formModel.__protoSui__[propName].setTabIndex(tabIndex.value, nextTabIndex.value);

                            attr.removeNamedItem('sui-nexttabindex');
                            attr.removeNamedItem('sui-tabindex');
                        }

                        formModel.__protoSui__.$components.items.push(comp);

                        attr.removeNamedItem('sui-prop');
                        attr.removeNamedItem('sui-comp');

                        for (var iAttr = 0; iAttr < attr.length; iAttr++) {
                            var elAttribute = document.createAttribute(attr[iAttr].name);
                            elAttribute.value = attr[iAttr].value;

                            comp.setAttributeNode(elAttribute);
                        }
                        
                        if(comp.__protoSui__.CanRemoveValidation)
                        {
                            oPropertyCustomModel.removeValidationMessage = function () { };
                            oPropertyCustomModel.validate = function () { return true };
                            
                            elementComp.parentNode.replaceChild(comp, elementComp);                            
                        }
                        else {
                            var containerValidation = oPropertyCustomModel.createValidation();

                            elementComp.parentNode.replaceChild(containerValidation, elementComp);                            
                        }

                        $form.__protoSui__.$addProperty(oPropertyCustomModel);
                    }
                    else if (typeObj == OBJECT_TYPE.REFERENCE_TYPE) {
                        var comp = $self_sui.components[fnName](null, elementComp);

                        if(groupNameValue != null) {
                            comp.__protoSui__.setGroupName(groupNameValue);
                            attr.removeNamedItem('sui-group');
                        }

                        formModel.__protoSui__[propName] = new propertyRefModel(formModel, propName);

                        formModel.__protoSui__.$fn[propName] = new fnPropertyRefModel(formModel.__protoSui__[propName]);

                        formModel.__protoSui__[propName].setElement(comp);
                                
                        createProperty(formModel, propName);
                        createPropertyFunc(formModel, propName);

                        if (tabIndex != null && nextTabIndex != null) {
                            formModel.__protoSui__[propName].setTabIndex(tabIndex.value, nextTabIndex.value);

                            attr.removeNamedItem('sui-nexttabindex');
                            attr.removeNamedItem('sui-tabindex');
                        }

                        formModel.__protoSui__.$components.items.push(comp);

                        attr.removeNamedItem('sui-prop');
                        attr.removeNamedItem('sui-comp');

                        var componentChildren = searchComponents($form, comp, formModel[propName], formModel);

                        if (componentChildren.length > 0) {
                            formModel.__protoSui__[propName].settings(componentChildren[0], componentChildren[componentChildren.length - 1]);
                        }
                    }
                    else if (typeObj == OBJECT_TYPE.ARRAY_TYPE) {
                        var comp = $self_sui.components[fnName]();

                        if(groupNameValue != null) {
                            comp.__protoSui__.setGroupName(groupNameValue);
                            attr.removeNamedItem('sui-group');
                        }

                        var oPropertyModel = new propertyArrayModel(formModel, propName);

                        formModel.__protoSui__[propName] = oPropertyModel;

                        formModel.__protoSui__.$fn[propName] = new fnPropertyArrayModel(formModel.__protoSui__[propName]);

                        formModel.__protoSui__[propName].setElement(comp, elementComp.innerHTML);

                        createProperty(formModel, propName);
                        createPropertyFunc(formModel, propName);

                        if (tabIndex != null && nextTabIndex != null) {
                            formModel.__protoSui__[propName].setTabIndex(tabIndex.value, nextTabIndex.value);

                            attr.removeNamedItem('sui-nexttabindex');
                            attr.removeNamedItem('sui-tabindex');
                        }

                        formModel.__protoSui__.$components.items.push(comp);

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
                        
                        if(groupNameValue != null) { 
                            attr.removeNamedItem('sui-group');
                        }

                        var formIdTemp = '$__suiTemp__$';

                        var elAttribute = document.createAttribute('sui-form');
                        elAttribute.value = formIdTemp;

                        elementComp.setAttributeNode(elAttribute);      

                        $self_sui.loadForm(formIdTemp, function ($formChild) {
                            formModel.__protoSui__[propName] = $formChild;
                            formModel.__protoSui__[propName].$parentForm = $form;
                        });          

                        (function(senderModel, propertyName){
                            Object.defineProperty(senderModel, propertyName, {
                                get: function () {
                                    return this.__protoSui__[propertyName];
                                }
                            });                                    
                        })(formModel, propName);
                                
                        elementComp.removeAttribute('sui-form');     
                    }
                }
            }

            searchLegends(parentElement, formModel);

            return formModel.__protoSui__.$components.items;
        }

        function searchLegends(parentElement, formModel) {
            var legendCollection = querySelectorElements(parentElement, 'sui-value');

            for (var index = 0; index < legendCollection.length; index++) {
                var el = legendCollection[index];
                var attr = legendCollection[index].attributes;

                var value = attr.getNamedItem('sui-value').value;

                el.__protoSui__ = new Object();
                el.__protoSui__.properties = [];

                searchPropertyLegend(el, formModel, value);
                addPropertyRefLegend(el, formModel, value);

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

                    var fnName = findFunction($self_sui.components, 'create' + suiComp.value);

                    if (fnName != null) {
                        var typeObj = $self_sui.components[fnName](true);

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
                    return this.__protoSui__[propertyName].get();
                }
				, set: function (v) {
					this.__protoSui__[propertyName].set(v);
				}
            });
        }

        function createPropertyFunc(senderModel, propertyName) {
            var propN = '$' + propertyName;

            var fGet = {
                get: function () {
                    return this.__protoSui__.$fn[propertyName];
                }                        
            }

            Object.defineProperty(senderModel, propN, fGet);
        }

        function createPropertyButton(senderModel, propertyName) {
            var propN = '_' + propertyName;

            var fGet = {
                get: function () {
                    return this.__protoSui__.$sub[propertyName].get();
                }                        
            }

            Object.defineProperty(senderModel, propN, fGet);
        }

        function searchPropertyLegend(el, formModel, contentReg) {
            var reg = new RegExp(/\$sui\.\w+/g);

            var result;
            while ((result = reg.exec(contentReg)) != null) {
                var propName = result[0].replace('$sui.', '');

                if (typeof( formModel.__protoSui__[propName] ) == 'undefined') {

                    var oPropertyReadOnlyModel = new propertyReadOnlyModel(formModel, propName);

                    formModel.__protoSui__[propName] = oPropertyReadOnlyModel;
                            
                    createProperty(formModel, propName);
                }

                var property = formModel.__protoSui__[propName];

                (function (element, text, objProp) {
                    objProp.onChangeValue.push(function () {
                        fillPropertyValueLegend(element, text);
                    });
                })(el, contentReg, property);

                el.__protoSui__.properties.push({ key: '$sui.' + propName ,property: property });
            }
        }

        function searchPropertyRefLegend(formModel, legendsRef) {
            var properties = legendsRef.propName.split('.');

            var parentMdl = formModel;
            var property = null;
                    
            for (var iProp = 0; iProp < properties.length; iProp++) {
                var propName = properties[iProp];

                if (typeof( parentMdl.__protoSui__[propName] ) == 'undefined') {
                    var oPropertyReadOnlyModel = new propertyReadOnlyModel(parentMdl, propName);

                    parentMdl.__protoSui__[propName] = oPropertyReadOnlyModel;
                            
                    createProperty(parentMdl, propName);

                    if (iProp < properties.length - 1) {
                        parentMdl[propName] = new Object();
                        parentMdl[propName].__protoSui__ = new Object();
                    }
                }

                property = parentMdl.__protoSui__[propName];

                parentMdl = parentMdl[propName];                        
            }
                    
            (function (element, text, objProp) {
                objProp.onChangeValue.push(function () {
                    fillPropertyValueLegend(element, text);
                });
            })(legendsRef.el, legendsRef.contentReg, property);
                    
            legendsRef.el.__protoSui__.properties.push({ key: '$suiP.' + legendsRef.propName ,property: property });

            fillPropertyValueLegend(legendsRef.el, legendsRef.contentReg);
        }

        function addPropertyRefLegend(el, formModel, contentReg) {
            var reg = new RegExp(/\$suiP(\.\w+)+/g);

            var result;
            while ((result = reg.exec(contentReg)) != null) {
                var propName = result[0].replace('$suiP.', '');

                formModel.__protoSui__.$form.__protoSui__.$addLegendsRef({ propName: propName, el: el, contentReg: contentReg });
            }
        }

        function fillPropertyValueLegend(element, text) {
            for (var iProp = 0; iProp < element.__protoSui__.properties.length; iProp++) {
                var item = element.__protoSui__.properties[iProp];

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

        function validationForm() {
            var messageValidation = [];

            this.addError = function(message) {
                messageValidation.push({ type: MESSAGE_VALIDATION.ERROR, msg: message });
            }

            this.addWarning = function(message) {
                messageValidation.push({ type: MESSAGE_VALIDATION.WARNING, msg: message });
            }

            this.addInfo = function(message) {
                messageValidation.push({ type: MESSAGE_VALIDATION.INFO, msg: message });
            }

            this.__protoSui__ = new Object();

            this.__protoSui__.hasMessages = function() {
                return messageValidation.length > 0;
            }

            this.__protoSui__.get = function() {
                var er = [];
                var war = [];
                var inf = [];

                messageValidation.forEach(function (item, index) {
                    if (item.type == MESSAGE_VALIDATION.ERROR) {
                        er.push(item.msg);
                    }
                    else if (item.type == MESSAGE_VALIDATION.WARNING) {
                        war.push(item.msg);
                    }
                    else if (item.type == MESSAGE_VALIDATION.INFO) {
                        inf.push(item.msg);
                    }
                });

                return { error: er.join('\n'), warning: war.join('\n'), info: inf.join('\n') };
            }
        }

        function propertyValidation(el) {
            var self = this;

            var errorLabel = null;
            var warningLabel = null;
            var infoLabel = null;

            this.checkProperty = null;

            this.validate = function() {
                if (self.checkProperty != null) {
                    var oValidationForm = new validationForm();

                    self.checkProperty(oValidationForm);
                            
                    if (oValidationForm.__protoSui__.hasMessages() > 0) {
                        var obj = oValidationForm.__protoSui__.get();

                        if (obj.error != '') {
                            self.throwError(obj.error);
                        }

                        if (obj.warning != '') {
                            self.throwWarning(obj.warning);
                        }

                        if (obj.info != '') {
                            self.throwInfo(obj.info);
                        }

                        return false;
                    }
                    else {
                        return true;
                    }
                }
                else {
                    return true;
                }
            }       
            
            this.createValidation = function() {
                errorLabel = createLabelValidation('sui-error');
                warningLabel = createLabelValidation('sui-warning');
                infoLabel = createLabelValidation('sui-info');

                var containerValidation = document.createElement('DIV');

                containerValidation.className = 'sui-cont-Val';

                containerValidation.appendChild(el);
                containerValidation.appendChild(errorLabel);
                containerValidation.appendChild(warningLabel);
                containerValidation.appendChild(infoLabel);

                return containerValidation;
            }        
            
            this.throwError = function (message) {
                this.hideWarning();
                this.hideInfoLabel();

                errorLabel.innerHTML = message;

                showLabelValidation(errorLabel);
            }

            this.throwWarning = function (message) {
                self.hideError();
                self.hideInfo();

                warningLabel.innerHTML = message;

                showLabelValidation(warningLabel);
            }

            this.throwInfo = function (message) {
                self.hideError();
                self.hideWarning();

                infoLabel.innerHTML = message;

                showLabelValidation(infoLabel);
            }

            this.hideError = function () {
                errorLabel.innerHTML = '';

                hideLabelValidation(errorLabel);
            }

            this.hideWarning = function () {
                warningLabel.innerHTML = '';

                hideLabelValidation(warningLabel);
            }

            this.hideInfo = function () {
                infoLabel.innerHTML = '';

                hideLabelValidation(infoLabel);
            }

            this.removeValidationMessage = function() {
                self.hideError();
                self.hideWarning();
                self.hideInfo();                        
            }                     
        }

        function propertyButtonModel(formModel, prop) {
            var self = this;
            var objFn = null;

            var el = null;
            var tbIn = 0;
            var ntTbIn = 0;

            this.propertyName = prop;

            this.setElement = function (elem) {
                el = elem;

                objFn = new baseFn(self);
            }

            this.getElement = function () {
                return el;
            }

            this.focus = function () {
                el.__protoSui__.setFocus();
            }

            this.setTabIndex = function (tabIndex, nextTabIndex) {
                el.__protoSui__.setTabIndex(tabIndex);

                tbIn = tabIndex;
                ntTbIn = nextTabIndex; 
            }

            this.get = function () {
                return objFn;
            }

            this.addEvents = function () {
                $self_sui.fn.addEvent('keydown', el, function (e) {
                    var key = e.charCode || e.keyCode || 0;

                    if (key == 9) {
                        e.preventDefault();

                        formModel.__protoSui__.$components.moveFocus(ntTbIn);
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

        function fnPropertyModel(propertyModel) {
            $self_sui.extends.propertyValue.call(this, propertyModel);

            this.getValueNoMask = function () {
                return propertyModel.getNoMask();
            }

            this.clear = function () {
                propertyModel.clear();
            }

            this.removeValidationMessage = function() {
                propertyModel.removeValidationMessage();
            }

            var setValidation = {
                set: function (v) {
                    propertyModel.checkProperty = v;
                }                        
            }

            Object.defineProperty(this, 'Validation', setValidation);
        }

        fnPropertyModel.prototype = new $self_sui.extends.propertyValue();
        fnPropertyModel.prototype.constructor = fnPropertyModel;

        function propertyModel(formModel, prop) {
            var self = this;

            var el = null;
            var ntTbIn = 0;

            this.propertyName = prop;

            this.setElement = function (elem) {
                propertyValidation.call(this, elem);

                el = elem;

                el.__protoSui__.valueChanged.push(function (obj) {
                    self.onChangeValue.forEach(function (item, index) {
                        item(obj);
                    });
                });
            }

            this.getElement = function() {
                return el;
            }

            this.addEvents = function () {
                var $form = formModel.__protoSui__.$form.__protoSui__;

                $self_sui.fn.addEvent('change', el, function () {
                    if ($form.$triggerChangePropertyArray(formModel, self.propertyName, this.__protoSui__.getValue(), this.__protoSui__.getNewValue())) {
                        this.__protoSui__.setValue(this.__protoSui__.getNewValue());
                    }
                    else {
                        this.__protoSui__.setValue(this.__protoSui__.getValue());
                    }
                });

                $self_sui.fn.addEvent('blur', el, function () {
                    self.validate();
                });

                $self_sui.fn.addEvent('keydown', el, function (e) {
                    var key = e.charCode || e.keyCode || 0;

                    if (key == 9) {
                        e.preventDefault();

                        formModel.__protoSui__.$components.moveFocus(ntTbIn);
                    }
                });

                $self_sui.fn.addEvent('focus', el, function () {
                    self.removeValidationMessage();
                });
            }

            this.clear = function () {
                el.__protoSui__.clear();

                this.removeValidationMessage();
            }

            this.setTabIndex = function (tabIndex, nextTabIndex) {
                el.__protoSui__.setTabIndex(tabIndex);

                ntTbIn = nextTabIndex;
            }

            this.changeNextTabIndex = function (newNextTabIndex) {
                ntTbIn = newNextTabIndex;
            }

            this.get = function () {
                return el.__protoSui__.getValue();
            }

            this.set = function (v) {
                el.__protoSui__.setValue(v);
            }

            this.getNoMask = function () {
                if( el.__protoSui__.getValueNoMask != undefined )
                {
                    return el.__protoSui__.getValueNoMask();
                }
                else {
                    return undefined;
                }
            }

            this.onChangeValue = [];
        }

        propertyModel.prototype = new propertyValidation();
        propertyModel.prototype.constructor = propertyModel;

        function fnPropertyCustomModel(propertyCustomModel) {
            $self_sui.extends.propertyCustom.call(this, propertyCustomModel);

            this.clear = function () {
                propertyCustomModel.clear();
            }

            this.removeValidationMessage = function() {
                propertyCustomModel.removeValidationMessage();
            }
        }

        fnPropertyCustomModel.prototype = new $self_sui.extends.propertyCustom();
        fnPropertyCustomModel.prototype.constructor = fnPropertyCustomModel;

        function propertyCustomModel(formModel, prop) {
            var self = this;

            var el = null;
            var tbIn = 0;
            var ntTbIn = 0;

            this.propertyName = prop;

            this.setElement = function (elem) {
                propertyValidation.call(this, elem);

                el = elem;

                if (typeof( el.__protoSui__.valueChanged ) != 'undefined' && el.__protoSui__.valueChanged != null) {
                    el.__protoSui__.valueChanged.push(function (obj) {
                        self.onChangeValue.forEach(function (item, index) {
                            item(obj);
                        });
                    });
                }
            }

            this.getElement = function() {
                return el;
            }

            this.get = function () {
                return el.__protoSui__.dataBound;
            }

            this.set = function (v) {
                throw 'This property is read only'
            }

            this.clear = function () {
                if(typeof( el.__protoSui__.clear ) != 'undefined') {
                    el.__protoSui__.clear();

                    this.removeValidationMessage();
                }
            }

            this.setTabIndex = function (tabIndex, nextTabIndex) {
                el.__protoSui__.setTabIndex(tabIndex);

                tbIn = tabIndex;
                ntTbIn = nextTabIndex;
            }

            this.changeNextTabIndex = function (newNextTabIndex) {
                ntTbIn = newNextTabIndex;
            }

            this.onChangeValue = [];
        }

        propertyCustomModel.prototype = new propertyValidation();
        propertyCustomModel.prototype.constructor = propertyCustomModel;

        function fnPropertyRefModel(propertyRefModel) {
            baseFn.call(this, propertyRefModel);
        }

        fnPropertyRefModel.prototype = new baseFn();
        fnPropertyRefModel.prototype.constructor = fnPropertyRefModel;

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

                el.__protoSui__.valueChanged.push(function (obj) {
                    self.onChangeValue.forEach(function (item, index) {
                        item(obj);
                    });
                });

                $self_sui.fn.addEvent('focus', el, function () {
                    if (firstComponent != null) {
                        firstComponent.__protoSui__.setFocus();
                    }
                });
            }

            this.getElement = function() {
                return el;
            }

            this.setTabIndex = function (tabIndex, nextTabIndex) {
                el.__protoSui__.setTabIndex(tabIndex);

                tbIn = tabIndex;
                ntTbIn = nextTabIndex;
            }

            this.changeNextTabIndex = function (newNextTabIndex) {
                ntTbIn = newNextTabIndex;
            }

            this.get = function () {
                return el.__protoSui__.getValue();
            }

            this.set = function (v) {
                el.__protoSui__.setValue(v);
            }

            this.settings = function (fComp, lComp) {
                firstComponent = fComp;
                lastComponent = lComp;

                if (lastComponent != null && lastComponent.__protoSui__.objectType() != OBJECT_TYPE.REFERENCE_TYPE) {
                    $self_sui.fn.addEvent('keydown', lastComponent, function (e) {
                        var key = e.charCode || e.keyCode || 0;

                        if (key == 9) {
                            e.preventDefault();

                            formModel.__protoSui__.$components.moveFocus(ntTbIn);
                        }
                    });
                }
            }

            this.onChangeValue = [];
        }

        function fnPropertyArrayModel(propertyArrayModel) {
            baseFn.call(this, propertyArrayModel);
        }

        fnPropertyArrayModel.prototype = new baseFn();
        fnPropertyArrayModel.prototype.constructor = fnPropertyArrayModel;

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

                el.__protoSui__.createModel = function () {
                    var newModel = new Object();

                    var parentElement = document.createElement('tt');

                    var elementDiv = elementModel.cloneNode(true);

                    parentElement.appendChild(elementDiv);

                    searchComponents(formModel.__protoSui__.$form, parentElement, newModel, formModel);

                    parentElement.removeChild(elementDiv);

                    newModel.__protoSui__.element = elementDiv;

                    return newModel;
                }

                el.__protoSui__.getElementOfModel = function (itemModel) {
                    return itemModel.__protoSui__.element;
                }

                el.__protoSui__.valueChanged.push(function (obj) {
                    self.onChangeValue.forEach(function (item, index) {
                        item(obj);
                    });
                });
            }

            this.getElement = function() {
                return el;
            }

            this.setTabIndex = function (tabIndex, nextTabIndex) {
                el.__protoSui__.setTabIndex(tabIndex);

                tbIn = tabIndex;
                ntTbIn = nextTabIndex;
            }

            this.changeNextTabIndex = function (newNextTabIndex) {
                ntTbIn = newNextTabIndex;
            }

            function arrayClass(elementArray) {
                this.createItem = function () {
                    return elementArray.__protoSui__.createItem();
                }

			    this.length = function () {
			        return elementArray.__protoSui__.length();
			    }

                this.add = function (item) {
                    elementArray.__protoSui__.add(item);
                }

                this.get = function (index) {
                    return elementArray.__protoSui__.get(index);
                }

                this.removeAt = function (index) {
                    elementArray.__protoSui__.removeAt(index);
                }

                this.remove = function (predicate) {
                    elementArray.__protoSui__.remove(predicate);
                }

                this.where = function (predicate) {
                    return elementArray.__protoSui__.where(predicate);
                }

                this.update = function (predicate, result) {
                    elementArray.__protoSui__.update(predicate, result);
                }

                Object.defineProperty(this, 'count', {
                    get: function () {
                        return elementArray.__protoSui__.length();
                    }
                });

                Object.defineProperty(this, 'dataSource', {
                    get: function () {
                        return elementArray.__protoSui__.getDataSource();
                    }
                    , set: function (v) {
                        elementArray.__protoSui__.setDataSource(v);
                    }
                });
            }

            this.onChangeValue = [];
        }

        function createLabelValidation(attrName){
            var itemNotElement = document.createElement('LABEL');

            itemNotElement.innerHTML = '';
            itemNotElement.className = 'sui-valHide-label';

            itemNotElement.setAttributeNode(document.createAttribute(attrName));  
                            
            return itemNotElement;                          
        }

        function showLabelValidation(el) {
            el.className = 'sui-valShow-label';
        }

        function hideLabelValidation(el) {
            el.className = 'sui-valHide-label';
        }

        function selectClass(el, isMultiple) {
            var options = el.__protoSui__.options;

            if (isMultiple) {
                Object.defineProperty(this, 'selectedItems', {
                    get: function () {
                        return options.getSelectedItems();
                    }
                }); 
            }
            else {
                Object.defineProperty(this, 'selectedIndex', {
                    get: function () {
                        return options.getSelectedIndex();
                    }
                    , set: function (index) {
                        options.setSelectedIndex(index);
                    }
                });

                Object.defineProperty(this, 'selectedText', {
                    get: function () {
                        if (this.selectedIndex > -1) {
                            return options.getText(this.selectedIndex);
                        }
                        else {
                            return null;
                        }
                    }
                    , set: function (v) {
                        options.setText(v);
                    }
                });

                Object.defineProperty(this, 'selectedValue', {
                    get: function () {
                        if (this.selectedIndex > -1) {
                            return options.getValue(this.selectedIndex);
                        }
                        else {
                            return null;
                        }
                    }
                    , set: function (v) {
                        options.setValue(v);
                    }
                });

                Object.defineProperty(this, 'selectedItem', {
                    get: function () {
                        if (this.selectedIndex > -1) {
                            return options.getItem(this.selectedIndex);
                        }
                        else {
                            return null;
                        }
                    }
                });               
            }

            this.add = function (text, value, tag) {
                options.add(text, value, tag);
            }

            this.get = function (index) {
                if (index < options.length()) {
                    return options.getItem(index);
                }
                else {
                    throw 'index out of range';
                }
            }

            this.removeAt = function (index) {
                if (index < options.length()) {
                    return options.removeAt(index);
                }
                else {
                    throw 'index out of range';
                }
            }

            this.remove = function (predicate) {
                if (predicate != null) {
                    for (var index = options.length() - 1; index >= 0; index--) {
                        var item = options.getItem(index);

                        if (predicate(item)) {
                            options.removeAt(index);
                        }
                    }
                }
            }

            this.where = function (predicate) {
                var array = [];

                if (predicate != null) {
                    for (var index = 0; index < options.length(); index++) {
                        var item = options.getItem(index);

                        if (predicate(item)) {
                            array.push(item);
                        }
                    }
                }
                else {
                    for (var index = 0; index < options.length(); index++) {
                        var item = options.getItem(index);

                        array.push(item);
                    }
                }

                return array;
            }

            this.update = function (predicate, result) {
                if (predicate != null) {
                    for (var index = 0; index < options.length(); index++) {
                        var item = options.getItem(index);

                        if (predicate(item)) {
                            result(item);
                        }
                    }
                }
                else {
                    for (var index = 0; index < options.length(); index++) {
                        var item = options.getItem(index);

                        result(item);
                    }
                }
            }

            Object.defineProperty(this, 'count', {
                get: function () {
                    return options.length();
                }
            });

            Object.defineProperty(this, 'dataSource', {
                get: function () {
                    return options.getDataSource();
                }
                , set: function (v) {
                    options.setDataSource(v);
                }
            });
        }

        function componentClass(classList) {
            this.add = function (args) {
                classList.add(args);        
            }

            this.exists = function (className) {
                return classList.contains(className);        
            }

            this.get = function () {
                return classList;
            }

            this.get = function (index) {
                return classList.item(index);
            }

            this.remove = function (args) {
                classList.remove(args);        
            }

            this.removeAt = function (index) {
                var iE = classList.item(index);

                if (iE != null && iE != undefined) {
                    classList.remove(iE);        
                }
            }

            this.switchClass = function (newClass, oldClass) {
                classList.remove(oldClass);
                classList.add(newClass);        
            };
        }

        function checkClassList() {
            if (typeof (document.body.classList) == 'undefined') {
                function $classList(el) {
                    this.add = function (args) {
                        var className = el.className;

                        for (var i = 0; i < arguments.length; i++) {
                            className = className.concat(' ', arguments[i]);
                        }

                        el.className = className;
                    }
                }

                Object.defineProperty(HTMLElement.prototype, 'classList', {
                    get: function () {
                        return new $classList(this);
                    }
                });
            }
        }

        function $components(fn) {
            var self = this;

            self.__protoSui__ = new Object();
            this.__protoSui__.fn = fn;

            self.createForm = function (isIni) {
                var type = OBJECT_TYPE.FORM_CHILD;

                if (isIni) { return type; }
            }

            self.createButton = function (isIni, element) {
                var type = OBJECT_TYPE.SUBMIT;

                if (isIni) { return type; }

                var el = element;
                el.__protoSui__ = new Object();

			    el.__protoSui__.setGroupName = function (name) {
			        el.name = name;
			    }

			    el.__protoSui__.objectType = function () {
			        return type;
			    }

			    el.__protoSui__.setFocus = function () {
			        el.focus();
			    }

			    el.__protoSui__.setTabIndex = function (tabIndex) {
			        el.tabIndex = tabIndex;
			    }

                el.__protoSui__.getEvents = function () {
			        return null;
			    }

                el.__protoSui__.getAttributes = function () {
			        return el.attributes;
			    }

                el.__protoSui__.getStyle = function () {
			        return el.style;
			    }

                el.__protoSui__.getClassList = function () {
			        return new componentClass(el.classList);
			    }

			    return el;
            }
            
            self.createSelect = function (isIni) {
                var type = OBJECT_TYPE.CUSTOM_TYPE;

                if (isIni) { return type; }    
                
                var el = document.createElement('SELECT');

                el.__protoSui__ = new Object();
                el.__protoSui__.options = new Object();

			    el.__protoSui__.setGroupName = function (name) {
			        el.name = name;
			    }

			    el.__protoSui__.objectType = function () {
			        return type;
			    }

			    el.__protoSui__.setFocus = function () {
			        el.focus();
			    }

			    el.__protoSui__.setTabIndex = function (tabIndex) {
			        el.tabIndex = tabIndex;
			    }

                $self_sui.fn.addEvent('change', el, function (e) {
                    triggerValueChanged();
                });

                el.__protoSui__.getEvents = function () {
			        return null;
			    }

                el.__protoSui__.getAttributes = function () {
			        return el.attributes;
			    }

                el.__protoSui__.getStyle = function () {
			        return el.style;
			    }

                el.__protoSui__.getClassList = function () {
			        return new componentClass(el.classList);
			    }

                el.__protoSui__.valueChanged = [];

                function triggerValueChanged() {
                    if (el.__protoSui__.valueChanged.length > 0) {
                        el.__protoSui__.valueChanged.forEach(function (item, index) {
                            item(el.__protoSui__.options.getItem());
                        });
                    }
                }

                el.__protoSui__.options.length = function() {
                    return el.options.length; 
                }

                el.__protoSui__.options.getSelectedIndex = function() {
                    return el.selectedIndex; 
                }

                el.__protoSui__.options.getText = function() {
                    return el.selectedOptions[el.selectedIndex].text;
                }

                el.__protoSui__.options.getValue = function() {
                    return el.selectedOptions[el.selectedIndex].value;
                }

                el.__protoSui__.options.setSelectedIndex = function(index) {
                    el.options[index].selected = true;
                }

                el.__protoSui__.options.setText = function(text) {
                    for (var i = 0; i < el.options.length; i++) {
                        if (el.options[i].text == text) {
                            el.options[i].selected = true;
                            break;
                        }
                    }
                }

                el.__protoSui__.options.setValue = function(value) {
                    for (var i = 0; i < el.options.length; i++) {
                        if (el.options[i].value == value) {
                            el.options[i].selected = true;
                            break;
                        }
                    }
                }

                el.__protoSui__.options.getItem = function() {
                    return el.selectedOptions[el.selectedIndex].__protoSui__.dataBoundItem;
                }

                el.__protoSui__.options.add = function(text, value, tag) {
                    var option = document.createElement('OPTION');

                    option.text = text;
                    option.value = value;
                    
                    option.__protoSui__ = new Object();

                    option.__protoSui__.dataBoundItem = new Object();
                    option.__protoSui__.dataBoundItem.text = text;
                    option.__protoSui__.dataBoundItem.value = value;
                    option.__protoSui__.dataBoundItem.tag = tag;

                    el.appendChild(option);
                }

                el.__protoSui__.options.getItem = function(index) {
                    return el.options[index].__protoSui__.dataBoundItem;
                }

                el.__protoSui__.options.removeAt = function(index) {
                     el.removeChild(el.options[index]);
                }

                el.__protoSui__.options.getDataSource = function() {
                    var items = [];

                    for (var i = 0; i < el.options.length; i++) {
                        items.push(el.options[i].__protoSui__.dataBoundItem);
                    }

                    return items; 
                }

                el.__protoSui__.options.setDataSource = function(list) {
                    for (var i = 0; i < list.length; i++) {
                        var text = list[i]['text'];
                        var value = list[i]['value'];
                        var tag = list[i]['tag'];

                        el.__protoSui__.options.add(text, value, tag);
                    }
                }

                el.__protoSui__.dataBound = new selectClass(el);

			    return el;                             
            }

            self.createSelectMultiple = function (isIni) {
                var type = OBJECT_TYPE.CUSTOM_TYPE;

                if (isIni) { return type; }    
                
                var el = document.createElement('SELECT');

                el.setAttribute('multiple', '');

                el.__protoSui__ = new Object();
                el.__protoSui__.options = new Object();

			    el.__protoSui__.setGroupName = function (name) {
			        el.name = name;
			    }

			    el.__protoSui__.objectType = function () {
			        return type;
			    }

			    el.__protoSui__.setFocus = function () {
			        el.focus();
			    }

			    el.__protoSui__.setTabIndex = function (tabIndex) {
			        el.tabIndex = tabIndex;
			    }
                
                el.__protoSui__.getEvents = function () {
			        return null;
			    }

                el.__protoSui__.getAttributes = function () {
			        return el.attributes;
			    }

                el.__protoSui__.getStyle = function () {
			        return el.style;
			    }

                el.__protoSui__.getClassList = function () {
			        return new componentClass(el.classList);
			    }

                el.__protoSui__.valueChanged = [];

                function triggerValueChanged() {
                    if (el.__protoSui__.valueChanged.length > 0) {
                        el.__protoSui__.valueChanged.forEach(function (item, index) {
                            item(el.__protoSui__.options.getItem());
                        });
                    }
                }

                el.__protoSui__.options.length = function() {
                    return el.options.length; 
                }

                el.__protoSui__.options.getSelectedItems = function() {
                    var items = [];

                    for (var i = 0; i < el.options.length; i++) {
                        if (el.options[i].selected) {                          
                            items.push(el.options[i].__protoSui__.dataBoundItem);
                        }
                    }

                    return items; 
                }

                el.__protoSui__.options.add = function(text, value, tag) {
                    var option = document.createElement('OPTION');

                    option.text = text;
                    option.value = value;
                    
                    option.__protoSui__ = new Object();

                    option.__protoSui__.dataBoundItem = new Object();
                    option.__protoSui__.dataBoundItem.text = text;
                    option.__protoSui__.dataBoundItem.value = value;
                    option.__protoSui__.dataBoundItem.tag = tag;

                    Object.defineProperty(option.__protoSui__.dataBoundItem, 'selected', {
                        get: function () { 
                            return option.selected; 
                        } 
                        , set: function (v) {
                            option.selected = v;
                        }
                    });

                    el.appendChild(option);
                }

                el.__protoSui__.options.getItem = function(index) {
                    return el.options[index].__protoSui__.dataBoundItem;
                }

                el.__protoSui__.options.removeAt = function(index) {
                     el.removeChild(el.options[index]);
                }

                el.__protoSui__.options.getDataSource = function() {
                    var items = [];

                    for (var i = 0; i < el.options.length; i++) {
                        items.push(el.options[i].__protoSui__.dataBoundItem);
                    }

                    return items; 
                }

                el.__protoSui__.dataBound = new selectClass(el, true);

			    return el;                             
            }

            self.createRadio = function (isIni) {
                var type = OBJECT_TYPE.CUSTOM_TYPE;

                if (isIni) { return type; }    
                
                var el = document.createElement('input');

                el.type = 'radio';
                el.__protoSui__ = new Object();

			    el.__protoSui__.setGroupName = function (name) {
			        el.name = name;
			    }

			    el.__protoSui__.objectType = function () {
			        return type;
			    }

			    el.__protoSui__.setFocus = function () {
			        el.focus();
			    }

			    el.__protoSui__.setTabIndex = function (tabIndex) {
			        el.tabIndex = tabIndex;
			    }

                el.__protoSui__.getEvents = function () {
			        return null;
			    }

                el.__protoSui__.getAttributes = function () {
			        return el.attributes;
			    }

                el.__protoSui__.getStyle = function () {
			        return el.style;
			    }

                el.__protoSui__.getClassList = function () {
			        return new componentClass(el.classList);
			    }

                el.__protoSui__.valueChanged = [];

                function triggerValueChanged() {
                    if (el.__protoSui__.valueChanged.length > 0) {
                        el.__protoSui__.valueChanged.forEach(function (item, index) {
                            item(el.checked);
                        });
                    }
                }                

                $self_sui.fn.addEvent('change', el, function (e) {
                    triggerValueChanged();
                });

                el.__protoSui__.dataBound = new checkObject(el);

                el.__protoSui__.clear = function () {
                    el.__protoSui__.dataBound.uncheck();
                }

			    return el;                             
            }

            self.createCheckBox = function (isIni) {
                var type = OBJECT_TYPE.CUSTOM_TYPE;

                if (isIni) { return type; }    
                
                var el = document.createElement('input');

                el.type = 'checkbox';
                el.__protoSui__ = new Object();

			    el.__protoSui__.setGroupName = function (name) {
			        el.name = name;
			    }

			    el.__protoSui__.objectType = function () {
			        return type;
			    }

			    el.__protoSui__.setFocus = function () {
			        el.focus();
			    }

			    el.__protoSui__.setTabIndex = function (tabIndex) {
			        el.tabIndex = tabIndex;
			    }

                el.__protoSui__.getEvents = function () {
			        return null;
			    }

                el.__protoSui__.getAttributes = function () {
			        return el.attributes;
			    }

                el.__protoSui__.getStyle = function () {
			        return el.style;
			    }

                el.__protoSui__.getClassList = function () {
			        return new componentClass(el.classList);
			    }

                el.__protoSui__.valueChanged = [];

                function triggerValueChanged() {
                    if (el.__protoSui__.valueChanged.length > 0) {
                        el.__protoSui__.valueChanged.forEach(function (item, index) {
                            item(el.checked);
                        });
                    }
                }                

                $self_sui.fn.addEvent('change', el, function (e) {
                    triggerValueChanged();
                });

                el.__protoSui__.dataBound = new checkObject(el);

                el.__protoSui__.clear = function () {
                    el.__protoSui__.dataBound.uncheck();
                }

			    return el;                             
            }

            self.createImg = function (isIni) {
                var type = OBJECT_TYPE.CUSTOM_TYPE;

                if (isIni) { return type; }    
                
                var el = document.createElement('IMG');

                el.__protoSui__ = new Object();

                el.__protoSui__.CanRemoveValidation = true;

			    el.__protoSui__.setGroupName = function (name) {
			        el.name = name;
			    }

			    el.__protoSui__.objectType = function () {
			        return type;
			    }

			    el.__protoSui__.setFocus = function () {
			        el.focus();
			    }

			    el.__protoSui__.setTabIndex = function (tabIndex) {
			        el.tabIndex = tabIndex;
			    }

                el.__protoSui__.getEvents = function () {
			        return null;
			    }

                el.__protoSui__.getAttributes = function () {
			        return el.attributes;
			    }

                el.__protoSui__.getStyle = function () {
			        return el.style;
			    }

                el.__protoSui__.getClassList = function () {
			        return new componentClass(el.classList);
			    }   

                el.__protoSui__.dataBound = new Object();

                Object.defineProperty(el.__protoSui__.dataBound, 'src', {
                    get: function () { 
                        return el.src; 
                    } 
                    , set: function(v) {
                        el.src = v;
                    }
                });

                Object.defineProperty(el.__protoSui__.dataBound, 'alt', {
                    get: function () { 
                        return el.alt; 
                    } 
                    , set: function(v) {
                        el.alt = v;
                    }
                });

			    return el;                             
            }

            self.createText = function (isIni) {
                var type = OBJECT_TYPE.VALUE_TYPE;

                if (isIni) { return type; }

                var el = document.createElement('INPUT');
                var valueOf = null;

                el.type = 'text';
                el.__protoSui__ = new Object();

			    el.__protoSui__.setGroupName = function (name) {
			        el.name = name;
			    }

                el.__protoSui__.objectType = function () {
                    return type;
                }

                el.__protoSui__.getNewValue = function () {
                    return el.value;
                }

                el.__protoSui__.getValue = function () {
                    return valueOf;
                }

                el.__protoSui__.setValue = function (v) {
                    valueOf = v;
                    el.value = v;

                    el.__protoSui__.triggerValueChanged();
                }

                el.__protoSui__.setFocus = function () {
                    el.focus();
                }

                el.__protoSui__.clear = function () {
                    el.__protoSui__.setValue('');
                }

                el.__protoSui__.setTabIndex = function (tabIndex) {
                    el.tabIndex = tabIndex;
                }

                el.__protoSui__.getEvents = function () {
			        return null;
			    }

                el.__protoSui__.getAttributes = function () {
			        return el.attributes;
			    }

                el.__protoSui__.getStyle = function () {
			        return el.style;
			    }

                el.__protoSui__.getClassList = function () {
			        return new componentClass(el.classList);
			    }

                el.__protoSui__.valueChanged = [];

                el.__protoSui__.triggerValueChanged = function () {
                    if (el.__protoSui__.valueChanged.length > 0) {
                        el.__protoSui__.valueChanged.forEach(function (item, index) {
                            item({ value: el.value });
                        });
                    }
                }

                return el;
            }
			
			self.createPassword = function (isIni) {
                var type = OBJECT_TYPE.VALUE_TYPE;

                if (isIni) { return type; }

                var el = document.createElement('INPUT');
                var valueOf = null;

                el.type = 'password';
                el.__protoSui__ = new Object();

			    el.__protoSui__.setGroupName = function (name) {
			        el.name = name;
			    }

                el.__protoSui__.objectType = function () {
                    return type;
                }

                el.__protoSui__.getNewValue = function () {
                    return el.value;
                }

                el.__protoSui__.getValue = function () {
                    return valueOf;
                }

                el.__protoSui__.setValue = function (v) {
                    valueOf = v;
                    el.value = v;

                    triggerValueChanged();
                }

                el.__protoSui__.setFocus = function () {
                    el.focus();
                }

                el.__protoSui__.clear = function () {
                    el.__protoSui__.setValue('');
                }

                el.__protoSui__.setTabIndex = function (tabIndex) {
                    el.tabIndex = tabIndex;
                }

                el.__protoSui__.getEvents = function () {
			        return null;
			    }

                el.__protoSui__.getAttributes = function () {
			        return el.attributes;
			    }

                el.__protoSui__.getStyle = function () {
			        return el.style;
			    }

                el.__protoSui__.getClassList = function () {
			        return new componentClass(el.classList);
			    }

                el.__protoSui__.valueChanged = [];

                function triggerValueChanged() {
                    if (el.__protoSui__.valueChanged.length > 0) {
                        el.__protoSui__.valueChanged.forEach(function (item, index) {
                            item({ value: el.value });
                        });
                    }
                }

                return el;
            }

			self.createTextarea = function (isIni) {
                var type = OBJECT_TYPE.VALUE_TYPE;

                if (isIni) { return type; }

                var el = document.createElement('TEXTAREA');
                var valueOf = null;

                el.__protoSui__ = new Object();

			    el.__protoSui__.setGroupName = function (name) {
			        el.name = name;
			    }

                el.__protoSui__.objectType = function () {
                    return type;
                }

                el.__protoSui__.getNewValue = function () {
                    return el.value;
                }

                el.__protoSui__.getValue = function () {
                    return valueOf;
                }

                el.__protoSui__.setValue = function (v) {
                    valueOf = v;
                    el.value = v;

                    triggerValueChanged();
                }

                el.__protoSui__.setFocus = function () {
                    el.focus();
                }

                el.__protoSui__.clear = function () {
                    el.__protoSui__.setValue('');
                }

                el.__protoSui__.setTabIndex = function (tabIndex) {
                    el.tabIndex = tabIndex;
                }

                el.__protoSui__.getEvents = function () {
			        return null;
			    }

                el.__protoSui__.getAttributes = function () {
			        return el.attributes;
			    }

                el.__protoSui__.getStyle = function () {
			        return el.style;
			    }

                el.__protoSui__.getClassList = function () {
			        return new componentClass(el.classList);
			    }

                el.__protoSui__.valueChanged = [];

                function triggerValueChanged() {
                    if (el.__protoSui__.valueChanged.length > 0) {
                        el.__protoSui__.valueChanged.forEach(function (item, index) {
                            item({ value: el.value });
                        });
                    }
                }

                return el;
            }

            self.createHidden = function (isIni) {
                var type = OBJECT_TYPE.VALUE_TYPE;

                if (isIni) { return type; }

                var el = document.createElement('INPUT');
                var valueOf = null;

                el.type = 'hidden';
                el.__protoSui__ = new Object();

			    el.__protoSui__.setGroupName = function (name) {
			        el.name = name;
			    }

                el.__protoSui__.CanRemoveValidation = true;

                el.__protoSui__.objectType = function () {
                    return type;
                }

                el.__protoSui__.getNewValue = function () {
                    return el.value;
                }

                el.__protoSui__.getValue = function () {
                    return valueOf;
                }

                el.__protoSui__.setValue = function (v) {
                    valueOf = v;
                    el.value = v;

                    triggerValueChanged();
                }

                el.__protoSui__.setFocus = function () {
                    el.focus();
                }

                el.__protoSui__.clear = function () {
                    el.__protoSui__.setValue('');
                }

                el.__protoSui__.setTabIndex = function (tabIndex) {
                    el.tabIndex = tabIndex;
                }

                el.__protoSui__.getEvents = function () {
			        return null;
			    }

                el.__protoSui__.getAttributes = function () {
			        return el.attributes;
			    }

                el.__protoSui__.getStyle = function () {
			        return el.style;
			    }

                el.__protoSui__.getClassList = function () {
			        return new componentClass(el.classList);
			    }

                el.__protoSui__.valueChanged = [];

                function triggerValueChanged() {
                    if (el.__protoSui__.valueChanged.length > 0) {
                        el.__protoSui__.valueChanged.forEach(function (item, index) {
                            item({ value: el.value });
                        });
                    }
                }

                return el;
            }

            self.createRepeater = function (isIni) {
			    var type = OBJECT_TYPE.ARRAY_TYPE;

			    if (isIni) { return type; }

			    var el = document.createElement('DIV');
			    var valueOf = [];

			    el.__protoSui__ = new Object();

			    el.__protoSui__.setGroupName = function (name) {
			        el.name = name;
			    }

			    el.__protoSui__.objectType = function () {
			        return type;
			    }

			    el.__protoSui__.toString = function () {
			        return valueOf.length + ' element' + (valueOf.length > 0 ? 's' : '');
			    }

                el.__protoSui__.getEvents = function () {
			        return null;
			    }

                el.__protoSui__.getAttributes = function () {
			        return el.attributes;
			    }

                el.__protoSui__.getStyle = function () {
			        return el.style;
			    }

                el.__protoSui__.getClassList = function () {
			        return new componentClass(el.classList);
			    }

			    el.__protoSui__.length = function () {
			        return valueOf.length;
			    }

			    el.__protoSui__.createItem = function () {
			        var viewModel = el.__protoSui__.createModel();

			        viewModel.__idm__ = new Object();
			        viewModel.__idm__.$id = '$isok$'

			        return viewModel;
			    }

			    el.__protoSui__.add = function (item) {
			        if (item.__idm__.$id != '$isok$') { throw 'Use the method createItem to create a new object'; }

			        valueOf.push(item);

			        el.appendChild(el.__protoSui__.getElementOfModel(item));

			        triggerValueChanged(item);
			    }

                el.__protoSui__.getDataSource = function () {
                    var items = [];

                    for (var i = 0; i < valueOf.length; i++) {
                        items.push(valueOf[index]);
                    }

                    return items;                     
                }

                el.__protoSui__.setDataSource = function (list) {
                    for (var index = 0; index < list.length; index++) {
                        var mdl = el.__protoSui__.createItem();

                        for (var propList in list[index]) {
                            if (typeof( mdl[propList] ) != 'undefined') {
                                mdl[propList] = list[index][propList];
                            }                            
                        }

                        el.__protoSui__.add(mdl)
                    }                    
                }

			    el.__protoSui__.get = function (index) {
                    if(index < valueOf.length) {
                        return valueOf[index];
                    }
                    else {
                        throw 'index out of range';
                    }
			    }

			    el.__protoSui__.removeAt = function (index) {
                    if(index < valueOf.length) {
			            var item = valueOf[index];

			            valueOf.splice(index, 1);

			            el.removeChild(el.__protoSui__.getElementOfModel(item));

			            triggerValueChanged(item);
                    }
                    else {
                        throw 'index out of range';
                    }
			    }

			    el.__protoSui__.remove = function (predicate) {
			        if (predicate != null) {
			            for (var index = valueOf.length - 1; index >= 0; index--) {
			                if (predicate(valueOf[index])) {
			                    var item = valueOf[index];

			                    valueOf.splice(index, 1);

			                    el.removeChild(el.__protoSui__.getElementOfModel(item));

			                    triggerValueChanged(item);
			                }
			            }
			        }
			    }

			    el.__protoSui__.where = function (predicate) {
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

			    el.__protoSui__.update = function (predicate, result) {
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

			    el.__protoSui__.setFocus = function () {
			        el.focus();
			    }

			    el.__protoSui__.setTabIndex = function (tabIndex) {
			        el.tabIndex = tabIndex;
			    }

			    el.__protoSui__.valueChanged = [];
			    el.__protoSui__.createModel = null;
			    el.__protoSui__.getElementOfModel = null;

			    function triggerValueChanged(itemValue) {
			        if (el.__protoSui__.valueChanged.length > 0) {
			            el.__protoSui__.valueChanged.forEach(function (item, index) {
			                item(itemValue);
			            });
			        }
			    }

			    return el;
			}
			
            self.createCustom = function (isIni, element) {
			    var type = OBJECT_TYPE.REFERENCE_TYPE;

			    if (isIni) { return type; }

			    var el = element;
                el.__protoSui__ = new Object();
			    el.__protoSui__.value = new Object();

			    el.__protoSui__.setGroupName = function (name) {
			        el.name = name;
			    }

			    el.__protoSui__.objectType = function () {
			        return type;
			    }

			    el.__protoSui__.getValue = function () {
			        return el.__protoSui__.value;
			    }

			    el.__protoSui__.setValue = function (v) {
			        el.__protoSui__.value = v;

			        triggerValueChanged();
			    }

			    el.__protoSui__.setFocus = function () {
			        el.focus();
			    }

			    el.__protoSui__.setTabIndex = function (tabIndex) {
			        el.tabIndex = tabIndex;
			    }

                el.__protoSui__.getEvents = function () {
			        return null;
			    }

                el.__protoSui__.getAttributes = function () {
			        return el.attributes;
			    }

                el.__protoSui__.getStyle = function () {
			        return el.style;
			    }

                el.__protoSui__.getClassList = function () {
			        return new componentClass(el.classList);
			    }

			    el.__protoSui__.valueChanged = [];

			    function triggerValueChanged() {
			        if (el.__protoSui__.valueChanged.length > 0) {
			            el.__protoSui__.valueChanged.forEach(function (item, index) {
			                item(el.__protoSui__.value);
			            });
			        }
			    }

			    return el;
			}
        }

        function $dataTypes() {
            this.getResponse = function (response, type) {
                if (type != null && typeof (this[type]) != 'undefined') {
                    return this[type](response);
                }
                else {
                    return this.text(response);
                }
            }

            this.text = function (response) {
                return response.responseText;
            }

            this.xml = function (response) {
                return response.responseXML;
            }

            this.json = function (response) {
                return JSON.parse(response.responseText);
            }

            this.html = function (response) {
                var documentXML = null;
                var content = '<sui>' + response.responseText + '</sui>';

                if (window.DOMParser) {
                    var oDOMParser = new DOMParser();

                    documentXML = parser.parseFromString(content, "text/xml");
                } else {
                    documentXML = new ActiveXObject("Microsoft.XMLDOM");
                    documentXML.async = false;
                    documentXML.loadXML(content);
                }

                return htmlDoc.documentElement;
            }
        }

        function $fn() {
            var self = this;

            self.__protoSui__ = new Object();

            self.addEvent = function (evnt, elem, fn) {
                if (elem.addEventListener) {
                    elem.addEventListener(evnt, fn, false);
                }
                else if (elem.attachEvent) {
                    elem.attachEvent("on" + evnt, fn);
                }
                else {
                    elem[evnt] = fn;
                }
            }

            self.createMask = function (el, mask, opt) {
                if (opt == null) { opt = {}; }

                if (opt.fixed) {
                    el.value = mask.replace(/0/g, ' ');
                    el.maxLength = mask.length;

                    var valueOfMask = null;

                    el.__protoSui__.getNewValue = function () {
                        return el.value;
                    }

                    el.__protoSui__.getValue = function () {
                        return valueOfMask;
                    }

                    el.__protoSui__.setValue = function (v) {
                        var elValue = setValue(v);

                        el.value = elValue;
                        valueOfMask = elValue;

                        el.__protoSui__.triggerValueChanged();
                    }

                    el.__protoSui__.getValueNoMask = function () {
                        var value = '';

                        for (var index = 0; index < mask.length; index++) {
                            if (mask[index] == '0') {
                                if (valueOfMask[index] != ' ') {
                                    value += valueOfMask[index];
                                }
                            }
                            else {
                                value += valueOfMask[index];
                            }
                        }

                        return value;
                    }

                    self.addEvent('focus', el, function (e) {
                        el.selectionStart = 0;
                        el.selectionEnd = 1;
                    });

                    self.addEvent('keydown', el, function (e) {
                        var sender = validateCode(e);

                        if (!sender.isValid) {
                            e.preventDefault();
                        }
                        else if (sender.keyCode == 46) {
                            el.value = mask.replace(/0/g, ' ');
                            
                            el.selectionStart = 0;
                            el.selectionEnd = 0;

                            e.preventDefault();
                        }
                        else if (sender.keyCode == 8) {
                            var index = el.selectionStart;

                            while (mask[index] != '0' && index > -1) {
                                index--;
                            }

                            if (index > -1) {
                                el.value = el.value.replaceAt(index, ' ');

                                el.selectionStart = index - 1;
                                el.selectionEnd = index;
                            }

                            e.preventDefault();
                        }
                        else if (!e.shiftKey && sender.keyCode == 9) {
                            var index = el.selectionStart;

                            while (mask[index] == '0' && index < mask.length) {
                                index++;
                            }

                            if (index < el.value.length) {
                                el.selectionStart = index + 1;
                                el.selectionEnd = index + 1;

                                e.preventDefault();
                            }
                        }
                        else if (e.shiftKey && sender.keyCode == 9) {
                            var index = el.selectionStart;

                            while (mask[index] == '0' && index > -1) {
                                index--;
                            }

                            if (index > -1) {
                                el.selectionStart = index - 1;
                                el.selectionEnd = index - 1;

                                e.preventDefault();
                            }
                        }
                    });

                    self.addEvent('keypress', el, function (e) {
                        var sender = validateCode(e);

                        var index = el.selectionStart;

                        while (mask[index] != '0' && index < mask.length) {
                            index++;
                        }

                        if (index < el.value.length) {
                            el.value = el.value.replaceAt(index, sender.key);

                            el.selectionStart = index + 1;
                            el.selectionEnd = index + 1;
                        }

                        e.preventDefault();
                    });

                    function setValue(elValue) {
                        var position = 0;
                        var contentMask = '';
                        var value = '';
                        
                        for (var index = 0; index < mask.length; index++) {
                            if (mask[index] != '0') {
                                var result = fillMask(mask[index], elValue, contentMask, position, value);

                                position = result.position;
                                value = result.value;

                                contentMask = '';

                                if (result.isExit) {
                                    break;
                                }
                            }
                            else {
                                contentMask += mask[index];

                                if (index == mask.length - 1) {
                                    var result = fillMask('¬', elValue, contentMask, position, value, true);

                                    position = result.position;
                                    value = result.value;
                                }
                            }
                        }

                        return value;
                    }

                    function validateCode(e) {
                        var key = e.charCode || e.keyCode || 0;

                        if ((e.shiftKey && key != 9) || e.ctrlKey) { return false; }

                        var result = (key == 46 || key == 8 || key == 9 || key == 13 || key == 37 || key == 39 || (key >= 48 && key <= 57) || (key >= 96 && key <= 105));

                        return { isValid: result, keyCode: key, key: e.key };
                    }

                    function fillMask(valueMask, valueFormat, contentMask, position, value, isLast) {
                        var isExit = false;
                        var indexOf = valueFormat.indexOf(valueMask, position);

                        if (indexOf > -1) {
                            var content = valueFormat.substr(position, indexOf - position);

                            if (content.length <= contentMask.length) {
                                while (content.length < contentMask.length) {
                                    content += ' ';
                                }
                            }
                            else {
                                content = content.substr(0, contentMask.length);
                            }

                            value += content + mask[index];

                            position = indexOf + 1;
                        }
                        else {
                            var content = valueFormat.substr(position, valueFormat.length - position);

                            if (content.length <= contentMask.length) {
                                while (content.length < contentMask.length) {
                                    content += ' ';
                                }
                            }
                            else {
                                content = content.substr(0, contentMask.length);
                            }

                            if (!isLast) {
                                value += content + mask[index];
                            } else {
                                value += content;
                            }

                            for (var posI = index + 1; posI < mask.length; posI++) {
                                value += mask[posI] == '0' ? ' ' : mask[posI];
                            }

                            isExit = true;
                        }

                        return { value: value, position: position, isExit: isExit };
                    }
                }
                else {
                    var valueOfMask = null;

                    var optional = (mask.match(/9/g) || []).length;
                    var valueLength = mask.match(/9|0/g).length;
                    var reverse = opt.reverse == true;

                    el.__protoSui__.getNewValue = function () {
                        return el.value;
                    }

                    el.__protoSui__.getValue = function () {
                        return valueOfMask;
                    }

                    el.__protoSui__.setValue = function (v) {
                        el.__protoSui__.valueOf = v.replace(/\D/g, '');

                        setMaskValue(el.__protoSui__.valueOf);

                        valueOfMask = el.value;

                        el.__protoSui__.triggerValueChanged();
                    }

                    el.__protoSui__.getValueNoMask = function () {
                        return el.__protoSui__.valueOf;
                    }

                    self.addEvent('keydown', el, function (e) {
                        validateCode(e);
                    });

                    self.addEvent('keyup', el, function (e) {
                        setMaskValue(el.__protoSui__.valueOf);
                    });

                    self.addEvent('keypress', el, function (e) {
                        var keypress = {};

                        if (validateCode(e, keypress)) {
                            if (!keypress.keyNoNumbers) {
                                el.__protoSui__.valueOf += e.key;
                            }
                        }
                    });

                    function validateCode(e, keypress) {
                        var key = e.charCode || e.keyCode || 0;

                        if (!(e.shiftKey && key != 9) && !e.ctrlKey) {
                            var keyNoNumbers = (key == 46 || key == 8 || key == 9 || key == 13);

                            if (keyNoNumbers || (key >= 48 && key <= 57) || (key >= 96 && key <= 105)) {
                                if (keypress != null) {
                                    keypress.keyNoNumbers = keyNoNumbers;

                                    return true;
                                }
                                else {
                                    if (keyNoNumbers) {
                                        if (key == 8) {
                                            el.__protoSui__.valueOf = el.__protoSui__.valueOf.substr(0, el.__protoSui__.valueOf.length - 1);
                                        }
                                        else if (key == 46) {
                                            el.__protoSui__.valueOf = '';
                                        }

                                        return true;
                                    }
                                    else if (el.__protoSui__.valueOf.length >= valueLength) {
                                        e.preventDefault();

                                        return false;
                                    }
                                }
                            }
                            else {
                                e.preventDefault();

                                return false;
                            }
                        }
                        else {
                            e.preventDefault();

                            return false;
                        }
                    }

                    function setMaskValue(valueHide) {
                        var qtdOpt = optional - (mask.match(/0|9/g).length - valueHide.length);
                        var newMask = mask;

                        if (qtdOpt > 0) {
                            var regex = /9/g;
                            var count = 0;

                            var match;
                            while ((match = regex.exec(mask)) != null) {
                                if (count < qtdOpt) {

                                    if (!reverse) {
                                        newMask = newMask.replace(/9/i, '0');
                                    }
                                    else {
                                        newMask = newMask.replaceLast(/9/i, '0');
                                    }

                                    count++;
                                }
                                else {
                                    break;
                                }
                            }

                            newMask = newMask.replace(/9/g, "Z");
                        }
                        else {
                            newMask = newMask.replace(/9/g, "Z");
                        }

                        newMask = newMask.replace(/Z\WZ|Z\W/g, "");
                        newMask = newMask.replace(/Z/g, "");

                        var value = '';

                        for (var index = 0; index < valueHide.length; index++) {
                            var i = value.length;
                            var texto = newMask.substring(i);

                            while (texto != '' && texto.substring(0, 1) != '0') {
                                i++;
                                value += texto.substr(0, 1);
                                texto = newMask.substring(i);
                            }

                            value += valueHide.substr(index, 1);
                        }

                        el.value = value;
                    }
                }
			}

			self.textToInt = function (value) {
			    var number = parseInt(value);

			    if (!isNaN(number)) {
			        return number;
			    }
			    else {
			        return 0;
			    }
			}

			self.trim = function (value) {
                if(value == null || value == undefined || typeof value != 'string') { return ''; }

			    return value.replace(/^[\s]+|[\s]+$/g, "");
			}

            self.isValidPhoneBr = function(value) {
                return true;
            }         
        }

        function $masks(fn) {
            var self = this;

            self.__protoSui__ = new Object();
            this.__protoSui__.fn = fn;

            self.time = function(selector) {
                fn.createMask(selector, '00:00:00');
            }   

            self.date = function (selector) {
                fn.createMask(selector, '00/00/0000');
            }   

            self.dateTime = function (selector) {
                fn.createMask(selector, '00/00/0000 00:00:00');
            }  

            self.moneyBr = function (selector) {
                fn.createMask(selector, '999.999.999.990,00', { reverse: true });
            }

            self.moneySymbolBr = function (selector) {
                fn.createMask(selector, 'R$ 999.999.999.990,00', { reverse: true });
            }

            self.phoneBr = function(selector) {
                fn.createMask(selector, '(00) 90000-0000');
            } 

            self.cnpj = function (selector) {
                fn.createMask(selector, '00.000.000/0000-00');
            } 

            self.cpf = function (selector) {
                fn.createMask(selector, '000.000.000-00');
            }

            self.zipCodeBr = function (selector) {
                fn.createMask(selector, '00000-000');
            }

            self.ip = function (selector) {
                fn.createMask(selector, '000.000.000.000', { fixed: true });
            }

            self.ipV6 = function (selector) {
                fn.createMask(selector, '0000:0000:0000:0000:0000:0000:0000:0000', { fixed: true });
            }
        }

        function $extends(fn) {
            var self = this;

            self.__protoSui__ = new Object();
    
            var fnPropVal = self.__protoSui__.propertyValue = function(propertyModel) {
                baseFn.call(this, propertyModel);

                this.__protoSui__ = new Object();       
                
                this.__protoSui__.fn = fn;

                Object.defineProperty(this.__protoSui__, 'property', {
                    get: function () {
                        return propertyModel.get();
                    }
                });

                this.trim = function() {
                    var obj = this.__protoSui__;
                    
                    return obj.fn.trim(obj.property);
                }

                this.isEmpty = function() {
                    var obj = this.__protoSui__;
                    
                    return obj.fn.trim(obj.property) == '';
                }

                this.isValidPhoneBr = function() {
                    var obj = this.__protoSui__;

                    return obj.fn.isValidPhoneBr(obj.property);
                } 
            }

            var fnPropCus = self.__protoSui__.propertyCustom = function(propertyModel) {
                baseFn.call(this, propertyModel);

                this.__protoSui__ = new Object();       
                
                this.__protoSui__.fn = fn;

                Object.defineProperty(this.__protoSui__, 'property', {
                    get: function () {
                        return propertyModel.get();
                    }
                });
            }

            Object.defineProperty(self, 'propertyValue', {
                get: function () {
                    return this.__protoSui__.propertyValue;
                }
            });     
            
            Object.defineProperty(self, 'propertyCustom', {
                get: function () {
                    return this.__protoSui__.propertyCustom;
                }
            });               

            fnPropVal.prototype = new baseFn();
            fnPropVal.prototype.constructor = fnPropVal;

            fnPropCus.prototype = new baseFn();
            fnPropCus.prototype.constructor = fnPropCus;
        }

        function baseFn(property) {
            this.changeNextTabIndex = function (newNextTabIndex) {
                property.changeNextTabIndex(newNextTabIndex);
            }

            this.focus = function () {
                property.getElement().__protoSui__.setFocus();
            }

            this.on = function(event, fn) {
                $self_sui.fn.addEvent(event, property.getElement(), fn);
            }

            Object.defineProperty(this, 'attributes', {
                get: function () {
                    return property.getElement().__protoSui__.getAttributes(); 
                }
            });

            Object.defineProperty(this, 'style', {
                get: function () {
                    return property.getElement().__protoSui__.getStyle();
                }
            });

            Object.defineProperty(this, 'class', {
                get: function () {
                    return property.getElement().__protoSui__.getClassList();
                }
            });

            Object.defineProperty(this, 'events', {
                get: function () {
                    return property.getElement().__protoSui__.getEvents(); 
                }
            });
        }

        function checkObject (el) {
            Object.defineProperty(this, 'isChecked', {
                get: function () { 
                    return el.checked; 
                } 
            });

            this.check = function() { 
                el.checked = true;
            }

            this.uncheck = function() { 
                el.checked = false;
            }
        }

        function ajaxExecute(method, options) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    //this.getResponseHeader("Last-Modified");
                }
            };

            var async = true; if (options.async != null && options.async != undefined && typeof (options.async) == 'boolean') { async = options.async; }

            var url = options.url;

            if (method == AJAX_METHOD.GET || method == AJAX_METHOD.DELETE) {
                if (options.data != undefined && options.data != null) {
                    url += options.data;
                }
            }

            var methodName = '';

            for (var property in AJAX_METHOD) {
                if (AJAX_METHOD[property] == method) {
                    methodName = property;
                    break;
                }
            }
            
            xhttp.open(methodName, url, options.async);

            if (options.headers != null && options.headers != undefined) {
                for (var header in options.headers) {
                    xhttp.setRequestHeader(header, options.headers[header]);
                }
            }

            xhttp.onerror = function (XMLHttpRequest, textStatus, errorThrown) {
                if (options.error != null && options.error != undefined) {
                    options.error(XMLHttpRequest, textStatus, errorThrown);
                }
            };

            xhttp.onload = function () {
                if (options.success != null && options.success != undefined) {
                    options.success(
                        $self_sui.dataTypes.getResponse(this, options.dataType)
                    );
                }
            }

            if (options.data != undefined && options.data != null && (method == AJAX_METHOD.POST || method == AJAX_METHOD.PUT)) {
                xhttp.send(options.data);
            }
            else {
                xhttp.send();
            }
        }

        function baseController() {
            var self = this;

            self.ctrl = null;

            self.get = function (options) {
                setConfig('get', options);
            }

            self.put = function (options) {
                setConfig('put', options);
            }

            self.delete = function (options) {
                setConfig('delete', options);
            }

            self.post = function (options) {
                setConfig('post', options);
            }

            function setConfig(method, options) {
                var dataModel = options.model; 
                var body = options.body;

                var params = {
                    url: options.url
                    , async: options.async
                    , headers: options.headers
                    , dataType: options.dataType
                    , data: null
                    , success: null
                    , error: null
                }

                self.ctrl[options.name] = function (opts) {
                    if (opts != null) {
                        if (dataModel != null && dataModel != undefined && opts.data != null && opts.data != undefined) {
                            var model = new Object();

                            var modelProp = new Object();
                            var modelAux = new Object();

                            for (var property in dataModel) {

                                modelAux[property] = dataModel[property];
                                modelProp[property] = new ajaxPropertyModel(modelAux, property);
                
                                (function (mdl, mdlProp, prop) {
                                    Object.defineProperty(mdl, prop, {
                                        get: function () {
                                            return mdlProp[prop];
                                        }
                                    });
                                })(model, modelProp, property);
                            }

                            opts.data(model);
                            
                            model = null;
                            modelProp = null;

                            if (body != null) {
                                params.data = body(modelAux);
                            }
                            else {
                                throw 'The "body" parameter is mandatory';
                            }
                        }
                        else {
                            params.data = null;
                        }

                        params.success = opts.success;
                        params.error = opts.error;
                    }
                    else {
                        params.data = null;
                        params.success = null;
                        params.error = null;
                    }

                    $self_sui[method](params);
                }                
            }
        }

        function ajaxPropertyModel(model, property) {
            this.get = function () {
                return model[property];
            }

            this.set = function (v) {
                model[property] = v;
            }
        }
    }
    
    win.__protoSui__ = new Object();

    win.__protoSui__[self_propertyName] = new factory();

    Object.defineProperty(win, self_propertyName, {
        get: function () {
            return this.__protoSui__[self_propertyName];
        }
    });
})(window);