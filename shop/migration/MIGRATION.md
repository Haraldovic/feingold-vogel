# Feingold Vogel – Shop-Vorschau und Shopify-Vorbereitung

Stand: 20. November 2026

## Was vorliegt

Die Shop-Vorschau gehört zu Feingold Vogel. Nachlassgold bleibt der Bereich für den Ankauf; Goldgezwitscher bleibt der Videocast. Die Vorschau zeigt Kollektionen, Produktseiten, Größenauswahl und einen lokalen Demo-Warenkorb. Sie ist eine eigenständige HTML/CSS/JavaScript-Umsetzung, keine Shopify-Installation, kein installierbares Liquid-Theme und keine Kopie des Quellcodes eines kommerziellen Themes.

Als gestalterische Referenz dient **Prestige von Maestrooo**. Der offizielle Shopify Theme Store nennt am 20. November 2026 **400 USD** als Theme-Preis. Es wurde kein Theme gekauft oder installiert. Eine spätere Nutzung des Original-Themes benötigt eine reguläre Lizenz; Shopify-Tarif und gegebenenfalls Apps kommen separat hinzu.

## Vorbereitete Produktdaten

`products-draft.csv` enthält **6 Musterprodukte, 34 Größenvarianten und 9 Bildverweise**. Die Datei nutzt die aktuellen Shopify-Spaltennamen und wurde als UTF-8 mit Kommas und LF-Zeilenenden erzeugt.

- Titel beginnen mit `MUSTER –`, Handles mit `muster-`.
- Alle Produkte erhalten `Status=draft` und `Published on online store=FALSE`.
- Der Tag `demo-vorschau` macht sie im Admin auffindbar.
- Jede Variante erhält Inventar-Tracker `shopify`, Bestand `0` und Verkaufsregel `deny`.
- Preise und Größen dienen ausschließlich der Demonstration. Materialien und Steinbezeichnungen sind keine geprüften Produktmerkmale.
- Die zusätzliche reine Bildzeile enthält nur Handle und Bildinformationen. Sie gehört zur Galerie der Musterkette und ist keine weitere Variante.

Die Bildadressen zeigen auf lokale Assets der veröffentlichten Feingold-Vogel-Vorschau. Sie müssen beim Import öffentlich erreichbar sein. Die drei aus Nachlassgold übernommenen Ringfotos sind mit dieser Shop-Version auch unter Feingold Vogel bereitzustellen. Bildrechte und Quellen bleiben im Bildnachweis dokumentiert.

## Übernahme in einen echten Shopify-Store

1. Einen Shopify-Store einrichten und das gewählte Theme regulär konfigurieren. Die Vorschau wird dabei in Shopify-Sections und -Templates nachgebaut; sie lässt sich nicht als Theme hochladen.
2. Bei Bedarf die CSV als **Entwürfe** importieren und im Admin Titel, Varianten, Bilder, Bestand und Status prüfen. Kein vorhandenes Sortiment überschreiben. Ein tatsächlicher Shopify-Import wurde hier noch nicht durchgeführt.
3. Kollektionen für Ringe, Ketten und Armbänder anlegen; die CSV-Spalte `Type` unterstützt die Zuordnung. Produktmerkmale und Filter anschließend mit echten Daten ergänzen.
4. Vor einem Verkaufsstart die Musterprodukte löschen oder vollständig durch freigegebene echte Produkte ersetzen. Echte Preise, Materialdaten, Größen, Gewichte, Verfügbarkeiten und Produktfotos hinterlegen.
5. Shopify-Warenkorb und Checkout anbinden sowie Zahlung, Versand, Steuern, geschäftsspezifische Rechtstexte und Domain einrichten und testen. Erst danach echte Produkte gezielt veröffentlichen. Bei mehreren Lagerstandorten Bestände gesondert einrichten; die Mengenangabe der Produkt-CSV gilt laut Shopify nur für einen Standort.

## Offizielle Referenzen

- Produkt-CSV und aktuelles Spaltenschema: https://help.shopify.com/en/manual/products/import-export/using-csv
- Offizielle Beispiel-CSV: https://help.shopify.com/cdn/shopifycloud/product-knowledge/production/csv/product_template.csv
- Importablauf: https://help.shopify.com/en/manual/products/import-export/import-products
- Theme Prestige: https://themes.shopify.com/themes/prestige/presets/prestige
