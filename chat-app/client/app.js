const sendButton = document.getElementById('sendButton');
const messageInput = document.getElementById('messageInput');
const messagesContainer = document.getElementById('messages');
const signupButton = document.getElementById('signupButton');
const loginButton = document.getElementById('loginButton');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

sendButton.addEventListener('click', async () => {
    const messageText = messageInput.value;
    if (messageText) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'sent');
        messageElement.textContent = messageText;
        messagesContainer.appendChild(messageElement);
        messageInput.value = '';

        await saveMessage(messageText);
    }
});

async function saveMessage(text) {
    await fetch('https://your-vercel-url/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: usernameInput.value, text }),
    });
}

signupButton.addEventListener('click', async () => {
    const response = await fetch('https://your-vercel-url/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: usernameInput.value,
            password: passwordInput.value,
        }),
    });
    alert(await response.text());
});

loginButton.addEventListener('click', async () => {
    const response = await fetch('https://your-vercel-url/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: usernameInput.value,
            password: passwordInput.value,
        }),
    });
    const result = await response.json();
    if (result.token) {
        alert('로그인 성공');
        // 토큰 저장 또는 세션 처리
    } else {
        alert('로그인 실패');
    }
});
