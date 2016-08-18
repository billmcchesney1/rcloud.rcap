define(['rcap/js/ui/controls/properties/baseControlProperty', 
	'text!templates/colorControl.tpl', 
	'spectrum/spectrum'], function(BaseControlProperty, tpl) {
	'use strict';

	var ColorControlProperty = BaseControlProperty.extend({
		init: function(options) {
			options = options || {};
			this._super({
				type : 'color',
				label : options.label || '',
				helpText : options.helpText || '',
				defaultValue : options.defaultValue || '',
				isRequired : options.isRequired || false,
				uid : options.uid,
				className : options.className
			});

			// additional assignments go here:
			this.isHorizontal = _.isUndefined(options.isHorizontal) ? true : options.isHorizontal;
			this.showAlpha = _.isUndefined(options.showAlpha) ? false : options.showAlpha;

			// default value dependent on alpha support:
			if(this.defaultValue === '') {
				this.defaultValue = this.showAlpha ? 'rgba(255, 255, 255, 0)' : 'rgb(255, 255, 255)';
			}
		},
		render: function(childIndex) {

			var template = _.template(tpl);
            
            return template({
            	property : this,
            	childIndex : childIndex
            });

		},
		getDialogValue : function() {
			return $('#' + this.id).spectrum('get').toRgbString();
		}
	});

	return ColorControlProperty;

});