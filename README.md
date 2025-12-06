# PabUI Page Builder

Een lichte, statische HTML pagebuilder met drag & drop-componenten, uitgebreide inspectoren, sjabloonblokken en exportmogelijkheden.

## Gebruik
1. Start een eenvoudige webserver, bijvoorbeeld:
   ```bash
   python -m http.server 8000
   ```
2. Open `http://localhost:8000` in je browser.
3. Sleep componenten vanuit de linkerkolom naar het canvas, klik om eigenschappen te wijzigen en exporteer de HTML wanneer je klaar bent.

De builder bewaart de layout in `localStorage` via de knop **Opslaan** en herstelt deze met **Herstel**.

## Wat is er beschikbaar?
- **Projectstructuur**: meerdere pagina's, project-instellingen (titel, meta, favicon, kleuren, fonts, container breedte) en pop-upcatalogus worden bewaard in `localStorage`.
- **Componentenbibliotheek**: sectie, row/column (Bootstrap), grid, stack, hero, navbar, kaarten, media-blocks, statistieken, formulieren, tabs, accordion, video, lijsten, quotes, knoppen, tekst, afbeeldingen en dividers.
- **Stylinginspector**: tekst/label, fontgrootte, achtergrond/tekstkleur, padding/margin, breedte/hoogte, gap, gutters, col-breedtes per breakpoint, flexuitlijning, zichtbaarheid, utilities, extra class, hoekradius, rand en schaduw-presets.
- **Elementacties**: dupliceren, verwijderen (ook via Backspace/Delete), en live metadata over het aantal subcomponenten.
- **Export**: HTML-kopie en download met Bootstrap-koppeling, globale settings, pop-upscripts en ingebedde stijlen.
- **Raster & snap**: raster zichtbaar/invisible plus snap spacing optioneel, device-toggle voor desktop/tablet/mobile viewports.

## Tips
- Selecteer containers (stack/grid) om snel `gap` of `uitlijning` aan te passen.
- Voor image-componenten kun je in het tekstveld een externe URL plakken; de placeholder wordt dan vervangen door een `<img>`.
- Gebruik **Dupliceer** om snel varianten te maken en vervolgens eigen padding/kleuren toe te passen.
