<?php

const GABOS_2026_SHOP_PAGE_TEMPLATE = 'page-shop-settings.php';
const GABOS_2026_SHOP_PRODUCT_SLOTS = 4;

function gabos_2026_shop_page_id() {
    static $page_id = null;
    if ($page_id !== null) {
        return $page_id;
    }
    $pages = get_posts(array(
        'post_type' => 'page',
        'post_status' => array('publish', 'draft', 'private'),
        'posts_per_page' => 1,
        'meta_key' => '_wp_page_template',
        'meta_value' => GABOS_2026_SHOP_PAGE_TEMPLATE,
        'no_found_rows' => true,
        'fields' => 'ids',
    ));
    $page_id = $pages ? (int) $pages[0] : 0;
    return $page_id;
}

/**
 * @param mixed $default
 * @return mixed
 */
function gabos_2026_shop_get_field($name, $default = null) {
    $page_id = gabos_2026_shop_page_id();
    if (!$page_id || !function_exists('get_field')) {
        return $default;
    }
    $value = get_field($name, $page_id);
    if ($value === null || $value === '') {
        return $default;
    }
    return $value;
}

/** When false, /shop and product URLs show “coming soon” (matches Next `shopAvailable`). */
function gabos_2026_shop_available($post_id = null) {
    unset($post_id);
    if (!gabos_2026_shop_page_id()) {
        return false;
    }
    return (bool) gabos_2026_shop_get_field('shop_available', false);
}

function gabos_2026_shop_url($slug = '') {
    $base = trailingslashit(home_url('/shop'));
    if ($slug === '') {
        return $base;
    }
    return $base . rawurlencode($slug) . '/';
}

function gabos_2026_cart_url() {
    return trailingslashit(home_url('/cart'));
}

function gabos_2026_shop_crop_url($slug, $segment) {
    $file = $slug . '__' . $segment . '.png';
    return gabos_2026_asset('shop/cropped/' . $file);
}

function gabos_2026_format_price($euros) {
    $fraction = fmod((float) $euros, 1.0) === 0.0 ? 0 : 2;
    return '€' . number_format((float) $euros, $fraction, '.', '');
}

/**
 * @return array{src: string, alt: string}|null
 */
function gabos_2026_shop_acf_picture($image, $alt_fallback = '') {
    if (!is_array($image) || empty($image['url'])) {
        return null;
    }
    return array(
        'src' => $image['url'],
        'alt' => !empty($image['alt']) ? (string) $image['alt'] : $alt_fallback,
    );
}

/**
 * @return list<string>
 */
function gabos_2026_shop_parse_sizes($raw) {
    if (!is_string($raw) || trim($raw) === '') {
        return array('XS', 'S', 'M', 'L', 'XL');
    }
    $parts = preg_split('/\s*,\s*/', trim($raw));
    $sizes = array();
    foreach ($parts as $part) {
        $part = trim($part);
        if ($part !== '') {
            $sizes[] = $part;
        }
    }
    return $sizes !== array() ? $sizes : array('XS', 'S', 'M', 'L', 'XL');
}

/**
 * @return array<string, mixed>|null
 */
function gabos_2026_shop_product_from_slot($slot) {
    $page_id = gabos_2026_shop_page_id();
    if (!$page_id || !function_exists('get_field')) {
        return null;
    }
    $title = trim((string) get_field('shop_product_' . $slot . '_title', $page_id));
    $slug = sanitize_title((string) get_field('shop_product_' . $slot . '_slug', $page_id));
    $card = gabos_2026_shop_acf_picture(get_field('shop_product_' . $slot . '_card_image', $page_id), $title);
    if ($title === '' || $slug === '' || !$card) {
        return null;
    }

    $gallery = array($card);
    $hover = gabos_2026_shop_acf_picture(get_field('shop_product_' . $slot . '_hover_image', $page_id), $title);
    if ($hover) {
        $gallery[] = $hover;
    }
    foreach (array('pdp_image_1', 'pdp_image_2') as $pdp_key) {
        $pic = gabos_2026_shop_acf_picture(get_field('shop_product_' . $slot . '_' . $pdp_key, $page_id), $title);
        if ($pic) {
            $gallery[] = $pic;
        }
    }

    return array(
        'id' => (int) $slot,
        'title' => $title,
        'slug' => $slug,
        'price' => (float) get_field('shop_product_' . $slot . '_price', $page_id),
        'description' => (string) get_field('shop_product_' . $slot . '_description', $page_id),
        'sizes' => gabos_2026_shop_parse_sizes((string) get_field('shop_product_' . $slot . '_sizes', $page_id)),
        'image' => $card,
        'gallery' => $gallery,
        'active' => true,
        'order' => (int) $slot - 1,
    );
}

/**
 * @return list<array<string, mixed>>
 */
function gabos_2026_shop_catalog_from_cms() {
    if (!gabos_2026_shop_page_id()) {
        return array();
    }
    $products = array();
    for ($slot = 1; $slot <= GABOS_2026_SHOP_PRODUCT_SLOTS; $slot++) {
        $product = gabos_2026_shop_product_from_slot($slot);
        if ($product) {
            $products[] = $product;
        }
    }
    return $products;
}

/**
 * Theme default catalog (matches Next `records.ts`).
 *
 * @return list<array<string, mixed>>
 */
