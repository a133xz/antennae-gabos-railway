<?php
$gabos_footer_id = gabos_2026_front_id();
$gabos_footer_kicker = GABOS_2026_ORIGIN_KICKER;
$gabos_footer_place = preg_replace('/\s+/', '', GABOS_2026_ORIGIN_PLACE);
$gabos_footer_copyright = '© Gabos ' . wp_date('Y');
$gabos_footer_address = gabos_2026_text('store_address', $gabos_footer_id, GABOS_2026_ADDRESS);
$gabos_footer_class = 'landing-footer';
if (!empty($gabos_footer_on_light)) {
    $gabos_footer_class .= ' landing-footer--store';
}
?>
<footer class="<?php echo esc_attr($gabos_footer_class); ?>">
    <div class="landing-footer__brand-group">
        <a class="landing-footer__logo" href="<?php echo esc_url(home_url('/')); ?>">
            <img src="<?php echo esc_url(gabos_2026_asset('logo-gabos.svg')); ?>" alt="Gabos" width="234" height="175">
        </a>
        <p class="landing-footer__origin">
            <span><?php echo esc_html($gabos_footer_kicker); ?></span>
            <span class="landing-footer__place"><?php echo esc_html($gabos_footer_place); ?></span>
        </p>
    </div>
    <p class="landing-footer__legal">
        <span><?php echo esc_html($gabos_footer_copyright); ?></span>
        <span><?php echo esc_html($gabos_footer_address); ?></span>
    </p>
</footer>
