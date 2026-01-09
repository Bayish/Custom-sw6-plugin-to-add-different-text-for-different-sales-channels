/**
 * @package system-settings
 */
import template from './sw-settings-snippet-variant-detail.html.twig';
import './sw-settings-snippet-variant-detail.scss';

const { Component, Mixin, Data: { Criteria } } = Shopware;

Component.register('sw-settings-snippet-variant-detail', {
    template,


    inject: [
        'repositoryFactory',
        'snippetVariant'
    ],
    mixins: [
        Mixin.getByName('notification'),
    ],

    data() {
        return {
            isLoading: false,
            isCreateMode: false,
            types: [
                "For whole sales channel",
                "For specific product group"
            ],
            type: null,
            translationKey: null,
            salesChannels: [],
            snippetVariants: [],
            snippetSets: [],
            productStreams: [],
            updatedVariant: null,
            processSuccess: false,
            filteredSalesChannels: [],
            filteredSnippetSets: [],
            filteredProductStreams: [],
        };
    },

    computed: {
        productStreamRepository() {
            return this.repositoryFactory.create('product_stream');
        },
        snippetSetRepository() {
            return this.repositoryFactory.create('snippet_set');
        },
        snippetVariantRepository() {
            return this.repositoryFactory.create('snippet_variant');
        },
        salesChannelRepository() {
            return this.repositoryFactory.create('sales_channel');
        },
        snippetSetCriteria() {
            const criteria = new Criteria(1, 25);
            criteria.addSorting(
                Criteria.sort('name', 'ASC'),
            );
            if (this.term) {
                criteria.setTerm(this.term);
            }
            return criteria;
        },
        snippetVariantCriteria() {
            const criteria = new Criteria();
            criteria.addFilter(Criteria.equals('translationKey', this.translationKey));
            return criteria;
        },
        backPath() {
            if (this.translationKey) {
                return {
                    name: 'sw.settings.snippet.variant.list',
                    params: {
                        key: this.$route.query.key,
                    },
                };
            }
            return { name: 'sw.settings.snippet.index' };
        },
    },

    created(){
        this.translationKey = this.$route.query.key;
        this.isCreateMode = this.$route.query.isCreateMode === 'true';
        this.prepareContent();
    },
    methods: {
        prepareContent() {
            this.isLoading = true;
            const response = [];
            response.push(
                this.snippetSetRepository.search(this.snippetSetCriteria),
                this.salesChannelRepository.search(new Criteria()),
                this.snippetVariantRepository.search(this.snippetVariantCriteria, Shopware.Context.api),
                this.productStreamRepository.search(new Criteria()),
            );

            if(!this.isCreateMode){
                response.push(this.snippetVariantRepository.get(this.$route.params.id, Shopware.Context.api, new Criteria()));
            }

            Promise.all(response).then((results) => {
                this.snippetSets = results[0];
                this.salesChannels = results[1];
                this.snippetVariants = results[2];
                this.productStreams = results[3];

                if(!this.isCreateMode){
                    this.updatedVariant = results[4];
                    this.type = this.updatedVariant.productStreamId !== null ? 'For specific product group' : 'For whole sales channel';
                    this.filterItems(this.type, this.isCreateMode,'salesChannels');
                    this.filterItems(this.type, this.isCreateMode,'snippetSets');
                    this.filterItems(this.type, this.isCreateMode,'productStreams');
                }else{
                    this.onChangeType();
                }

            }).finally(() =>{
                this.isLoading = false;
            });
        },

        onSave() {
            if(this.isCreateMode ){
                const newVariant = this.snippetVariantRepository.create();
                newVariant.setId =  this.updatedVariant.setId;
                newVariant.salesChannelId = this.updatedVariant.salesChannelId;
                newVariant.translationKey = this.translationKey;
                newVariant.variant = this.updatedVariant.variant;

                if(this.type === 'For specific product group'){
                    newVariant.productStreamId = this.updatedVariant.productStreamId
                }

                this.snippetVariantRepository.save(newVariant, Shopware.Context.api, new Criteria())
                    .then((r) => {
                        this.createInlineSuccessNote('sw-advanced-snippet.detail.message.create.success', newVariant.variant );
                        this.processSuccess = true;
                    })
                    .catch((e) => {
                        this.createInlineErrorNote(this.$tc('sw-advanced-snippet.detail.message.create.error', 0, { error: e.message}));
                        this.prepareContent();
                    })
                    .finally(() => {
                        this.isLoading = false;
                    });
            } else{
                const match = Object.values(this.snippetVariants).find((element) => {
                    return element.id === this.updatedVariant.id;
                })

                if (this.deepEqual(match, this.updatedVariant) !== true) {
                    this.isLoading = true;

                    this.snippetVariantRepository.save(this.updatedVariant, Shopware.Context.api)
                        .then(() => {
                            this.createInlineSuccessNote('sw-advanced-snippet.detail.message.edit.success', this.updatedVariant.variant)
                            this.processSuccess = true;
                        })
                        .catch((e) => {
                            this.createInlineErrorNote(this.$tc('sw-advanced-snippet.detail.message.create.error', 0, { error: e.message}), this.updatedVariant.variant)
                            this.prepareContent();
                        })
                        .finally(() => {
                            this.isLoading = false;
                        });
                }
            }
        },
        onChangeType(){
            this.filteredSalesChannels = this.salesChannels;
            console.log(this.filteredSalesChannels, this.type);
            this.filteredSnippetSets = this.snippetSets;
            this.filteredProductStreams = this.productStreams;
            this.updatedVariant = {
                setId: null,
                salesChannelId: null,
                variant: null,
                productStreamId: null
            };
        },

        createInlineSuccessNote(message, name) {
            this.createNotificationSuccess({
                message: this.$tc(message, 0, { name }),
            });
        },

        createInlineErrorNote(message, name) {
            this.createNotificationError({
                message: this.$tc(message, name !== null, { name }),
            });
        },

        deepEqual(object1, object2) {
            const keys1 = Object.keys(object1);
            const keys2 = Object.keys(object2);
            return !keys1.salesChannelId === keys2.salesChannelId && keys1.setId === keys2.setId && keys1.variant === keys2.variant
        },

        filterItems(type, isCreateMode, item){
            let countOfNotes = 0;
            const snippetVariants = this.snippetVariants;
            const updatedVariant = this.updatedVariant;
            const items = ['salesChannels', 'snippetSets', 'productStreams'];
            const filteredItems = ['filteredSalesChannels', 'filteredSnippetSets', 'filteredProductStreams'];
            const parameters = ['salesChannelId', 'setId', 'productStreamId'];
            const index = items.indexOf(item);

            for (let i = 0; i < items.length; i++) {
                if(i !== index){
                    const selectedItem = items[i];
                    const secondItem = items.filter(value => value !== item && value !== selectedItem)[0];
                    const selectedItemParameter = parameters[i];
                    const firstParameter = parameters[index];
                    const secondItemParameter = parameters[items.indexOf(secondItem)];

                    if(type === 'For whole sales channel'){
                        this[filteredItems[i]] = this.filterBySalesChannel(isCreateMode, snippetVariants, updatedVariant, selectedItem, selectedItemParameter, firstParameter, secondItemParameter);
                    }else if(type === "For specific product group") {
                        this[filteredItems[i]] = this.filterBySpecificGroup(isCreateMode, snippetVariants, updatedVariant, selectedItem, secondItem, selectedItemParameter, firstParameter, secondItemParameter)
                    }

                    if(this[filteredItems[i]].length < 1 && i < 1){
                        this.createInlineErrorNote("sw-advanced-snippet.detail.message.warning", "Not possible");
                        countOfNotes++;
                    }
                }
            }
        },

         filterBySalesChannel(isCreateMode, snippetVariants, updatedVariant, selectedItem, selectedItemParameter, firstParameter, secondItemParameter) {
            const variantsFiltered = snippetVariants.filter(variant =>
                variant[firstParameter] === updatedVariant[firstParameter] && variant[secondItemParameter] === null
            );

            return this[selectedItem].filter(item => {
                const foundVariant = variantsFiltered.find(variant => variant[selectedItemParameter] === item.id);

                if(!isCreateMode){
                    const hasAdditionalItem = variantsFiltered.find(variant => item.id === variant[selectedItemParameter] && updatedVariant.id === variant.id);
                    return !foundVariant || hasAdditionalItem;
                }
                return !foundVariant;
            });
        },

        filterBySpecificGroup(isCreateMode, snippetVariants, updatedVariant, selectedItem, secondItem, selectedItemParameter, firstParameter, secondItemParameter){
            if(updatedVariant !== null && updatedVariant[secondItemParameter] !== null) {
                return this[selectedItem].filter(item => {
                    const foundVariant = snippetVariants.find(variant =>
                        item.id === variant[selectedItemParameter] &&
                        variant[firstParameter] === updatedVariant[firstParameter] &&
                        variant[secondItemParameter] === updatedVariant[secondItemParameter]
                    );
                    if(!isCreateMode){
                        const hasAdditionalItem = snippetVariants.find(variant =>
                            item.id === variant[selectedItemParameter] &&
                            updatedVariant.id === variant.id
                        )
                        return !foundVariant || hasAdditionalItem;
                    }

                    return !foundVariant;
                });
            }else{
                const filteredSnippetVariants = snippetVariants.filter(variant => variant[firstParameter] === updatedVariant[firstParameter] && variant[secondItemParameter] !== null);
                return this[selectedItem].filter(item =>{
                    return filteredSnippetVariants.filter(variant => variant[selectedItemParameter] === item.id).length < this[secondItem].length
                })
            }
        }
    }
});