function gabos_2026_shop_catalog_default() {
    $crop = function ($slug, $segment) {
        return array(
            'src' => gabos_2026_shop_crop_url($slug, $segment),
            'alt' => '',
        );
    };

    return array(
        array(
            'id' => 1,
            'title' => 'f1 shorts',
            'slug' => 'f1-shorts-1',
            'price' => 40,
            'description' => 'Lightweight race-day shorts with an easy fit. Pair with the F1 tank for a full grid look.',
            'sizes' => array('XS', 'S', 'M', 'L', 'XL'),
            'image' => array_merge($crop('f1-shorts-1', 'grid-card'), array('alt' => 'Maroon F1 shorts')),
            'gallery' => array(array_merge($crop('f1-shorts-1', 'grid-card'), array('alt' => 'Maroon F1 shorts'))),
            'active' => true,
            'order' => 0,
        ),
        array(
            'id' => 2,
            'title' => 'f1 shorts',
            'slug' => 'f1-shorts-2',
            'price' => 40,
            'description' => 'Lightweight race-day shorts with an easy fit.',
            'sizes' => array('XS', 'S', 'M', 'L', 'XL'),
            'image' => array_merge($crop('f1-shorts-2', 'grid-card'), array('alt' => 'Black Gabos cap')),
            'gallery' => array(array_merge($crop('f1-shorts-2', 'grid-card'), array('alt' => 'Black Gabos cap'))),
            'active' => true,
            'order' => 1,
        ),
        array(
            'id' => 3,
            'title' => 'f1 shorts',
            'slug' => 'f1-shorts-3',
            'price' => 40,
            'description' => 'Lightweight race-day shorts with an easy fit.',
            'sizes' => array('XS', 'S', 'M', 'L', 'XL'),
            'image' => array_merge($crop('f1-shorts-3', 'grid-card'), array('alt' => 'White F1 briefs')),
            'gallery' => array(array_merge($crop('f1-shorts-3', 'grid-card'), array('alt' => 'White F1 briefs'))),
            'active' => true,
            'order' => 2,
        ),
        array(
            'id' => 4,
            'title' => 'f1 tank top',
            'slug' => 'f1-tank-top-black',
            'price' => 40,
            'description' => 'Black F1 tank top with grid-ready fit.',
            'sizes' => array('XS', 'S', 'M', 'L', 'XL'),
            'image' => array_merge($crop('f1-tank-top-black', 'grid-card'), array('alt' => 'Black F1 tank top, front')),
            'gallery' => array(
                array_merge($crop('f1-tank-top-black', 'grid-card-hover'), array('alt' => 'Black F1 tank top, back')),
                array_merge($crop('f1-tank-top-black', 'pdp-front'), array('alt' => 'Black F1 tank top, front')),
                array_merge($crop('f1-tank-top-black', 'pdp-back'), array('alt' => 'Black F1 tank top, back')),
            ),
            'active' => true,
            'order' => 3,
        ),
    );
}

/**
 * @return list<array<string, mixed>>
 */
function gabos_2026_shop_catalog() {
    $from_cms = gabos_2026_shop_catalog_from_cms();
    if ($from_cms !== array()) {
        return $from_cms;
    }
    return gabos_2026_shop_catalog_default();
}

/**
 * @return list<array<string, mixed>>
 */
function gabos_2026_shop_products() {
    $products = array_values(array_filter(gabos_2026_shop_catalog(), function ($product) {
        return !empty($product['active']);
    }));
    usort($products, function ($a, $b) {
        return (int) $a['order'] <=> (int) $b['order'];
    });
    return $products;
}

/**
 * @return array<string, mixed>|null
 */
function gabos_2026_shop_product($slug) {
    foreach (gabos_2026_shop_products() as $product) {
        if ($product['slug'] === $slug) {
            return $product;
        }
    }
    return null;
}

/**
 * @param array<string, mixed> $product
 * @return array{src: string, alt: string}|null
 */
function gabos_2026_shop_card_hover($product) {
    if (empty($product['gallery']) || !is_array($product['gallery'])) {
        return null;
    }
    foreach ($product['gallery'] as $photo) {
        if (!empty($photo['src']) && strpos($photo['src'], '__grid-card-hover') !== false) {
            return $photo;
        }
    }
    foreach ($product['gallery'] as $photo) {
        if (!empty($photo['src']) && $photo['src'] !== $product['image']['src']) {
            return $photo;
        }
    }
    return null;
}

/**
 * @param array<string, mixed> $product
 * @return list<array{src: string, alt: string}>
 */
function gabos_2026_shop_pdp_photos($product) {
    $gallery = isset($product['gallery']) && is_array($product['gallery']) ? $product['gallery'] : array();
    $pdp = array();
    foreach ($gallery as $photo) {
        if (!empty($photo['src']) && strpos($photo['src'], '__pdp-') !== false) {
            $pdp[] = $photo;
        }
    }
    if ($pdp !== array()) {
        return $pdp;
    }
    $rest = array();
    foreach ($gallery as $photo) {
        if (!empty($photo['src']) && strpos($photo['src'], '__grid-card-hover') === false && $photo['src'] !== $product['image']['src']) {
            $rest[] = $photo;
        }
    }
    if ($rest !== array()) {
        return $rest;
    }
    return !empty($product['image']['src']) ? array($product['image']) : array();
}

function gabos_2026_is_shop_route() {
    return (bool) get_query_var('gabos_shop') || (bool) get_query_var('gabos_shop_product');
}
