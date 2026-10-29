<?php
$product = !empty($args['product']) ? $args['product'] : (isset($product) ? $product : null);
if (empty($product) || !is_array($product)) {
    return;
}
$href = gabos_2026_shop_url($product['slug']);
$hover = gabos_2026_shop_card_hover($product);
?>
<article class="shop-product-card">
    <a class="shop-product-card__link" href="<?php echo esc_url($href); ?>" aria-label="<?php echo esc_attr($product['title']); ?>">
        <div class="shop-product-card__photo">
            <img
                class="shop-product-card__photo-main"
                src="<?php echo esc_url($product['image']['src']); ?>"
                alt="<?php echo esc_attr($product['image']['alt']); ?>"
                width="445"
                height="545"
                loading="lazy"
            />
            <?php if ($hover) : ?>
                <img
                    class="shop-product-card__photo-hover"
                    src="<?php echo esc_url($hover['src']); ?>"
                    alt="<?php echo esc_attr($hover['alt']); ?>"
                    width="445"
                    height="545"
                    loading="lazy"
                />
            <?php endif; ?>
        </div>
        <div class="shop-product-card__caption">
            <h2><?php echo esc_html($product['title']); ?></h2>
            <p><?php echo esc_html(gabos_2026_format_price($product['price'])); ?></p>
        </div>
    </a>
</article>
