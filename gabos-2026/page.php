<?php
$gabos_locked = true;
require get_template_directory() . '/template-parts/document-open.php';
?>
<div class="wrapper page-contact" data-scrollable="0">
    <?php require get_template_directory() . '/template-parts/curtains.php'; ?>
    <div class="navWrapper">
        <div class="linkContainer">
            <div class="details item">
                <?php while (have_posts()) : the_post(); ?>
                    <h1 class="heading"><?php the_title(); ?></h1>
                    <?php the_content(); ?>
                <?php endwhile; ?>
            </div>
            <a class="item" href="<?php echo esc_url(home_url('/')); ?>">Home</a>
        </div>
    </div>
</div>
<?php require get_template_directory() . '/template-parts/document-close.php'; ?>
