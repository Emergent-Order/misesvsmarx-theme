<header class="banner bg-gold-light">
  <div class="container mx-auto py-4">
    <a class="brand hidden lg:flex" href="{{ home_url('/') }}">
      @svg('../resources/assets/images/logo-full.svg', 'logo')
    </a>
    <a class="brand flex lg:hidden" href="{{ home_url('/') }}">
      @svg('../resources/assets/images/logo.svg', 'logo')
      @svg('../resources/assets/images/logo-sub-oneline.svg', 'logo')
    </a>
    <nav class="nav-primary">
      @if (has_nav_menu('primary_navigation'))
        {!! wp_nav_menu(['theme_location' => 'primary_navigation', 'menu_class' => 'nav']) !!}
      @endif
    </nav>
  </div>
</header>
