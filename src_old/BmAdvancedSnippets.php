<?php declare(strict_types=1);

namespace BmAdvancedSnippets;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Plugin;
use Shopware\Core\Framework\Plugin\Context\InstallContext;
use Shopware\Core\Framework\Plugin\Context\UninstallContext;

class BmAdvancedSnippets extends Plugin
{

    public function install(InstallContext $installContext): void
    {
        // Do stuff such as creating a new payment method
    }

    public function uninstall(UninstallContext $uninstallContext): void
    {
        parent::uninstall($uninstallContext);

        if($uninstallContext->keepUserData()){
            return;
        }

        $connection = $this->container->get(Connection::class);

        $connection->executeUpdate(("DROP TABLE IF EXISTS `snippet_variant`"));
    }

}