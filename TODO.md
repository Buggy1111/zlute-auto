# TODO - Žluté Auto - Dokončení projektu

## 🚀 Co je hotové

### ✅ Hlavní funkcionalita
- [x] Real-time multiplayer hra (až 6 hráčů)
- [x] Firebase Firestore integrace
- [x] Rate limiting (2s cooldown)
- [x] Achievement systém (1, 5, 10, 20, 50, 100 bodů)
- [x] Zvukové efekty (point, achievement, error)
- [x] Historie událostí
- [x] Responzivní design
- [x] PWA podpora (manifest.json, ikony)

### ✅ SEO Optimalizace
- [x] Meta tags (title, description, keywords)
- [x] Open Graph tags (Facebook)
- [x] Twitter Cards
- [x] JSON-LD strukturovaná data
- [x] Sitemap.xml
- [x] Robots.txt
- [x] SEO-optimalizovaný obsah na homepage
- [x] 18+ českých klíčových slov

### ✅ Design & UX
- [x] Premium žlutý theme s gradienty
- [x] Glassmorphism efekty
- [x] Framer Motion animace
- [x] Floating particles background
- [x] Gradient mesh pozadí
- [x] Všechny 🚗 emojis jsou žluté (CSS filter)
- [x] Toast notifikace
- [x] Loading states
- [x] Error handling

### ✅ "Podpoř vývojáře"
- [x] Tlačítko "Podpoř vývojáře ☕" v menu
- [x] Modal s textem a motivací
- [x] Placeholder pro QR kód platby

### ✅ Dokumentace
- [x] CLAUDE.md - kompletní dokumentace projektu
- [x] Clean code - odstraněno 150+ řádků mrtvého kódu
- [x] Optimalizované dependencies

---

## 📋 CO DODĚLAT ZÍTRA

### 1. **QR Kód pro podporu** 🔴 DŮLEŽITÉ

**Co udělat:**
1. Vygenerovat QR kód s číslem bankovního účtu
   - Použij: https://qr-generator.cz/ nebo https://qr.payme.cz/
   - Formát: SPD platba s číslem účtu
   - Nech pole "částka" prázdné = libovolná částka

2. Uložit QR kód:
   - Název souboru: `qr-code.png`
   - Umístění: `/zlute-auto/public/qr-code.png`
   - Velikost: doporučeno 512x512px nebo 1024x1024px

3. Upravit `components/GameMenu.tsx`:
   - **Řádek 356**: Zakomentovat placeholder, přidat Image komponentu:
   ```tsx
   <Image
     src="/qr-code.png"
     alt="QR platba"
     width={256}
     height={256}
     className="rounded-2xl"
   />
   ```
   - **Řádek 370**: Nahradit `XXXX-XXXXXX/XXXX` svým číslem účtu

4. Přidat import Image na začátek souboru:
   ```tsx
   import Image from 'next/image';
   ```

---

### 2. **Firebase Deploy** 🔴 DŮLEŽITÉ

**Před deployem zkontrolovat:**
- [ ] `.env.local` má správné Firebase credentials
- [ ] Firebase projekty jsou vytvořené (Firestore, Hosting)
- [ ] Firestore Security Rules jsou nastavené

**Doporučené Firestore Security Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /games/{gameId} {
      allow read: if true;
      allow create: if true;
      allow update: if request.time > resource.data.updatedAt + duration.value(2, 's');

      match /events/{eventId} {
        allow read: if true;
        allow create: if true;
      }
    }
  }
}
```

**Deploy příkazy:**
```bash
npm run build                    # Build projektu
firebase init hosting            # Inicializace (pokud ještě nebylo)
firebase deploy --only hosting   # Deploy na Firebase
```

**Alternativa - Vercel Deploy:**
```bash
vercel                          # Deploy na Vercel (jednodušší)
```

---

### 3. **Testing před spuštěním** 🟡 DOPORUČENÉ

**Otestovat:**
- [ ] Vytvoření nové hry (2-6 hráčů)
- [ ] Přidání bodu (rate limiting 2s)
- [ ] Achievement notifikace (milestone bodů)
- [ ] Sdílení hry (QR kód / link)
- [ ] Menu → "Podpoř vývojáře" → QR kód se zobrazuje
- [ ] Responsivita na mobilu
- [ ] Zvukové efekty fungují
- [ ] Real-time sync mezi zařízeními

**Test na produkci:**
1. Otevři hru na 2 zařízeních (mobil + PC)
2. Přidej bod na jednom → měl by se zobrazit na druhém okamžitě
3. Test rate limitingu → rychlé klikání = error toast

---

### 4. **Google Search Console** 🟢 VOLITELNÉ

**Po deployu:**
1. Registrovat na https://search.google.com/search-console
2. Přidat property: `https://zlute-auto.vercel.app` (nebo tvoje doména)
3. Ověřit vlastnictví (HTML tag nebo DNS)
4. Odeslat sitemap: `https://zlute-auto.vercel.app/sitemap.xml`

