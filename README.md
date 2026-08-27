# 🇬🇦 Nexora Gabon — Première Marketplace E-Commerce Multi-Vendeurs du Gabon

<p align="center">
  <img src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1200&q=80" alt="Nexora Gabon Banner" width="100%" style="border-radius: 16px;" />
</p>

<p align="center">
  <strong>La plateforme e-commerce tout-en-un adaptée aux réalités du Gabon : Paiements Airtel Money & Moov Money, Adressage par Points de Repère, Gestion Vendeurs & Coursiers Moto Express.</strong>
</p>

<p align="center">
  <a href="#-fonctionnalités-clés">Fonctionnalités</a> •
  <a href="#-stack-technique">Stack</a> •
  <a href="#-structure-du-projet">Architecture</a> •
  <a href="#-guide-de-démarrage-local">Démarrage</a> •
  <a href="#-synchronisation-github">GitHub</a> •
  <a href="#-déploiement-vercel-en-1-clic">Déploiement Vercel</a>
</p>

---

## 🌟 Fonctionnalités Clés

### 🛍️ Expérience Client Mobile-First
* **Navigation par Univers** : Alimentation & Terroir (Odika, Chocolat Kango, Miel), Mode & Wax, Électronique, Beauté & Cosmétiques, etc.
* **Système d'Adressage Gabonais** : Sélecteur couvrant les **9 provinces du Gabon** (Estuaire, Haut-Ogooué, Moyen-Ogooué, Ngounié, Nyanga, Ogooué-Ivindo, Ogooué-Lolo, Ogooué-Maritime, Woleu-Ntem) et les communes majeures (Libreville, Akanda, Owendo, Port-Gentil, Franceville, Oyem, Moanda...).
* **Points de Repère Visuels Obligatoires** : Saisie descriptive des repères locaux (*« barrière blanche en face de la pharmacie, grand portail vert à 50m du carrefour »*) pour éliminer les appels d'orientation.
* **Panier Persistant & Code Promo** : Réductions locales et livraison offerte avec le code `NEXORA241`.

### 💳 Flux de Paiement Transactionnel & Idempotence
* **Paiements Mobiles Locaux** : Intégration native **Airtel Money Gabon** et **Moov Money Flooz** + Option Cash à la livraison.
* **Push USSD Interactif** : Invite automatique sur le téléphone du client avec compte à rebours de 30s.
* **Idempotence Stricte** : Détection des requêtes dupliquées (`idempotencyKey`) pour prévenir tout double débit.
* **Sécurité HMAC SHA-256** : Webhooks chiffrés pour validation instantanée du statut `paid` et notification immédiate du vendeur.

### 📸 & 🎬 Médias Produits & Démonstrations Vidéo
* **Téléversement Multi-Médias** : Photos HD et vidéos de démonstration (`.mp4`, `.webm`, `.mov`).
* **Galerie Interactive & Lecteur Vidéo** : Prévisualisation des fèves de cacao, sculptures sur pierre de Mbigou ou défilés de mode wax avant achat.

### 🏪 Espace Marchand / Vendeur (`/dashboard/vendor`)
* **Indicateurs Temps Réel (KPIs)** : Chiffre d'affaires du jour en FCFA (XAF), commandes en attente, alertes stock.
* **Gestion du Catalogue** : Ajout rapide de produits avec upload de médias et gestion de stock inline.
* **Retraits Mobile Money** : Transfert direct des gains vers comptes Airtel Money ou Moov Money.

### 🛵 Espace Livreur / Coursier Moto (`/dashboard/courier`)
* **Bascule En Service / Hors Service** en 1 clic.
* **Missions Express** : Point A (Boutique & repère) $\rightarrow$ Point B (Client & repère).
* **Raccourcis WhatsApp & Appel Direct** vers le client dès l'arrivée.
* **Validation de Remise Sécurisée par Code OTP à 4 chiffres**.

---

## 🛠️ Stack Technique

