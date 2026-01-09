<?php declare(strict_types=1);

namespace BmAdvancedSnippets\Migration;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Migration\MigrationStep;

class Migration1695714198AddVariantToSnippet extends MigrationStep
{
    public function getCreationTimestamp(): int
    {
        return 1695714198;
    }

    public function update(Connection $connection): void
    {
        $connection->executeStatement('
            CREATE TABLE IF NOT EXISTS `snippet_variant` (
              `id`                   BINARY(16)       NOT NULL,
              `snippet_set_id`       BINARY(16)       NOT NULL,
              `translationKey`       VARCHAR(255) COLLATE utf8mb4_unicode_ci     NOT NULL,
              `sales_channel_id`     BINARY(16)       NOT NULL,        
              `product_stream_id`    BINARY(16)       NULL,        
              `variant`           LONGTEXT COLLATE utf8mb4_unicode_ci     NULL,
              `created_at`           DATETIME(3)      NOT NULL,
              `updated_at`           DATETIME(3)      NULL,
              PRIMARY KEY (`id`),
              CONSTRAINT `fk.snippet_sales_channel.snippet_set_id` FOREIGN KEY (`snippet_set_id`)
                REFERENCES `snippet_set` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
              CONSTRAINT `fk.snippet_sales_channel.sales_channel_id` FOREIGN KEY (`sales_channel_id`)
                REFERENCES `sales_channel` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT `fk.snippet_sales_channel.product_stream_id` FOREIGN KEY (`product_stream_id`)
                REFERENCES `product_stream` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ');
    }

    public function updateDestructive(Connection $connection): void
    {
        // implement update destructive
    }
}
