// TELEGRAM INITIALIZATION

const tg = window.Telegram?.WebApp;

if (tg) {
    tg.ready();
    tg.expand();

    tg.setHeaderColor('#080808');
    tg.setBackgroundColor('#080808');
}

// PARTICLES

const particleContainer = document.getElementById('particles');

function createParticle() {
    const particle = document.createElement('div');

    particle.className = 'particle';

    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration =
        (3 + Math.random() * 5) + 's';

    particle.style.opacity = Math.random();

    particleContainer.appendChild(particle);

    setTimeout(() => {
        particle.remove();
    }, 8000);
}

setInterval(createParticle, 250);

// MAIN BUTTON

document.getElementById('enterButton')
    .addEventListener('click', () => {

        if (tg) {
            tg.HapticFeedback.impactOccurred('medium');
            tg.showAlert('WELCOME TO BLG MAFIA 🔴');
        } else {
            alert('WELCOME TO BLG MAFIA 🔴');
        }

    });

// CARD BUTTONS

document.querySelectorAll('.card-button')
    .forEach(button => {

        button.addEventListener('click', () => {

            const action = button.dataset.action;

            if (tg) {
                tg.HapticFeedback.impactOccurred('light');
            }

            switch (action) {

                case 'universe':
                    showMessage('Bienvenue dans notre univers !');
                    break;

                case 'power':
                    showMessage('POWER MODE ACTIVATED ⚡');
                    break;

                case 'community':
                    showMessage('Communauté BLG Mafia');
                    break;

            }

        });

    });

function showMessage(message) {

    if (tg) {
        tg.showAlert(message);
    } else {
        alert(message);
    }

}