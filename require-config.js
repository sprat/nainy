require.config({
    urlArgs: 'cachebust=' + (new Date()).getTime(),  // prevents caching
    baseUrl: 'lib',
    paths: {
        'app': '../app',
        'require': 'vendor/require',
        'text': 'vendor/text',
        'test': '../test',
        'images': '../images'
    },
    packages: ['app/nainwak']
});