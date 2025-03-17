// popup system
const popup = {
    overlay: null,
    container: null,
    title: null,
    content: null,
    confirmBtn: null,
    cancelBtn: null,
    closeBtn: null,
    actionButtons: null,

  
    init: function() {
        this.overlay = document.getElementById('popupOverlay');
        this.container = this.overlay.querySelector('.popup-container');
        this.title = document.getElementById('popupTitle');
        this.content = document.getElementById('popupContent');
        this.confirmBtn = document.getElementById('popupConfirm');
        this.cancelBtn = document.getElementById('popupCancel');
        this.closeBtn = document.getElementById('popupClose');
        this.actionButtons = document.getElementById('popupActions');

      
        this.closeBtn.addEventListener('click', () => this.close());
        
        
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.close();
            }
        });
    },

   
    alert: function(options) {
        const defaults = {
            title: 'Notification',
            message: '',
            icon: 'info', 
            buttonText: 'OK',
            callback: null
        };

        const settings = { ...defaults, ...options };

        this.title.textContent = settings.title;
        
        
        this.content.innerHTML = `
            <div class="popup-icon ${settings.icon}">
                <i class="fas fa-${this.getIconClass(settings.icon)}"></i>
            </div>
            <div class="popup-message">${settings.message}</div>
        `;

       
        this.actionButtons.innerHTML = `
            <button class="popup-btn popup-btn-primary" id="popupConfirm">${settings.buttonText}</button>
        `;

        this.confirmBtn = document.getElementById('popupConfirm');
        this.confirmBtn.addEventListener('click', () => {
            this.close();
            if (settings.callback) settings.callback();
        });

        this.open();
    },

   
    confirm: function(options) {
        const defaults = {
            title: 'Confirmation',
            message: 'Are you sure you want to proceed?',
            icon: 'warning',
            confirmText: 'Confirm',
            cancelText: 'Cancel',
            onConfirm: null,
            onCancel: null
        };

        const settings = { ...defaults, ...options };

        this.title.textContent = settings.title;
        
        
        this.content.innerHTML = `
            <div class="popup-icon ${settings.icon}">
                <i class="fas fa-${this.getIconClass(settings.icon)}"></i>
            </div>
            <div class="popup-message">${settings.message}</div>
        `;

      
        this.actionButtons.innerHTML = `
            <button class="popup-btn popup-btn-secondary" id="popupCancel">${settings.cancelText}</button>
            <button class="popup-btn popup-btn-primary" id="popupConfirm">${settings.confirmText}</button>
        `;

        this.confirmBtn = document.getElementById('popupConfirm');
        this.cancelBtn = document.getElementById('popupCancel');
        
        this.confirmBtn.addEventListener('click', () => {
            this.close();
            if (settings.onConfirm) settings.onConfirm();
        });
        
        this.cancelBtn.addEventListener('click', () => {
            this.close();
            if (settings.onCancel) settings.onCancel();
        });

        this.open();
    },

    
    prompt: function(options) {
        const defaults = {
            title: 'Enter Information',
            label: 'Value:',
            placeholder: '',
            defaultValue: '',
            confirmText: 'Submit',
            cancelText: 'Cancel',
            onSubmit: null,
            onCancel: null
        };

        const settings = { ...defaults, ...options };

        this.title.textContent = settings.title;
        
        // Create content with form field
        this.content.innerHTML = `
            <div class="popup-form">
                <div class="popup-form-group">
                    <label for="promptInput">${settings.label}</label>
                    <input type="text" id="promptInput" placeholder="${settings.placeholder}" value="${settings.defaultValue}">
                </div>
            </div>
        `;

       
        this.actionButtons.innerHTML = `
            <button class="popup-btn popup-btn-secondary" id="popupCancel">${settings.cancelText}</button>
            <button class="popup-btn popup-btn-primary" id="popupConfirm">${settings.confirmText}</button>
        `;

        this.confirmBtn = document.getElementById('popupConfirm');
        this.cancelBtn = document.getElementById('popupCancel');
        const promptInput = document.getElementById('promptInput');
        
      
        setTimeout(() => promptInput.focus(), 100);
        
        this.confirmBtn.addEventListener('click', () => {
            const value = promptInput.value;
            this.close();
            if (settings.onSubmit) settings.onSubmit(value);
        });
        
        this.cancelBtn.addEventListener('click', () => {
            this.close();
            if (settings.onCancel) settings.onCancel();
        });

     
        promptInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                this.confirmBtn.click();
            }
        });

        this.open();
    },

    custom: function(options) {
        const defaults = {
            title: 'Custom Content',
            content: '',
            buttons: [],
            width: null
        };

        const settings = { ...defaults, ...options };

        this.title.textContent = settings.title;
        this.content.innerHTML = settings.content;

     
        if (settings.width) {
            this.container.style.maxWidth = settings.width;
        } else {
            this.container.style.maxWidth = '400px';
        }

       
        let buttonsHtml = '';
        settings.buttons.forEach(button => {
            const buttonClass = button.primary ? 'popup-btn-primary' : 'popup-btn-secondary';
            buttonsHtml += `<button class="popup-btn ${buttonClass}" id="${button.id}">${button.text}</button>`;
        });
        
        this.actionButtons.innerHTML = buttonsHtml;

      
        settings.buttons.forEach(button => {
            const buttonElement = document.getElementById(button.id);
            buttonElement.addEventListener('click', () => {
                if (button.closeOnClick !== false) {
                    this.close();
                }
                if (button.onClick) button.onClick();
            });
        });

        this.open();
    },

    // Show ticket details in popup
    viewTicket: function(ticket) {
        const dateObj = new Date(ticket.dateCreated);
        const formattedDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')} ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;
        
        const content = `
            <dl class="ticket-details">
                <dt>Ticket ID:</dt>
                <dd>${ticket.id}</dd>
                
                <dt>Raised by:</dt>
                <dd>${ticket.fullName}</dd>
                
                <dt>Email:</dt>
                <dd>${ticket.email}</dd>
                
                <dt>Phone:</dt>
                <dd>${ticket.phone}</dd>
                
                <dt>Subject:</dt>
                <dd>${ticket.subject}</dd>
                
                <dt>Date Created:</dt>
                <dd>${formattedDate}</dd>
                
                <dt>Preferred Contact:</dt>
                <dd>${ticket.preferredContact}</dd>
                
                <dt>Attachment:</dt>
                <dd>${ticket.hasAttachment ? 'Yes' : 'No'}</dd>
            </dl>
            
            <div>
                <h4>Message:</h4>
                <p>${ticket.message}</p>
            </div>
        `;
        
        this.custom({
            title: `Ticket #${ticket.id} Details`,
            content: content,
            width: '500px',
            buttons: [
                {
                    id: 'ticketClose',
                    text: 'Close',
                    primary: false
                },
                {
                    id: 'ticketReply',
                    text: 'Reply',
                    primary: true,
                    onClick: () => this.replyToTicket(ticket)
                }
            ]
        });
    },

    // Reply to ticket popup
    replyToTicket: function(ticket) {
        const content = `
            <div class="popup-form">
                <div class="popup-form-group">
                    <label for="replyMethod">Reply Method:</label>
                    <select id="replyMethod">
                        <option value="email" ${ticket.preferredContact === 'Email' ? 'selected' : ''}>Email</option>
                        <option value="phone" ${ticket.preferredContact === 'Phone' ? 'selected' : ''}>Phone</option>
                    </select>
                </div>
                <div class="popup-form-group">
                    <label for="replyMessage">Message:</label>
                    <textarea id="replyMessage" rows="4" placeholder="Type your reply..."></textarea>
                </div>
            </div>
        `;
        
        this.custom({
            title: `Reply to Ticket #${ticket.id}`,
            content: content,
            width: '500px',
            buttons: [
                {
                    id: 'cancelReply',
                    text: 'Cancel',
                    primary: false
                },
                {
                    id: 'sendReply',
                    text: 'Send Reply',
                    primary: true,
                    onClick: () => {
                        const method = document.getElementById('replyMethod').value;
                        const message = document.getElementById('replyMessage').value;
                        
                        if (!message.trim()) {
                         
                            this.alert({
                                title: 'Error',
                                message: 'Please enter a reply message.',
                                icon: 'error'
                            });
                            return;
                        }
                        
                  
                        this.alert({
                            title: 'Success',
                            message: `Reply sent to ${ticket.fullName} via ${method === 'email' ? 'email' : 'phone call'}.`,
                            icon: 'success'
                        });
                    }
                }
            ]
        });
    },


    open: function() {
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; 
    },

  
    close: function() {
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
    },

  
    getIconClass: function(type) {
        switch(type) {
            case 'success': return 'check-circle';
            case 'warning': return 'exclamation-triangle';
            case 'error': return 'times-circle';
            case 'info':
            default: return 'info-circle';
        }
    }
};