**Výhody:**
- Rychlejší indexování Googlem
- Sledování pozic ve vyhledávání
- Kontrola SEO zdraví

---

### 5. **Sociální sítě & Marketing** 🟢 VOLITELNÉ

**Připravit:**
- [ ] Screenshot aplikace pro sociální sítě
- [ ] Krátký popisek: "První česká online hra Žluté Auto! 🚗 Real-time multiplayer zdarma!"
- [ ] Hashtags: #ZluteAuto #CeskaHra #Roadtrip #Multiplayer #HryNaCesty

**Kde sdílet:**
- Facebook skupiny (hry, roadtrip, rodiny s dětmi)
- Instagram s hashtags
- Reddit r/czech, r/gamedev
- LinkedIn (jako cool projekt)

---

### 6. **Analytika** 🟢 VOLITELNÉ

**Přidat Google Analytics nebo Vercel Analytics:**
```tsx
// app/layout.tsx
export const metadata = {
  // ... existing metadata
  verification: {
    google: 'tvůj-google-verification-code',
  },
}
```

**Sledovat:**
- Počet návštěvníků
- Nejpoužívanější funkce
- Retention rate
- Chybovost

---

## 🎯 Prioritní TODO na zítra

### 🔴 Vysoká priorita (MUSÍ být hotovo):
1. ✅ Přidat QR kód obrázek
2. ✅ Upravit číslo účtu v GameMenu
3. ✅ Firebase/Vercel deploy

### 🟡 Střední priorita (MĚLO by být):
4. ✅ Otestovat na produkci
5. ✅ Google Search Console setup

### 🟢 Nízká priorita (MŮŽE být):
6. ⬜ Sociální sítě sdílení
7. ⬜ Analytics setup

---

## 📝 Poznámky

### URL produkce:
- Vercel: `https://zlute-auto.vercel.app` (doporučeno - 1-click deploy)
- Firebase: `https://zlute-auto.web.app`
- Vlastní doména: koupená doména + DNS setup

### Číslo účtu formát pro QR:
```
Formát: IBAN nebo lokální číslo účtu
Příklad: CZ6508000000192000145399
Nebo: 123456789/0800
```

### Backup před deployem:
```bash
git add .
git commit -m "feat: Production ready - SEO + Support button"
git push
```

---

## 🚀 Po spuštění - Budoucí vylepšení

### Potenciální features:
- [ ] Statistiky hráčů (kdo viděl nejvíc žlutých aut za měsíc)
- [ ] Leaderboard napříč všemi hrami
- [ ] Custom barvy/témata (modrá auta, zelená auta...)
- [ ] Push notifikace při novém bodu
- [ ] Fotky žlutých aut (upload při přidání bodu)
- [ ] Multiplayer napříč hrami (globální chat)
- [ ] Progressive Web App offline mode
- [ ] Dark mode

---

## ✅ Checklist před spuštěním

Před tím, než řekneš "Je to živě!" zkontroluj:

- [ ] QR kód je správně zobrazený
- [ ] Číslo účtu je správné
- [ ] Firebase credentials jsou v `.env.local`
- [ ] Build prošel bez errorů (`npm run build`)
- [ ] SEO meta tags jsou správně
- [ ] Aplikace funguje na mobilu
- [ ] Real-time sync funguje
- [ ] Zvuky fungují
- [ ] Rate limiting funguje (2s cooldown)
- [ ] Error handling funguje
- [ ] "O hře" modal má WhatsApp kontakt
- [ ] Všechny 🚗 jsou žluté

---

**Úspěšný launch! 🎉🚗💛**

Držím palce! Máš první českou online hru Žluté Auto. Budeš průkopník! 🚀
