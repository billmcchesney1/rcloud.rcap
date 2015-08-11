define([], function() {
	
	'use strict';

	var BaseControlProperty = Class.extend({
		init : function(options) {
			var options = options || {};

			this.type = options.type;
			this.label = options.label;
			this.helpText = options.helpText;
			this.defaultValue = options.defaultValue;

			this.value = options.value;

			this.id = 'ctrl' + this.type + Math.random().toString(16).slice(2);

		},
		render : function(childIndex) {
			return '';
		},
		// id : function() {
		// 	return id;
		// },
		getDialogValue : function() {
			return '';
		}
	});

	return BaseControlProperty;

});