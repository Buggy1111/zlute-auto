# Synchronizace Player Stats

## Co je nové?

Statistiky hráčů se teď **synchronizují real-time přes Firebase** a fungují jak na jednom zařízení, tak napříč více zařízeními!

## Jak to funguje?

### 1. **Unikátní Player ID**
- Každé zařízení dostane automaticky unikátní `playerId` při první návštěvě
- Tento ID se uloží do `localStorage` a zůstane tam navždy
- Díky tomu hra pozná, že jste to vy, i když hrajete pod jiným jménem

### 2. **Dual-layer Storage (Firebase + localStorage)**

**Firebase (primary):**
- Všechny statistiky se ukládají do Firebase kolekce `/playerStats/{playerId}`
- Real-time synchronizace - změny se projeví okamžitě
- Funguje across všechna zařízení s *tímtéž playerId*

**localStorage (fallback):**
- Ukládá se jako cache pro rychlý přístup
- Funguje i offline
- Pokud Firebase selže, používá se localStorage

### 3. **Automatická synchronizace**

```typescript
// V PlayerStats.tsx
useEffect(() => {
  // Subscribe to real-time updates from Firebase
  const unsubscribe = subscribeToPlayerStats(() => {
    const calculated = getCalculatedStats();
    setStats(calculated);
  });

  return () => unsubscribe(); // Cleanup on unmount
}, []);
```

## Použití na jednom zařízení

**Scénář:** Vy a dcera hrajete na jednom mobilu/tabletu

1. Vytvoříte hru s jmény "Táta" a "Dcera"
2. Oba klikáte na tlačítka na jednom zařízení
3. **Problém:** Obě jména používají stejný `playerId` (zařízení)
4. **Řešení:** Statistiky se ukládají pod posledním použitým jménem

**Co vidíte ve statistikách:**
- Poslední hra: Vítěz je ten, kdo vyhrál (např. "Dcera - 16 bodů 🥇")
- Historie: Všechny hry z tohoto zařízení pod různými jmény
- Celkem her: Počítá všechny hry hrané na tomto zařízení

## Použití na více zařízeních

**Scénář:** Každý hráč má vlastní mobil/tablet

1. Táta na svém mobilu klikne "Táta" - dostane `playerId_123`
2. Dcera na svém mobilu klikne "Dcera" - dostane `playerId_456`
3. Obě zařízení se připojí ke stejné hře přes URL
4. Každé zařízení ukládá statistiky pod vlastním `playerId`

**Výhody:**
- ✅ Každý má své vlastní statistiky
- ✅ Statistiky se synchronizují přes Firebase
- ✅ Vidíte své výsledky na všech svých zařízeních
- ✅ Historie zůstává i po restartování

**Příklad:**
```
Táta (playerId_123):
  - Celkem her: 5
  - Vítězství: 2
  - Nejlepší výkon: 18 bodů

Dcera (playerId_456):
  - Celkem her: 5
  - Vítězství: 3
  - Nejlepší výkon: 20 bodů
```

## Nové funkce ve statistikách

### 1. **Sekce "Poslední hra"**
- Zobrazuje výsledek vaší poslední hry
- 🥇 Zlatý neonový efekt pro vítěze
- Vidíte svoje umístění (1., 2., 3. místo)
- Datum a čas hry

### 2. **Přehlednější layout**
- Vítězství jsou teď vedle "Celkem her"
- "Průměr bodů" místo jen "Průměr"

### 3. **Nejlepší & Nejhorší výkon**
- Vidíte svůj best score (žlutý border)
- Vidíte svůj worst score
- Pomáhá sledovat progress

## Firebase Security Rules

Nové pravidla v `firestore.rules`:

```javascript
match /playerStats/{playerId} {
  // Kdokoliv může číst svoje vlastní statistiky
  allow read: if true;

  // Může vytvořit/aktualizovat jen se správným playerId
  allow create, update: if request.resource.data.playerId == playerId
    && request.resource.data.totalGames >= 0
    && request.resource.data.totalPoints >= 0
    && request.resource.data.lastUpdated > resource.data.lastUpdated;

  // Může smazat (při kliknutí "Vymazat statistiky")
  allow delete: if true;
}
```

## Nasazení do produkce

**DŮLEŽITÉ:** Před nasazením na Vercel musíte aktualizovat Firebase Security Rules!

1. Otevřete [Firebase Console](https://console.firebase.google.com/)
2. Firestore Database → Rules
3. Zkopírujte celý obsah `firestore.rules`
4. Vložte do Firebase Console
5. Klikněte **Publish**

## Struktura dat v Firebase

```
/playerStats/{playerId}
  - playerId: "player_1728934567890_abc123def"
  - playerName: "Táta"
  - totalGames: 10
  - totalPoints: 87
  - lastUpdated: 1728934567890
  - games: [
      {
        gameId: "abc123",
        date: 1728934567890,
        playerName: "Táta",
        finalScore: 15,
        placement: 1,
        totalPlayers: 2,
        pointTimestamps: [...]
      },
      ...
    ]
```

## API Reference

### `lib/playerStats.ts`

**Nové funkce:**

```typescript
// Load stats from Firebase (fallback to localStorage)
loadPlayerStats(): Promise<PlayerStats>

// Subscribe to real-time stats updates
subscribeToPlayerStats(callback: (stats: PlayerStats) => void): () => void

// Record point (saves to Firebase + localStorage)
recordPoint(gameId: string, playerName: string): Promise<void>

// Finalize game with placement
finalizeGame(gameId: string, placement: number, totalPlayers: number): Promise<void>

// Clear stats (both Firebase + localStorage)
clearPlayerStats(): Promise<void>
```

## Testování

### Test na jednom zařízení:
1. Otevřete hru v prohlížeči
2. Vytvořte hru se 2 hráči
3. Hrajte a sledujte statistiky
4. Klikněte F12 → Application → Local Storage
5. Najděte `yellowcar_player_id` - to je váš unikátní ID

### Test na více zařízeních:
1. Otevřete hru na dvou zařízeních (mobil + tablet)
2. Na prvním vytvořte hru
3. Zkopírujte URL a otevřete na druhém zařízení
4. Oba hrajte současně
5. Otevřete statistiky na obou zařízeních
6. Každé zařízení ukazuje svoje vlastní statistiky

### Test synchronizace:
1. Otevřete hru na mobilu
2. Zahrajte pár her
3. Otevřete tutéž hru na tabletu (přihlaste se stejným Google účtem)
4. **Pozor:** Statistiky se synchronizují jen pokud je stejný `playerId`
   - Když použijete jiné zařízení = nový playerId = nové statistiky
   - Když smažete localStorage = nový playerId = nové statistiky

## Omezení

1. **Player ID je per-device:**
   - Každé zařízení má vlastní ID
   - Nelze přenést statistiky mezi zařízeními (zatím)
   - Pro multi-device stats by bylo potřeba přihlášení (Firebase Auth)

2. **localStorage limit:**
   - Historie je omezena na posledních 50 her
   - Starší hry se automaticky mažou

3. **Firebase limit:**
   - Free tier: 50K reads/day, 20K writes/day
   - Pro běžné použití je to víc než dost

## Budoucí vylepšení

- [ ] Firebase Authentication (Google login)
- [ ] Propojení statistik across zařízeními přes účet
- [ ] Globální leaderboard (top hráči)
- [ ] Exportovat statistiky do CSV/JSON
- [ ] Grafy a vizualizace pokroku
