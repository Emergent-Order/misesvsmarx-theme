<header class="banner bg-gold-light">
  <div class="container mx-auto py-4">
    <a class="brand hidden lg:flex" href="{{ home_url('/') }}">
      <img src="@asset('../resources/assets/images/logo-full.svg')" />
    </a>
    <a class="brand flex justify-start lg:hidden" href="{{ home_url('/') }}">
      <img src="@asset('../resources/assets/images/logo.svg')" />
      <img src="@asset('../resources/assets/images/logo-sub-oneline.svg')" />
    </a>
    <nav class="nav-primary">
      @if (has_nav_menu('primary_navigation'))
        {!! wp_nav_menu(['theme_location' => 'primary_navigation', 'menu_class' => 'nav']) !!}
      @endif
    </nav>
  </div>
</header>
