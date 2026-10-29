<?php
/*
Template Name: Contact Page
*/

$post_id = get_queried_object_id();
$phone = gabos_2026_text('number', $post_id, GABOS_2026_PHONE);
$phone_hours = gabos_2026_text('contact_phone_hours', $post_id, GABOS_2026_PHONE_HOURS);
$email_res = gabos_2026_text('email_res', $post_id, GABOS_2026_EMAIL_RES);
$email_admin = gabos_2026_text('email_admin', $post_id, GABOS_2026_EMAIL_ADMIN);
$email_res_label = gabos_2026_text('email_res_label', $post_id, GABOS_2026_EMAIL_RES_LABEL);
$email_admin_label = gabos_2026_text('email_admin_label', $post_id, GABOS_2026_EMAIL_ADMIN_LABEL);
$hours_lines = gabos_2026_contact_hours_lines($post_id);

$gabos_locked = true;
require get_template_directory() . '/template-parts/document-open.php';
?>
<div class="wrapper page-contact" data-scrollable="0">
    <?php require get_template_directory() . '/template-parts/curtains.php'; ?>
    <div class="navWrapper">
        <div class="linkContainer">
            <div class="details item">
                <p>
                    <?php foreach ($hours_lines as $line) : ?>
                        <?php list($days, $time) = gabos_2026_hour_parts($line); ?>
                        <span class="hours-line">
                            <?php if ($time) : ?>
                                <span class="hours-days"><?php echo esc_html($days); ?></span>
                                <span class="hours-time"><?php echo esc_html($time); ?></span>
                            <?php else : ?>
                                <?php echo esc_html($line); ?>
                            <?php endif; ?>
                        </span>
                    <?php endforeach; ?>
                </p>
                <p>&nbsp;</p>
                <?php if ($phone !== '') : ?>
                    <p>T: <?php echo esc_html($phone); ?></p>
                <?php endif; ?>
                <?php if ($phone_hours !== '') : ?>
                    <p><?php echo esc_html($phone_hours); ?></p>
                <?php endif; ?>
            </div>
            <?php if ($email_res !== '') : ?>
                <p class="heading"><?php echo esc_html($email_res_label); ?></p>
                <a class="email item" href="<?php echo esc_url('mailto:' . $email_res); ?>"><?php echo esc_html($email_res); ?></a>
            <?php endif; ?>
            <?php if ($email_admin !== '') : ?>
                <p class="heading"><?php echo esc_html($email_admin_label); ?></p>
                <a class="email item" href="<?php echo esc_url('mailto:' . $email_admin); ?>"><?php echo esc_html($email_admin); ?></a>
            <?php endif; ?>
        </div>
    </div>
</div>
<?php require get_template_directory() . '/template-parts/document-close.php'; ?>
