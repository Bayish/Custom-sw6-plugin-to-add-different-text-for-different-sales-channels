<?php declare(strict_types=1);

namespace BmAdvancedSnippets\Core\System\SnippetVariant;

use Shopware\Core\Framework\Uuid\Uuid;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Framework\Context;

class SnippetVariantService extends EntityRepository
{

    public function __construct(
        private  EntityRepository $snippetVariantRepository,
    ) {
    }
    public function createSnippetVariant(SnippetVariantEntity $snippetVariantEntity, Context $context): void
    {
        $id = UUID::randomHex();
        $this->snippetVariantRepository->create([
            [
                'id' => $id,
                'setId' => UUID::randomHex(),
                'salesChannelId' => UUID::randomHex(),
                'productStreamId' => UUID::randomHex(),
                'translationKey' => 'jbjkbjbydfv',
                'variant' => 'khbdfbvdfljvkjhbydfkjhvbdfkjhbvdfjxhvb',
            ]
        ], Context::createDefaultContext());
    }
    
}
