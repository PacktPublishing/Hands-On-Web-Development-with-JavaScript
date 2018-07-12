function changeName() {
    const msgEl = document.querySelector('#welcomeMessage');
    const inputEl = document.querySelector('input[name="name"]');
    msgEl.textContent = inputEl.value === '' ? 'Hello!' : `Hello, ${inputEl.value}!`;
}

function changeTextColor(textClass) {
    const msgEl = document.querySelector('#welcomeMessage');
    ['text-primary', 'text-success', 'text-danger'].forEach(tClass => {
        msgEl.classList.remove(tClass);
    });
    msgEl.classList.add(textClass);
}