define(['rcap/js/Class'], function() {
	
	'use strict';

	var BaseProperty = Class.extend({
		init : function(options) {
			
			options = options || {};

			this.uid = options.uid;
			this.type = options.type;
			this.label = options.label;
			this.helpText = options.helpText;
			this.defaultValue = options.defaultValue;
			this.value = options.value;
			this.isRequired = options.isRequired || false;
			this.className = options.className || '';
			this.id = 'ctrl' + this.type + Math.random().toString(16).slice(2);

		},
		toJSON : function() {
			return {
				'uid': this.uid,
				'value': this.value,
				'id':  this.id
			};
		},
		render : function() {
			return '';
		},
		getDialogValue : function() {
			return '';
		},
		getValueOrDefault : function() {
			if(_.isUndefined(this.value)) {
				return this.defaultValue;
			}

			return this.value;
		},
		finalise: function() {
			
		}
	});

	return BaseProperty;

});