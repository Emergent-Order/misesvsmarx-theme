{{--
  Template Name: Lyrics Template
--}}

@extends('layouts.app')

@section('content')
  <div class="header bg-red-dark">
    <div class="flex container mx-auto py-20">
      <div class="col-left w-1/2 px-8">
        <div class="responsive-embed">
          @php the_field('header_video') @endphp
        </div>
      </div>
      <div class="col-right w-1/2 px-8">
        @php the_field('header_intro') @endphp
      </div>
    </div>
  </div>
  <div id="intro" class="container mx-auto">
    @php the_field('instructions') @endphp
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
  <media-player data="@php the_field('audio_file') @endphp" />
@endsection
