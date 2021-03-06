define(['pubsub', 'site/site', 'rcap/js/assetManager', 'rcap/js/profileManager', 'rcap/js/versionConverters/versionConverter', 'site/pubSubTable', 'rcap/js/ui/message', 'controls/factories/controlFactory', 'rcap/js/utils/rcapLogger'],
    function(PubSub, Site, AssetManager, ProfileManager, VersionConverter, pubSubTable, Message, ControlFactory, RcapLogger) {

    'use strict';

    var rcapLogger = new RcapLogger();

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    var Serializer = function() {

        this.initialise = function(startTimers) {

    	  if (_.isUndefined(startTimers)) {
            startTimers = false;
        }

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // serialize
        //
        PubSub.subscribe(pubSubTable.serialize, function(msg, data) {

            rcapLogger.info('serializer: pubSubTable.serialize');

            new AssetManager().save(data);
        });


            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //
            // deserialize
            //
            PubSub.subscribe(pubSubTable.deserialize, function(msg, msgData) {

                rcapLogger.info('serializer: pubSubTable.deserialize');

                var controls,
                    control,
                    jsonControl,
                    jsonControlProperty,
                    jsonProperty,
                    jsonStyleProperty,
                    currentPage,
                    //jsonPageProperty,
                    controlLoop,
                    propertyLoop,
                    currentDataSource,
                    currentTimer,
                    stylePropertyLoop,
                    property,
                    currProp,
                    currStyleProp,
                    data,
                    versionConverter = new VersionConverter(),
                    controlFactory = new ControlFactory(),
                    currentChild,
                    rawData = msgData.hasOwnProperty('jsonData') ? msgData.jsonData : new AssetManager().load(),
                    isDesignTime = msgData.hasOwnProperty('isDesignTime') ? msgData.isDesignTime : true;

                // create a site:
                var site = new Site({
                    isDesignTime: isDesignTime
                });

                data = rawData && rawData.length > 0 ? JSON.parse(rawData) : [];

                // update versions:
                data = versionConverter.processJson(data);

                // process site settings:
                if(data.settings) {
                    site.settings.properties.forEach(function(setting) {
                        // find the value, if any from the json:
                        var jsonSetting = _.findWhere(data.settings.properties, { uid : setting.uid });

                        if(jsonSetting) {
                            setting.value = jsonSetting.value;
                        }
                    });
                }

                // loop through each page:
                if (data.pages) {

                    // we have at least a single page, so get rid of the pages we started with and
                    // replace with what's coming in:
                    site.pages = [];

                    // and also set the current page:
                    site.currentPageID = data.pages[0].id;

                    _.each(data.pages, function(jsonPage) {

                        // this page isn't enabled, so carry on:
                        // load all pages in design time, however:
                        if (msgData.isDesignTime || (!msgData.isDesignTime && jsonPage.hasOwnProperty('isEnabled') && jsonPage.isEnabled)) {

                            currentPage = site.createPage();

                            controls = [];

                            // assign all properties, but ignore
                            // controls and pages:
                            for (var jsonPageProperty in jsonPage) {
                                if (jsonPage.hasOwnProperty(jsonPageProperty) && ['controls', 'styleProperties'].indexOf(jsonPageProperty) === -1) {
                                    currentPage[jsonPageProperty] = jsonPage[jsonPageProperty];
                                }
                            }

                            // now loop through the controls:
                            for (controlLoop = 0; controlLoop < jsonPage.controls.length; ++controlLoop) {

                                // create the appropriate control type:
                                jsonControl = jsonPage.controls[controlLoop];

                                control = controlFactory.getByKey(jsonControl.type);
                                control.isOnGrid = true;

                                // set control's properties, excluding 'controlProperties', 'childControls'
                                // and 'styleProperties' properties:
                                for (property in jsonControl) {
                                    // don't overwrite the control properties, they will be updated separately below:
                                    if (jsonControl.hasOwnProperty(property) && ['controlProperties', 'styleProperties', 'childControls'].indexOf(property) === -1) {
                                        control[property] = jsonControl[property];
                                    }
                                }

                                // loop through each specific controlProperties property:
                                for (propertyLoop = 0; propertyLoop < jsonControl.controlProperties.length; ++propertyLoop) {

                                    jsonControlProperty = jsonControl.controlProperties[propertyLoop];
                                    jsonProperty = jsonControl.controlProperties[propertyLoop];

                                    // uid, value, id:
                                    // get the property:
                                    currProp = _.findWhere(control.controlProperties, {
                                        uid: jsonControlProperty.uid
                                    });

                                    if (currProp !== undefined) {

                                        //
                                        _.extend(currProp, jsonControlProperty);

                                        // currProp.value = jsonControlProperty.value;
                                        // currProp.id = jsonControlProperty.id;
                                    }
                                }

                                // loop through each specific styleProperties property:
                                for (stylePropertyLoop = 0; stylePropertyLoop < jsonControl.styleProperties.length; ++stylePropertyLoop) {
                                    jsonStyleProperty = jsonControl.styleProperties[stylePropertyLoop];

                                    currStyleProp = _.findWhere(control.styleProperties, {
                                        uid: jsonStyleProperty.uid
                                    });

                                    if (currStyleProp !== undefined) {
                                        currStyleProp.value = jsonStyleProperty.value;
                                        currStyleProp.id = jsonStyleProperty.id;
                                    }
                                }

                                // loop through each child control:
                                if (jsonControl.hasOwnProperty('childControls')) {

                                    for (propertyLoop = 0; propertyLoop < jsonControl.childControls.length; ++propertyLoop) {

                                        jsonControlProperty = jsonControl.childControls[propertyLoop];
                                        jsonProperty = jsonControl.childControls[propertyLoop];

                                        // what type is it?
                                        currentChild = controlFactory.getChildByKey(jsonControl.childControls[propertyLoop].type);
                                        currentChild.id = jsonControl.childControls[propertyLoop].id;

                                        // now loop through the child control's control properties:
                                        for (var childControlLoop = 0; childControlLoop < jsonControl.childControls[propertyLoop].controlProperties.length;
                                            ++childControlLoop) {

                                            // get the property:
                                            currProp = _.findWhere(currentChild.controlProperties, {
                                                uid: jsonControl.childControls[propertyLoop].controlProperties[childControlLoop].uid
                                            });

                                            if (currProp !== undefined) {
                                                currProp.value = jsonControl.childControls[propertyLoop].controlProperties[childControlLoop].value;
                                                currProp.id = jsonControl.childControls[propertyLoop].controlProperties[childControlLoop].id;

                                                // call finalise method:
                                                currProp.finalise();
                                            }
                                        }

                                        if(jsonControl.childControls[propertyLoop].styleProperties) {
                                          for(stylePropertyLoop = 0; stylePropertyLoop < jsonControl.childControls[propertyLoop].styleProperties.length; ++stylePropertyLoop) {
                                            currStyleProp = _.findWhere(currentChild.styleProperties, {
                                                uid: jsonControl.childControls[propertyLoop].styleProperties[stylePropertyLoop].uid
                                            });

                                            if (currStyleProp !== undefined) {
                                                currStyleProp.value = jsonControl.childControls[propertyLoop].styleProperties[stylePropertyLoop].value;
                                                currStyleProp.id = jsonControl.childControls[propertyLoop].styleProperties[stylePropertyLoop].id;
                                            }
                                          }
                                        }

                                        control.childControls.push(currentChild);
                                    }
                                }

                                // add the control:
                                controls.push(control);
                            }

                            currentPage.controls = controls;

                            site.pages.push(currentPage);
                        }
                    });
                }

                if (data.dataSources) {
                    // load in the data sources:
                    _.each(data.dataSources, function(jsonDataSource) {

                        currentDataSource = site.createDataSource();

                        for (property in jsonDataSource) {
                            if (currentDataSource.hasOwnProperty(property)) {
                                currentDataSource[property] = jsonDataSource[property];
                            }
                        }

                        site.dataSources.push(currentDataSource);
                    });
                }

                if (data.timers) {
                    // load the timers:
                    _.each(data.timers, function(jsonTimer) {
                        currentTimer = site.createTimer();

                        for (property in jsonTimer) {
                            if (currentTimer.hasOwnProperty(property)) {
                                currentTimer[property] = jsonTimer[property];
                            }
                        }

                        if (startTimers){
                            currentTimer.start();
                        }

                        site.timers.push(currentTimer);
                    });
                }

                if(data.profile) {
                  if(data.profile.variables) {
                    site.profile.variables = data.profile.variables;
                  }
                }

                if (data.gridOptions) {
                    // load grid options:
                    site.gridOptions = data.gridOptions;
                }

                site.themeExists = msgData.themeExists;

                PubSub.publish(pubSubTable.initSite, site);
            });
        };
    };

    return Serializer;

});
