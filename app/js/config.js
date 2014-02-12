require.config({
    paths 		: {
        'jquery'        : '../bower_components/jquery/jquery.min',
        'underscore' 	: '../bower_components/underscore/underscore',
        'backbone' 		: '../bower_components/backbone/backbone-min'
    },
    shim 		: {
        'underscore': {
        	deps 		: ['jquery'],
            exports 	: '_'
        },
        'backbone' 	: {
        	deps 		: ['jquery', 'underscore'],
            exports 	: 'Backbone'
        }
    }
});