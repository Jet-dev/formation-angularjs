(function() {
    'use strict';

    /**
     * properties.js : environement specific properties script
     * this file will NOT be included in the build of the application and NEEDS to be deployed directly on the target server
     * with the correct environement specific values
     *
     * @author lmathieu
     */
    angular.module('properties', []);

    /**
     * First : define all constants, they are available at instantiation time of the application and can be injected separatly
     */
    //environement constant : allow to swicth functionalities based on the environement
    angular.module('properties').constant('env', 'DEV');

    //debug enabled/disabled => should be false in production
    angular.module('properties').constant('isDebug', true);

    /**
     * Then, register a globalConfig objet that can be injected in order to have a single objet holding all the configuration.
     * It'll be available at runtime not at instantiation time (for this use a constant).
     */
    angular.module('properties').value('globalConfig', {
        rootUrl: 'rs',
        authServerUrl : 'http://localhost:9000/mock_auth',
        //authServerUrl : 'http://recj2ee.kiabi.fr:9999/uaa',
        //authServerUrl : 'https://auth.kiabi.fr/uaa',
        authClientId : 'NOM_APPLI',
        authScope : 'internal'
    });

})();
