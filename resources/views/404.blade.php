@extends('layouts.app')

@php
  $image = get_field('footer_image', 'option');
  $img_src = wp_get_attachment_image_url( $image, 'full' );
  $img_srcset = wp_get_attachment_image_srcset($image);
@endphp

@section('content')
  <div class="image-background">
    <img src="{!! $img_src !!}" srcset="{!! $img_srcset !!}"/>
  </div>
  @include('partials.page-header')
  @if (!have_posts())
    <div class="container mx-auto text-center justify-center items-center">
      <div class="alert alert-warning">
        {{ __('Sorry, but the page you were trying to view does not exist.', 'sage') }}
      </div>
      <a href="/">← Go Back to the App</a>
    </div>
  @endif
@endsection
