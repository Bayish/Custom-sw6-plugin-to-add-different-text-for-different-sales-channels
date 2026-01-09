/**
 * @package system-settings
 */
import template from './sw-settings-snippet-variant-list.html.twig';
import './sw-settings-snippet-variant-list.scss';
const { Component, Mixin, Data: { Criteria } } = Shopware;

Component.register('sw-settings-snippet-variant-list', {
    template,

    inject: [
        'repositoryFactory',
        'acl',
    ],

    mixins: [
        Mixin.getByName('listing'),
        Mixin.getByName('placeholder'),
        Mixin.getByName('notification'),
    ],

    data() {
        return {
            isLoading: false,
            snippets: [],
            salesChannels: [],
            snippetSets : [],
            snippetVariants: [],
            productStreams: [],
            translationKey: null,
            sortBy: 'variant',
            sortDirection: 'ASC',
            entityName: 'snippet_variant',
            showDeleteModal: false,
            showCloneModal: false,
            editing: null,
            isCreatePossible: true,

            offset: 0,
            page: 1,
            limit: 25,
        };
    },

    metaInfo() {
        return {
            title: this.$createTitle(),
        };
    },

    computed: {
        identifier() {
            return this.translationKey;
        },


        snippetVariantRepository() {
            return this.repositoryFactory.create('snippet_variant');
        },

        snippetSetRepository() {
            return this.repositoryFactory.create('snippet_set');
        },

        salesChannelRepository() {
            return this.repositoryFactory.create('sales_channel');
        },

        productStreamRepository() {
            return this.repositoryFactory.create('product_stream');
        },

        snippetSetCriteria() {
            return new Criteria();
        },

        snippetVariantCriteria() {
            const criteria = new Criteria(this.page, this.limit);
            criteria.addSorting(Criteria.sort(this.sortBy, this.sortDirection));
            criteria.addFilter(Criteria.equals('translationKey', this.translationKey));
            return criteria;
        },

        backPath() {
            if (this.translationKey) {
                return {
                    name: 'sw.settings.snippet.detail',
                    query: {
                        key: this.translationKey,
                    },
                };
            }
            return { name: 'sw.settings.snippet.index' };
        },
        columns() {
            return this.getColumns();
        },
        contextMenuEditSnippet() {
            return this.acl.can('snippetVariant.editor') ?
                this.$tc('global.default.edit') :
                this.$tc('global.default.view');
        },
    },
    created() {
        this.translationKey = this.$route.params.key;
        this.sortDirection = this.$route.query.sortDirection ? this.$route.query.sortDirection : 'ASC';
        this.sortBy = this.$route.query.sortBy ? this.$route.query.sortBy : 'variant';
        this.createdComponents();
    },

    methods: {
        createdComponents(){
            this.isLoading = true;
            const response = [];

            response.push(
                this.salesChannelRepository.search(new Criteria(), Shopware.Context.api),
                this.snippetSetRepository.search(this.snippetSetCriteria, Shopware.Context.api),
                this.productStreamRepository.search(new Criteria(), Shopware.Context.api),
                this.snippetVariantRepository.search(this.snippetVariantCriteria, Shopware.Context.api)
            )

            Promise.all(response).then((results)=>{
                this.salesChannels = results[0];
                this.snippetSets = results[1];
                this.productStreams = results[2];
                this.snippetVariants = results[3];
                this.total = results[3].total;
                this.isCreatePossible = ((this.salesChannels.length * this.snippetSets.length) + (this.salesChannels.length * this.snippetSets.length * this.productStreams.length)) > this.snippetVariants.length;
            }).finally(()=>{
                this.isLoading = false;
            });
        },
        getSalesChannel(id){
            return this.salesChannels.find(s => s.id === id).name
        },
        getSetName(id){
            return this.snippetSets.find(s => s.id === id).name
        },

        getProductStream(id){
            return this.productStreams.find(c => c.id === id) ? this.productStreams.find(c => c.id === id).name : '';
        },

        onDeleteSet(item) {
            this.showDeleteModal = item;
        },

        onConfirmDelete(item) {
            return this.snippetVariantRepository.delete(item.id)
                .then(() => {
                    this.createdComponents();
                    this.createDeleteSuccessNote();
                }).catch(() => {
                    this.createDeleteErrorNote();
                }).finally(() => {
                    this.onCloseDeleteModal();
                });
        },

        getNoPermissionsTooltip(role, showOnDisabledElements = true) {
            return {
                showDelay: 300,
                appearance: 'dark',
                showOnDisabledElements,
                disabled: this.acl.can(role),
                message: this.$tc('sw-privileges.tooltip.warning'),
            };
        },

        createDeleteSuccessNote() {
            this.createNotificationSuccess({
                message: this.$tc('sw-advanced-snippet.list.message.delete.success'),
            });
        },
        createDeleteErrorNote() {
            this.createNotificationError({
                message: this.$tc('sw-advanced-snippet.list.message.delete.error'),
            });
        },

        onCloseDeleteModal(){
            this.showDeleteModal = false;
        },

        onSortColumn(column) {
            if (this.sortDirection === 'ASC' && column.dataIndex === this.sortBy) {
                this.sortDirection = 'DESC';
            }else  {
                this.sortDirection = 'ASC';
            }
            this.updateRoute({
                sortDirection: this.sortDirection,
                sortBy: column.dataIndex,
            })
            this.createdComponents();
        },

        paginate({ page, limit }) {
            this.page = page;
            this.limit = limit;
            this.createdComponents();
        },
    }
});