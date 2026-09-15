@extends('layouts.app')
@section('content')
<section class="auth-layout"><div class="auth-intro"><p class="eyebrow">KÖZÖS TÉR</p><h1>Kapcsolódj azokhoz, akik számítanak.</h1><p>Belépés után megtalálod a közösséged, és te döntöd el, kikkel tartod a kapcsolatot.</p></div><div class="form-card"><p class="eyebrow">ÜDV ÚJRA</p><h2>Belépés</h2><p class="muted">A jóváhagyott fiókok azonnal használhatják a KözösTeret.</p>
<form method="POST" action="{{ route('login.store') }}" class="stack">@csrf
    @if(session('status'))<div class="notice">{{ session('status') }}</div>@endif
    <label>Email cím<input type="email" name="email" value="{{ old('email') }}" required autofocus></label>@error('email')<p class="field-error">{{ $message }}</p>@enderror
    <label>Jelszó<input type="password" name="password" required></label>
    <label class="checkbox"><input type="checkbox" name="remember"> Emlékezz rám</label>
    <button class="button primary" type="submit">Belépés</button>
</form><p class="form-footer">Még nincs fiókod? <a href="{{ route('register') }}">Regisztrálj itt</a></p></div></section>
@endsection