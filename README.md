# AdvancedSnippetsPlugin
Shopware 6


-It is custom plugin to help with snippets, we can tell it "Snippet Pro" for shopware 6.
-Shopware 6 has default snippet which can translate only for languages, AdvancedSnippetsPlugin can help to translate for different sales channel and specific dynamic product group.

-If you want to use our plugin you need to use "custom_trans" instead of default Symfony's "trans" function. And it works with extra parameters.
*if your aim is to use custom snippet for whole sub sales channel then you need to give sales channel "id" and "language-id". For example 
        {% block some_twig_block %}
            <div>
                {{ custom_trans('some.snippet', 
                        [{
                            id: context.salesChannel.id,
                            languageId: context.salesChannel.languageId
                        }]
                    ) 
                }}
            </div>
        {% endblock %}

And if you have two domains with the same language you will get you last sales channel, priority is high for last one

*if you want to use for custom product dynamic groups you need to give as parameter productStream id too

    {% block some_twig_block %}
        <div>
            {{ custom_trans('some.snippet',
                    [{
                        id: context.salesChannel.id,
                        languageId: context.salesChannel.languageId,
                        productStreamId: page.product.streamIds
                    }]
                )
            }}
        </div>
    {% endblock %}


