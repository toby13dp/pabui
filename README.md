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
- **Componentenbibliotheek**: sectie, grid, stack, hero, navbar, kaarten, media-blocks, statistieken, formulieren, lijsten, quotes, knoppen, tekst, afbeeldingen en dividers.
- **Stylinginspector**: tekst/label, fontgrootte, achtergrond/tekstkleur, padding/margin, breedte/hoogte, gap, uitlijning (flex & tekst), hoekradius, rand en schaduw-presets.
- **Elementacties**: dupliceren, verwijderen (ook via Backspace/Delete), en live metadata over het aantal subcomponenten.
- **Export**: HTML-kopie en download met ingebedde stijlen voor alle componenttypen.
- **Raster & snap**: raster zichtbaar/invisible plus snap spacing optioneel.

## Tips
- Selecteer containers (stack/grid) om snel `gap` of `uitlijning` aan te passen.
- Voor image-componenten kun je in het tekstveld een externe URL plakken; de placeholder wordt dan vervangen door een `<img>`.
- Gebruik **Dupliceer** om snel varianten te maken en vervolgens eigen padding/kleuren toe te passen.
