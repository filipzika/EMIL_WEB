# Emil 2.0 — produktový web

Jednostránkový produktový web pro naučnou elektrotechnickou stavebnici
**Emil 2.0** (ForestBit Electronics). Vizuální styl vychází z brand
prezentace `Emil.pdf`, obrázky desek z dodaných renderů.

## Struktura

```
index.html              celá stránka (9 sekcí)
assets/css/style.css    styly — monochromatický technicistní vizuál
assets/js/main.js       navigace, reveal animace, přepínání desek, hotspoty, kontaktní formulář
assets/img/             emil-logo.svg
                        emil-deska-1.png, emil-deska-2.png, emil-deska-3.png (osazené desky pro sekci Anatomie desek)
                        emil-deska-2-hero.png (neosazená deska 2/3 pro hero)
                        emil-deska-2-pcb.png (nepoužito, ponecháno pro pozdější použití)
                        emil-box.jpg, emil-etiketa.jpg
```

Žádný build, žádné závislosti — statické soubory. Fonty (Poppins,
JetBrains Mono) se načítají z Google Fonts.

## Spuštění

```bash
python -m http.server 4321
```

Pak otevřít <http://localhost:4321>. Kvůli relativním cestám k assetům
je lepší stránku servírovat přes HTTP než otevírat `index.html` z disku.

## Sekce

1. **Hero** — logo, claim, tři hlavní benefity, CTA, pruh parametrů
2. **Anatomie desek** — přepínač mezi deskami 1/3, 2/3 a 3/3;
   na každé desce klikací body součástek s popisem v bočním panelu
   (celkem 31 bodů)
3. **Zapoj. Vyzkoušej. Pochop.** — tři kroky výukového principu
4. **Obsah balení** — kompletní seznam součástek + foto krabice
5. **Pro školy** — šest karet s argumenty pro nákup
6. **Specifikace** — tabulka parametrů + holá deska 2/3
7. **FAQ** — rozbalovací dotazy (`<details>`)
8. **Kontakt / CTA** — poptávkový formulář + e-mail a Instagram jako alternativa
9. **Patička**

## Interaktivní desky

Body součástek jsou v HTML umístěné procentuálně (`--x`, `--y`) vůči
obrázku desky. Texty jsou v objektu `PARTS` v `assets/js/main.js`,
klíče mají tvar `b1-dc1`, `b2-ldr1`, `b3-l1` (deska–součástka).
Při výměně obrázku desky je potřeba přeměřit souřadnice bodů.

Ovládání: myš (hover i klik), klávesnice — `←` / `→` mezi body i mezi
záložkami desek.

## Kontaktní formulář

Formulář v sekci **Kontakt** odesílá data přes [FormSubmit](https://formsubmit.co)
(`https://formsubmit.co/ajax/emil@forestbit.cz`) — bezplatná služba,
která POST z formuláře přepošle e-mailem, takže web nepotřebuje žádný
vlastní backend. Odeslání běží přes `fetch` v `main.js` (bez opuštění
stránky), obsahuje honeypot pole proti spamu a `_captcha=false`.

**Před prvním použitím:** FormSubmit musí příjemce jednou potvrdit —
po prvním odeslání formuláře přijde na `emil@forestbit.cz`
aktivační e-mail s odkazem „Activate form". Bez potvrzení se další
zprávy nedoručí.

## Design

- Barvy: `#1d1d1b` (ink), bílá, `#f2f2f0` (wash) — monochromaticky dle manuálu
- Typografie: Poppins (nadpisy), JetBrains Mono (technické popisky, uzly, čísla sekcí)
- Blueprint pozadí: svislé vlasové linky jako v technickém výkresu
- Responzivita: 3 breakpointy (1080 / 900 / 640 px), respektuje `prefers-reduced-motion`

## Co je potřeba doplnit před ostrým nasazením

- potvrdit FormSubmit aktivační e-mail (viz výše), jinak poptávky nedojdou
- ověřit popisy součástek v sekci **Anatomie desek** — jsou odvozené
  ze schémat na deskách, ne z dokumentace
- vlastní hosting fontů, pokud je potřeba fungovat bez externích požadavků
