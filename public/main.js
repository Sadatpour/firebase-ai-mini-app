// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCMxgINQ3KjAY7-Y-HdLpLy3irqY3oYgzQ",
    authDomain: "fir-ai-mini-app.firebaseapp.com",
    projectId: "fir-ai-mini-app",
    storageBucket: "fir-ai-mini-app.firebasestorage.app",
    messagingSenderId: "772691815272",
    appId: "1:772691815272:web:7f1ed9086d47e0f1a684dd"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// 🔗 Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const functions = firebase.functions();

// 🎛️ DOM elements
const loginButton = document.getElementById('login');
const logoutButton = document.getElementById('logout');
const chatUI = document.getElementById('chatUI');

// 🟢 Login with Google
loginButton.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            console.log('✅ User signed in:', result.user);
        })
        .catch((error) => {
            console.error('❌ Error during sign-in:', error);
            alert('Login failed: ' + error.message);
        });
});

// 🔴 Logout
logoutButton.addEventListener('click', () => {
    auth.signOut()
        .then(() => {
            console.log('✅ User signed out');
        })
        .catch((error) => {
            console.error('❌ Error during sign-out:', error);
        });
});

// 🔄 Auth state change handler
auth.onAuthStateChanged(user => {
    if (user) {
        console.log('🔄 Auth state: User is signed in', user);
        loginButton.style.display = 'none';
        logoutButton.style.display = 'block';
        chatUI.style.display = 'block';
        loadMessages(user.uid);
    } else {
        console.log('🔄 Auth state: No user signed in');
        loginButton.style.display = 'block';
        logoutButton.style.display = 'none';
        chatUI.style.display = 'none';
    }
});

// ✉️ Send message
document.getElementById('sendMessage').addEventListener('click', async () => {
    const messageText = document.getElementById('messageInput').value;
    if (!messageText) return;

    try {
        const user = auth.currentUser;
        if (!user) {
            alert('Please sign in to send a message.');
            return;
        }
        const idToken = await user.getIdToken();

        const response = await fetch('https://us-central1-fir-ai-mini-app.cloudfunctions.net/processMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify({ message_text: messageText })
        });

        const result = await response.json();

        if (result.success) {
            console.log('✅ AI Response:', result.aiResponse);
            document.getElementById('messageInput').value = '';
        } else {
            console.error('❌ Error calling processMessage:', result.error);
            alert('Failed to send message: ' + result.error);
        }
    } catch (error) {
        console.error('❌ Error calling processMessage:', error);
        alert('Failed to send message: ' + error.message);
    }
});

// 💬 Load messages for the user
function loadMessages(userId) {
    db.collection('user_messages')
        .where('user_id', '==', userId)
        .orderBy('timestamp', 'desc')
        .onSnapshot(snapshot => {
            const messagesDiv = document.getElementById('messages');
            messagesDiv.innerHTML = '';
            snapshot.forEach(doc => {
                const data = doc.data();
                messagesDiv.innerHTML += `
                    <div style="margin-bottom: 10px;">
                        <p><strong>You:</strong> ${data.message_text}</p>
                        <p><strong>AI:</strong> ${data.response_text}</p>
                        <hr>
                    </div>
                `;
            });
        }, error => {
            console.error('❌ Error loading messages:', error);
        });
}


























