let users = [];
let expenses = [];

function addUser() {
    const name = document.getElementById("username").value;
    if (!name) return;

    users.push({ id: Date.now(), name: name });
    document.getElementById("username").value = "";
    updateUI();
}

function addExpense() {
    const description = document.getElementById("description").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const paidById = parseInt(document.getElementById("paidBy").value);

    const selectedParticipants = [];
    document.querySelectorAll(".participant-checkbox:checked").forEach(cb => {
        selectedParticipants.push(parseInt(cb.value));
    });

    if (!description || !amount || selectedParticipants.length === 0) {
        alert("Fill all fields and select participants");
        return;
    }

    expenses.push({
        description,
        amount,
        paidById,
        participants: selectedParticipants
    });

    document.getElementById("description").value = "";
    document.getElementById("amount").value = "";

    updateUI();
}

function updateUI() {
    const userList = document.getElementById("userList");
    const paidBySelect = document.getElementById("paidBy");
    const participantsDiv = document.getElementById("participants");
    const balancesList = document.getElementById("balances");

    userList.innerHTML = "";
    paidBySelect.innerHTML = "";
    participantsDiv.innerHTML = "";
    balancesList.innerHTML = "";

    users.forEach(user => {
        userList.innerHTML += `<li>${user.name}</li>`;
        paidBySelect.innerHTML += `<option value="${user.id}">${user.name}</option>`;

        participantsDiv.innerHTML += `
            <label>
                <input type="checkbox" class="participant-checkbox" value="${user.id}">
                ${user.name}
            </label><br>
        `;
    });

    let balances = {};
    users.forEach(user => balances[user.id] = 0);

    expenses.forEach(exp => {
        const splitAmount = exp.amount / exp.participants.length;

        exp.participants.forEach(participantId => {
            if (participantId !== exp.paidById) {
                balances[participantId] -= splitAmount;
                balances[exp.paidById] += splitAmount;
            }
        });
    });

    users.forEach(user => {
        if (balances[user.id] < 0) {
            balancesList.innerHTML += 
                `<li>${user.name} owes ₹${Math.abs(balances[user.id]).toFixed(2)}</li>`;
        }
    });
}