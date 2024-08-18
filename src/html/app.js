const signInButton = document.getElementById('signIn');
const signOutButton = document.getElementById('signOut');

const tableBody = document.querySelector('#activeTable tbody');
const messageContainer = document.getElementById('messageContainer');

let activeUsers = JSON.parse(localStorage.getItem('activeUsers')) || {};

signInButton.addEventListener('click', () => {
    const currentUser = getId();
    if (activeUsers[currentUser]) {
        displayMessage(currentUser + " is already signed in", 'error');
        return;
    } else if (currentUser == null || !/^\d[A-Z]{4}$/.test(currentUser)) {
        displayMessage("Please enter a valid user id", 'error');
        return;
    }

    activeUsers[currentUser] = getTime();
    updateUsers();
    displayMessage(currentUser + " signed in successfully", 'success');
});

signOutButton.addEventListener('click', () => {
    const currentUser = getId();
    if (!activeUsers[currentUser]) {
        displayMessage(currentUser + " is not signed in", 'error');
        return;
    }

    const startTime = activeUsers[currentUser];
    const duration = formatTime(getTime() - startTime);
    console.log(appendSheet(userId, duration));
    delete activeUsers[currentUser];
    updateUsers();
    displayMessage(currentUser + " signed out successfully. Duration: " + duration, 'success');
});

document.addEventListener('DOMContentLoaded', () => {
    populateUserTable();
});

function getId() {
    return document.getElementById('userId').value.toUpperCase();
}

function getTime() {
    return Date.now();
}

function updateUsers() {
    localStorage.setItem('activeUsers', JSON.stringify(activeUsers));
    populateUserTable();
}

function populateUserTable() {
    tableBody.innerHTML = '';

    for (const [key, value] of Object.entries(activeUsers)) {
        const row = document.createElement('tr');

        const keyCell = document.createElement('td');
        keyCell.textContent = key;
        row.appendChild(keyCell);

        const valueCell = document.createElement('td');
        valueCell.textContent = formatTime(getTime() - value);
        row.appendChild(valueCell);

        tableBody.appendChild(row);
    }
}

function formatTime(duration) {
    const millisecondsInHour = 60 * 60 * 1000;
    const totalHours = duration / millisecondsInHour;
    const formattedHours = totalHours.toFixed(2);
    return `${formattedHours} hour${formattedHours !== '1.00' ? 's' : ''}`;
}

function displayMessage(message, type) {
    messageContainer.textContent = message;
    messageContainer.className = `message-container ${type}`;
    messageContainer.style.display = 'block';
}

function reset() {
    localStorage.removeItem('activeUsers');
    activeUsers = {};
}

function appendSheet(userId, duration) {
    console.log(userId);
    console.log(duration);
    const jsonData = {
        spreadsheetId: "12xwz8spAzkXQqzTzrBgh8BQdmfS3g5a7XyyxtDpgdIc",
        date: new Date().toISOString().split('T')[0],
        userId: userId.value,
        duration: duration
    };
    
    fetch('https://script.google.com/macros/s/AKfycbw3OqPK2qFiKOBNZkApbB2Fge645B8wXtuWf8FP1h9K0rh97mvPgNurA7XeBEfv1lUc/exec', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData),
        mode: 'no-cors'
    })
    // .then(response => console.log('Response: ', response))
    // .then(result => console.log('Form submitted successfully: ', result))
    .catch(error => displayMessage("An error occured while submitting", 'error'));
}