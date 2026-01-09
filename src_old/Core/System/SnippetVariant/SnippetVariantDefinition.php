<?php declare(strict_types=1);

namespace BmAdvancedSnippets\Core\System\SnippetVariant;

use Shopware\Core\Content\ProductStream\ProductStreamDefinition;
use Shopware\Core\Framework\DataAbstractionLayer\EntityDefinition;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\AllowEmptyString;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\AllowHtml;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\ApiAware;
use Shopware\Core\Framework\DataAbstractionLayer\Field\LongTextField;
use Shopware\Core\Framework\DataAbstractionLayer\FieldCollection;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\PrimaryKey;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\Required;
use Shopware\Core\Framework\DataAbstractionLayer\Field\IdField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\StringField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\FkField;
use Shopware\Core\System\SalesChannel\SalesChannelDefinition;
use Shopware\Core\System\Snippet\Aggregate\SnippetSet\SnippetSetDefinition;

class SnippetVariantDefinition extends EntityDefinition
{
    public const ENTITY_NAME = 'snippet_variant';

    public function getEntityName(): string
    {
        return self::ENTITY_NAME;
    }

    public function getEntityClass(): string
    {
        return SnippetVariantEntity::class;
    }

    public function getCollectionClass(): string
    {
        return SnippetVariantCollection::class;
    }

    protected function defineFields(): FieldCollection
    {
        return new FieldCollection([
            (new IdField('id', 'id'))->addFlags(new Required(), new PrimaryKey()),
            (new FkField('snippet_set_id', 'setId', SnippetSetDefinition::class))->addFlags(new Required()),
            (new FkField('sales_channel_id', 'salesChannelId', SalesChannelDefinition::class))->addFlags(new Required()),
            (new FkField('product_stream_id', 'productStreamId', ProductStreamDefinition::class)),
            (new StringField('translationKey', 'translationKey'))->addFlags(new Required()),
            (new LongTextField('variant', 'variant'))->addFlags(new ApiAware(), new AllowHtml(), new AllowEmptyString()),
        ]);
    }
}
