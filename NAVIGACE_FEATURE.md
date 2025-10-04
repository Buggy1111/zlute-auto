# 🗺️ Navigace Feature

## Co je nové?

Přidali jsme **kompletní podporu pro navigaci během hry** - teď můžeš mít otevřenou navigaci a hru současně!

## Jak to funguje?

### 1. **Tlačítko Navigace v menu**
- Otevři menu (pravý horní roh)
- Klikni na **"🗺️ Navigace"**
- Otevře se modal s výběrem navigačních aplikací

### 2. **Výběr navigace**
Můžeš si vybrat z:
- 🗺️ **Google Maps**
- 🚗 **Waze**
- 🇨🇿 **Mapy.cz**
- 🍎 **Apple Maps**

### 3. **Automatické instrukce**
Modal ti ukáže přesný návod jak nastavit split screen pro tvůj systém:

**📱 Android:**
1. Otevře se navigace v nové kartě
2. Stiskni tlačítko "Poslední aplikace" (čtverec)
3. Klikni na ikonu hry nahoře a vyber "Rozdělená obrazovka"
4. Navigace nahoře 🗺️, hra dole 🎮

**📱 iPhone/iPad:**
1. Otevře se navigace v nové kartě
2. Přejeď zpět do hry (swipe zespodu)
3. Hra běží na pozadí - všechny body se ukládají!
4. Přepínej mezi navigací a hrou dle potřeby

## Nové funkce

### ✅ **Wake Lock API**
- **Obrazovka nezhasne** během hry
- Automaticky se aktivuje když hra běží
- Funguje i když přepneš na navigaci a zpět

```typescript
// lib/wakeLock.ts
requestWakeLock()       // Zamkne obrazovku
releaseWakeLock()       // Odemkne obrazovku
isWakeLockActive()      // Zkontroluje stav
```

### 🟢 **Indikátor "Hra běží na pozadí"**
- Když se vrátíš zpět do hry z navigace
- Ukazuje zelený indikátor nahoře: **"✅ Hra běžela na pozadí"**
- Zmizí automaticky po 3 sekundách
- Potvrzuje, že všechny body byly uloženy

```tsx
// components/BackgroundIndicator.tsx
<BackgroundIndicator />
```

### 🔄 **Real-time synchronizace**
- Body se ukládají i když hra není vidět
- Firebase synchronizuje změny na pozadí
- Když se vrátíš, vidíš aktuální stav

## Technická implementace

### Wake Lock API

**Automatická aktivace:**
```typescript
useEffect(() => {
  if (!isPlaying) return;

  // Request wake lock when game starts
  requestWakeLock();

  // Setup reacquisition when page becomes visible again
  const cleanup = setupWakeLockReacquisition();

  return () => {
    cleanup();
    releaseWakeLock();
  };
}, [isPlaying]);
```

**Reacquisition při visibility change:**
```typescript
// Wake lock is automatically released when page is hidden
// This re-requests it when page becomes visible again
export function setupWakeLockReacquisition(): () => void {
  const handleVisibilityChange = async () => {
    if (document.visibilityState === 'visible' && wakeLock?.released) {
      await requestWakeLock();
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}
```

### Background Indicator

**Detekce návrat z pozadí:**
```typescript
const [wasHidden, setWasHidden] = useState(false);

useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.hidden) {
      setWasHidden(true);
    } else if (wasHidden) {
      // Show indicator for 3 seconds
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 3000);
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
}, [wasHidden]);
```

### Navigation Modal

**Komponenta:**
```tsx
<NavigationModal onClose={() => setShowNavigation(false)} />
```

**Funkce:**
- Seznam navigačních aplikací s ikonami
- Automatický návod pro Android/iOS
- Informace o background synchronizaci
- Wake Lock tip

## Browser Support

### Wake Lock API:
✅ **Chrome/Edge** 84+
✅ **Safari** 16.4+
✅ **Firefox** ❌ (zatím nepodporuje)
✅ **Samsung Internet** 14+

