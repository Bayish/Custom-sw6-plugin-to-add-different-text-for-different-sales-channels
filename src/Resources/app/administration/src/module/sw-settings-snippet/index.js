import './page/sw-settings-snippet-detail'
import './page/sw-settings-snippet-variant-list'
import './page/sw-settings-snippet-variant-detail'


import deDE from './snippet/de-DE.json';
import enGB from './snippet/en-GB.json';


Shopware.Module.register('sw-settings-snippet-variant', {
    color: '#ff3d58',
    icon: 'default-shopping-paper-bag-product',
    title: 'My custom module',
    description: 'Manage your custom snippets for subshop here',

    snippets: {
        'de-DE': deDE,
        'en-GB': enGB
    },

    routes: {
        list: {
            component: 'sw-settings-snippet-variant-list',
            path: 'list/:key',
            meta: {
                parentPath: 'sw.settings.snippet.detail',
            },
        },
        detail: {
            component: 'sw-settings-snippet-variant-detail',
            path: 'detail/:id',
            meta: {
                parentPath: 'sw.settings.snippet.variant.list'
            },
        },
    },

});
