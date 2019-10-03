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
  <div id="intro" class="container mx-auto">
    <div class="row">
      @php the_field('instructions') @endphp
    </div>
  </div>
  @php
    $blocks = parse_blocks($post->post_content);
  @endphp
  {{-- <Lyrics blocks='{!! json_encode($blocks) !!}'></Lyrics> --}}
  <Lyrics id="lyrics">
    @while(have_posts()) @php the_post() @endphp
      @include('partials.content-page')
    @endwhile
  </Lyrics>
  <MediaPlayer post="@php echo urlencode(json_encode(get_field('audio_file'))) @endphp" />
@endsection
