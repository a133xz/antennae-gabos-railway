<?php

const GABOS_2026_STATEMENT = "Gabo's is a New York-inspired supper club and cocktail bar in Madrid offering late-night dining, vinyl music, and classic American bites";
const GABOS_2026_MENU_URL = 'https://gabosny.com/wp-content/uploads/2026/07/Menu_Web_July2026.pdf';
const GABOS_2026_BRUNCH_MENU_URL = 'https://gabosny.com/wp-content/uploads/2026/01/Gabos_Brunch.pdf';
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
    $brunch = gabos_2026_url('brunch_menu', $post_id, GABOS_2026_BRUNCH_MENU_URL);
    $brunch_on = $post_id && function_exists('get_field') && (bool) get_field('brunch_on', $post_id);
    if ($brunch_on) {
        return array(
            'url' => $brunch,
            'label' => gabos_2026_text('brunch_label', $post_id, 'brunch'),
        );
    }
    return array(
        'url' => $regular,
        'label' => 'Menu',
    );
}

function gabos_2026_column($field) {
    if (!isset($field['wrapper']) || !is_array($field['wrapper'])) {
        $field['wrapper'] = array(
            'width' => '',
            'class' => '',
            'id' => '',
        );
    }
    $field['wrapper']['width'] = '33';
    return $field;
}

function gabos_2026_like_menu_field($menu_field, $key, $name, $label) {
    $type = (is_array($menu_field) && !empty($menu_field['type'])) ? $menu_field['type'] : 'file';
    $field = array(
        'key' => $key,
        'label' => $label,
        'name' => $name,
        'type' => $type,
        'parent' => isset($menu_field['parent']) ? $menu_field['parent'] : '',
    );
    if ($type === 'file') {
        $field['return_format'] = isset($menu_field['return_format']) ? $menu_field['return_format'] : 'array';
        $field['library'] = isset($menu_field['library']) ? $menu_field['library'] : 'all';
        $field['mime_types'] = isset($menu_field['mime_types']) ? $menu_field['mime_types'] : 'pdf';
    }
    return gabos_2026_column($field);
}

function gabos_2026_on_field($parent_key, $key, $name, $instructions = '') {
    $field = array(
        'key' => $key,
        'label' => 'On',
        'name' => $name,
        'type' => 'true_false',
        'ui' => 0,
        'message' => 'On',
        'parent' => $parent_key,
    );
    if ($instructions !== '') {
        $field['instructions'] = $instructions;
    }
    return gabos_2026_column($field);
}

