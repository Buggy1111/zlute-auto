# Firebase Security Setup

## 🔒 Firestore Security Rules

Tento soubor obsahuje instrukce pro nastavení Firestore Security Rules před nasazením na produkci.

## 📋 Co dělají Security Rules?

Security Rules chrání tvoji Firebase databázi před:
- ❌ Spamováním a útoky
- ❌ Mazáním dat
- ❌ Nastavením neplatných skóre
- ❌ Vyčerpáním Firebase kvóty
- ✅ Povolují pouze validní operace

## 🚀 Jak nastavit (před nasazením na Vercel)

### Krok 1: Otevři Firebase Console
1. Jdi na https://console.firebase.google.com/
2. Vyber svůj projekt
3. V levém menu klikni na **Firestore Database**
4. Klikni na záložku **Rules** (nahoře)

### Krok 2: Nahraj Security Rules
1. Otevři soubor `firestore.rules` v tomto projektu
2. **Zkopíruj celý obsah** souboru
3. Ve Firebase Console **smaž vše** v editoru
4. **Vlož zkopírovaný obsah**
5. Klikni na **Publish** (Publikovat)

### Krok 3: Ověř, že fungují
Firebase Console ti ukáže, jestli jsou rules validní. Pokud vidíš zelený status, je vše OK! ✅

## 🛡️ Co Security Rules dělají?

### ✅ Povoleno:
- **Čtení her** - Kdokoliv může číst data her (potřebné pro multiplayer)
- **Vytváření her** - Kdokoliv může vytvořit novou hru (2-8 hráčů, validní data)
- **Přidávání bodů** - S rate limitingem (min 1 sekunda mezi updaty)
- **Challenge systém** - Vytváření, hlasování, rozhodování
- **Hodnocení hráčů** - Přidávání anonymních hodnocení

### ❌ Zakázáno:
- Mazání her
- Přidávání/odebírání hráčů po vytvoření hry
- Změna časových razítek
- Nevalidní skóre (nad 1000 bodů)
- Spam (rate limiting 1 sekunda)
- Nevalidní hodnocení (musí být 1-5)

## 🔥 Rate Limiting

Security Rules obsahují **server-side rate limiting**:
- Minimálně **1 sekunda** mezi updaty hry
- Client-side limit (2s) funguje pro UX
- Server-side limit (1s) chrání před útoky

## 📊 Monitoring

Po nasazení můžeš sledovat bezpečnost v Firebase Console:
1. **Firestore Database** → **Usage** - sleduj počet operací
2. **Firestore Database** → **Rules Playground** - testuj rules

## 🚨 Co dělat při útoku?

Pokud někdo spamuje tvoji aplikaci:
1. Jdi do Firebase Console → **Firestore Database** → **Rules**
2. Dočasně změň `allow read: if true;` na `allow read: if request.time < timestamp.date(2025, 12, 31);` (nastav budoucí datum)
3. To zastaví všechny operace
4. Napiš mi na WhatsApp (605 954 429) a pomohu to vyřešit

## ✅ Checklist před nasazením

- [ ] Security Rules nahrány do Firebase Console
- [ ] Rules publikovány (zelený status)
- [ ] Aplikace otestována (vytvoření hry, přidání bodu)
- [ ] Žádné chyby v konzoli
- [ ] Ready pro Vercel! 🚀

## 💡 Tipy

- **Rules jsou aktivní okamžitě** po publikování
- **Nemusíš nic měnit v kódu** - funguje automaticky
- **Můžeš kdykoliv upravit** rules ve Firebase Console
- **Rules jsou zdarma** - nejsou součástí kvót

---

Máš otázky? Napiš mi na WhatsApp: **605 954 429** 📱
