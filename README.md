# Bordje – calorieën & macro's bijhouden

Een eenvoudige calorieteller voor je iPhone. Je installeert hem via Safari op je beginscherm, dus zonder App Store en zonder Mac.

## Functies
- **Dagboek** per dag met ontbijt, lunch, avondeten en tussendoor. Met de pijltjes blader je naar andere dagen.
- **Calorieën**: een ring laat zien hoeveel kcal je over hebt (of hoeveel je te veel hebt gegeten).
- **Macro's**: koolhydraten, eiwit en vet in gram, afgezet tegen je doel. Per maaltijd en per product. Ook vezels, suikers, verzadigd vet en zout.
- **Voedingsdatabase**:
  - **Open Food Facts**: de grootste open voedingsdatabase ter wereld, met miljoenen merkproducten, waaronder veel Nederlandse supermarktproducten. Producten uit Nederland en België staan bovenaan in de zoekresultaten.
  - **Barcodescanner** met de camera, of typ de barcode zelf in.
  - **Ingebouwde basislijst** met ongeveer 170 gewone voedingsmiddelen (brood, groente, fruit, vlees, zuivel enzovoort), met porties zoals "1 snee" of "1 stuk". Werkt ook offline.
  - **Eigen producten** maken en **snel calorieën toevoegen**.
- **Caloriedoel**: zelf invullen, of laten berekenen uit geslacht, leeftijd, lengte, gewicht, activiteit en doel (Mifflin-St Jeor).
- **Macroverdeling** instellen met kant-en-klare keuzes (Gebalanceerd, Eiwitrijk, Sportief, Koolhydraatarm, Keto) of met schuifjes.
- **Back-up** maken en terugzetten. Al je gegevens blijven op je eigen iPhone.

## Installeren op je iPhone

De app moet op een HTTPS-adres staan, anders werken de camera en het offline gebruik niet. GitHub Pages is gratis en het makkelijkst.

### 1. GitHub Pages aanzetten (eenmalig)
1. Ga op github.com naar de repository → **Settings** → **Pages**.
2. Kies bij *Source*: **Deploy from a branch**.
3. Kies de branch **main** en de map **/(root)**. Klik op **Save**.
4. Na een minuut of twee staat de app op:
   `https://pauldekoning78.github.io/bordje/`

> Gratis GitHub Pages werkt alleen als de repository **openbaar** is. In de app staan geen persoonlijke gegevens, want die worden alleen op je telefoon bewaard.

### 2. Op het beginscherm zetten
1. Open de link hierboven in **Safari** op je iPhone (niet in Chrome).
2. Tik op het **deel-icoon** (vierkantje met pijl omhoog).
3. Kies **Zet op beginscherm** en tik op **Voeg toe**.
4. Open **Bordje** vanaf je beginscherm. De app opent schermvullend, net als een gewone app.

Bij de eerste keer scannen vraagt de app om cameratoegang. Tik op **Sta toe**.

## Goed om te weten
- **Online zoeken** heeft internet nodig. Het dagboek, de basislijst en je eigen producten werken ook offline.
- Open Food Facts wordt gevuld door gebruikers. Controleer bij twijfel de waarden op het etiket. Ontbreekt een product, dan maak je het zelf aan (de barcode wordt dan onthouden).
- Gegevens staan in de opslag van de app op je iPhone. Als je de app van je beginscherm verwijdert, ben je ze kwijt. Maak dus af en toe een **back-up** (Doelen → Back-up maken) en bewaar die in Bestanden of iCloud Drive.

## Techniek
Een PWA in gewone HTML, CSS en JavaScript, zonder build-stap.
- `index.html`, `styles.css`, `app.js`: de app
- `foods.js`: de ingebouwde basislijst
- `sw.js`: service worker voor offline gebruik
- `vendor/zxing.min.js`: barcodelezer ([ZXing](https://github.com/zxing-js/library), Apache-2.0)
- Voedingsdata: [Open Food Facts](https://world.openfoodfacts.org) (ODbL)

Lokaal testen: `python3 -m http.server` in deze map en daarna `http://localhost:8000` openen.
