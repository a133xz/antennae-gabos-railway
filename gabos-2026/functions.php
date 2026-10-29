<?php

require get_template_directory() . '/inc/fields.php';
require get_template_directory() . '/inc/shop.php';

add_action('after_setup_theme', function () {
    add_theme_support('title-tag');
});

add_filter('use_block_editor_for_post', '__return_false');

add_action('init', function () {
    remove_post_type_support('page', 'editor');
    add_rewrite_rule('^shop/([^/]+)/?$', 'index.php?gabos_shop_product=$matches[1]', 'top');
    add_rewrite_rule('^shop/?$', 'index.php?gabos_shop=1', 'top');
    if (get_option('gabos_2026_rewrite') !== '3') {
        flush_rewrite_rules(false);
        update_option('gabos_2026_rewrite', '3');
    }
});

add_filter('query_vars', function ($vars) {
    $vars[] = 'gabos_shop';
    $vars[] = 'gabos_shop_product';
    return $vars;
});

add_filter('template_include', function ($template) {
    if (get_query_var('gabos_shop_product')) {
        return get_template_directory() . '/page-shop-product.php';
    }
    if (get_query_var('gabos_shop')) {
        return get_template_directory() . '/page-shop.php';
    }
    return $template;
});

add_filter('show_admin_bar', function ($show) {
    if (is_admin()) {
        return $show;
    }
    return false;
});

remove_action('wp_enqueue_scripts', 'wp_enqueue_global_styles');
remove_action('wp_body_open', 'wp_global_styles_render_svg_filters');

add_action('after_switch_theme', function () {
    flush_rewrite_rules(false);
        update_option('gabos_2026_rewrite', '3');
    do_action('litespeed_purge_all');
});

add_filter('upload_mimes', function ($mimes) {
    $mimes['svg'] = 'image/svg+xml';
    return $mimes;
});

add_action('wp_enqueue_scripts', function () {
    wp_dequeue_style('wp-block-library');
    wp_dequeue_style('wp-block-library-theme');
    wp_dequeue_style('classic-theme-styles');
    wp_dequeue_style('global-styles');

    $dir = get_template_directory();
    $uri = get_template_directory_uri();

    wp_enqueue_style(
        'gabos-2026',
        get_stylesheet_uri(),
        array(),
        filemtime($dir . '/style.css')
    );

    if (!gabos_2026_is_shop_route()) {
        wp_enqueue_script(
            'gabos-2026-curtain',
            $uri . '/js/curtain.js',
            array(),
            filemtime($dir . '/js/curtain.js'),
            true
        );
    } else {
        wp_enqueue_script(
            'gabos-2026-shop-menu',
            $uri . '/js/shop-menu.js',
            array(),
            filemtime($dir . '/js/shop-menu.js'),
            true
        );
    }

    if (is_front_page()) {
        wp_enqueue_script(
            'gabos-2026-landing',
            $uri . '/js/landing.js',
            array(),
            filemtime($dir . '/js/landing.js'),
            true
        );
    }
});

add_action('wp_head', function () {
    if (!is_front_page()) {
        return;
    }
    $statement = gabos_2026_text('statement', gabos_2026_front_id(), GABOS_2026_STATEMENT);
    echo '<meta name="description" content="' . esc_attr(wp_strip_all_tags($statement)) . '">' . "\n";
}, 1);
