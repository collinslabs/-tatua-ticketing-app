// part2-session-storage: Session Storage Implementation
document.addEventListener('DOMContentLoaded', function() {
    const storedTickets = sessionStorage.getItem('tickets');
    if (storedTickets) {
        tickets.push(...JSON.parse(storedTickets));
        updateTicketTable();
    }
});

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
    sessionStorage.setItem('tickets', JSON.stringify(tickets));
    updateTicketTable();
    this.reset();
});