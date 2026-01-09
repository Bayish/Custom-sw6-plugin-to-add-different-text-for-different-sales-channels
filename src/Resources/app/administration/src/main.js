import './module/sw-settings-snippet'

import VariantSnippetService from "./services/snippet-variant";

const { Application } = Shopware;

Application.addServiceProvider('snippetVariant', (container) => {
    const initContainer = Application.getContainer('init');
    return new VariantSnippetService(initContainer.httpClient, container.loginService);
});


