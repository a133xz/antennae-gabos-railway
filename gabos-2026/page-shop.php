<?php
$post_id = gabos_2026_front_id();
$menu_url = gabos_2026_url('menu', $post_id, GABOS_2026_MENU_URL);
$book_url = gabos_2026_url('book', $post_id, GABOS_2026_BOOK_URL);
$contact_url = gabos_2026_contact_url();
$kicker = gabos_2026_text('origin_kicker', $post_id, GABOS_2026_ORIGIN_KICKER);
$place = preg_replace('/\s+/', '', gabos_2026_text('origin_place', $post_id, GABOS_2026_ORIGIN_PLACE));
$copyright = gabos_2026_text('copyright', $post_id, GABOS_2026_COPYRIGHT);
$address = gabos_2026_text('store_address', $post_id, GABOS_2026_ADDRESS);

$gabos_plain = true;
require get_template_directory() . '/template-parts/document-open.php';
?>
<div class="gabos-store-page">
    <header class="store-header">
        <div class="store-mobile">
            <div class="store-mobile-bar">
                <button type="button" class="store-menu-toggle" aria-expanded="false" aria-label="Open menu">
                    <svg class="store-icon-open" width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden="true"><path d="M0 1h22M0 8h22M0 15h22" stroke="currentColor" stroke-width="1.5"></path></svg>
                    <svg class="store-icon-close" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M1 1l18 18M19 1L1 19" stroke="currentColor" stroke-width="1.5"></path></svg>
                </button>
                <a class="store-brand" href="<?php echo esc_url(home_url('/')); ?>">gabos</a>
                <span></span>
            </div>
            <nav class="store-mobile-panel" aria-label="Primary" hidden>
                <a href="<?php echo esc_url($menu_url); ?>" download>Menu</a>
                <a class="is-active" href="<?php echo esc_url(home_url('/shop/')); ?>">shop</a>
                <a href="<?php echo esc_url($book_url); ?>" target="_blank" rel="noopener noreferrer">book</a>
                <a href="<?php echo esc_url($contact_url); ?>">contact</a>
            </nav>
        </div>
        <div class="store-desktop">
            <a class="store-brand" href="<?php echo esc_url(home_url('/')); ?>">gabos</a>
            <nav aria-label="Primary">
                <a href="<?php echo esc_url($menu_url); ?>" download>Menu</a>
                <a class="is-active" href="<?php echo esc_url(home_url('/shop/')); ?>">shop</a>
                <a href="<?php echo esc_url($book_url); ?>" target="_blank" rel="noopener noreferrer">book</a>
                <a href="<?php echo esc_url($contact_url); ?>">contact</a>
            </nav>
            <span></span>
        </div>
    </header>
    <main class="shop-coming-soon">
        <p>coming soon</p>
    </main>
    <footer class="landing-footer landing-footer--store">
        <div class="landing-footer__brand">
            <a href="<?php echo esc_url(home_url('/')); ?>">
                <img src="<?php echo esc_url(gabos_2026_asset('logo-gabos.svg')); ?>" alt="Gabos" width="234" height="175">
            </a>
            <p>
                <span><?php echo esc_html($kicker); ?></span>
                <span class="landing-footer__place"><?php echo esc_html($place); ?></span>
            </p>
        </div>
        <p class="landing-footer__legal">
            <span><?php echo esc_html($copyright); ?></span>
            <span><?php echo esc_html($address); ?></span>
        </p>
    </footer>
</div>
<?php require get_template_directory() . '/template-parts/document-close.php'; ?>
