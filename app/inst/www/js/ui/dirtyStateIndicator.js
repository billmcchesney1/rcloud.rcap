define(['pubsub', 'site/pubSubTable', 'rcap/js/utils/rcapLogger'], function(PubSub, pubSubTable, RcapLogger) {

    'use strict';

    var rcapLogger = new RcapLogger();

    var DirtyStateIndicator = function() {
        this.initialise = function() {

            var isDirty = false,
                el = $('#state-modified i');

            PubSub.subscribe(pubSubTable.saved, function(msg, assetDetails) {
                // only update the dirty flag if this wasn't a theme save:
                if(!assetDetails.wasTheme) {
                    isDirty = false;
                    el.hide();  
                    PubSub.publish(pubSubTable.clearModified);   
                }
            });

            //console.log(rcapLogger);

            PubSub.subscribe(pubSubTable.gridInitComplete, function() {
                // these events incur a modified state:
                var modifyingEvents = [
                   pubSubTable.pageAdded,
                   pubSubTable.deletePageConfirm,
                   pubSubTable.duplicatePageConfirm,
                   pubSubTable.dataSourceAdded,
                   pubSubTable.deleteDataSourceConfirm,
                   pubSubTable.updateDataSource,
                   pubSubTable.updateControl,
                   pubSubTable.gridItemsChanged
                    // updating themes does not invoke the dirty flag because
                    // they are saved when the save button on the theme editor
                    // dialog is clicked
                ];

                modifyingEvents.forEach(function(e) {
                    PubSub.subscribe(e, function(msg, msgInfo) {
                        if(msg !== pubSubTable.updateControl || (msg === pubSubTable.updateControl && msgInfo.isDirty)) {
                            rcapLogger.info('dirtyStateIndicator, setting modified after receiving: pubSubTable.' + msg);
                            isDirty = true;
                            el.show();  
                            PubSub.publish(pubSubTable.setModified); 
                        }
                    });
                });
            });
        };
    };

    return DirtyStateIndicator;
});