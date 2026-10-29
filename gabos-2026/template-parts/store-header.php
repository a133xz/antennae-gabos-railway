<?php
$post_id = isset($post_id) ? $post_id : gabos_2026_front_id();
$menu = gabos_2026_menu_link($post_id);
$book_url = gabos_2026_url('book', $post_id, GABOS_2026_BOOK_URL);
$contact_url = gabos_2026_contact_url();
$shop_url = gabos_2026_shop_url();
$cart_url = gabos_2026_cart_url();
$show_cart = !empty($show_cart);
$active = isset($active) ? $active : '';
$shop_surface = !empty($shop_surface);
?>
<header class="store-header">
    <div class="store-mobile">
        <div class="store-mobile-bar">
            <button type="button" class="store-menu-toggle" aria-expanded="false" aria-label="Open menu">
                <svg class="store-icon-open" width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden="true"><path d="M0 1h22M0 8h22M0 15h22" stroke="currentColor" stroke-width="1.5"></path></svg>
                <svg class="store-icon-close" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M1 1l18 18M19 1L1 19" stroke="currentColor" stroke-width="1.5"></path></svg>
            </button>
            <a class="store-brand" href="<?php echo esc_url(home_url('/')); ?>">gabos</a>
            <?php if ($show_cart) : ?>
                <a class="store-cart-link" href="<?php echo esc_url($cart_url); ?>">cart</a>
            <?php else : ?>
                <span></span>
            <?php endif; ?>
        </div>
        <nav class="store-mobile-panel" aria-label="Primary" hidden>
            <?php echo gabos_2026_menu_link_html($menu); ?>
            <a<?php echo $active === 'shop' ? ' class="is-active"' : ''; ?> href="<?php echo esc_url($shop_url); ?>">shop</a>
            <a href="<?php echo esc_url($book_url); ?>" target="_blank" rel="noopener noreferrer">book</a>
            <a href="<?php echo esc_url($contact_url); ?>">contact</a>
        </nav>
    </div>
    <div class="store-desktop">
        <a class="store-brand" href="<?php echo esc_url(home_url('/')); ?>">gabos</a>
        <nav aria-label="Primary">
            <?php echo gabos_2026_menu_link_html($menu); ?>
            <a<?php echo $active === 'shop' ? ' class="is-active"' : ''; ?> href="<?php echo esc_url($shop_url); ?>">shop</a>
            <a href="<?php echo esc_url($book_url); ?>" target="_blank" rel="noopener noreferrer">book</a>
            <a href="<?php echo esc_url($contact_url); ?>">contact</a>
        </nav>
        <?php if ($show_cart) : ?>
            <a class="store-cart-link store-cart-link--desktop" href="<?php echo esc_url($cart_url); ?>">cart</a>
        <?php else : ?>
            <span></span>
        <?php endif; ?>
    </div>
</header>
