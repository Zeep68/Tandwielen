# The Woodpecker Diner — website

Next.js 15 (App Router) + TypeScript, geen CSS-framework: kleuren, typografie en patronen staan in
`app/globals.css` en per component in CSS Modules.

## Lokaal draaien

```bash
npm install
npm run dev
```

## Structuur

```
app/layout.tsx                 fonts (Bebas Neue, Pacifico, Poppins), metadata
app/page.tsx                   pagina-opbouw incl. checkerboard dividers
app/globals.css                kleurvariabelen, knoppen, formulierstijl, checkerboard
app/api/reservations/route.ts  POST-handler, zet door naar Odoo als env-vars gezet zijn
components/                    Nav, Hero, MenuSection, About, Reserve, Footer
data/menu.ts                   MENU_DATA (lunch | diner | drinks)
data/site.ts                   adres, telefoon, e-mail, openingstijden
```

## Nog invullen

- `data/site.ts`: echte NAW-gegevens en social links.
- `data/menu.ts`: definitieve kaart en prijzen.
- `.env`: `ODOO_RESERVATIONS_URL` en `ODOO_API_KEY` voor de koppeling. Zolang die leeg zijn geeft de
  API `success: true` terug zonder door te zetten; faalt de call, dan valt het formulier terug op
  een `mailto:` met alle gegevens erin.

## Vercel

Importeer de repo en zet **Root Directory** op `woodpecker-diner`. Build command en output zijn de
Next.js-standaard.
