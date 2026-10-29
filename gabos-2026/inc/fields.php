<?php

const GABOS_2026_STATEMENT = "Gabo's is a New York-inspired supper club and cocktail bar in Madrid offering late-night dining, vinyl music, and classic American bites";
const GABOS_2026_MENU_URL = 'https://gabosny.com/wp-content/uploads/2026/07/Menu_Web_July2026.pdf';
const GABOS_2026_BOOK_URL = 'https://www.covermanager.com/reservation/module_restaurant/restaurante-gabos-ne-york/spanish';
const GABOS_2026_FOLLOW_URL = 'https://www.instagram.com/gabosmadrid/';
const GABOS_2026_IG_LABEL = 'Follow us on Instagram';
const GABOS_2026_IG_HANDLE = '@gabosmadrid';
const GABOS_2026_ADDRESS = 'Calle Prim 5, Madrid, Spain 28004';
const GABOS_2026_ORIGIN_KICKER = 'From';
const GABOS_2026_ORIGIN_PLACE = 'New York';
const GABOS_2026_PHONE = '91 639 1343';
const GABOS_2026_PHONE_HOURS = 'Tue -- Sat 17.00-22.00';
const GABOS_2026_EMAIL_RES = 'reservas@gabosnewyork.com';
const GABOS_2026_EMAIL_ADMIN = 'sala@gabosnewyork.com';

function gabos_2026_asset($file) {
    return get_template_directory_uri() . '/assets/' . ltrim($file, '/');
}

function gabos_2026_front_id() {
    $id = (int) get_option('page_on_front');
    if ($id > 0) {
        return $id;
    }
    $queried = get_queried_object_id();
    return $queried ? (int) $queried : 0;
}

function gabos_2026_text($name, $post_id, $fallback) {
    if ($post_id && function_exists('get_field')) {
        $value = get_field($name, $post_id);
        if (is_string($value) && trim($value) !== '') {
            return $value;
        }
        if (is_numeric($value)) {
            return (string) $value;
        }
    }
    return $fallback;
}

function gabos_2026_url($name, $post_id, $fallback) {
    if ($post_id && function_exists('get_field')) {
        $value = get_field($name, $post_id);
        if (is_array($value) && !empty($value['url'])) {
            return $value['url'];
        }
        if (is_string($value) && trim($value) !== '') {
            return $value;
        }
    }
    return $fallback;
}

function gabos_2026_image($name, $post_id) {
    if ($post_id && function_exists('get_field')) {
        $value = get_field($name, $post_id);
        if (is_array($value) && !empty($value['url'])) {
            return array(
                'url' => $value['url'],
                'alt' => isset($value['alt']) ? $value['alt'] : '',
            );
        }
    }
    return null;
}

function gabos_2026_contact_url() {
    $pages = get_posts(array(
        'post_type' => 'page',
        'post_status' => 'publish',
        'posts_per_page' => 1,
        'meta_key' => '_wp_page_template',
        'meta_value' => 'page-contact.php',
        'no_found_rows' => true,
    ));
    if ($pages) {
        return get_permalink($pages[0]);
    }
    $by_path = get_page_by_path('contact');
    if ($by_path) {
        return get_permalink($by_path);
    }
    return home_url('/contact/');
}

function gabos_2026_menu_link($post_id) {
    $regular = gabos_2026_url('menu', $post_id, GABOS_2026_MENU_URL);
    $branch = gabos_2026_url('branch_menu', $post_id, '');
    $choice = ($post_id && function_exists('get_field')) ? get_field('menu_choice', $post_id) : '';
    if ($choice === 'branch' && $branch !== '') {
        return array(
            'url' => $branch,
            'label' => 'Branch menu',
        );
    }
    return array(
        'url' => $regular,
        'label' => 'Menu',
    );
}

function gabos_2026_hour_parts($line) {
    if (preg_match('/^(.+?)\s+(\d{1,2}\.\d{2}\s+a\s+\d{1,2}\.\d{2})$/', $line, $match)) {
        return array($match[1], $match[2]);
    }
    return array($line, '');
}

