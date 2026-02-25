let users = [];
let expenses = [];

// Add User
function addUser() {
    const name = document.getElementById("username").value.trim();
    if (!name) return;

    const user = {
        id: Date.now(),
        name: name
    };

    users.push(user);
    document.getElementById("username").value = "";
    updateUI();
}

// Add Expense
function addExpense() {
    const description = document.getElementById("description").value.trim();
    const amount = parseFloat(document.getElementById("amount").value);
    const paidById = parseInt(document.getElementById("paidBy").value);

    const selectedParticipants = [];
    document.querySelectorAll(".participant-checkbox:checked").forEach(cb => {
        selectedParticipants.push(parseInt(cb.value));
    });

    if (!description || !amount || selectedParticipants.length === 0) {
        alert("Please fill all fields and select participants.");
        return;
    }

    const expense = {
        id: Date.now(),
        description: description,
        totalAmount: amount,
        paidBy: paidById,
        participants: selectedParticipants
    };

    expenses.push(expense);

    document.getElementById("description").value = "";
    document.getElementById("amount").value = "";

    updateUI();
}

// Update UI
function updateUI() {
    updateUsers();
    updateParticipants();
    updateExpenses();
    updateBalances();
}

// Show Users
function updateUsers() {
    const userList = document.getElementById("userList");
    const paidBySelect = document.getElementById("paidBy");

    userList.innerHTML = "";
    paidBySelect.innerHTML = "";

    users.forEach(user => {
        userList.innerHTML += `<li>${user.name} (ID: ${user.id})</li>`;
        paidBySelect.innerHTML += `<option value="${user.id}">${user.name}</option>`;
    });
}

// Show Participants Checkboxes
function updateParticipants() {
    const participantsDiv = document.getElementById("participants");
    participantsDiv.innerHTML = "";

    users.forEach(user => {
        participantsDiv.innerHTML += `
            <label>
                <input type="checkbox" class="participant-checkbox" value="${user.id}">
                ${user.name}
            </label><br>
        `;
    });
}

// View All Expenses
function updateExpenses() {
    const expenseList = document.getElementById("expenseList");
    expenseList.innerHTML = "";

    expenses.forEach(exp => {
        const payer = users.find(u => u.id === exp.paidBy);
        const participantNames = exp.participants
            .map(id => users.find(u => u.id === id)?.name)
            .join(", ");

        expenseList.innerHTML += `
            <li>
                <strong>${exp.description}</strong><br>
                Expense ID: ${exp.id}<br>
                Amount: ₹${exp.totalAmount}<br>
                Paid By: ${payer?.name}<br>
                Participants: ${participantNames}
            </li>
        `;
    });
}

// Show Exact Settlement
function updateBalances() {
    const balancesList = document.getElementById("balances");
    balancesList.innerHTML = "";

    let balances = {};
    users.forEach(user => balances[user.id] = 0);

    expenses.forEach(exp => {
        const splitAmount = exp.totalAmount / exp.participants.length;

        exp.participants.forEach(participantId => {
            if (participantId !== exp.paidBy) {
                balances[participantId] -= splitAmount;
                balances[exp.paidBy] += splitAmount;
            }
        });
    });

    users.forEach(user1 => {
        users.forEach(user2 => {
            if (balances[user1.id] < 0 && balances[user2.id] > 0) {
                const amount = Math.min(
                    Math.abs(balances[user1.id]),
                    balances[user2.id]
                );

                if (amount > 0) {
                    balancesList.innerHTML += `
                        <li>${user1.name} owes ${user2.name} ₹${amount.toFixed(2)}</li>
                    `;
                    balances[user1.id] += amount;
                    balances[user2.id] -= amount;
                }
            }
        });
    });
}