// Initialize popup when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    popup.init();
    
 
    let activeFilters = false;
    let activeSorts = false;

    
    const tableBody = document.getElementById('ticketTableBody');
    populateTicketTable(tickets);
    updateControlButtons();

    // Event listeners for sort, filter and refresh buttons
    document.getElementById('sortButton').addEventListener('click', function() {
        if (activeSorts) {
           
            clearSorts();
        } else {
           
            document.getElementById('sortPopupOverlay').style.display = 'flex';
        }
    });
    
    document.getElementById('filterButton').addEventListener('click', function() {
        if (activeFilters) {
            
            clearFilters();
        } else {
           
            document.getElementById('filterPopupOverlay').style.display = 'flex';
        }
    });
    
    document.getElementById('refreshButton').addEventListener('click', function() {
      
        populateTicketTable(tickets);
    });

    // Close buttons for popups
    document.getElementById('sortPopupClose').addEventListener('click', function() {
        document.getElementById('sortPopupOverlay').style.display = 'none';
    });
    
    document.getElementById('filterPopupClose').addEventListener('click', function() {
        document.getElementById('filterPopupOverlay').style.display = 'none';
    });

    // Submit buttons for sort and filter
    document.getElementById('submitSortBtn').addEventListener('click', function() {
        applySorting();
        document.getElementById('sortPopupOverlay').style.display = 'none';
    });

    document.getElementById('submitFilterBtn').addEventListener('click', function() {
        applyFilters();
        document.getElementById('filterPopupOverlay').style.display = 'none';
    });

    
    function applySorting() {
        activeSorts = true;
        updateControlButtons();
    }

    
    function applyFilters() {
        activeFilters = true;
        updateControlButtons();
    }

   
    function clearSorts() {
        activeSorts = false;
        updateControlButtons();
        
        populateTicketTable(tickets);
    }

    
    function clearFilters() {
        activeFilters = false;
        updateControlButtons();
        
        populateTicketTable(tickets);
    }

    
    function updateControlButtons() {
        
        const sortButton = document.getElementById('sortButton');
        if (activeSorts) {
            sortButton.innerHTML = `<span class="active-filter-indicator">1 Sort <i class="fas fa-times"></i></span>`;
            sortButton.classList.add('active-control');
        } else {
            sortButton.innerHTML = `<i class="fas fa-sort-amount-down"></i> Sort`;
            sortButton.classList.remove('active-control');
        }

        // Update filter button
        const filterButton = document.getElementById('filterButton');
        if (activeFilters) {
            filterButton.innerHTML = `<span class="active-filter-indicator">1 Filter <i class="fas fa-times"></i></span>`;
            filterButton.classList.add('active-control');
        } else {
            filterButton.innerHTML = `<i class="fas fa-filter"></i> Filter`;
            filterButton.classList.remove('active-control');
        }
    }

    // Populate table function
    function populateTicketTable(ticketData) {
        tableBody.innerHTML = '';
        
        ticketData.forEach(ticket => {
            const row = document.createElement('tr');
            
         
            const idCell = document.createElement('td');
            idCell.textContent = ticket.ticket_id;
            row.appendChild(idCell);
            
       
            const raisedByCell = document.createElement('td');
            raisedByCell.innerHTML = `${ticket.raised_by}<br><span style="color: #666; font-size: 0.9em;">${ticket.email}</span>`;
            row.appendChild(raisedByCell);
            
       
            const detailsCell = document.createElement('td');
            detailsCell.innerHTML = ticket.ticket_details.replace(/\n/g, '<br>');
            row.appendChild(detailsCell);
            
          
            const dateCell = document.createElement('td');
            dateCell.textContent = ticket.date_created;
            row.appendChild(dateCell);
            
         
            const actionsCell = document.createElement('td');
            actionsCell.className = 'actions-cell';
            
         
            const infoBtn = document.createElement('span');
            infoBtn.innerHTML = '<i class="fas fa-info-circle"></i>';
            infoBtn.className = 'action-icon';
            actionsCell.appendChild(infoBtn);
            
          
            const downloadBtn = document.createElement('span');
            downloadBtn.innerHTML = '<i class="fas fa-download"></i>';
            downloadBtn.className = 'action-icon';
            actionsCell.appendChild(downloadBtn);
            
        
            const callBtn = document.createElement('span');
            callBtn.innerHTML = '<i class="fas fa-phone"></i>';
            callBtn.className = 'action-icon';
            actionsCell.appendChild(callBtn);
            
         
            const emailBtn = document.createElement('span');
            emailBtn.innerHTML = '<i class="fas fa-envelope"></i>';
            emailBtn.className = 'action-icon';
            actionsCell.appendChild(emailBtn);
            
       
            const copyBtn = document.createElement('span');
            copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
            copyBtn.className = 'action-icon';
            actionsCell.appendChild(copyBtn);
            
          
            const deleteBtn = document.createElement('span');
            deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteBtn.className = 'action-icon';
            actionsCell.appendChild(deleteBtn);
            
            row.appendChild(actionsCell);
            tableBody.appendChild(row);
        });
    }
});