add_action('acf/init', function () {
    if (!function_exists('acf_add_local_field_group')) {
        return;
    }

    acf_add_local_field_group(array(
        'key' => 'group_gabos_2026_home',
        'title' => 'Home landing',
        'fields' => array(
            array(
                'key' => 'field_gabos_2026_tab_landing',
                'label' => 'Landing',
                'type' => 'tab',
                'placement' => 'top',
            ),
            array(
                'key' => 'field_gabos_2026_statement',
                'label' => 'Statement',
                'name' => 'statement',
                'type' => 'textarea',
                'rows' => 4,
                'new_lines' => '',
                'instructions' => 'Shown under the curtain. Leave empty to keep the current sentence.',
            ),
            array(
                'key' => 'field_gabos_2026_video',
                'label' => 'Editorial video',
                'name' => 'editorial_video',
                'type' => 'file',
                'return_format' => 'array',
                'library' => 'all',
                'mime_types' => 'mp4,webm',
                'instructions' => 'Leave empty to keep the video shipped with the theme.',
            ),
            array(
                'key' => 'field_gabos_2026_poster',
                'label' => 'Video poster',
                'name' => 'editorial_image',
                'type' => 'image',
                'return_format' => 'array',
                'preview_size' => 'medium',
                'instructions' => 'Still frame shown before the video plays.',
            ),
            array(
                'key' => 'field_gabos_2026_tab_menus',
                'label' => 'Menus',
                'type' => 'tab',
                'placement' => 'top',
            ),
            array(
                'key' => 'field_gabos_2026_menu',
                'label' => 'Menu',
                'name' => 'menu',
                'type' => 'file',
                'return_format' => 'array',
                'library' => 'all',
                'mime_types' => 'pdf',
                'instructions' => 'Regular menu PDF. Leave empty to keep the file already on the site.',
            ),
            array(
                'key' => 'field_gabos_2026_branch_menu',
                'label' => 'Branch menu',
                'name' => 'branch_menu',
                'type' => 'file',
                'return_format' => 'array',
                'library' => 'all',
                'mime_types' => 'pdf',
                'instructions' => 'PDF used when the menu link is set to Branch menu.',
            ),
            array(
                'key' => 'field_gabos_2026_menu_choice',
                'label' => 'Menu link shows',
                'name' => 'menu_choice',
                'type' => 'button_group',
                'choices' => array(
                    'regular' => 'Menu',
                    'branch' => 'Branch menu',
                ),
                'default_value' => 'regular',
                'return_format' => 'value',
                'layout' => 'horizontal',
                'instructions' => 'Switches the Menu link on the home page and the shop. Branch menu is used only after a PDF is uploaded above.',
            ),
            array(
                'key' => 'field_gabos_2026_christmas',
                'label' => 'Show Christmas menu',
                'name' => 'on_off',
                'type' => 'true_false',
                'ui' => 1,
                'ui_on_text' => 'Shown',
                'ui_off_text' => 'Hidden',
                'instructions' => 'Adds the seasonal link above the home navigation. It does not replace Menu.',
            ),
            array(
                'key' => 'field_gabos_2026_christmas_label',
                'label' => 'Christmas menu label',
                'name' => 'special_menu_text',
                'type' => 'text',
                'placeholder' => 'nye menu',
                'instructions' => 'Leave empty to show “nye menu”.',
                'conditional_logic' => array(
                    array(
                        array(
                            'field' => 'field_gabos_2026_christmas',
                            'operator' => '==',
                            'value' => '1',
                        ),
                    ),
                ),
            ),
            array(
                'key' => 'field_gabos_2026_christmas_file',
                'label' => 'Christmas menu PDF',
                'name' => 'special_menu_file',
                'type' => 'file',
                'return_format' => 'array',
                'library' => 'all',
                'mime_types' => 'pdf',
                'instructions' => 'File the seasonal link opens.',
                'conditional_logic' => array(
                    array(
                        array(
                            'field' => 'field_gabos_2026_christmas',
                            'operator' => '==',
                            'value' => '1',
                        ),
                    ),
                ),
            ),
            array(
                'key' => 'field_gabos_2026_tab_instagram',
                'label' => 'Instagram',
                'type' => 'tab',
                'placement' => 'top',
            ),
            array(
                'key' => 'field_gabos_2026_follow',
                'label' => 'Profile link',
                'name' => 'follow',
                'type' => 'url',
                'instructions' => 'Instagram profile URL. Leave empty to keep https://www.instagram.com/gabosmadrid/',
            ),
            array(
                'key' => 'field_gabos_2026_ig_label',
                'label' => 'Label',
                'name' => 'instagram_label',
                'type' => 'text',
                'instructions' => 'Line above the handle. Leave empty to keep “Follow us on Instagram”.',
            ),
            array(
                'key' => 'field_gabos_2026_ig_handle',
                'label' => 'Handle',
                'name' => 'instagram_handle',
                'type' => 'text',
                'instructions' => 'Leave empty to keep @gabosmadrid.',
            ),
            array(
                'key' => 'field_gabos_2026_tab_footer',
                'label' => 'Footer',
                'type' => 'tab',
                'placement' => 'top',
            ),
            array(
                'key' => 'field_gabos_2026_address',
                'label' => 'Address',
                'name' => 'store_address',
                'type' => 'text',
                'instructions' => 'Leave empty to keep Calle Prim 5, Madrid, Spain 28004.',
            ),
        ),
        'location' => array(
            array(
                array(
                    'param' => 'page_type',
                    'operator' => '==',
                    'value' => 'front_page',
                ),
            ),
        ),
        'position' => 'normal',
        'style' => 'default',
        'active' => true,
    ));

    acf_add_local_field_group(array(
        'key' => 'group_gabos_2026_contact',
        'title' => 'Contact extra',
        'fields' => array(
            array(
                'key' => 'field_gabos_2026_phone_hours',
                'label' => 'Phone hours',
                'name' => 'contact_phone_hours',
                'type' => 'text',
                'instructions' => 'Line under the phone number. Leave empty to hide it when Details is already filled in.',
            ),
        ),
        'location' => array(
            array(
                array(
                    'param' => 'page_template',
                    'operator' => '==',
                    'value' => 'page-contact.php',
                ),
            ),
        ),
        'position' => 'normal',
        'style' => 'default',
        'active' => true,
    ));
});
