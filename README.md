# KözösTér

Egyszerű, jóváhagyás-alapú webes közösségi oldal Laravel 13 és MySQL használatával. A felhasználók regisztrálhatnak, adminisztrátori jóváhagyás után beléphetnek, felhasználókra kereshetnek, ismerősnek jelölhetik egymást, értesítéseket kezelhetnek, kapcsolatot szüntethetnek meg és blokkolhatnak másokat.

## Funkciók

- Regisztráció névvel, email címmel és jelszóval, adminisztrátori elbírálással.
- Belépés csak jóváhagyott felhasználóknak.
- Kereshető és lapozható felhasználói lista név és email alapján.
- Ismerősnek jelölés, elfogadás, elutasítás és kapcsolat megszüntetése.
- Felhasználók blokkolása és tiltás feloldása; blokkolt felhasználók nem jelölhetnek és nem jelennek meg releváns listákban.
- Adatbázisban tárolt értesítések olvasott/olvasatlan állapottal.
- Feature tesztek a fő üzleti folyamatokra.

## Követelmények

- PHP 8.3 vagy újabb
- Composer
- Node.js 20 vagy újabb és npm
- MySQL 8 vagy MariaDB 10.6+

## Telepítés

```bash
git clone https://github.com/gellert4/WebPage.git
cd WebPage
composer install
cp .env.example .env
php artisan key:generate
```

Hozd létre a `kozoster` adatbázist MySQL-ben, majd állítsd be a `.env` fájlban a `DB_*` értékeket. Ezután:

```bash
php artisan migrate --seed
npm install
npm run build
php artisan storage:link
php artisan serve
```

Az alkalmazás a `http://127.0.0.1:8000` címen érhető el.

Seedelt admin:

```text
Email: admin@kozoster.local
Jelszó: password
```

Éles környezetben ezt a jelszót azonnal cseréld le.

## Tesztelés

A tesztek alapértelmezés szerint izolált SQLite memóriadatbázist használnak, így nem módosítják a fejlesztői MySQL adatbázist:

```bash
php artisan test
```

## AI-alapú fejlesztési folyamat

### Használt eszközök és modellek

- **IDE és coding assistant:** Visual Studio Code, GitHub Copilot Chat és Copilot coding agent workflow.
- **AI modell:** a fejlesztés ebben a VS Code Copilot munkamenetben történt. A Copilot felülete a backend modell konkrét verzióazonosítóját ebben a környezetben nem tette elérhetővé, ezért nem állítok ellenőrizetlenül GPT/Claude/Gemini modellnevet.
- **Nem AI-eszközök:** Laravel 13, Composer, PHP 8.5, Vite, npm, PHPUnit, MySQL/SQLite és PowerShell. Ezeket futtatással, nem generatív javaslatként használtam.

### Feladattípusok és workflow

Az AI-t a lokális kód felderítésére, Laravel konvenciók szerinti adatmodell- és controller-tervezésre, Blade nézetekre, feature tesztekre és README-szerkesztésre használtam. A workflow minden funkciónál ugyanaz volt: kis lokális felület kijelölése, minimális implementáció, célzott futtatás, hiba javítása, majd külön git commit.

Reprezentatív prompt: „Implementáld a regisztráció-jóváhagyás, ismerősi kérés, elfogadás/elutasítás, blokkolás és adatbázis-értesítés folyamatát Laravel natív Eloquent és Notification mintákkal, feature tesztekkel.”

### Ellenőrzés és döntések

- A migrációkat Artisan futtatással, a route-okat `route:list` paranccsal, a Blade nézeteket `view:cache` paranccsal, a CSS/JS-t `npm run build` paranccsal ellenőriztem.
- Az üzleti viselkedést 5 feature teszt és 21 assertion fedi le: regisztráció, admin jóváhagyás, belépés, értesítések, ismerősi döntés, blokkolás/feloldás és keresés.
- A jelszavakat Laravel hashed cast kezeli; a formok CSRF-védettek; minden admin és felhasználói művelet auth/middleware és szerveroldali validáció mögött van.
- Az AI egyik első tesztjavaslata 2 értesítést várt a jelölőnél. A folyamat tényei alapján ez hibás volt: jelöléskor a címzett, elfogadáskor a jelölő kap értesítést, ezért a tesztet 1 értesítésre javítottam.
- Több lehetséges adatkezelési megoldás közül a Laravel database notificationt és külön `friend_requests`/`blocks` táblákat választottam, mert ezek explicit állapotot, auditálható adatot és egyszerű tesztelhetőséget adnak.

### Rövid értékelés

A leghasznosabb az volt, hogy a Copilot gyorsan össze tudta állítani a Laravel rétegek közötti ismétlődő szerkezetet, miközben a lokális tesztfuttatás adta a döntő visszajelzést. Kevésbé volt alkalmas a Windows PHP-környezet automatikus felismerésére és az értesítési teszt kezdeti darabszámának helyes megítélésére. A legtöbb manuális ellenőrzés a jogosultsági határokra, a blokkolás kétirányú kizárására, a notification címzettekre és a MySQL konfigurációra kellett.

## Git történet

A fejlesztés tematikus commitokban készült: Laravel bootstrap, domain modell és értesítések, auth és közösségi üzleti logika, felület, majd feature tesztek és dokumentáció. Ez megkönnyíti a változások áttekintését és visszakeresését.