// Global variables
let tickets = [];
let currentTicketId = 1;
let cryptoKey;


// Initialize the application
document.addEventListener('DOMContentLoaded', async function() {
    await loadTicketsFromStorage();
    
 
    const isTicketForm = document.getElementById('ticketForm');
    const isTicketList = document.getElementById('ticketTableBody');
    
    if (isTicketForm) {
        setupTicketForm();
    }
    
    if (isTicketList) {
        displayTickets();
        setupTicketListControls();
    }
});

// Load tickets from localStorage
async function loadTicketsFromStorage() {
    try {
        if (!cryptoKey) {
            cryptoKey = await generateKey();
        }

        const storedTickets = localStorage.getItem('tickets');
        if (storedTickets) {
            const combined = Uint8Array.from(atob(storedTickets), c => c.charCodeAt(0));
            const decryptedData = await decryptData(cryptoKey, combined);
            tickets = JSON.parse(decryptedData);

         
            if (tickets.length > 0) {
                const highestId = Math.max(...tickets.map(ticket => ticket.id));
                currentTicketId = highestId + 1;
            }
        }
    } catch (error) {
        console.error('Failed to load tickets from storage:', error);
     
        localStorage.removeItem('tickets');
        tickets = [];
    }
}
// Save tickets to localStorage
async function saveTicketsToStorage() {
    try {
        if (!cryptoKey) {
            cryptoKey = await generateKey();
        }

        const combined = await encryptData(cryptoKey, tickets);
        const base64Data = btoa(String.fromCharCode.apply(null, combined));
        localStorage.setItem('tickets', base64Data);
    } catch (error) {
        console.error('Failed to save tickets to storage:', error);
    }
}


