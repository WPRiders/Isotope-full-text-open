<?php
/**
 * Generate articles
 *
 * @return string
 */
function wpr_get_articles() {
	$output = '';

	$args = array(
		'post_type'      => 'wpr_articles',
		'post_status'    => 'publish',
		'posts_per_page' => - 1,
		'order'          => 'ASC',
		'orderby'        => 'menu_order',
	);

	$posts = new WP_Query( $args );

	if ( $posts->have_posts() ) {
		$i = 0;
		$output .= '<div class="wpr-display-articles"><div class="wpr-display-articles-filter">';
		$output .= '<a href=".filters-show" id="wpr-toggle"><span></span></a>';
		$output .= '<ul id="filters" class="filters-show">';
		$output .= '<li><a class="button selected" data-filter="*">' . __( 'Show all', 'wpr-lang' ) . '</a></li>';

		$categories = get_terms( array(
			'taxonomy'   => 'wpr_article',
			'hide_empty' => true,
		) );

		if ( ! empty( $categories ) ) {
			foreach ( $categories as $category ) {
				$output .= '<li><a class="button" data-filter=".' . $category->slug . '">' . $category->name . '</a></li>';
			}
		}

		$output .= '</ul></div>';

		$output .= '<div id="wpr-display-articles" class="wpr-grid">';
		while ( $posts->have_posts() ) {
			$posts->the_post();
			$output .= wpr_display_article( get_the_ID(), $i );
			$i ++;
		}
		$output .= '</div></div>';
	}
	wp_reset_postdata();

	return $output;
}

/**
 * Article construct
 *
 * @param $post_id
 *
 * @return string
 */
function wpr_display_article( $post_id, $i ) {
	$termsArray  = get_the_terms( $post_id, 'wpr_article' );
	$termsString = '';
	foreach ( $termsArray as $term ) {
		$termsString .= $term->slug . ' ';
	}

	$article = '<div id="post-' . $post_id . '" class="' . $termsString . 'show-full wpr-post-article" data-items="' . $termsString . '" data-id="#article-' . $post_id . '">';

	$image_size = 'full';
	if ( has_post_thumbnail( $post_id ) ) {
		$article .= '<div class="wpr-article-image">' . get_the_post_thumbnail( $post_id, $image_size ) . '</div>';
	}

	$article .= '<div class="wpr-article-content"><div class="wpr-excerpt"> ';
	$article .= '<h2>' . get_the_title( $post_id ) . '</h2>';
	$article .= '<div class="wpr-article-excerpt">' . get_the_excerpt( $post_id ) . '</div>';
	$article .= '<div class="wpr-article-read-more"><a href="#" data-read="' . get_the_permalink( $post_id ) . '">' . __( 'Read more', 'wpr-lang' ) . '</a></div>';
	$article .= '</div></div>';

	$article .= '<div class="border"></div>';
	$content         = get_the_content();
	$get_the_content = apply_filters( 'the_content', $content );
	$article .= '<div class="wpr-full-content port" id="article-' . $post_id . '">' . $get_the_content . '</div>';
	$article .= '<p class="wpr-sorting">' . $i . '</p>';
	$article .= '</div>';

	return $article;
}