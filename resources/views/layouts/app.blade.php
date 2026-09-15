<!doctype html>
<html lang="hu">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $title ?? 'KözösTér' }}</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    <header class="topbar">
        <a class="brand" href="{{ auth()->check() ? route('dashboard') : route('login') }}"><span class="brand-mark">K</span><span>KözösTér</span></a>
        @auth
            <nav class="nav-links">
                <a href="{{ route('dashboard') }}">Kezdőlap</a>
                <a href="{{ route('users.index') }}">Közösség</a>
                <a href="{{ route('notifications.index') }}" class="notification-link">Értesítések @if(auth()->user()->unreadNotifications()->count())<span class="badge">{{ auth()->user()->unreadNotifications()->count() }}</span>@endif</a>
                @if(auth()->user()->is_admin)<a href="{{ route('admin.index') }}">Admin</a>@endif
                <form method="POST" action="{{ route('logout') }}">@csrf<button class="link-button" type="submit">Kilépés</button></form>
            </nav>
        @endauth
    </header>
    <main class="page-shell">
        @if(session('status'))<div class="flash success">{{ session('status') }}</div>@endif
        @if(session('error'))<div class="flash error">{{ session('error') }}</div>@endif
        @yield('content')
    </main>
</body>
</html>