//In-memory storage implementation
const tickets = [];

document.getElementById('ticket-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const newTicket = {
        id: tickets.length + 1,
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
        contact: document.querySelector('input[name="contact"]:checked').value,
        date: new Date().toLocaleString()
    };
    
    tickets.push(newTicket);
    updateTicketTable();
    this.reset();
});

function updateTicketTable() {
    const tableBody = document.getElementById('ticket-list');
    tableBody.innerHTML = '';
    tickets.forEach(ticket => {
        const row = `<tr>
            <td>${ticket.id}</td>
            <td>${ticket.name} <br><span class="ticket-email">${ticket.email}</span></td>
            <td>${ticket.message}</td>
            <td>${ticket.date}</td>
            <td class="actions"><span class="action-icon delete-icon" onclick="deleteTicket(${ticket.id})">🗑️</span></td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

function deleteTicket(id) {
    const index = tickets.findIndex(ticket => ticket.id === id);
    if (index !== -1) {
        tickets.splice(index, 1);
        updateTicketTable();
    }
}