// Setup the ticket form
function setupTicketForm() {
    const ticketForm = document.getElementById('ticketForm');
    const fileInput = document.getElementById('attachment');
    const fileNameDisplay = document.querySelector('.file-name');
    const fileSelectButton = document.querySelector('.file-select-button');
    
   
    fileInput.addEventListener('change', function(e) {
        const fileName = e.target.files.length > 0 ? e.target.files[0].name : 'No file chosen';
        fileNameDisplay.textContent = fileName;
    });
    
    fileSelectButton.addEventListener('click', function() {
        fileInput.click();
    });
    
    // Handle form submission
    ticketForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
    
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        const preferredContact = document.querySelector('input[name="preferredContact"]:checked').value;
        
      
        const newTicket = {
            id: currentTicketId++,
            fullName: fullName,
            email: email,
            phone: phone,
            subject: subject,
            message: message,
            preferredContact: preferredContact,
            hasAttachment: fileInput.files.length > 0,
            dateCreated: new Date().toISOString()
        };
        
      
        tickets.push(newTicket);
        
   
        await saveTicketsToStorage();
        
   
        ticketForm.reset();
        fileNameDisplay.textContent = 'No file chosen';
        
       
        popup.alert({
            title: 'Success',
            message: 'Your ticket has been submitted successfully!',
            icon: 'success',
            buttonText: 'View Tickets',
            callback: function() {
                window.location.href = 'view_ticketlist.html';
            }
        });
    });
}



