@extends('layouts.app')

@php
  $image = get_field('footer_image', 'option');
  $img_src = wp_get_attachment_image_url( $image, 'full' );
  $img_srcset = wp_get_attachment_image_srcset($image);

  $rows = get_field('404_page_content', 'option');
  $i = 1;
@endphp

@section('content')
  <div class="image-background">
    <img src="{!! $img_src !!}" srcset="{!! $img_srcset !!}"/>
  </div>
  @include('partials.page-header')
  @if (!have_posts())
    <div class="container mx-auto text-center justify-center items-center">
      <div class="w-full lg:w-1/2 mx-auto alert alert-warning">
        @if( $rows )
          @foreach($rows as $row)
            <span id="message-{{ $i }}" class="error-message hidden">{{ $row['text'] }}</span>
            @php $i++; @endphp
          @endforeach
        @else
          {{ __('Sorry, but the page you were trying to view does not exist.', 'sage') }}
        @endif
      </div>
      <button id="do-it-again" class="btn btn-dark default">
        {{ __('My marginal utility for bad econ jokes is still > 0', 'sage') }}
      </button>
      <a href="/">← Go Back to the App</a>
    </div>
  @endif
@endsection
