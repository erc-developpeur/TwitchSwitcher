const TWITCH_URL = "https://www.twitch.tv";

document.addEventListener('DOMContentLoaded', () => {
    loadAccounts();
    document.getElementById('btn-save').addEventListener('click', saveCurrentAccount);
    document.getElementById('btn-logout').addEventListener('click', manualLogout);
});

// --- 1. SAUVEGARDE ---
async function saveCurrentAccount() {
    try {
        const cookies = await chrome.cookies.getAll({ domain: "twitch.tv" });
        const authToken = cookies.find(c => c.name === 'auth-token');

        if (!authToken) {
            showMessage("Erreur : Vous n'êtes pas connecté !", "red");
            return;
        }

        let loginCookie = cookies.find(c => c.name === 'login' || c.name === 'name');
        let defaultName = loginCookie ? loginCookie.value : "Compte Inconnu";
        
        // On nettoie le nom pour l'affichage
        defaultName = defaultName.replace(/%22/g, '').replace(/"/g, '');

        const finalName = prompt("Nom du compte :", defaultName);
        if (!finalName) return;

        const accountData = { name: finalName, cookies: cookies };
        
        chrome.storage.local.get(['accounts'], (result) => {
            let accounts = result.accounts || [];
            const index = accounts.findIndex(a => a.name === finalName);
            if (index > -1) accounts[index] = accountData;
            else accounts.push(accountData);

            chrome.storage.local.set({ accounts: accounts }, () => {
                showMessage(`Compte "${finalName}" sauvegardé !`);
                loadAccounts();
            });
        });
    } catch (err) {
        console.error(err);
    }
}

// --- 2. CHARGEMENT LISTE ---
function loadAccounts() {
    const list = document.getElementById('accounts-list');
    list.innerHTML = '';

    chrome.storage.local.get(['accounts'], (result) => {
        const accounts = result.accounts || [];
        if (accounts.length === 0) {
            list.innerHTML = '<p style="text-align:center; color:#888; font-size:12px;">Aucun compte.<br>Connectez-vous sur Twitch et cliquez sur "+".</p>';
            return;
        }

        accounts.forEach((account, index) => {
            const div = document.createElement('div');
            div.className = 'account-item';
            div.innerHTML = `
                <span class="account-name">${account.name}</span>
                <div class="actions">
                    <button class="btn-switch" data-index="${index}">Go</button>
                    <button class="btn-delete" data-index="${index}">X</button>
                </div>
            `;
            list.appendChild(div);
        });

        document.querySelectorAll('.btn-switch').forEach(btn => 
            btn.addEventListener('click', (e) => switchAccount(e.target.dataset.index))
        );
        document.querySelectorAll('.btn-delete').forEach(btn => 
            btn.addEventListener('click', (e) => deleteAccount(e.target.dataset.index))
        );
    });
}

// --- 3. DÉCONNEXION LOCALE (POUR CONFIGURATION) ---
async function manualLogout() {
    // Cette fonction supprime les cookies MAIS ne prévient pas Twitch.
    // Cela permet de se connecter à un autre compte sans "tuer" la session du premier.
    showMessage("Nettoyage local...", "#FFA500");
    
    const cookies = await chrome.cookies.getAll({ domain: "twitch.tv" });
    for (let cookie of cookies) {
        let url = "https://" + cookie.domain.replace(/^\./, '') + cookie.path;
        await chrome.cookies.remove({ url: url, name: cookie.name });
    }
    
    // On recharge la page pour avoir le formulaire de login
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0].url.includes('twitch.tv')) {
            chrome.tabs.reload(tabs[0].id);
        }
        window.close();
    });
}

// --- 4. LE SWITCH ---
async function switchAccount(index) {
    chrome.storage.local.get(['accounts'], async (result) => {
        const accounts = result.accounts || [];
        const targetAccount = accounts[index];
        if (!targetAccount) return;

        showMessage("Changement de compte...", "#FFA500");

        // A. Nettoyage complet
        const currentCookies = await chrome.cookies.getAll({ domain: "twitch.tv" });
        for (let cookie of currentCookies) {
            let url = "https://" + cookie.domain.replace(/^\./, '') + cookie.path;
            await chrome.cookies.remove({ url: url, name: cookie.name });
        }

        // B. Injection
        for (let cookie of targetAccount.cookies) {
            let domainClean = cookie.domain.replace(/^\./, '');
            let url = "https://" + domainClean + cookie.path;

            const newCookie = {
                url: url,
                name: cookie.name,
                value: cookie.value,
                domain: cookie.domain,
                path: cookie.path,
                secure: true,
                httpOnly: cookie.httpOnly,
                expirationDate: cookie.expirationDate,
                storeId: "0",
                sameSite: 'lax' // Force lax pour compatibilité
            };

            if (cookie.sameSite === 'no_restriction') newCookie.sameSite = 'no_restriction';

            try {
                await chrome.cookies.set(newCookie);
            } catch (err) {}
        }

        // C. Nettoyage LocalStorage via Scripting (Nécessite permission "scripting")
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            if (activeTab && activeTab.url.includes("twitch.tv")) {
                chrome.scripting.executeScript({
                    target: { tabId: activeTab.id },
                    func: () => {
                        window.localStorage.clear();
                        window.sessionStorage.clear();
                    }
                }, () => {
                    setTimeout(() => {
                        chrome.tabs.reload(activeTab.id);
                        window.close();
                    }, 500);
                });
            } else {
                chrome.tabs.create({ url: TWITCH_URL });
                window.close();
            }
        });
    });
}

// --- 5. SUPPRESSION ---
function deleteAccount(index) {
    chrome.storage.local.get(['accounts'], (result) => {
        let accounts = result.accounts || [];
        accounts.splice(index, 1);
        chrome.storage.local.set({ accounts: accounts }, loadAccounts);
    });
}

function showMessage(msg, color = "#00e6cb") {
    const el = document.getElementById('message');
    el.textContent = msg;
    el.style.color = color;
}