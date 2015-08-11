define(['text!rcap/partials/main.htm', 
    'rcap/js/ui/dialog-manager', 
    'rcap/js/ui/grid-manager',
    'rcap/js/ui/menu-manager',
    'rcap/js/ui/controls/baseControl'
], function(mainPartial, dialogManager, gridManager, menuManager, BaseControl) {

    'use strict';

    return {
        initialise: function() {

            //////////////////////////////////////////////////////////////////////////////////////////////////////////////
            var bc = new BaseControl();
            console.log(bc);
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////

            if ($('body').find('#rcap-designer').length === 0) {

                // append if necessary:
                $('#rcloud-navbar-menu').append('<li class="rcap"><a href="#">Close</a></li>');

                $('body').append(mainPartial);

                $('#rcloud-navbar-menu li.rcap').click(function() {
                    $('.container, #rcloud-navbar-main, #rcloud-navbar-main, #rcloud-navbar-menu li:not(.rcap)').show();
                    $(this).hide();
                });

                // menu manager:
                menuManager.initialise();

                // initialise the dialog manager:
                dialogManager.initialise();

                // grid:
                gridManager.initialise();
            }

            $('.container, #rcloud-navbar-main, #rcloud-navbar-main, #rcloud-navbar-menu li:not(.rcap)').hide();

            // it may have been hidden from a previous 'close':
            $('#rcloud-navbar-menu li.rcap').show();
        }
    };
});
