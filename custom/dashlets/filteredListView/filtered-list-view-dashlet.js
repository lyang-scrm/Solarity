/*
 * Your installation or use of this SugarCRM file is subject to the applicable
 * terms available at
 * http://support.sugarcrm.com/Resources/Master_Subscription_Agreements/.
 * If you do not agree to all of the applicable terms or do not have the
 * authority to bind the entity as an authorized representative, then do not
 * install or use this SugarCRM file.
 *
 * Copyright (C) SugarCRM Inc. All rights reserved.
 */

var app = SUGAR.App;
var customization = require('%app.core%/customization');
var ListContainerDashletView = require('%app.dashlets%/list-container-dashlet-view');

var deviceFeatures = require('%app.core%/device');

var dashlet = customization.declareDashlet({
    title: 'Today\'s appointments',
    parent: ListContainerDashletView,
    iconKey: 'dashlets.dashablelist',
},
{
    initViews: function(views, options) {    // overriding initViews method to add own filter to options object.
        // jscs:disable requireCamelCaseOrUpperCaseIdentifiers

        options.listParams = {  // listParam property holds configuration of child list view including filter.
            filter: {
                date_start: {
                    $dateRange: 'today'
                },
            }
        };

        // jscs:enable requireCamelCaseOrUpperCaseIdentifiers

        this._super(views, options);
    },

    loadViewsData: function(loadParams) {
        this.getViews()[0].collection.orderBy = {
            field: 'date_start',
            direction: 'ASC'
        };
        this._super(loadParams);
    },
});

customization.registerComponent(dashlet, { type: 'filtered-dashable-list' });

var DashboardLayout = require('%app.layouts%/dashboard-layout');

customization.declareLayout({
    parent: DashboardLayout,
    header: {
        buttons: {
            save: true
        }
    },
    register: {}
}, {
    initialize: function(options) {

        this._super(options);
    },

    getHeaderConfig: function() {
        var cfg = this._super();

        cfg.save = true;
        cfg.saveLabel = 'Route';

        return cfg;
    },

    handleComponentAction: function(actionInitiator, action) {
        if (action.name === 'header:save:click') {
            this._doSmth();
        } else {
            this._super(actionInitiator, action);
        }
    },

    _doSmth: function() {

        var dashboard = this.getComponent('dashboard');
        var cards = dashboard.getViews()[0];
        var list = cards.getViews()[0];
        var models = list.collection.models;
        var currentAddress = "10051 North Wolfe, Cupertino, CA 95014";
        var url = "https://www.google.com/maps/dir/" + currentAddress;

        for(var i=0; i<models.length; i++) {
            var newAddress = models[i].get('location');
            url = url + "/" + newAddress;
        }
        deviceFeatures.openWebPage(url);
    }

}
);
