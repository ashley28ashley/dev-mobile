# Application E-Commerce Mode - Dev-Mobile

Cette application mobile de commerce de mode est développée avec **React Native**, **Expo SDK 54** et **Supabase**. Elle propose une expérience utilisateur fluide avec une gestion complète du catalogue, du panier, de la géolocalisation des boutiques et des notifications de rappel.

---

## Fonctionnalités principales

1. **Authentification sécurisée (Supabase)**
   - Inscription et Connexion avec validation d'email et mot de passe fort.
   - Demande de réinitialisation de mot de passe oublié (`forgot.tsx`).
   - Session persistée localement avec `AsyncStorage`.
   - Redirection automatique selon l'état de connexion (`RootLayout` dans `_layout.tsx`).

2. ** Catalogue & Détails Produits**
   - Affichage dynamique des articles disponibles avec prix, photos et descriptions.
   - Détail de chaque produit avec vue zoomée et option d'ajout rapide au panier.

3. ** Gestion du Panier (Zustand & Supabase)**
   - Panier synchronisé en temps réel avec la base de données Supabase.
   - Actions d'incrémentation, décrémentation et suppression des articles.
   - Calcul dynamique du montant total et persistance de l'état.

4. **Ajout de Produit - Mode Admin (Expo Camera)**
   - Écran de création réservé aux administrateurs (`add-product.tsx`).
   - Prise de photo en direct via `expo-camera`.
   - Téléchargement sécurisé de l'image sur Supabase Storage (bucket `product_images`) avec politiques de sécurité (RLS) actives.

5. ** Boutiques Proches (Expo Location)**
   - Détection de la position géographique de l'utilisateur avec `expo-location`.
   - Calcul des distances en kilomètres à l'aide de la formule **Haversine**.
   - Tri automatique des boutiques de la plus proche à la plus éloignée.
   

6. ** Rappels Locaux (Expo Notifications)**
   
   - Notification de confirmation d'ajout de produit en mode admin.

---

##  Stack Technique

* **Framework** : [Expo SDK 54](https://expo.dev/) (React Native)
* **Base de données & Auth** : [Supabase](https://supabase.com/)
* **Gestion d'État** : [Zustand](https://github.com/pmndrs/zustand)
* **Composants UI** : [React Native Paper](https://callstack.github.io/react-native-paper/)
* **Styles** : StyleSheet natif & Thème personnalisé
* **Tests** : [Jest](https://jestjs.io/) & [@testing-library/react-native](https://callstack.github.io/react-native-testing-library/)

---

##  Installation & Configuration

### 1. Prérequis
Assurez-vous d'avoir installé **Node.js** (v18+) et le gestionnaire de paquets **npm**.

### 2. Cloner le projet & Installer les dépendances
```bash
git clone <repository-url>
cd my-app
npm install
```

### 3. Variables d'environnement
Créez un fichier `.env` à la racine du projet et ajoutez-y vos identifiants Supabase :
```env
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=votre-cle-anonyme-publique
```

### 4. Démarrer l'application
```bash
# Lancement de l'application
npx expo start
```
Vous pouvez ensuite scanner le QR code avec l'application **Expo Go** (sur iOS/Android) ou appuyer sur `w` pour tester la version web.

---

##  Tests Automatisés

Le projet contient des suites de tests unitaires et d'intégration complets configurés avec Jest et `@testing-library/react-native`.

Pour exécuter les tests :
```bash
npm test
```

### Détail des tests inclus :
* **Tests API** (`services/__tests__/api.test.ts`) : vérification des requêtes CRUD.
* **Tests Image Upload** (`services/__tests__/imageUpload.test.ts`) : mock de l'upload vers Supabase Storage.
* **Tests Notifications** (`services/__tests__/notifications.test.ts`) : vérification de la planification.
* **Tests Intégration** (`services/__tests__/notifications.integration.test.tsx`) : vérification complète de la planification locale via les hooks et services.

---

##  Sécurité & RLS (Supabase)

Les règles de sécurité (Row Level Security - RLS) recommandées pour la production :
- **Table `products`** : lecture publique (`anon`), écriture/modification limitée aux comptes ayant le rôle `admin`.
- **Table `cart`** : lecture et écriture autorisées uniquement pour l'utilisateur connecté propriétaire des lignes (`auth.uid() = user_id`).
- **Bucket `product_images`** : lecture publique, téléversement limité aux administrateurs.
