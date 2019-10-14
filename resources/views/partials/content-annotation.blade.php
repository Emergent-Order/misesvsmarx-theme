<article @php post_class() @endphp>
  <header class="container mx-auto">
    <h1 class="entry-title">{!! get_the_title() !!}</h1>
  </header>
  <div id="app" class="entry-content container mx-auto">
    @php the_field('video_url') @endphp
    @php the_content() @endphp
  </div>
</article>
