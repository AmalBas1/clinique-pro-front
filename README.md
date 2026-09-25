# CliniquePro - Front-End

Interface utilisateur web moderne, ergonomique et responsive développée pour la gestion complète d'une clinique (patients, médecins, rendez-vous et utilisateurs).

---

##  À propos du projet

**CliniquePro** est une application front-end conçue pour interagir avec une API backend (Spring Boot). Elle propose une interface adaptée aux différents rôles de la clinique :
* **Administrateurs** : Gestion globale et configuration.
* **Médecins** : Consultation des plannings, des rendez-vous..
* **Secrétaires / Agents** : Prise et gestion des rendez-vous, accueil des patients.

---

##  🛠️ Stack Technique

* **Framework** : React.js (avec Vite pour un build ultra-rapide)
* **Routage** : React Router DOM
* **Gestion des requêtes HTTP** : Axios (avec intercepteurs pour l'injection automatique du token JWT)
* **Containerisation** : Docker & Nginx (image `nginxinc/nginx-unprivileged`)

---

## 📂 Architecture des Pages & Parcours

1. **Module d'Authentification (Public)**
   * `/login` : Connexion sécurisée avec stockage du JWT dans le `localStorage`.
   * `/register` : Inscription de nouveaux utilisateurs selon leur rôle.
2. **Tableau de Bord (`/dashboard`)**
   * Vue d'ensemble et indicateurs clés (statistiques de la clinique).
3. **Module Patients (`/patients`)**
   * Liste, recherche, filtrage, ajout, modification des patients.
4. **Module Médecins (`/medecins`)**
   * Annuaire des médecins, spécialités et consultation des profils.
5. **Module Rendez-vous (`/rendez-vous`)**
   * Gestion et suivi des plannings (Statuts : `PENDING`, `CONFIRMED`, `CANCELLED`).
   * Sécurisation des routes par rôles et gestion propre des codes d'erreur (ex: `403 Forbidden`).

---

## ⚙️ Installation et Lancement (Développement Local)

### Prérequis
* Node.js (version 22 ou supérieure recommandée)
* npm

### Étapes
1. Cloner le projet et installer les dépendances :
   ```bash
   git clone https://github.com/AmalBas1/clinique-pro-front
   cd clinique-pro-front
   npm install