// Display tickets in the table
function displayTickets() {
    const tableBody = document.getElementById('ticketTableBody');
    tableBody.innerHTML = '';
    
    tickets.forEach(ticket => {
        const row = document.createElement('tr');
        
        // Format date
        const dateObj = new Date(ticket.dateCreated);
        const formattedDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')} ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}:${String(dateObj.getSeconds()).padStart(2, '0')}`;
        
        row.innerHTML = `
            <td>${ticket.id}</td>
            <td>
                ${ticket.fullName}<br>
                <small>${ticket.email}</small>
            </td>
            <td>
                ${ticket.subject}<br>
                <small>Logging it is taking 5 mins and...</small>
            </td>
            <td>${formattedDate}</td>
            <td class="action-buttons">
                <button class="action-button menu-btn" data-id="${ticket.id}" title="View Ticket">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-button download-btn" data-id="${ticket.id}" title="Download Attachment" ${!ticket.hasAttachment ? 'disabled' : ''}>
                    <i class="fas fa-download"></i>
                </button>
                <button class="action-button call-btn" data-id="${ticket.id}" title="Call">
                    <i class="fas fa-phone"></i>
                </button>
                <button class="action-button email-btn" data-id="${ticket.id}" title="Email">
                    <i class="fas fa-envelope"></i>
                </button>
                <button class="action-button chat-btn" data-id="${ticket.id}" title="Chat">
                    <i class="fas fa-comment"></i>
                </button>
                
                <button class="action-button delete-btn" data-id="${ticket.id}" title="Delete Ticket">
                    <i class="fas fa-trash"></i>
                </button>
            
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    
    addActionButtonListeners();
}

// Add event listeners to ticket action buttons

function addActionButtonListeners() {
    // View button
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const ticketId = this.getAttribute('data-id');
            const ticket = tickets.find(t => t.id == ticketId);
            if (ticket) {
                popup.viewTicket(ticket);
            }
        });
    });
    
    // Call button
    document.querySelectorAll('.call-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const ticketId = this.getAttribute('data-id');
            const ticket = tickets.find(t => t.id == ticketId);
            
            popup.alert({
                title: 'Calling',
                message: `Initiating call to ${ticket.fullName} at ${ticket.phone}`,
                icon: 'info',
                buttonText: 'OK'
            });
        });
    });
    
    // Email button
    document.querySelectorAll('.email-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const ticketId = this.getAttribute('data-id');
            const ticket = tickets.find(t => t.id == ticketId);
            
            popup.custom({
                title: 'Send Email',
                content: `
                    <div class="popup-form">
                        <div class="popup-form-group">
                            <label for="emailSubject">Subject:</label>
                            <input type="text" id="emailSubject" value="RE: ${ticket.subject}">
                        </div>
                        <div class="popup-form-group">
                            <label for="emailMessage">Message:</label>
                            <textarea id="emailMessage" rows="4" placeholder="Type your message..."></textarea>
                        </div>
                    </div>
                `,
                buttons: [
                    {
                        id: 'cancelEmail',
                        text: 'Cancel',
                        primary: false
                    },
                    {
                        id: 'sendEmail',
                        text: 'Send Email',
                        primary: true,
                        onClick: function() {
                            const subject = document.getElementById('emailSubject').value;
                            const message = document.getElementById('emailMessage').value;
                            
                            if (!message.trim()) {
                                popup.alert({
                                    title: 'Error',
                                    message: 'Please enter a message.',
                                    icon: 'error'
                                });
                                return;
                            }
                            
                            popup.alert({
                                title: 'Success',
                                message: `Email sent to ${ticket.email}`,
                                icon: 'success'
                            });
                        }
                    }
                ]
            });
        });
    });
    
    // Chat button
    document.querySelectorAll('.chat-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const ticketId = this.getAttribute('data-id');
            const ticket = tickets.find(t => t.id == ticketId);
            
            popup.alert({
                title: 'Chat',
                message: `Chat feature with ${ticket.fullName} is not available in this demo.`,
                icon: 'info'
            });
        });
    });
    
    //Download attachment button
    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const ticketId = this.getAttribute('data-id');
            const ticket = tickets.find(t => t.id == ticketId);
            
            if (ticket && ticket.hasAttachment) {
                downloadAttachment(ticket);
            } else {
                popup.alert({
                    title: 'No Attachment',
                    message: 'This ticket does not have any attachments.',
                    icon: 'info'
                });
            }
        });
    });
    
    //  Delete ticket button
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const ticketId = this.getAttribute('data-id');
            deleteTicketWithConfirmation(ticketId);
        });
    });
    
    // Context menu button
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const ticketId = this.getAttribute('data-id');
            showContextMenu(e, ticketId);
        });
    });
}

// Show context menu
function setupContextMenuItems(ticketId) {
   
    document.getElementById('downloadAttachment').addEventListener('click', function() {
        popup.alert({
            title: 'Download',
            message: `Downloading attachment for ticket ${ticketId}`,
            icon: 'info'
        });
        closeContextMenu();
    });
    
    // Trigger email
    document.getElementById('triggerEmail').addEventListener('click', function() {
        popup.alert({
            title: 'Contact Changed',
            message: `Contact method changed to email for ticket ${ticketId}`,
            icon: 'success'
        });
        closeContextMenu();
    });
    
    // Trigger call
    document.getElementById('triggerCall').addEventListener('click', function() {
        popup.alert({
            title: 'Contact Changed',
            message: `Contact method changed to phone call for ticket ${ticketId}`,
            icon: 'success'
        });
        closeContextMenu();
    });
    
    // Add as copy
    document.getElementById('addAsTicket').addEventListener('click', function() {
        const ticket = tickets.find(t => t.id == ticketId);
        if (ticket) {
            const newTicket = {...ticket};
            newTicket.id = currentTicketId++;
            newTicket.dateCreated = new Date().toISOString();
            tickets.push(newTicket);
            saveTicketsToStorage();
            displayTickets();
            
            popup.alert({
                title: 'Success',
                message: `Ticket ${ticketId} copied as ticket ${newTicket.id}`,
                icon: 'success'
            });
        }
        closeContextMenu();
    });
    
    // Delete ticket
    document.getElementById('deleteTicket').addEventListener('click', function() {
        popup.confirm({
            title: 'Confirm Deletion',
            message: `Are you sure you want to delete ticket ${ticketId}?`,
            icon: 'warning',
            confirmText: 'Delete',
            cancelText: 'Cancel',
            onConfirm: function() {
                tickets = tickets.filter(t => t.id != ticketId);
                saveTicketsToStorage();
                displayTickets();
                
                popup.alert({
                    title: 'Success',
                    message: `Ticket ${ticketId} has been deleted`,
                    icon: 'success'
                });
            }
        });
        closeContextMenu();
    });
}

function downloadAttachment(ticket) {
    
    popup.custom({
        title: 'Downloading Attachment',
        content: `
            <div class="popup-icon info">
                <i class="fas fa-download"></i>
            </div>
            <div class="popup-message">
                <p>Downloading attachment for Ticket #${ticket.id}...</p>
                <div class="download-progress">
                    <div class="progress-bar">
                        <div class="progress-bar-fill" id="downloadProgress"></div>
                    </div>
                    <div class="progress-text" id="progressText">0%</div>
                </div>
            </div>
        `,
        buttons: [
            {
                id: 'cancelDownload',
                text: 'Cancel',
                primary: false
            }
        ]
    });
    
   
    let progress = 0;
    const progressBar = document.getElementById('downloadProgress');
    const progressText = document.getElementById('progressText');
    
    const downloadInterval = setInterval(() => {
        progress += 5;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${progress}%`;
        
        if (progress >= 100) {
            clearInterval(downloadInterval);
            setTimeout(() => {
                popup.alert({
                    title: 'Download Complete',
                    message: `Attachment for Ticket #${ticket.id} has been downloaded successfully.`,
                    icon: 'success'
                });
            }, 500);
        }
    }, 150);
    
 
    document.getElementById('cancelDownload').addEventListener('click', () => {
        clearInterval(downloadInterval);
    });
}

