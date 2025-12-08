// Vérifie si le tuto a déjà été vu
chrome.storage.local.get(['tutorialSeen'], (result) => {
    if (!result.tutorialSeen) {
        showTutorial();
    }
});

function showTutorial() {
    // 1. Création du fond sombre
    const overlay = document.createElement('div');
    overlay.id = 'twitch-switcher-overlay';
    Object.assign(overlay.style, {
        position: 'fixed',
        top: '0', left: '0', width: '100%', height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        zIndex: '99999',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backdropFilter: 'blur(5px)'
    });

    // 2. Création de la fenêtre
    const modal = document.createElement('div');
    Object.assign(modal.style, {
        backgroundColor: '#18181b', // Dark Twitch
        border: '1px solid #9146FF', // Purple Twitch
        borderRadius: '10px',
        padding: '30px',
        width: '500px',
        color: 'white',
        fontFamily: 'Inter, Roobert, "Helvetica Neue", Helvetica, Arial, sans-serif',
        boxShadow: '0 0 20px rgba(145, 70, 255, 0.4)',
        textAlign: 'center'
    });

    // 3. Le contenu HTML
    modal.innerHTML = `
        <h2 style="color: #9146FF; margin-top: 0;">Bienvenue sur Twitch Switcher !</h2>
        <p style="font-size: 16px; line-height: 1.5; color: #efeff1;">
            Gérez vos multiples comptes sans prise de tête. Voici la règle d'or pour que ça fonctionne :
        </p>
        
        <div style="background: #2f2f35; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: left;">
            <p style="margin: 5px 0; font-weight: bold; color: #ff4f4d;">🚫 NE JAMAIS utiliser le bouton "Déconnexion" de Twitch.</p>
            <p style="margin: 5px 0; font-size: 14px; color: #adadb8;">Cela invaliderait votre sauvegarde.</p>
            <br>
            <p style="margin: 5px 0; font-weight: bold; color: #00e6cb;">✅ Utilisez le bouton "Mode Ajout" de l'extension.</p>
            <p style="margin: 5px 0; font-size: 14px; color: #adadb8;">Cela permet de changer de compte tout en gardant l'autre en mémoire.</p>
        </div>

        <button id="close-tuto-btn" style="
            background-color: #9146FF; 
            color: white; 
            border: none; 
            padding: 12px 24px; 
            font-size: 16px; 
            font-weight: bold; 
            border-radius: 4px; 
            cursor: pointer; 
            transition: background 0.2s;
        ">J'ai compris, c'est parti !</button>
    `;

    // 4. Assemblage
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // 5. Gestion de la fermeture
    document.getElementById('close-tuto-btn').addEventListener('click', () => {
        // On retire la fenêtre
        overlay.remove();
        // On enregistre que l'utilisateur a vu le tuto
        chrome.storage.local.set({ tutorialSeen: true });
    });

    // Effet hover sur le bouton
    const btn = document.getElementById('close-tuto-btn');
    btn.onmouseover = () => btn.style.backgroundColor = '#772ce8';
    btn.onmouseout = () => btn.style.backgroundColor = '#9146FF';
}