* **Framework** : [Next.js 14+ / Next.js 16](https://nextjs.org/) (App Router, Server Actions, Dynamic API Routes)
* **Langage** : [TypeScript](https://www.typescriptlang.org/) (Typage strict de bout en bout)
* **Styling** : [Tailwind CSS](https://tailwindcss.com/) + Icônes [Lucide React](https://lucide.dev/)
* **State Management** : [Zustand](https://zustand-demo.pmnd.rs/) (Panier client et préférences d'adressage persistées)
* **Base de Données** : [PostgreSQL](https://www.postgresql.org/) avec schéma relationnel Supabase complet (`supabase/schema.sql`)
* **Paiements & Webhooks** : Moteur d'idempotence et signatures HMAC SHA-256

---

## 📁 Structure du Projet

```text
NEXORA/
├── public/                     # Assets statiques et illustrations
├── src/
│   ├── app/                    # Routes Next.js App Router
│   │   ├── api/payments/       # Endpoints transactionnels
│   │   │   ├── initiate/       # Initiation Push USSD & idempotence
│   │   │   ├── status/[id]/    # Polling du statut de validation
│   │   │   └── webhook/        # Réception Webhook HMAC
│   │   ├── boutique/[slug]/    # Page vitrine boutique & catalogue
│   │   ├── checkout/           # Tunnel de commande & paiement USSD
│   │   ├── dashboard/          # Espace multi-rôles
│   │   │   ├── courier/        # Dashboard livreur moto & OTP
│   │   │   └── vendor/         # Dashboard marchand & catalogue
│   │   ├── layout.tsx          # Layout racine & metadata SEO
│   │   └── page.tsx            # Page d'accueil marketplace
│   ├── components/
│   │   ├── dashboard/          # Uploader médias, KPIs, gestionnaires
│   │   ├── marketplace/        # Modale de paiement USSD, cartes produits, navbar
│   │   └── ui/                 # Composants atomiques (Button, Badge, Input...)
│   ├── lib/
│   │   ├── constants/          # Base des 9 provinces et quartiers du Gabon
│   │   ├── services/           # Moteur passerelle de paiement & HMAC
│   │   ├── types/              # Définitions TypeScript strictes
│   │   └── utils.ts            # Formateur FCFA (XAF) et utilitaires
│   └── store/                  # Stores Zustand (Panier & Localisation)
├── supabase/
│   └── schema.sql              # Schéma PostgreSQL (RLS, tables, profils)
├── .env.example                # Modèle des variables d'environnement
├── package.json
└── tsconfig.json
```

---

## 🚀 Guide de Démarrage Local

### 1. Cloner le projet et installer les dépendances
```bash
git clone https://github.com/votre-compte/nexora-gabon.git
cd nexora-gabon
npm install
```

### 2. Configurer les variables d'environnement
Copiez le fichier `.env.example` en `.env.local` :
```bash
cp .env.example .env.local
```

### 3. Lancer le serveur de développement
```bash
npm run dev
```
Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## 🐙 Synchronisation GitHub

Pour publier votre code source sur votre dépôt GitHub :

```bash
# 1. Initialiser le dépôt git local (si non fait)
git init

# 2. Ajouter tous les fichiers du projet
git add .

# 3. Créer le commit initial
git commit -m "feat: Initialisation complète Marketplace Nexora Gabon avec paiements Airtel/Moov et dashboard marchands"

# 4. Définir la branche principale
git branch -M main

# 5. Lier votre dépôt distant GitHub
git remote add origin https://github.com/VOTRE_PSEUDO/nexora-gabon.git

# 6. Pousser vers GitHub
git push -u origin main
```

---

## ⚡ Déploiement Vercel en 1 Clic

### Option A : Déploiement via le tableau de bord Vercel (Recommandé)
1. Rendez-vous sur [Vercel](https://vercel.com/) et connectez-vous avec votre compte GitHub.
2. Cliquez sur **« Add New... »** $\rightarrow$ **« Project »**.
3. Sélectionnez le dépôt `nexora-gabon` et cliquez sur **« Import »**.
4. Dans la section **Environment Variables**, ajoutez les variables depuis votre `.env.example` :
   * `NEXT_PUBLIC_APP_URL` : `https://nexora-gabon.vercel.app` (ou votre domaine)
   * `NEXT_PUBLIC_CURRENCY` : `XAF`
   * `NEXT_PUBLIC_SUPABASE_URL` : `https://votre-projet.supabase.co`
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY` : `votre_clé_anon_supabase`
   * `PSP_SECRET_KEY` : `votre_clé_secrète_paiement`
   * `PAYMENT_WEBHOOK_SECRET` : `votre_clé_webhook`
5. Cliquez sur **« Deploy »**. Votre marketplace sera en ligne en moins de 2 minutes !

### Option B : Déploiement via la CLI Vercel
```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## 🗄️ Schéma de Base de Données (`supabase/schema.sql`)

Pour initialiser votre base de données Supabase :
1. Accédez à la console [Supabase](https://app.supabase.com/).
2. Ouvrez l'éditeur SQL (**SQL Editor**).
3. Copiez et exécutez l'intégralité du fichier [`supabase/schema.sql`](./supabase/schema.sql).
4. Le schéma créera automatiquement :
   * Les tables : `profiles`, `stores`, `products`, `orders`, `order_items`, `courier_profiles`, `reviews`.
   * Les règles de sécurité **Row Level Security (RLS)** pour protéger les données marchands et clients.

---

## 📄 Licence

Ce projet est sous licence MIT. Développé pour propulser le commerce digital au Gabon 🇬🇦.
