<?php
$post_id = gabos_2026_front_id();
$shop_available = gabos_2026_shop_available($post_id);
$show_cart = $shop_available;
$active = 'shop';
$shop_surface = $shop_available;

$slug = sanitize_title(get_query_var('gabos_shop_product'));
$product = $shop_available ? gabos_2026_shop_product($slug) : null;

if ($shop_available && !$product) {
    global $wp_query;
    $wp_query->set_404();
    status_header(404);
    nocache_headers();
    require get_template_directory() . '/404.php';
    return;
}

$page_classes = 'gabos-store-page';
if ($shop_surface && $product) {
    $page_classes .= ' gabos-page-shop gabos-page-pdp';
}

$gabos_plain = true;
require get_template_directory() . '/template-parts/document-open.php';
?>
<div class="<?php echo esc_attr($page_classes); ?>">
    <?php
    require get_template_directory() . '/template-parts/store-header.php';
    if ($shop_available && $product) {
        get_template_part('template-parts/shop-product-detail', null, array('product' => $product));
    } else {
        require get_template_directory() . '/template-parts/shop-coming-soon.php';
    }
    $gabos_footer_on_light = true;
    require get_template_directory() . '/template-parts/landing-footer.php';
    ?>
</div>
<?php require get_template_directory() . '/template-parts/document-close.php'; ?>
