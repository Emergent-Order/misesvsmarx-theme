<article @php post_class() @endphp>
  <header class="container mx-auto">
    <div class="w-full lg:w-3/5 mx-auto">
      <label class="breadcrumb">
        <a href="/">← Back to App</a>
      </label>
      <h1 class="entry-title">{!! get_the_title() !!}</h1>
    </div>
  </header>
  <div id="app" class="entry-content container mx-auto">
    <div class="w-full lg:w-3/5 mx-auto">
      <div class="responsive-embed">
        @php the_field('video_url') @endphp
      </div>
      @php the_content() @endphp
    </div>
  </div>
</article>