function gabos_2026_home_page_fields($fields, $parent) {
    if (!is_array($parent) || empty($parent['title']) || $parent['title'] !== 'Home page' || !is_array($fields)) {
        return $fields;
    }
    foreach ($fields as $field) {
        if (isset($field['name']) && $field['name'] === 'brunch_menu') {
            return $fields;
        }
    }

    $by_name = array();
    foreach ($fields as $field) {
        if (!empty($field['name']) && !isset($by_name[$field['name']])) {
            $by_name[$field['name']] = $field;
        }
    }
    if (!isset($by_name['menu'])) {
        return $fields;
    }

    $parent_key = $parent['key'];
    $pull = array(
        'logo' => true,
        'book' => true,
        'follow' => true,
        'menu' => true,
        'on_off' => true,
        'special_menu_text' => true,
        'special_menu_file' => true,
    );
    $kept = array();
    $menu_seen = false;
    foreach ($fields as $field) {
        $name = isset($field['name']) ? $field['name'] : '';
        if (isset($pull[$name])) {
            if ($name === 'menu' && !$menu_seen) {
                $menu_seen = true;
                $menu = $by_name['menu'];
                if (!isset($menu['wrapper']) || !is_array($menu['wrapper'])) {
                    $menu['wrapper'] = array('width' => '', 'class' => '', 'id' => '');
                }
                $menu['wrapper']['width'] = '';
                $kept[] = $menu;
                $special_menu = gabos_2026_like_menu_field($menu, 'field_gabos_2026_brunch_menu', 'brunch_menu', 'Special menu');
                $special_menu['instructions'] = 'Leave empty to use Gabos_Brunch.pdf. Used when On is ticked; replaces the Menu link only.';
                $kept[] = $special_menu;
                $kept[] = gabos_2026_on_field(
                    $parent_key,
                    'field_gabos_2026_brunch_on',
                    'brunch_on',
                    'Replaces the Menu link with Special menu.'
                );
                $kept[] = gabos_2026_column(array(
                    'key' => 'field_gabos_2026_brunch_label',
                    'label' => 'Menu link label',
                    'name' => 'brunch_label',
                    'type' => 'text',
                    'placeholder' => 'brunch',
                    'instructions' => 'Leave empty to show “brunch” on the Menu link when Special menu is on.',
                    'parent' => $parent_key,
                ));
                if (isset($by_name['special_menu_file'])) {
                    $christmas_file = gabos_2026_column($by_name['special_menu_file']);
                    $christmas_file['label'] = 'Christmas menu';
                    $christmas_file['instructions'] = 'PDF for the extra seasonal link above the navigation.';
                    $kept[] = $christmas_file;
                } else {
                    $christmas_file = gabos_2026_like_menu_field($menu, 'field_gabos_2026_christmas_file', 'special_menu_file', 'Christmas menu');
                    $christmas_file['instructions'] = 'PDF for the extra seasonal link above the navigation.';
                    $kept[] = $christmas_file;
                }
                if (isset($by_name['on_off'])) {
                    $christmas_on = gabos_2026_column($by_name['on_off']);
                    $christmas_on['instructions'] = 'Shows the extra seasonal link above the navigation. Does not replace Menu.';
                    $kept[] = $christmas_on;
                } else {
                    $kept[] = gabos_2026_on_field(
                        $parent_key,
                        'field_gabos_2026_christmas',
                        'on_off',
                        'Shows the extra seasonal link above the navigation. Does not replace Menu.'
                    );
                }
                if (isset($by_name['special_menu_text'])) {
                    $christmas_label = gabos_2026_column($by_name['special_menu_text']);
                    $christmas_label['label'] = 'Link label';
                    $christmas_label['instructions'] = 'Leave empty to show “nye menu” on the extra link.';
                    $kept[] = $christmas_label;
                } else {
                    $kept[] = gabos_2026_column(array(
                        'key' => 'field_gabos_2026_christmas_label',
                        'label' => 'Link label',
                        'name' => 'special_menu_text',
                        'type' => 'text',
                        'instructions' => 'Leave empty to show “nye menu” on the extra link.',
                        'parent' => $parent_key,
                    ));
                }
            }
            continue;
        }
        $kept[] = $field;
    }

    if (isset($by_name['book'])) {
        $book_at = null;
        foreach ($kept as $index => $field) {
            if (isset($field['name']) && $field['name'] === 'special_menu_text') {
                $book_at = $index + 1;
            }
        }
        $book = $by_name['book'];
        if (!isset($book['wrapper']) || !is_array($book['wrapper'])) {
            $book['wrapper'] = array('width' => '', 'class' => '', 'id' => '');
        }
        $book['wrapper']['width'] = '';
        if ($book_at === null) {
            $kept[] = $book;
        } else {
            array_splice($kept, $book_at, 0, array($book));
        }
    }

    foreach ($kept as $order => $field) {
        $kept[$order]['menu_order'] = $order;
        if (empty($kept[$order]['parent'])) {
            $kept[$order]['parent'] = $parent_key;
        }
    }
    return $kept;
}

function gabos_2026_hour_parts($line) {
    if (preg_match('/^(.+?)\s+(\d{1,2}\.\d{2}\s+a\s+\d{1,2}\.\d{2})$/', $line, $match)) {
        return array($match[1], $match[2]);
    }
    return array($line, '');
}

add_filter('acf/load_fields', 'gabos_2026_home_page_fields', 20, 2);

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
                'key' => 'field_gabos_2026_logo',
                'label' => 'Logo',
                'name' => 'logo',
                'type' => 'image',
                'return_format' => 'array',
                'preview_size' => 'medium',
                'instructions' => 'Leave empty to keep the logo shipped with the theme.',
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
                'key' => 'field_gabos_2026_tab_instagram',
                'label' => 'Instagram',
                'type' => 'tab',
                'placement' => 'top',
            ),
            array(
                'key' => 'field_gabos_2026_follow',
                'label' => 'Follow',
                'name' => 'follow',
                'type' => 'url',
                'instructions' => 'Insert the link to your social media profile here. Leave empty to keep https://www.instagram.com/gabosmadrid/',
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
