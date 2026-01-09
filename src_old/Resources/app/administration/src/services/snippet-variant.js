const ApiService = Shopware.Classes.ApiService;

/**
 * Gateway for the API end point "snippet"
 * @class
 * @extends ApiService
 * @package system-settings
 */
class VariantSnippetService extends ApiService {
    constructor(httpClient, loginService, apiEndpoint = 'snippet') {
        super(httpClient, loginService, apiEndpoint);
        this.name = 'snippetVariant';
    }
}
export default VariantSnippetService;
