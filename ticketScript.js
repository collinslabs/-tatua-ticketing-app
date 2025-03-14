
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

    // Initializing the popup system
    init: function() {
        this.overlay = document.getElementById('popupOverlay');
        this.container = this.overlay.querySelector('.popup-container');
        this.title = document.getElementById('popupTitle');
        this.content = document.getElementById('popupContent');
        this.confirmBtn = document.getElementById('popupConfirm');
        this.cancelBtn = document.getElementById('popupCancel');
        this.closeBtn = document.getElementById('popupClose');
        this.actionButtons = document.getElementById('popupActions');

        // Close popup when clicking the close button
        this.closeBtn.addEventListener('click', () => this.close());
        
        // Close popup when clicking outside
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.close();
            }
        });
    },

    // Show alert popup
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
        
        // Create content with icon and message
        this.content.innerHTML = `
            <div class="popup-icon ${settings.icon}">
                <i class="fas fa-${this.getIconClass(settings.icon)}"></i>
            </div>
            <div class="popup-message">${settings.message}</div>
        `;

        // Show only the confirm button
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

    // Show confirmation popup
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
        
        // Create content with icon and message
        this.content.innerHTML = `
            <div class="popup-icon ${settings.icon}">
                <i class="fas fa-${this.getIconClass(settings.icon)}"></i>
            </div>
            <div class="popup-message">${settings.message}</div>
        `;

        // Show confirm and cancel buttons
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

    // Show prompt popup
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

        // Show submit and cancel buttons
        this.actionButtons.innerHTML = `
            <button class="popup-btn popup-btn-secondary" id="popupCancel">${settings.cancelText}</button>
            <button class="popup-btn popup-btn-primary" id="popupConfirm">${settings.confirmText}</button>
        `;

        this.confirmBtn = document.getElementById('popupConfirm');
        this.cancelBtn = document.getElementById('popupCancel');
        const promptInput = document.getElementById('promptInput');
        
        // Focus the input field
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

        // Submit on Enter key
        promptInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                this.confirmBtn.click();
            }
        });

        this.open();
    },

    // Show custom content in popup
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

        // Set custom width if provided
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
                            // Show error if message is empty
                            this.alert({
                                title: 'Error',
                                message: 'Please enter a reply message.',
                                icon: 'error'
                            });
                            return;
                        }
                        
                        // Show success message
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

    // Open the popup
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


document.addEventListener('DOMContentLoaded', function() {
    popup.init();
    
});


let tickets = [];
let currentTicketId = 1;


document.addEventListener('DOMContentLoaded', function() {
    loadTicketsFromStorage();
    
 
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


function loadTicketsFromStorage() {
    const storedTickets = sessionStorage.getItem('tickets');
    if (storedTickets) {
        tickets = JSON.parse(storedTickets);
       
        if (tickets.length > 0) {
            const highestId = Math.max(...tickets.map(ticket => ticket.id));
            currentTicketId = highestId + 1;
        }
    }
}


function saveTicketsToStorage() {
    sessionStorage.setItem('tickets', JSON.stringify(tickets));
}


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
    
 
    ticketForm.addEventListener('submit', function(e) {
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
        
        
        saveTicketsToStorage();
        
       
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


function displayTickets() {
    const tableBody = document.getElementById('ticketTableBody');
    tableBody.innerHTML = '';
    
    tickets.forEach(ticket => {
        const row = document.createElement('tr');
        
      
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
                <button class="action-button view-btn" data-id="${ticket.id}" title="View Ticket">
                    <i class="fas fa-eye"></i>
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
                <button class="action-button download-btn" data-id="${ticket.id}" title="Download Attachment" ${!ticket.hasAttachment ? 'disabled' : ''}>
                    <i class="fas fa-download"></i>
                </button>
                <button class="action-button delete-btn" data-id="${ticket.id}" title="Delete Ticket">
                    <i class="fas fa-trash"></i>
                </button>
                <button class="action-button menu-btn" data-id="${ticket.id}" title="More Options">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    

    addActionButtonListeners();
}


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
    
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const ticketId = this.getAttribute('data-id');
            deleteTicketWithConfirmation(ticketId);
        });
    });
    
   
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const ticketId = this.getAttribute('data-id');
            showContextMenu(e, ticketId);
        });
    });
}


