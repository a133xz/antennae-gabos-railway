<?php

/** When false, /shop and product URLs show “coming soon” (matches Next `shopAvailable`). */
function gabos_2026_shop_available($post_id = null) {
    if ($post_id === null) {
        $post_id = gabos_2026_front_id();
    }
    if ($post_id && function_exists('get_field')) {
        $value = get_field('shop_available', $post_id);
        if ($value !== null && $value !== '') {
            return (bool) $value;
        }
    }
    return false;
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
 * @return list<array<string, mixed>>
 */
function gabos_2026_shop_catalog() {
    static $catalog = null;
    if ($catalog !== null) {
        return $catalog;
    }

    $crop = function ($slug, $segment) {
        return array(
            'src' => gabos_2026_shop_crop_url($slug, $segment),
            'alt' => '',
        );
    };

    $catalog = array(
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

    return $catalog;
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
        if (!empty($photo['src']) && strpos($photo['src'], '__grid-card-hover') === false) {
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
