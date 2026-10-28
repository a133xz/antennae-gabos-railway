<?php
$gabos_plain = !empty($gabos_plain);
$gabos_locked = !empty($gabos_locked) && !$gabos_plain;
$gabos_html_class = $gabos_locked ? ' class="gabos-curtain-locked"' : '';
if ($gabos_plain) {
    $gabos_body_class = 'gabos-store';
} elseif ($gabos_locked) {
    $gabos_body_class = 'gabos-curtain-view gabos-curtain-locked';
} else {
    $gabos_body_class = 'gabos-curtain-view';
}
?><!DOCTYPE html>
<html <?php language_attributes(); ?><?php echo $gabos_html_class; ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class($gabos_body_class); ?>>
<?php wp_body_open(); ?>
