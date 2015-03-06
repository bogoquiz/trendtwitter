'use strict';

//socket factory that provides the socket service
angular.module('core').factory('Socket', ['socketFactory',
    function(socketFactory) {
        return socketFactory({
            prefix: '',
            //ioSocket: io.connect('http://localhost:3000')
            ioSocket: io.connect('https://shielded-journey-5640.herokuapp.com')
        });
    }
]);