function setupContextMenuItems(ticketId) {
   
    document.getElementById('downloadAttachment').addEventListener('click', function() {
        popup.alert({
            title: 'Download',
            message: `Downloading attachment for ticket ${ticketId}`,
            icon: 'info'
        });
        closeContextMenu();
    });
    
   
    document.getElementById('triggerEmail').addEventListener('click', function() {
        popup.alert({
            title: 'Contact Changed',
            message: `Contact method changed to email for ticket ${ticketId}`,
            icon: 'success'
        });
        closeContextMenu();
    });
    
 
    document.getElementById('triggerCall').addEventListener('click', function() {
        popup.alert({
            title: 'Contact Changed',
            message: `Contact method changed to phone call for ticket ${ticketId}`,
            icon: 'success'
        });
        closeContextMenu();
    });
    
  
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
    
   
    function resetFilters() {
       
        while (filterRows.children.length > 1) {
            filterRows.removeChild(filterRows.lastChild);
        }
        
       
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
        
        // Filter the table rows based on the collected filters
        filterTableRows(filters);
    }
    
    // Function to filter table rows based on applied filters
    function filterTableRows(filters) {
        const tableRows = document.querySelectorAll('#ticketTableBody tr');
        
        if (filters.length === 0) {
            // Show all rows if no filters are applied
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
    
    // Helper function to get cell index by column name
    function getCellIndexByColumnName(columnName) {
        const columnMapping = {
            'ticket_id': 0,
            'raised_by': 1,
            'email_address': 1, // Assuming email is also in the raised_by column
            'ticket_details': 2,
            'date_created': 3
        };
        
        return columnMapping[columnName] !== undefined ? columnMapping[columnName] : -1;
    }
    
    // Initialize the filter popup
    initFilterPopup();
    
    // Initialize the filter popup with one row
    function initFilterPopup() {
        // Make sure there's at least one filter row
        if (filterRows.children.length === 0) {
            addFilterRow();
        }
    }
});

// Sort functionality
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const sortButton = document.getElementById('sortButton');
    const sortPopupOverlay = document.getElementById('sortPopupOverlay');
    const sortPopupClose = document.getElementById('sortPopupClose');
    const addSortBtn = document.getElementById('addSortBtn');
    const resetSortingBtn = document.getElementById('resetSortingBtn');
    const submitSortBtn = document.getElementById('submitSortBtn');
    const sortRows = document.getElementById('sortRows');
    
    // Open sort popup
    sortButton.addEventListener('click', function() {
        sortPopupOverlay.style.display = 'flex';
    });
    
    // Close sort popup
    sortPopupClose.addEventListener('click', function() {
        sortPopupOverlay.style.display = 'none';
    });
    
    // Close sort popup when clicking outside
    sortPopupOverlay.addEventListener('click', function(event) {
        if (event.target === sortPopupOverlay) {
            sortPopupOverlay.style.display = 'none';
        }
    });
    
    // Add new sort row
    addSortBtn.addEventListener('click', function() {
        addSortRow();
    });
    
    // Reset sorting
    resetSortingBtn.addEventListener('click', function() {
        resetSorting();
    });
    
    // Submit sorting
    submitSortBtn.addEventListener('click', function() {
        applySorting();
        sortPopupOverlay.style.display = 'none';
    });
    
    // Initialize event listeners for the first sort row
    initSortRowEvents(sortRows.querySelector('.sort-row'));
    
    // Function to add a new sort row
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
            // Don't remove if it's the only row
            if (sortRows.querySelectorAll('.sort-row').length > 1) {
                row.remove();
            }
        });
    }
    
    // Reset all sorting
    function resetSorting() {
        // Clear all rows except the first one
        const allRows = sortRows.querySelectorAll('.sort-row');
        for (let i = 1; i < allRows.length; i++) {
            allRows[i].remove();
        }
        
        // Reset the first row's selects
        const firstRow = sortRows.querySelector('.sort-row');
        firstRow.querySelector('.column-select').value = '';
        firstRow.querySelector('.order-select').value = '';
        
        // Apply the reset to the table
        // This part depends on your table implementation
        // Example: resetTableSorting();
        
        // For demonstration, we'll just reload the tickets
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
        // Get the current tickets array
        // This depends on how you're storing your tickets
        // For demonstration, let's assume tickets are stored in a global variable
        if (typeof tickets !== 'undefined' && Array.isArray(tickets)) {
            tickets.sort((a, b) => {
                // Iterate through each sort criteria
                for (const criterion of criteria) {
                    const { column, order } = criterion;
                    
                    // Convert values based on column type
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
    
    function initTableRowEvents() {
        
    }
});