// API and pagination configuration
const apiUrl = 'https://services.odata.org/TripPinRESTierService/(S(olb0yty34pw25ka5nt0go11m))/People';
let currentPage = 1;
let pageSize = 10;
let totalRecords = 0;
let currentSortCriteria = [];
let currentFilterCriteria = [];

document.addEventListener('DOMContentLoaded', () => {
    // Load initial data
    loadPeople();

    // Set up sort button
    document.getElementById('sortButton').addEventListener('click', () => {
        document.getElementById('sortPopupOverlay').style.display = 'flex';
    });

    // Set up filter button
    document.getElementById('filterButton').addEventListener('click', () => {
        document.getElementById('filterPopupOverlay').style.display = 'flex';
    });

    // Close sort popup
    document.getElementById('sortPopupClose').addEventListener('click', () => {
        document.getElementById('sortPopupOverlay').style.display = 'none';
    });

    // Close filter popup
    document.getElementById('filterPopupClose').addEventListener('click', () => {
        document.getElementById('filterPopupOverlay').style.display = 'none';
    });

    // Add sort row
    document.getElementById('addSortBtn').addEventListener('click', addSortRow);

    // Submit sort
    document.getElementById('submitSortBtn').addEventListener('click', () => {
        updateSortCriteria();
        document.getElementById('sortPopupOverlay').style.display = 'none';
        currentPage = 1;
        loadPeople();
    });

    // Reset sorting
    document.getElementById('resetSortingBtn').addEventListener('click', () => {
        currentSortCriteria = [];
        document.querySelectorAll('.sort-row').forEach((row, index) => {
            if (index > 0) {
                row.remove();
            } else {
                const columnSelect = row.querySelector('.column-select');
                const orderSelect = row.querySelector('.order-select');
                columnSelect.value = '';
                orderSelect.value = '';
            }
        });
        currentPage = 1;
        loadPeople(); // Reload data without sorting
    });

    // Add filter row
    document.getElementById('addFilterBtn').addEventListener('click', addFilterRow);

    // Submit filter
    document.getElementById('submitFilterBtn').addEventListener('click', () => {
        updateFilterCriteria();
        document.getElementById('filterPopupOverlay').style.display = 'none';
        currentPage = 1;
        loadPeople();
    });

    // Reset filter
    document.getElementById('resetFilterBtn').addEventListener('click', () => {
        currentFilterCriteria = [];
        document.querySelectorAll('.filter-row').forEach((row, index) => {
            if (index > 0) {
                row.remove();
            } else {
                const columnSelect = row.querySelector('.column-select');
                const relationSelect = row.querySelector('.relation-select');
                const valueInput = row.querySelector('.filter-value-input');
                columnSelect.value = '';
                relationSelect.value = '';
                valueInput.value = '';
            }
        });
        currentPage = 1;
        loadPeople(); // Reload data without filtering
    });

    // Set up context menu
    setupContextMenu();
});

// Function to add a new sort row
function addSortRow() {
    const sortRows = document.getElementById('sortRows');
    const newRow = document.createElement('div');
    newRow.className = 'sort-row';
    newRow.innerHTML = `
        <div class="sort-column">
            <label>Column:</label>
            <select class="column-select">
                <option value="">Select Column</option>
                <option value="FirstName">First Name</option>
                <option value="LastName">Last Name</option>
                <option value="Gender">Gender</option>
                <option value="Age">Age</option>
            </select>
        </div>
        <div class="sort-order">
            <label>Order:</label>
            <select class="order-select">
                <option value="">Select Order</option>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
            </select>
        </div>
        <div class="sort-remove">
            <button class="remove-sort-btn">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
    `;
    sortRows.appendChild(newRow);

    // Add event listener to the new remove button
    newRow.querySelector('.remove-sort-btn').addEventListener('click', function () {
        newRow.remove();
    });
}

