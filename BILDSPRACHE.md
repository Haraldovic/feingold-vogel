# Bildsprache und Umsetzung – 20. November 2026

Die drei Websites behalten ihre eigenen Schwerpunkte: Markeneinstieg und Schmuckthemen bei Feingold Vogel, persönlicher Ankauf und Orientierung bei Nachlassgold, Gastgeber und geplante Gespräche bei Goldgezwitscher. Vogelzeichen, Logo-Unterzeilen, Schriftfamilien und Markenwechsel verbinden sie. Die jeweiligen Unterzeilen behalten ihren eigenen Text.

## Fotografien

- `assets/dietmar-portrait-v13-1120.webp` und `-640.webp`: Hintergrundbearbeitung des vorhandenen Dietmar-Porträts im Anzug. Heller Steinfarbton, natürliche Struktur, bereinigter Freistellrand. Bildbearbeitung mit dem eingebauten Bildwerkzeug; lokale Exporte lediglich skaliert und als WebP komprimiert.
- `assets/dietmar-mikrofon-v13-1120.webp` und `-640.webp` (Feingold Vogel und Goldgezwitscher): vorhandenes Mikrofonporträt mit warmem, zurückgenommenem Hintergrund; das Blatt oben rechts entfernt. Keine erfundene Studioeinrichtung.
- Saphirkette: unveränderte echte Produktaufnahmen aus dem Kundenkatalog. Kein generativ veränderter Stein, keine ergänzte Fassung, keine erfundenen Produkte. Die Produktseite bleibt als Anschauungsbeispiel unter der bestehenden URL erhalten. Auf der Startseite und der Schmuckübersicht wird sie nicht als aktuelles Angebot präsentiert.
- Goldbarren: vorhandene lizenzierte Aufnahme von Scottsdale Mint. Die einzelnen Edelsteinaufnahmen behalten die vorhandenen Quellen und Lizenzhinweise.

Die neuen Porträtdateien wurden mit image_gen als Bearbeitungen erstellt. Bestehende Originaldateien bleiben erhalten. Die Hintergründe sind Bearbeitungen und belegen keine tatsächlichen Geschäftsräume. Öffentliche Bildnachweise nennen die Bearbeitung.

## Verwendete Bildprompts

### Anzugporträt

Use case: identity-preserve, precise background replacement. Edit this exact client portrait for the website of his digital precious-metal business. The input contains a real man in a navy blazer and light blue shirt against a transparent background. Change ONLY the background and clean the white cutout fringe. Keep the entire man pixel-faithful wherever possible: exactly the same face, age, facial structure, expression, eyeglasses, hair, beard stubble, pose, body, blue shirt, navy blazer, jacket seam and lighting. Do not beautify or regenerate his face. Replace the empty background with a restrained, realistic matte warm light limestone-grey studio backdrop, softly lit from the left with a very subtle organic tonal falloff, no scene, no props, no gradient graphics, no vignette. Refined professional portrait, photographic natural texture, quiet and credible, not a luxury advertisement cliché. Crop in an elegant 4:5 portrait frame, man occupying central-right 78 percent, with a little air above head and complete existing shoulders visible. Do not add hands or invent unseen body. Preserve original skin imperfections and details. No text, logos, jewellery, gold decorations or objects. Output high-resolution photograph, not illustration.

### Mikrofonporträt

Use case: identity-preserve / precise-object-edit. Edit this exact real client photograph for his forthcoming interview videocast website. Keep the man completely unchanged: exact face, eyes, eyeglasses, hair, skin, expression, head, hand, fingers, elbow, watch, shirt, pose and body. Keep the existing microphone, metal grille, support and pop-filter unchanged in position, shape and detail. Preserve real photo texture; absolutely no skin smoothing or face beautification. Only change the BACKGROUND: remove the plant leaf at upper right and recolor the existing vertical wooden wall from cold white to a restrained warm light putty-grey, retaining the exact vertical grooves and subtle real painted-wood texture, with gentle warm natural illumination. Do not create a studio, lights, equipment, furniture, jewellery or props. Maintain the existing portrait composition and scale, sufficient space above head, matching the original image aspect ratio. High resolution and natural detail, no text or graphics or vignette. This should look like the same candid real photo, professionally background-retouched, not a generated portrait.

## Grenzen der Vorbereitung

Goldgezwitscher ist ausdrücklich ein Vorab-Auftritt: keine erfundenen Folgen, Gäste, Reichweiten oder Sponsoren. Drei freie Sponsorenplätze sind vorgesehen. Der Shop ist noch nicht aktiv; das spätere System und seine Zuordnung werden mit Dietmar festgelegt. Produktansichten und Informationsstruktur sind dafür vorbereitet, jedoch noch keine Wix-/Shopify-Integration.

Die laufenden Vorschau-Domains, Suchmaschinen-Sperre und vorhandenen Rechtstexte bleiben bestehen. Vor dem Umzug werden endgültige Domains, Hostinger-Vertrag, tatsächliche Kontaktverarbeitung, Bildfreigaben und Rechtstexte für den echten Betrieb gemeinsam finalisiert. Die statischen Kontaktformulare öffnen derzeit einen E-Mail-Entwurf.

Nachlassgold: Vorbereitung des privaten Hostinger-Kursdiensts unter `hosting/hostinger/`. Einrichtung und erster echter API-Lauf benötigen den vorgesehenen Hostinger-Webspace und einen Metals.Dev-Schlüssel. Der Schlüssel gehört weder ins Repository noch in den Browser. Die aktuelle Vorschau kennzeichnet weiterhin NBP-Referenz und Archivwerte korrekt.


## Revision 15 – Markenauftritt vor Shopstart

Die Startseite führt mit einem Einleitungstext in Feingold Vogel ein. Hero und Themenbilder illustrieren die Marke; sie behaupten keine Verfügbarkeit der gezeigten Schmuckstücke. Der zukünftige Bestand mit konkreten Produktdaten und Preisen erscheint erst mit dem Shopstart. Die Schmuckübersicht beschreibt Materialien und Beratung. Die Originalseite zur Saphirkette bleibt als Anschauungsbeispiel erhalten, wird aber nicht mehr in der Hauptpräsentation oder im Footer beworben.

Neue reale Fotografien unter der Pexels-Lizenz, abgerufen am 20.11.2026:

- Ron Lach: https://www.pexels.com/photo/a-woman-with-gold-necklaces-9489731/ (4160 × 6240). Lokale responsive Exporte: `assets/gold-getragen-v15-640.webp`, `-1280.webp`, `-1800.webp`. Schmuck getragen zu einer hellen Bluse, Ausschnitt über CSS.
- Castorly Stock: https://www.pexels.com/photo/gold-and-diamond-jewelry-3641059/ (6000 × 4000). Exporte: `assets/schmuck-seide-v15-640.webp`, `-960.webp`, `-1600.webp`.
- Lizenz: https://www.pexels.com/license/ . Freie Website- und Werbenutzung; Attribution nicht vorgeschrieben. Fotografen und Quellen werden dennoch unter `bildnachweise.html` genannt. Keine Empfehlung durch die abgebildeten Personen oder Anbieter wird behauptet.

Keine generative Änderung dieser Schmuckfotos. Nur Skalierung und WebP-Kompression. Kein Abruf von Pexels beim Laden der Website; sämtliche Fotodateien sind lokal. Die bestehende Markenleiste und die unterschiedlichen Logo-Unterzeilen bleiben unverändert. Der Schmuckeinstieg enthält keinen Produktpreis, keine Verfügbarkeitsaussage und keinen Kaufen-Button.
