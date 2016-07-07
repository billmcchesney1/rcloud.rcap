define(['rcap/js/ui/controls/gridControl',
    'rcap/js/ui/controls/properties/autocompleteControlProperty',
    'text!controlTemplates/rPrint.tpl',
    'text!controlTemplates/rPrint-design.tpl'
], function(GridControl, AutocompleteControlProperty, tpl, dtpl) {

    'use strict';

    var RPlotControl = GridControl.extend({
        init: function() {
            this._super({
                type: 'rprint',
                controlCategory: 'Dynamic',
                label: 'R Print',
                icon: 'print',
                initialSize: [4, 4],
                controlProperties: [
                    new AutocompleteControlProperty({
                        uid: 'code',
                        label: 'R Function',
                        helpText: 'R Function for this control.',
                        isRequired: true
                    })
                ]
            });
        },
        render: function(options) {

            options = options || {};
            var isDesignTime = options.isDesignTime || false;
            var designTimeDescription = '';

            if(isDesignTime && this.controlProperties[0].value) {
                designTimeDescription += 'Function: ' + this.controlProperties[0].value;
            }

            var template = isDesignTime ? _.template(dtpl) : _.template(tpl);

            return template({
                control: this,
                designTimeDescription : designTimeDescription
            });

        },
        initialiseViewerItems: function() {
 
        }
    });

    return RPlotControl;


});
