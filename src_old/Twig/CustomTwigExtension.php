<?php declare(strict_types=1);

namespace BmAdvancedSnippets\Twig;

use Symfony\Contracts\Translation\TranslatorInterface;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Framework\Context;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsAnyFilter;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\MultiFilter;

class CustomTwigExtension extends AbstractExtension
{
    public function __construct(
        private readonly TranslatorInterface $translator,
        private readonly EntityRepository $snippetVariantRepository,
        private readonly EntityRepository $salesChannelRepository,
    ){}

    public function getFunctions()
    {
        return [
            new TwigFunction('custom_trans', [$this, 'customTransFunction']),
        ];
    }

    public function customTransFunction($message, array $parameters = [], $domain = null, $locale = null)
    {
        $context = Context::createDefaultContext();
        $setIdCriteria = new Criteria();
        $setIdCriteria->addFilter(
            new MultiFilter(
                MultiFilter::CONNECTION_AND,
                [
                    new EqualsFilter('salesChannelId', $parameters[0]["id"]),
                    new EqualsFilter('languageId', $parameters[0]["languageId"])
                ]
            )

        );
        $salesChannelDomain = $this->salesChannelRepository->search($setIdCriteria, $context)->last();
        $criteria = new Criteria();
        $criteria->addFilter(
            new MultiFilter(
                MultiFilter::CONNECTION_AND,
                [
                    new EqualsFilter('salesChannelId', $parameters[0]["id"]),
                    new EqualsFilter('setId', $salesChannelDomain->snippetSetId),
                    new EqualsFilter('translationKey', $message),
                    isset($parameters[0]["productStreamId"]) ?
                        new EqualsAnyFilter('productStreamId', $parameters[0]["productStreamId"]) :
                        new EqualsFilter('productStreamId', null)
                ]
            )
        );

        $variantCollection = $this->snippetVariantRepository->search($criteria, $context);
        $variant = $variantCollection->first();

        if(!is_null($variant)){
            return $variant->variant;
        }
        return $this->translator->trans($message);
    }
}