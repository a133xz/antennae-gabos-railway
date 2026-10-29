<?php
$product = !empty($args['product']) ? $args['product'] : (isset($product) ? $product : null);
if (empty($product) || !is_array($product)) {
    return;
}
$photos = gabos_2026_shop_pdp_photos($product);
$sizes = isset($product['sizes']) && is_array($product['sizes']) ? $product['sizes'] : array();
$default_size = $sizes ? $sizes[0] : 'XS';
?>
<main class="store-main store-main--pdp">
    <div class="shop-detail-layout">
        <div class="shop-detail-photos">
            <?php foreach ($photos as $photo) : ?>
                <figure class="shop-photo shop-photo--natural">
                    <img src="<?php echo esc_url($photo['src']); ?>" alt="<?php echo esc_attr($photo['alt']); ?>" loading="lazy" />
                </figure>
            <?php endforeach; ?>
        </div>
        <div class="shop-detail-copy">
            <h1><?php echo esc_html($product['title']); ?></h1>
            <div class="shop-detail-meta">
                <p class="shop-detail-price"><?php echo esc_html(gabos_2026_format_price($product['price'])); ?></p>
                <?php if ($sizes) : ?>
                    <div class="shop-detail-sizes" role="group" aria-label="Size">
                        <?php foreach ($sizes as $size) : ?>
                            <span class="shop-detail-size<?php echo $size === $default_size ? ' is-selected' : ''; ?>"><?php echo esc_html($size); ?></span>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
                <p class="shop-detail-description"><?php echo esc_html($product['description']); ?></p>
                <a class="shop-detail-add-to-cart" href="<?php echo esc_url(gabos_2026_cart_url()); ?>">add to cart</a>
            </div>
        </div>
    </div>
</main>
