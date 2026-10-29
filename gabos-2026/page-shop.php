<?php
$post_id = gabos_2026_front_id();
$shop_available = gabos_2026_shop_available($post_id);
$show_cart = $shop_available;
$active = 'shop';
$shop_surface = $shop_available;

$page_classes = 'gabos-store-page';
if ($shop_surface) {
    $page_classes .= ' gabos-page-shop';
}

$gabos_plain = true;
require get_template_directory() . '/template-parts/document-open.php';
?>
<div class="<?php echo esc_attr($page_classes); ?>">
    <?php
    require get_template_directory() . '/template-parts/store-header.php';
    if ($shop_available) {
        require get_template_directory() . '/template-parts/shop-grid.php';
    } else {
        require get_template_directory() . '/template-parts/shop-coming-soon.php';
    }
    $gabos_footer_on_light = true;
    require get_template_directory() . '/template-parts/landing-footer.php';
    ?>
</div>
<?php require get_template_directory() . '/template-parts/document-close.php'; ?>