// Function to add a new filter row
function addFilterRow() {
    const filterRows = document.getElementById('filterRows');
    const newRow = document.createElement('div');
    newRow.className = 'filter-row';
    newRow.innerHTML = `
        <div class="filter-column">
            <label>Column:</label>
            <select class="column-select">
                <option value="">Select Column</option>
                <option value="FirstName">First Name</option>
                <option value="LastName">Last Name</option>
                <option value="Gender">Gender</option>
                <option value="Age">Age</option>
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

    // Add event listener to the new remove button
    newRow.querySelector('.remove-filter-btn').addEventListener('click', function () {
        newRow.remove();
    });
}

// Function to update the sort criteria
function updateSortCriteria() {
    currentSortCriteria = [];
    document.querySelectorAll('.sort-row').forEach(row => {
        const column = row.querySelector('.column-select').value;
        const order = row.querySelector('.order-select').value;

        if (column && order) {
            currentSortCriteria.push({
                column: column,
                order: order
            });
        }
    });
}

// Function to update the filter criteria
function updateFilterCriteria() {
    currentFilterCriteria = [];
    document.querySelectorAll('.filter-row').forEach(row => {
        const column = row.querySelector('.column-select').value;
        const relation = row.querySelector('.relation-select').value;
        const value = row.querySelector('.filter-value-input').value;

        if (column && relation && value) {
            currentFilterCriteria.push({
                column: column,
                relation: relation,
                value: value
            });
        }
    });
}

// Function to build the filter query for the API
function buildFilterQuery() {
    if (currentFilterCriteria.length === 0) {
        return '';
    }

    const filters = currentFilterCriteria.map(filter => {
        switch (filter.relation) {
            case 'equals':
                return `${filter.column} eq '${filter.value}'`;
            case 'contains':
                return `contains(${filter.column},'${filter.value}')`;
            case 'starts_with':
                return `startswith(${filter.column},'${filter.value}')`;
            case 'ends_with':
                return `endswith(${filter.column},'${filter.value}')`;
            case 'greater_than':
                return `${filter.column} gt ${filter.value}`;
            case 'less_than':
                return `${filter.column} lt ${filter.value}`;
            default:
                return '';
        }
    }).filter(filter => filter !== '');

    return filters.join(' and ');
}

// Function to build the sort query for the API
function buildSortQuery() {
    if (currentSortCriteria.length === 0) {
        return '';
    }

    return currentSortCriteria.map(sort => {
        return `${sort.column} ${sort.order === 'desc' ? 'desc' : 'asc'}`;
    }).join(',');
}

// Function to load people data with sorting and filtering
async function loadPeople() {
    try {
        // Build OData query parameters
        const filterQuery = buildFilterQuery();
        const sortQuery = buildSortQuery();

        let url = `${apiUrl}?$count=true&$top=${pageSize}&$skip=${(currentPage - 1) * pageSize}`;

        if (filterQuery) {
            url += `&$filter=${filterQuery}`;
        }

        if (sortQuery) {
            url += `&$orderby=${sortQuery}`;
        }

        // Fetch data
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const data = await response.json();

        // Update total records count for pagination
        totalRecords = data['@odata.count'] || data.value.length;

        // Render the people data
        renderTable(data.value);

        // Update pagination info
        updatePaginationInfo();
    } catch (error) {
        console.error('Error loading people:', error);
        showPopup('Error', `Failed to load data: ${error.message}`);
    }
}

// Function to render the table with people data
function renderTable(people) {
    const tbody = document.getElementById('peopleTableBody');
    tbody.innerHTML = ''; // Clear previous data

    if (!people || people.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="6" class="no-data">No data available</td>';
        tbody.appendChild(row);
        return;
    }

    people.forEach(person => {
        const row = document.createElement('tr');
        row.dataset.id = person.UserName; // Store the ID for context menu actions

        row.innerHTML = `
            <td>${person.UserName || '-'}</td>
            <td>${person.FirstName || '-'}</td>
            <td>${person.LastName || '-'}</td>
            <td>${person.MiddleName || '-'}</td>
            <td>${person.Gender || '-'}</td>
            <td>${person.Age || '-'}</td>
        `;

        // Add context menu functionality to each row
        row.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showContextMenu(e, person);
        });

        tbody.appendChild(row);
    });
}

// Function to update pagination info
function updatePaginationInfo() {
    const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
    document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${totalPages}`;

    // Enable/disable pagination buttons
    document.getElementById('prevPage').disabled = currentPage <= 1;
    document.getElementById('nextPage').disabled = currentPage >= totalPages;
}

// Function to show a popup
function showPopup(title, message) {
    const overlay = document.getElementById('popupOverlay');
    const popupTitle = document.getElementById('popupTitle');
    const popupContent = document.getElementById('popupContent');
    const popupActions = document.getElementById('popupActions');

    popupTitle.textContent = title;
    popupContent.innerHTML = message;
    popupActions.style.display = 'none';

    overlay.style.display = 'flex';

    document.getElementById('popupClose').onclick = () => {
        overlay.style.display = 'none';
    };
}

