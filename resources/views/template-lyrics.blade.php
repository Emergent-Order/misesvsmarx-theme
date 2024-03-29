{{--
  Template Name: Lyrics Template
--}}

@extends('layouts.app')

@section('content')
  <div id="hero" class="header bg-red-dark">
    <div class="flex container mx-auto justify-between items-center">
      <div class="col w-full lg:w-7/12 lg:pr-4">
        <div class="responsive-embed">
          @php the_field('header_video') @endphp
        </div>
      </div>
      <div class="col w-full lg:w-5/12 lg:pl-4">
        @php the_field('header_intro') @endphp
      </div>
    </div>
  </div>
  <div id="intro">
    <div class="container mx-auto">
      <div class="wrap">
        @php the_field('instructions') @endphp
      </div>
    </div>
  </div>
  <Lyrics id="lyrics">
    @while(have_posts()) @php the_post() @endphp
      @include('partials.content-page')
    @endwhile
  </Lyrics>
  <div id="footer">
    <div class="flex container mx-auto justify-start items-start">
      <div id="left-col" class="col w-full lg:w-1/2">
        @php the_field('left') @endphp
      </div>
      <div id="right-col" class="col w-full lg:w-1/2">
        @php the_field('right') @endphp
      </div>
    </div>
  </div>
  <MediaPlayer url="{!! App::audio() !!}" />
@endsection
