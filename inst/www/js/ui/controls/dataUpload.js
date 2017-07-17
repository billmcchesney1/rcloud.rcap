define(['pubsub',
  'site/pubSubTable',
  'rcap/js/ui/controls/gridControl',
  'rcap/js/ui/properties/textProperty',
  'utils/variableHandler',
  'text!controlTemplates/dataUpload.tpl'
], function (PubSub, pubSubTable, GridControl, TextProperty, variableHandler, tpl) {

  'use strict';

  var DataUploadControl = GridControl.extend({
    init: function () {
      this._super({
        type: 'dataupload',
        controlCategory: 'Dynamic',
        label: 'Data Upload',
        icon: 'cloud-upload',
        initialSize: [2, 2],
        controlProperties: [
          new TextProperty({
            uid: 'variablename',
            label: 'Variable',
            helpText: 'The variable associated with this data upload',
            isRequired: true
          }),
          new TextProperty({
            uid: 'allowedtypes',
            label: 'Allowed types',
            helpText: 'List of allowed file types, comma-separated, e.g. csv,tsv. Leave blank for "all"',
            isRequired: false
          }),
          new TextProperty({
            uid: 'buttontext',
            label: 'Button Text',
            defaultValue: '',
            helpText: 'The text that appears on the button',
            isRequired: true
          })
        ]
      });
    },
    getVariableData: function () {

    },
    render: function () {

      var template = _.template(tpl);

      return template({
        control: this
      });

    },
    initialiseViewerItems: function () {
      $('[data-controltype="dataupload"]').click(function () {
        PubSub.publish(pubSubTable.showDataUploadDialog, $(this).data());
      });
    }
  });

  return DataUploadControl;


});
