{{--
  Template Name: Lyrics Template
--}}

@extends('layouts.app')

@section('content')
  <div id="hero" class="header bg-red-dark">
    <div class="flex container mx-auto justify-between items-center py-20">
      <div class="col-left w-7/12 pr-4">
        <div class="responsive-embed">
          @php the_field('header_video') @endphp
        </div>
      </div>
      <div class="col-right w-5/12 pl-4">
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
  <media-player data="@php the_field('audio_file') @endphp" />
@endsection