function deleteTicketWithConfirmation(ticketId) {
    const ticket = tickets.find(t => t.id == ticketId);
    
    if (!ticket) return;
    
    popup.confirm({
        title: 'Delete Ticket',
        message: `Are you sure you want to delete Ticket #${ticketId} from ${ticket.fullName}?`,
        icon: 'warning',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        onConfirm: function() {
          
            tickets = tickets.filter(t => t.id != ticketId);
            
            
            saveTicketsToStorage();
            
           
            displayTickets();
            
          
            popup.alert({
                title: 'Success',
                message: `Ticket #${ticketId} has been deleted successfully.`,
                icon: 'success'
            });
        }
    });
}
// Setup ticket list controls
function setupTicketListControls() {
  
    document.getElementById('refreshButton').addEventListener('click', function() {
        loadTicketsFromStorage();
        displayTickets();
        
        popup.alert({
            title: 'Refreshed',
            message: 'Ticket list has been refreshed',
            icon: 'success'
        });
    });
}

// Filter Popup Functionality
document.addEventListener('DOMContentLoaded', function() {
  
    const filterButton = document.getElementById('filterButton');
    const filterPopupOverlay = document.getElementById('filterPopupOverlay');
    const filterPopupClose = document.getElementById('filterPopupClose');
    const addFilterBtn = document.getElementById('addFilterBtn');
    const resetFilterBtn = document.getElementById('resetFilterBtn');
    const submitFilterBtn = document.getElementById('submitFilterBtn');
    const filterRows = document.getElementById('filterRows');
    
    
    filterButton.addEventListener('click', function() {
        filterPopupOverlay.style.display = 'flex';
    });
    
  
    filterPopupClose.addEventListener('click', function() {
        filterPopupOverlay.style.display = 'none';
    });
    
   
    addFilterBtn.addEventListener('click', function() {
        addFilterRow();
    });
    
    
    resetFilterBtn.addEventListener('click', function() {
        resetFilters();
    });
    
    submitFilterBtn.addEventListener('click', function() {
        applyFilters();
        filterPopupOverlay.style.display = 'none';
    });
    
   
    filterPopupOverlay.addEventListener('click', function(event) {
        if (event.target === filterPopupOverlay) {
            filterPopupOverlay.style.display = 'none';
        }
    });
    
  
    filterRows.addEventListener('click', function(event) {
        if (event.target.classList.contains('fa-trash-alt') || 
            event.target.classList.contains('remove-filter-btn')) {
            const filterRow = getClosestParent(event.target, '.filter-row');
            if (filterRow && filterRows.children.length > 1) {
                filterRow.remove();
            }
        }
    });
    
   
    function getClosestParent(element, selector) {
        while (element && !element.matches(selector)) {
            element = element.parentElement;
        }
        return element;
    }
    
  
    function addFilterRow() {
        const newRow = document.createElement('div');
        newRow.className = 'filter-row';
        newRow.innerHTML = `
            <div class="filter-column">
                <label>Column:</label>
                <select class="column-select">
                    <option value="">Select Column</option>
                    <option value="ticket_id">Ticket ID</option>
                    <option value="raised_by">Raised by</option>
                    <option value="email_address">Email Address</option>
                    <option value="ticket_details">Ticket Details</option>
                    <option value="date_created">Date Created</option>
                </select>
            </div>
            <div class="filter-relation">
                <label>Relation:</label>
                <select class="relation-select">
                    <option value="">Select Relation</option>
                    <option value="equals">Equals</option>
                    <option value="contains">Contains</option>
                    <option value="starts_with">Starts with</option>
                    <option value="ends_with">Ends with</option>
                    <option value="greater_than">Greater than</option>
                    <option value="less_than">Less than</option>
                </select>
            </div>
            <div class="filter-value">
                <label>Filter Value:</label>
                <input type="text" class="filter-value-input" placeholder="Enter Value">
            </div>
            <div class="filter-remove">
                <button class="remove-filter-btn">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
        filterRows.appendChild(newRow);
    }
    
    // Function to reset filters
    function resetFilters() {
        // Clear all filter rows except the first one
        while (filterRows.children.length > 1) {
            filterRows.removeChild(filterRows.lastChild);
        }
        
        // Reset the values in the first row
        const firstRow = filterRows.children[0];
        if (firstRow) {
            const columnSelect = firstRow.querySelector('.column-select');
            const relationSelect = firstRow.querySelector('.relation-select');
            const valueInput = firstRow.querySelector('.filter-value-input');
            
            if (columnSelect) columnSelect.value = '';
            if (relationSelect) relationSelect.value = '';
            if (valueInput) valueInput.value = '';
        }
    }
    
    // Function to apply filters to the table
    function applyFilters() {
        const filters = [];
        const filterRowElements = filterRows.querySelectorAll('.filter-row');
        
        filterRowElements.forEach(row => {
            const column = row.querySelector('.column-select').value;
            const relation = row.querySelector('.relation-select').value;
            const value = row.querySelector('.filter-value-input').value;
            
            if (column && relation && value) {
                filters.push({
                    column,
                    relation,
                    value
                });
            }
        });
       
        filterTableRows(filters);
    }
    
  
    function filterTableRows(filters) {
        const tableRows = document.querySelectorAll('#ticketTableBody tr');
        
        if (filters.length === 0) {
          
            tableRows.forEach(row => {
                row.style.display = '';
            });
            return;
        }
        
        tableRows.forEach(row => {
            let shouldShow = true;
            
            filters.forEach(filter => {
                const cellIndex = getCellIndexByColumnName(filter.column);
                if (cellIndex === -1) return;
                
                const cell = row.cells[cellIndex];
                const cellValue = cell.textContent.trim().toLowerCase();
                const filterValue = filter.value.toLowerCase();
                
                switch(filter.relation) {
                    case 'equals':
                        if (cellValue !== filterValue) shouldShow = false;
                        break;
                    case 'contains':
                        if (!cellValue.includes(filterValue)) shouldShow = false;
                        break;
                    case 'starts_with':
                        if (!cellValue.startsWith(filterValue)) shouldShow = false;
                        break;
                    case 'ends_with':
                        if (!cellValue.endsWith(filterValue)) shouldShow = false;
                        break;
                    case 'greater_than':
                        if (!(parseFloat(cellValue) > parseFloat(filterValue))) shouldShow = false;
                        break;
                    case 'less_than':
                        if (!(parseFloat(cellValue) < parseFloat(filterValue))) shouldShow = false;
                        break;
                }
            });
            
            row.style.display = shouldShow ? '' : 'none';
        });
    }
    

    function getCellIndexByColumnName(columnName) {
        const columnMapping = {
            'ticket_id': 0,
            'raised_by': 1,
            'email_address': 1, 
            'ticket_details': 2,
            'date_created': 3
        };
        
        return columnMapping[columnName] !== undefined ? columnMapping[columnName] : -1;
    }
    
  
    initFilterPopup();
    
    
    function initFilterPopup() {
       
        if (filterRows.children.length === 0) {
            addFilterRow();
        }
    }
});

// Sort functionality
document.addEventListener('DOMContentLoaded', function() {
   
    const sortButton = document.getElementById('sortButton');
    const sortPopupOverlay = document.getElementById('sortPopupOverlay');
    const sortPopupClose = document.getElementById('sortPopupClose');
    const addSortBtn = document.getElementById('addSortBtn');
    const resetSortingBtn = document.getElementById('resetSortingBtn');
    const submitSortBtn = document.getElementById('submitSortBtn');
    const sortRows = document.getElementById('sortRows');
    
   
    sortButton.addEventListener('click', function() {
        sortPopupOverlay.style.display = 'flex';
    });
    
    sortPopupClose.addEventListener('click', function() {
        sortPopupOverlay.style.display = 'none';
    });
    
    
    sortPopupOverlay.addEventListener('click', function(event) {
        if (event.target === sortPopupOverlay) {
            sortPopupOverlay.style.display = 'none';
        }
    });
    
   
    addSortBtn.addEventListener('click', function() {
        addSortRow();
    });
    
   
    resetSortingBtn.addEventListener('click', function() {
        resetSorting();
    });
    
   
    submitSortBtn.addEventListener('click', function() {
        applySorting();
        sortPopupOverlay.style.display = 'none';
    });
    
    initSortRowEvents(sortRows.querySelector('.sort-row'));
    
    
    function addSortRow() {
        const newRow = document.createElement('div');
        newRow.className = 'sort-row';
        newRow.innerHTML = `
            <div class="sort-column">
                <label>Column:</label>
                <select class="column-select">
                    <option value="">Select Column</option>
                    <option value="ticket_id">Ticket ID</option>
                    <option value="raised_by">Raised by</option>
                    <option value="ticket_details">Ticket Details</option>
                    <option value="date_created">Date Created</option>
                </select>
            </div>
            <div class="sort-order">
                <label>Order:</label>
                <select class="order-select">
                    <option value="">Select Order</option>
                    <option value="ascending">Ascending</option>
                    <option value="descending">Descending</option>
                </select>
            </div>
            <div class="sort-remove">
                <button class="remove-sort-btn">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
        
        sortRows.appendChild(newRow);
        initSortRowEvents(newRow);
    }
    
    // Initialize events for a sort row
    function initSortRowEvents(row) {
        const removeBtn = row.querySelector('.remove-sort-btn');
        
        removeBtn.addEventListener('click', function() {
        
            if (sortRows.querySelectorAll('.sort-row').length > 1) {
                row.remove();
            }
        });
    }
    
    // Reset all sorting
    function resetSorting() {
        
        const allRows = sortRows.querySelectorAll('.sort-row');
        for (let i = 1; i < allRows.length; i++) {
            allRows[i].remove();
        }
        
      
        const firstRow = sortRows.querySelector('.sort-row');
        firstRow.querySelector('.column-select').value = '';
        firstRow.querySelector('.order-select').value = '';
        
        
        loadTickets();
    }
    
    // Apply sorting to the table
    function applySorting() {
        const sortCriteria = [];
        const sortRowElements = sortRows.querySelectorAll('.sort-row');
        
        sortRowElements.forEach(row => {
            const column = row.querySelector('.column-select').value;
            const order = row.querySelector('.order-select').value;
            
            if (column && order) {
                sortCriteria.push({ column, order });
            }
        });
        
        if (sortCriteria.length > 0) {
            sortTickets(sortCriteria);
        }
    }
    
    // Function to sort tickets based on criteria
    function sortTickets(criteria) {
     
        if (typeof tickets !== 'undefined' && Array.isArray(tickets)) {
            tickets.sort((a, b) => {
                
                for (const criterion of criteria) {
                    const { column, order } = criterion;
                    
                   
                    let valueA, valueB;
                    
                    if (column === 'date_created') {
                        valueA = new Date(a[column]);
                        valueB = new Date(b[column]);
                    } else if (column === 'ticket_id') {
                        valueA = parseInt(a[column].replace(/\D/g, ''));
                        valueB = parseInt(b[column].replace(/\D/g, ''));
                    } else {
                        valueA = a[column].toString().toLowerCase();
                        valueB = b[column].toString().toLowerCase();
                    }
                    
                    // Compare values
                    if (valueA !== valueB) {
                        if (order === 'ascending') {
                            return valueA < valueB ? -1 : 1;
                        } else {
                            return valueA > valueB ? -1 : 1;
                        }
                    }
                }
                
                return 0; // Equal based on all criteria
            });
            
            // Refresh the table with sorted tickets
            renderTickets(tickets);
        }
    }
    
    // Function to render tickets to the table
    // This depends on your implementation
    function renderTickets(ticketsArray) {
        const tableBody = document.getElementById('ticketTableBody');
        tableBody.innerHTML = '';
        
        ticketsArray.forEach(ticket => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${ticket.ticket_id}</td>
                <td>${ticket.raised_by}</td>
                <td>${ticket.ticket_details}</td>
                <td>${ticket.date_created}</td>
                <td>
                    <button class="action-btn view-btn" data-id="${ticket.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit-btn" data-id="${ticket.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" data-id="${ticket.id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
        
        initTableRowEvents();
    }
    
   
    function loadTickets() {
       
        if (typeof fetchTickets === 'function') {
            fetchTickets();
        }
    }
    
    // Initialize table row events
    function initTableRowEvents() {
        
       
    }
});