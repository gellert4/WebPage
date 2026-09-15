@extends('layouts.app')
@section('content')
<section class="auth-layout"><div class="auth-intro accent"><p class="eyebrow">CSATLAKOZZ</p><h1>Egy jó közösség azzal kezdődik, hogy belépsz.</h1><p>A regisztrációdat egy adminisztrátor hagyja jóvá. Erről email helyett itt, a következő belépéskor kapsz visszajelzést.</p></div><div class="form-card"><p class="eyebrow">ÚJ FIÓK</p><h2>Regisztráció</h2><form method="POST" action="{{ route('register.store') }}" class="stack">@csrf
    <label>Név<input type="text" name="name" value="{{ old('name') }}" required autofocus></label>@error('name')<p class="field-error">{{ $message }}</p>@enderror
    <label>Email cím<input type="email" name="email" value="{{ old('email') }}" required></label>@error('email')<p class="field-error">{{ $message }}</p>@enderror
    <label>Jelszó<input type="password" name="password" required></label>
    <label>Jelszó újra<input type="password" name="password_confirmation" required></label>@error('password')<p class="field-error">{{ $message }}</p>@enderror
    <button class="button primary" type="submit">Regisztráció elküldése</button>
</form><p class="form-footer">Van már fiókod? <a href="{{ route('login') }}">Lépj be</a></p></div></section>
@endsection