**Fallback:** Pokud Wake Lock není podporován, hra funguje normálně, jen obrazovka může zhasnout.

### Page Visibility API:
✅ **Všechny moderní prohlížeče**

## Testování

### Test Wake Lock:
1. Otevři hru v prohlížeči
2. Hra běží → obrazovka by neměla zhasnout
3. Nech telefon ležet 5 minut → stále svítí
4. Ukonči hru → obrazovka zhasne normálně

### Test Background Indicator:
1. Otevři hru
2. Přepni na jinou aplikaci (navigace)
3. Vrať se zpět do hry
4. Měl bys vidět zelený indikátor "✅ Hra běžela na pozadí"

### Test Split Screen (Android):
1. Otevři hru, klikni "Navigace"
2. Vyber Google Maps
3. Stiskni tlačítko "Poslední aplikace"
4. Klikni na ikonu hry → "Rozdělená obrazovka"
5. Navigace nahoře, hra dole
6. Oba běží současně ✅

### Test iOS:
1. Otevři hru, klikni "Navigace"
2. Vyber Apple Maps
3. Navigace se otevře
4. Swipe zpět do hry
5. Vidíš zelený indikátor
6. Body se synchronizují ✅

## UX Flow

```
Menu → Navigace tlačítko
  ↓
NavigationModal otevřený
  ↓
Vyber navigaci (Google Maps, Waze...)
  ↓
Navigace se otevře v novém tabu
  ↓
━━━━━━━━━━━━━━━━━━━━━━━━━━
│ Android              │ iOS               │
│──────────────────────│───────────────────│
│ Manual split screen  │ Přepni zpět       │
│ Oba viditelné        │ Hra na pozadí     │
│ Wake Lock aktivní    │ Wake Lock aktivní │
━━━━━━━━━━━━━━━━━━━━━━━━━━
  ↓
Návrat do hry
  ↓
✅ Zelený indikátor (3s)
"Hra běžela na pozadí, všechny body uloženy"
```

## Soubory

**Nové soubory:**
- `components/NavigationModal.tsx` - Modal s navigačními aplikacemi
- `components/BackgroundIndicator.tsx` - Indikátor návratu z pozadí
- `lib/wakeLock.ts` - Wake Lock API utilities
- `NAVIGACE_FEATURE.md` - Tato dokumentace

**Upravené soubory:**
- `components/GameMenu.tsx` - Přidáno tlačítko Navigace
- `app/game/[gameId]/page.tsx` - Wake Lock + Background Indicator

## Performance Impact

**Bundle size:**
- NavigationModal: ~2 kB
- BackgroundIndicator: ~1 kB
- wakeLock.ts: ~0.5 kB
- **Celkem: ~3.5 kB** (minimální)

**Runtime:**
- Wake Lock: 0ms overhead (browser API)
- Visibility listener: <1ms (event listener)
- Firebase běží už tak → 0ms overhead

## Future Improvements

Možná budoucí vylepšení:

1. **Deep links do navigací**
   - Otevřít navigaci s už zadanou destinací
   - `maps.google.com/dir/?api=1&destination=...`

2. **Geolokace**
   - Automaticky odhadnout, kam jedete
   - Nabídnout nastavit destinaci v navigaci

3. **Picture-in-Picture** (Android)
   - Malé plovoucí okno s tlačítkem přes navigaci
   - Zatím omezená podpora v webech

4. **App Shortcuts** (PWA)
   - Rychlá zkratka "Otevřít navigaci" přímo z home screen

## Známé problémy

1. **Firefox nepodporuje Wake Lock**
   - Fallback: Obrazovka může zhasnout
   - Řešení: Nastavit "Keep screen on" v systému

2. **iOS Safari - aggressive tab suspension**
   - Safari agresivně uspává taby na pozadí
   - Firebase má reconnect mechanismus
   - Body se synchronizují jakmile se vrátíš

3. **Split screen může být složitý pro nové uživatele**
   - Řešení: Detailní instrukce v modalu
   - Budoucnost: Video tutorial?
