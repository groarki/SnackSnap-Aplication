# SnackSnap - Kolekcja Przepisów Kulinarnych

## Opis projektu

SnackSnap to aplikacja webowa umożliwiająca użytkownikom tworzenie i zarządzanie cyfrową książką kucharską. Aplikacja została stworzona z wykorzystaniem wzorca MVC i Node.js.

## Funkcjonalności

- Dodawanie nowych przepisów
- Edytowanie i usuwanie przepisów
- System oceniania przepisów (1-5 gwiazdek) oraz komentowanie praepisu (opcjonalnie)
- Wyszukiwanie przepisów po nazwie, autorze
- Filtrowanie po kategoriach

## Wymagania

- Node.js (wersja 16+)
- MongoDB Atlas lub lokalna instancja MongoDB
- NPM

## Instalacja i uruchomienie

1. Sklonuj repozytorium: `git clone`
2. Zainstaluj zależności: `npm install`
3. Uzupełni następujące dane usera w pliku `.env`:

- DB_USER=twojuser
- DB_PASS=twojehaslo
- DB_NAME=nazwaklastera

4. Dla podłączenia do nowej bazy danych wklej "connection string" do **MONGODB_URI** W pliku `config.js`

Connection string weżmiesz w zakladce "Connect" -> "Drivers"

5. Wklej hasło i usera w miejsca wskazane w linku

Wszystkie zmienne przekazuj jako template string

6. Zmienną DB_NAME wklej w to miejsce:
   ....mongodb.net/**${DB_NAME}**?retryWrites...

7. Uruchom aplikację przy pomocy poleceń `npm start` lub `npm run dev`
8. Otwórz przeglądarkę: `http://localhost:3000`

## Struktura aplikacji

### Modele (Models)

- `Recipe.js` - Model przepisu z metodami CRUD i walidacją

### Kontrolery (Controllers)

- `HomeController.js` - Obsługa strony głównej
- `RecipeController.js` - Obsługa interakcji użytkownika z przepisami

### Widoki (Views)

- `home.ejs` - Strona główna
- `recipes.ejs` - Lista przepisów
- `add-recipe.ejs` - Formularz dodawania
- `edit-recipe.ejs` - Formularz edycji
- `recipe-details.ejs` - Szczegóły przepisu

#### Dodatkowe widoki

- `footer.ejs` - Footer
- `navigation.ejs` - Header wraz z poszukiwarką
- `recipie-card.ejs` - Krótka kartka przepisu

## Biblioteki zewnętrzne

- Express.js - Framework webowy
- EJS - Template engine
- MongoDB - Baza danych
- Bootstrap 5 - Framework CSS
- Font Awesome - Ikony
- iziToast - Notyfikacje

## Przykładowe dane

Aplikacja automatycznie inicjalizuje przykładowe przepisy przy pierwszym uruchomieniu.

#### Przy wykorzystaniu pustej bazy danych można dodać swój przepis wpisując

- Nazwy przepisu np. **Gulasz po węgiersku**
- Imie i nazwisko autora
- Kategorię przepisu (Przystawki, Dania główne, Desery itd.)
- Nazwy składników
- Instrukcję przygotowania
