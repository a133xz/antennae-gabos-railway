<?php
$post_id = gabos_2026_front_id();
$menu = gabos_2026_menu_link($post_id);
$book_url = gabos_2026_url('book', $post_id, GABOS_2026_BOOK_URL);
$follow_url = gabos_2026_url('follow', $post_id, GABOS_2026_FOLLOW_URL);
$logo = gabos_2026_image('logo', $post_id);
$logo_url = $logo ? $logo['url'] : gabos_2026_asset('Artboard-1-1.png');
$logo_alt = ($logo && $logo['alt'] !== '') ? $logo['alt'] : "Gabo's";

$special_on = $post_id && function_exists('get_field') && (bool) get_field('on_off', $post_id);
$special_text = gabos_2026_text('christmas_menu_label', $post_id, 'nye menu');
$special_url = gabos_2026_url('christmas_menu_file', $post_id, '');

$statement = gabos_2026_text('statement', $post_id, GABOS_2026_STATEMENT);
$video_url = gabos_2026_url('editorial_video', $post_id, gabos_2026_asset('video.mp4'));
$poster = gabos_2026_image('editorial_image', $post_id);
$poster_url = $poster ? $poster['url'] : gabos_2026_asset('editorial.jpg');
$poster_alt = ($poster && $poster['alt'] !== '') ? $poster['alt'] : 'Close-up of a cocktail glass';
$ig_label = gabos_2026_text('instagram_label', $post_id, GABOS_2026_IG_LABEL);
$ig_handle = gabos_2026_text('instagram_handle', $post_id, GABOS_2026_IG_HANDLE);
$contact_url = gabos_2026_contact_url();

$huellas = array(
    array('top' => '0%', 'right' => '50.19%', 'bottom' => '87.72%', 'left' => '34.42%', 'rotate' => '160.89', 'src' => '2f781.svg'),
    array('top' => '18.95%', 'right' => '16.66%', 'bottom' => '67.56%', 'left' => '66.63%', 'rotate' => '145.61', 'src' => 'a8e0a.svg'),
    array('top' => '45.49%', 'right' => '84.62%', 'bottom' => '42.24%', 'left' => '0%', 'rotate' => '160.89', 'src' => 'f3698.svg'),
    array('top' => '43.32%', 'right' => '34.43%', 'bottom' => '43.19%', 'left' => '48.86%', 'rotate' => '145.61', 'src' => 'a8e0a.svg'),
    array('top' => '78.7%', 'right' => '50.19%', 'bottom' => '9.03%', 'left' => '34.42%', 'rotate' => '160.89', 'src' => 'f2065.svg'),
    array('top' => '87.72%', 'right' => '0%', 'bottom' => '0%', 'left' => '84.62%', 'rotate' => '160.89', 'src' => '54e23.svg'),
);

$gabos_locked = false;
require get_template_directory() . '/template-parts/document-open.php';
?>
<div class="wrapper wrapper--scroll" data-scrollable="1">
    <?php require get_template_directory() . '/template-parts/curtains.php'; ?>
    <div class="navWrapper">
        <div class="linkContainer linkContainer--landing">
            <div class="gabos-home">
                <section class="gabos-hero">
                    <div class="gabos-hero-stage">
                        <nav class="gabos-hero-nav" aria-label="Primary">
                            <?php if ($special_on) : ?>
                                <?php if ($special_url) : ?>
                                    <a class="gabos-christmas-menu" href="<?php echo esc_url($special_url); ?>" target="_blank" rel="noopener noreferrer">
                                <?php else : ?>
                                    <p class="gabos-christmas-menu">
                                <?php endif; ?>
                                    <?php $flip = false; require get_template_directory() . '/template-parts/flourish.php'; ?>
                                    <span><?php echo esc_html($special_text); ?></span>
                                    <?php $flip = true; require get_template_directory() . '/template-parts/flourish.php'; ?>
                                <?php echo $special_url ? '</a>' : '</p>'; ?>
                            <?php endif; ?>
                            <div class="gabos-hero-nav-group">
                                <?php echo gabos_2026_menu_link_html($menu, 'gabos-hero-nav-menu'); ?>
                                <a class="gabos-hero-nav-shop" href="<?php echo esc_url(home_url('/shop/')); ?>">shop</a>
                            </div>
                            <a class="gabos-hero-logo" href="<?php echo esc_url(home_url('/')); ?>" aria-label="Gabos home">
                                <img class="gabos-hero-logo-original" src="<?php echo esc_url($logo_url); ?>" alt="<?php echo esc_attr($logo_alt); ?>" width="200" height="200">
                                <img class="gabos-hero-logo-monogram" src="<?php echo esc_url(gabos_2026_asset('monogram.svg')); ?>" alt="" width="118" height="165">
                            </a>
                            <div class="gabos-hero-nav-group">
                                <a class="gabos-hero-nav-book" href="<?php echo esc_url($book_url); ?>" target="_blank" rel="noopener noreferrer">book</a>
                                <a class="gabos-hero-nav-contact" href="<?php echo esc_url($contact_url); ?>">contact</a>
                            </div>
                        </nav>
                    </div>
                </section>

                <section class="landing-panel">
                    <div class="landing-huellas" aria-hidden="true">
                        <?php foreach ($huellas as $huella) : ?>
                            <div class="landing-huella" style="top:<?php echo esc_attr($huella['top']); ?>;right:<?php echo esc_attr($huella['right']); ?>;bottom:<?php echo esc_attr($huella['bottom']); ?>;left:<?php echo esc_attr($huella['left']); ?>">
                                <img src="<?php echo esc_url(gabos_2026_asset('huellas/' . $huella['src'])); ?>" alt="" width="122" height="68" style="transform:rotate(<?php echo esc_attr($huella['rotate']); ?>deg)">
                            </div>
                        <?php endforeach; ?>
                    </div>
                    <div class="landing-panel-inner">
                        <div class="landing-statement">
                            <h1><?php echo esc_html($statement); ?></h1>
                        </div>
                        <div class="landing-video">
                            <video src="<?php echo esc_url($video_url); ?>" poster="<?php echo esc_url($poster_url); ?>" autoplay muted loop playsinline aria-label="<?php echo esc_attr($poster_alt); ?>"></video>
                        </div>
                        <a class="landing-instagram" href="<?php echo esc_url($follow_url); ?>" target="_blank" rel="noopener noreferrer">
                            <span><?php echo esc_html($ig_label); ?></span>
                            <span><?php echo esc_html($ig_handle); ?></span>
                        </a>
                        <?php require get_template_directory() . '/template-parts/landing-footer.php'; ?>
                    </div>
                </section>
            </div>
        </div>
    </div>
</div>
<?php require get_template_directory() . '/template-parts/document-close.php'; ?>