// Function to set up the context menu
function setupContextMenu() {
    const contextMenu = document.getElementById('contextMenu');

    // Hide context menu when clicking elsewhere
    document.addEventListener('click', () => {
        contextMenu.style.display = 'none';
    });

    // Set up context menu items
    document.getElementById('downloadAttachment').addEventListener('click', () => {
        const selectedRow = document.querySelector('tr.selected');
        if (selectedRow) {
            const person = getPersonFromRow(selectedRow);
            downloadAttachment(person);
        }
        contextMenu.style.display = 'none';
    });

    document.getElementById('triggerEmail').addEventListener('click', () => {
        const selectedRow = document.querySelector('tr.selected');
        if (selectedRow) {
            const person = getPersonFromRow(selectedRow);
            triggerEmail(person);
        }
        contextMenu.style.display = 'none';
    });

    document.getElementById('triggerCall').addEventListener('click', () => {
        const selectedRow = document.querySelector('tr.selected');
        if (selectedRow) {
            const person = getPersonFromRow(selectedRow);
            triggerCall(person);
        }
        contextMenu.style.display = 'none';
    });

    document.getElementById('addAsTicket').addEventListener('click', () => {
        const selectedRow = document.querySelector('tr.selected');
        if (selectedRow) {
            const person = getPersonFromRow(selectedRow);
            addAsTicket(person);
        }
        contextMenu.style.display = 'none';
    });

    document.getElementById('deleteTicket').addEventListener('click', () => {
        const selectedRow = document.querySelector('tr.selected');
        if (selectedRow) {
            const person = getPersonFromRow(selectedRow);
            confirmDeleteTicket(person);
        }
        contextMenu.style.display = 'none';
    });
}

// Function to show the context menu
function showContextMenu(e, person) {
    const contextMenu = document.getElementById('contextMenu');

    // Remove selected class from all rows
    document.querySelectorAll('tr.selected').forEach(row => {
        row.classList.remove('selected');
    });

    // Mark the current row as selected
    e.currentTarget.classList.add('selected');

    // Position the context menu
    contextMenu.style.top = `${e.pageY}px`;
    contextMenu.style.left = `${e.pageX}px`;
    contextMenu.style.display = 'block';
}

// Function to get person data from a table row
function getPersonFromRow(row) {
    return {
        UserName: row.cells[0].textContent,
        FirstName: row.cells[1].textContent,
        LastName: row.cells[2].textContent,
        MiddleName: row.cells[3].textContent,
        Gender: row.cells[4].textContent,
        Age: row.cells[5].textContent
    };
}

// Context menu action functions
function downloadAttachment(person) {
    showPopup('Download Attachment', `Downloading attachment for ${person.FirstName} ${person.LastName}...`);
}

function triggerEmail(person) {
    showPopup('Trigger Email', `Sending email to ${person.FirstName} ${person.LastName}...`);
}

function triggerCall(person) {
    showPopup('Trigger Call', `Initiating call to ${person.FirstName} ${person.LastName}...`);
}

function addAsTicket(person) {
    showPopup('Add as Ticket', `Adding ${person.FirstName} ${person.LastName} as a new ticket...`);
}

function confirmDeleteTicket(person) {
    showConfirmPopup(
        'Delete Ticket',
        `Are you sure you want to delete the ticket for ${person.FirstName} ${person.LastName}?`,
        () => deleteTicket(person)
    );
}

function deleteTicket(person) {
    showPopup('Delete Ticket', `Ticket for ${person.FirstName} ${person.LastName} has been deleted.`);
    loadPeople(); // Refresh the table after deletion
}

// Function to show a confirmation popup
function showConfirmPopup(title, message, confirmCallback) {
    const overlay = document.getElementById('popupOverlay');
    const popupTitle = document.getElementById('popupTitle');
    const popupContent = document.getElementById('popupContent');
    const popupActions = document.getElementById('popupActions');

    popupTitle.textContent = title;
    popupContent.innerHTML = message;
    popupActions.style.display = 'flex';

    overlay.style.display = 'flex';

    document.getElementById('popupClose').onclick = () => {
        overlay.style.display = 'none';
    };

    document.getElementById('popupCancel').onclick = () => {
        overlay.style.display = 'none';
    };

    document.getElementById('popupConfirm').onclick = () => {
        overlay.style.display = 'none';
        if (typeof confirmCallback === 'function') {
            confirmCallback();
        }
    };
}