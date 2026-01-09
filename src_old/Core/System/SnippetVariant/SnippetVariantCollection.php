<?php declare(strict_types=1);

namespace BmAdvancedSnippets\Core\System\SnippetVariant;

use Shopware\Core\Framework\DataAbstractionLayer\EntityCollection;


/**
 * @method void               add(SnippetVariantEntity $entity)
 * @method void               set(string $key, SnippetVariantEntity $entity)
 * @method SnippetVariantEntity[]    getIterator()
 * @method SnippetVariantEntity[]    getElements()
 * @method SnippetVariantEntity|null get(string $key)
 * @method SnippetVariantEntity|null first()
 * @method SnippetVariantEntity|null last()
 */
class SnippetVariantCollection extends EntityCollection
{
    protected function getExpectedClass(): string
    {
        return SnippetVariantEntity::class;
    }
}