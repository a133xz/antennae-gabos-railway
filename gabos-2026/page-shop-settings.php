<?php
/*
Template Name: Shop
Description: Shop on/off and up to 4 products. Public catalog: /shop/
*/

if (!is_admin()) {
    wp_safe_redirect(gabos_2026_shop_url(), 302);
    exit;
}

$post_id = get_queried_object_id();
$gabos_plain = true;
require get_template_directory() . '/template-parts/document-open.php';
?>
<div class="gabos-store-page">
    <main class="store-main" style="padding:2rem 0;font-size:21px;text-transform:uppercase;">
        <p>This page is for editing in the admin only. Visitors use <a href="<?php echo esc_url(gabos_2026_shop_url()); ?>"><?php echo esc_html(gabos_2026_shop_url()); ?></a>.</p>
    </main>
</div>
<?php require get_template_directory() . '/template-parts/document-close.php'; ?>
