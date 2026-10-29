<?php
$products = gabos_2026_shop_products();
$fits_viewport = count($products) <= 4;
$row_class = 'shop-product-row' . ($fits_viewport ? ' shop-product-row--fits-viewport' : '');
?>
<main class="store-main store-main--shop">
    <h1 class="screen-reader-text">Shop</h1>
    <ul class="<?php echo esc_attr($row_class); ?>">
        <?php foreach ($products as $product) : ?>
            <li>
                <?php get_template_part('template-parts/shop-product-card', null, array('product' => $product)); ?>
            </li>
        <?php endforeach; ?>
    </ul>
</main>
