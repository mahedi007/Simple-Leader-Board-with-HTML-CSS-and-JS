let players = [];

// Load leaderboard data from localStorage on page load
window.addEventListener('DOMContentLoaded', () => {
    const savedPlayers = JSON.parse(localStorage.getItem('leaderboardPlayers'));
    if (savedPlayers) {
        players = savedPlayers;
        updateLeaderboard();
    }
});

function addPlayer(event) {
    event.preventDefault();
    const playerNameInput = document.getElementById('playerName');
    const playerScoreInput = document.getElementById('playerScore');

    const playerName = playerNameInput.value.trim();
    const playerScore = parseInt(playerScoreInput.value);

    if (playerName && !isNaN(playerScore)) {
        players.push({ name: playerName, score: playerScore });
        players.sort((a, b) => b.score - a.score); // Sort players by score
        updateLeaderboard();
        playerNameInput.value = '';
        playerScoreInput.value = '';

        // Save leaderboard data to localStorage
        saveLeaderboard();
    }
}

function updateLeaderboard() {
    const leaderboardBody = document.getElementById('leaderboardBody');
    leaderboardBody.innerHTML = '';

    players.forEach((player, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><span class="name" id="name_${index}" contenteditable="false">${player.name}</span></td>
            <td><span class="score" id="score_${index}" contenteditable="false">${player.score}</span></td>
            <td class="edit-name"><button onclick="editName(${index})">Edit Name</button></td>
            <td class="edit-score"><button onclick="editScore(${index})">Edit Score</button></td>
            <td class="adjust-score">
                <button onclick="adjustScore(${index}, 'add', 1)">+1</button>
                <button onclick="adjustScore(${index}, 'subtract', 1)">-1</button>
                <button onclick="adjustScore(${index}, 'add', 5)">+5</button>
                <button onclick="adjustScore(${index}, 'subtract', 5)">-5</button>
            </td>
            <td class="remove-player"><button onclick="removePlayer(${index})">Remove</button></td>
        `;
        leaderboardBody.appendChild(row);
    });
}

function editName(index) {
    const nameElement = document.getElementById(`name_${index}`);
    const newName = prompt('Enter new name:', nameElement.textContent.trim());
    if (newName !== null && newName !== '' && newName !== nameElement.textContent.trim()) {
        nameElement.textContent = newName;
        players[index].name = newName;
        saveLeaderboard();
    }
}

function editScore(index) {
    const scoreElement = document.getElementById(`score_${index}`);
    const newScore = prompt('Enter new score:', scoreElement.textContent.trim());
    if (newScore !== null && !isNaN(newScore) && newScore !== scoreElement.textContent.trim()) {
        scoreElement.textContent = newScore;
        players[index].score = parseInt(newScore);
        players.sort((a, b) => b.score - a.score); // Re-sort players after score change
        updateLeaderboard();
        saveLeaderboard();
    }
}

function adjustScore(index, operation, value) {
    const scoreElement = document.getElementById(`score_${index}`);
    let score = parseInt(scoreElement.textContent);

    if (operation === 'add') {
        score += value;
    } else if (operation === 'subtract') {
        score -= value;
    }

    if (!isNaN(score)) {
        scoreElement.textContent = score;
        players[index].score = score;
        players.sort((a, b) => b.score - a.score); // Re-sort players after score change
        updateLeaderboard(); // Update leaderboard after adjusting score
        saveLeaderboard(); // Save leaderboard after adjusting score
    }
}

function removePlayer(index) {
    players.splice(index, 1); // Remove the player from the array
    updateLeaderboard(); // Update the leaderboard to reflect the changes
    saveLeaderboard(); // Save the updated leaderboard to local storage
}

function saveLeaderboard() {
    localStorage.setItem('leaderboardPlayers', JSON.stringify(players));
}

document.getElementById('addPlayerForm').addEventListener('submit', addPlayer);

// Update leaderboard once on page load
updateLeaderboard();
