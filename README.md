# 🟣 Twitch Account Switcher



> [cite_start]Une extension Chrome / Chromium permettant le basculement instantané entre plusieurs comptes Twitch, reproduisant l'expérience utilisateur native des plateformes comme YouTube[cite: 1].

---

## 🤖 Réalisé avec l'aide de l'Intelligence Artificielle (IA)

Ce projet a été conçu et développé avec l'assistance de Gemini, une Intelligence Artificielle. L'IA a été utilisée pour l'architecture du code, la gestion des API de cookies (`chrome.cookies`), l'implémentation de la logique de basculement de session, ainsi que pour la création du `README` et l'amélioration du style CSS.

---

## ✨ Fonctionnalités Clés

* **Sauvegarde Facile :** Enregistrez votre compte Twitch actuel en un clic avec son nom d'utilisateur.
* **Basculement Instantané :** Changez de compte sans effort en cliquant sur le bouton "Go" depuis la fenêtre pop-up de l'extension.
* **Gestion des Sessions :** L'extension gère la complexité des cookies et du `localStorage` de Twitch pour garantir un changement de session propre.
* **Mode Ajout Sécurisé :** Un bouton dédié pour effectuer une **déconnexion locale** (via le nettoyage des cookies et du stockage) sans invalider la session du compte sauvegardé, permettant de se connecter à un nouveau compte pour le sauvegarder.

## ⚠️ Règle d'Or (Très Important !)

Pour que l'extension fonctionne correctement et maintienne vos sessions :

* **🚫 NE JAMAIS** utiliser le bouton **"Déconnexion"** standard de Twitch.tv, car cela invaliderait la sauvegarde de votre session.
* **✅ Utilisez** le bouton **"⚠ Mode Ajout (Déconnexion Locale)"** de l'extension lorsque vous voulez vous connecter à un *nouveau* compte à sauvegarder.

## 🛠️ Installation

Comme il s'agit d'une extension de développement, l'installation se fait en mode développeur.

1.  **Téléchargement :** Clonez ce dépôt ou téléchargez le code source complet sous forme de fichier ZIP et décompressez-le.
2.  **Ouvrir les Extensions :** Ouvrez votre navigateur Chrome/Chromium et accédez à `chrome://extensions`.
3.  **Mode Développeur :** Activez le **Mode développeur** (généralement un interrupteur en haut à droite).
4.  **Charger l'Extension :** Cliquez sur **"Charger l'extension non empaquetée"** et sélectionnez le dossier racine du projet (`Twitch-Account-Switcher`).
5.  **Épingler :** Épinglez l'icône de l'extension (🟣) pour un accès rapide.

## 🚀 Utilisation

### 1. Sauvegarder votre Compte Actuel

1.  Assurez-vous d'être connecté au compte que vous souhaitez sauvegarder sur Twitch.tv.
2.  Cliquez sur l'icône de l'extension.
3.  Cliquez sur le bouton **"+ Sauvegarder ce compte"**.
4.  Un prompt apparaîtra. Vérifiez et confirmez le nom du compte (déduit du cookie de session).

### 2. Ajouter un Nouveau Compte à la Liste

Si vous êtes connecté à un compte et que vous souhaitez en ajouter un nouveau sans le déconnecter via le site :

1.  Cliquez sur l'icône de l'extension.
2.  Cliquez sur le bouton **"⚠ Mode Ajout (Déconnexion Locale)"**.
    * Cela effacera les cookies de session *localement* et rechargera la page Twitch sur la page de connexion.
3.  Connectez-vous au nouveau compte sur Twitch.tv.
4.  Revenez à l'extension et cliquez sur **"+ Sauvegarder ce compte"** pour l'ajouter à la liste.

### 3. Basculer entre les Comptes

1.  Cliquez sur l'icône de l'extension.
2.  Dans la liste de vos comptes sauvegardés, cliquez sur le bouton **"Go"** à côté du compte désiré.
3.  L'extension nettoiera la session en cours (cookies et LocalStorage), injectera les cookies de la session sauvegardée, et rechargera l'onglet Twitch actif, vous connectant instantanément.

### 4. Suppression

* Pour supprimer un compte de la liste, cliquez sur le bouton **"X"** à côté du nom du compte.

## 👨‍💻 Technologie

* **HTML, CSS** (avec un thème inspiré des couleurs de Twitch)
* **JavaScript (Chrome Extension API) :**
    * `chrome.cookies` : Pour la lecture, la sauvegarde et l'injection des sessions.
    * `chrome.storage.local` : Pour stocker les données des comptes (nom et cookies sérialisés).
    * `chrome.scripting` : Utilisé pour vider le `localStorage` et `sessionStorage` de Twitch, nécessaire pour garantir un changement de session complet.

## 📄 Licence

Ce projet est sous licence [Ajouter le type de licence, ex: MIT].
