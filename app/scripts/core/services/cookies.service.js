(function () {

    angular
        .module('app.core')
        .service('cookies', cookiesService);

    cookiesService.$inject = ['userSettings', '$controller', '$templateCache', '$rootScope', '$ionicPopover'];
    function cookiesService (userSettings, $controller, $templateCache, $rootScope, $ionicPopover) {

        var template,
            popover;

        this.hide         = hide;
        this.show         = show;
        this.showIfNeeded = showIfNeeded;

        activate();

        ////////////////

        /**
         * Initialize service
         */
        function activate () {

            template = $templateCache.get('views/core/cookies.html');
        }

        /**
         * Position popover element
         * @param target
         * @param popoverElement
         */
        function positionView (target, popoverElement) {

            popoverElement.css({
                margin: 0,
                top:    0,
                left:   0,
                width:  '100%',
                height: 'auto'
            });
        }

        /**
         * Hide cookies popover
         */
        function hide () {

            if (!popover) {
                return;
            }

            popover.remove();
            popover = null;
        }

        /**
         * Show cookies popover
         */
        function show () {

            var scope;

            // already shown
            if (popover) {
                return;
            }

            scope = $rootScope.$new();

            $controller('CookiesController as vm', {
                $scope:  scope,
                cookies: {
                    hide: hide
                }
            });

            popover = $ionicPopover
                .fromTemplate(template, {
                    scope:                   scope,
                    positionView:            positionView,
                    animation:               'cookies-animation',
                    hideDelay:               300,
                    backdropClickToClose:    false,
                    hardwareBackButtonClose: false
                });

            popover
                .show(document.body);
        }

        /**
         * Show cookies popover if user has not 'accepted'
         */
        function showIfNeeded () {

            if (!userSettings.settings.cookies) {
                show();
            }
        }
    }

}());
