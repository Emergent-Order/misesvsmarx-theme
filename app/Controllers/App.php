<?php

namespace App\Controllers;

use Sober\Controller\Controller;

class App extends Controller
{
    use Partials\Audio;

    public function siteName()
    {
        return get_bloginfo('name');
    }

    public static function title()
    {
        if (is_home()) {
            if ($home = get_option('page_for_posts', true)) {
                return get_the_title($home);
            }
            return __('Latest Posts', 'sage');
        }
        if (is_archive()) {
            return get_the_archive_title();
        }
        if (is_search()) {
            return sprintf(__('Search Results for %s', 'sage'), get_search_query());
        }
        if (is_404()) {
            return __('Not Found', 'sage');
        }
        return get_the_title();
    }

    public static function audio()
    {
        global $post;
        $data = get_field('audio_file');

        if ($data) {
          return $data['url'];
        } else {
          return 'empty';
        }
    }

    public static function annotations()
    {
      $args = array(
        'post_type' => 'annotation',
        'post_status' => 'publish',
        'nopaging' => true
      );

      $query = new \WP_Query($args);
      $posts = $query->get_posts();
      $output = [];

      foreach($posts as $post) {
        $blocks = parse_blocks($post->post_content);
        $content = '';
        foreach( $blocks as $block) {
          $content .= $block["innerHTML"];
        }

        $output[] = array(
          'id' => $post->ID,
          'slug' => $post->post_name,
          'title' => $post->post_title,
          'excerpt' => $post->post_excerpt,
          'content' => $content,
          'video_url' => get_field('video_url', $post->ID),
          'type' => get_field('type', $post->ID)
        );
      }

      return json_encode($output);
    }
}
