const baseApiUrl = 'http://localhost:8080/api/customers';   //base url for customer api
const jwtToken = localStorage.getItem('jwtToken');  //jwt toke for authorization
let currentPage = 0;
let pageSize = 10;
let globalCustomers;    //store the all customers for filtering and pagination

//DOM elemts
let customerForm = document.getElementById('customerForm');
let addCustomerBtn = document.getElementById('addCustomerBtn');
let formTitle = document.getElementById('formTitle');
let addCustomerForm = document.getElementById('addCustomer');
let searchBySelect = document.getElementById('searchBy');
let searchBar = document.getElementById('searchBar');
let searchBtn = document.getElementById('searchBtn');
let customerTable = document.getElementById('customerTable');
let paginationControls = document.getElementById('paginationControls');
let pageInfo = document.getElementById('pageInfo');

//Initialization of page
initializationOfPage();

function initializationOfPage() {
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    searchBySelect.addEventListener('change', toggleSearch);
    addCustomerBtn.addEventListener('click', toggleCustomerForm);
    addCustomerForm.addEventListener('submit', handleFormSubmit);
    document.getElementById('syncBtn').addEventListener('click', syncCustomers);

    //Fetch customers information and users
    fetchUserName().then();
    fetchAndDisplayCustomers().then();
}

function handleLogout() {
    if (confirm("Are you sure, you want to log out?")) {
        logout();
    }
}

function logout() {
    localStorage.removeItem('jwtToken');
    window.location.href = '/login-signup';
}

function isTokenExpired(token) {
    if (!token) {
        return true;
    }

    try {
        // Decode token payload (Base64 URL decoding)
        const payload = JSON.parse(atob(token.split('.')[1]));
        // Get the current time in seconds
        const now = Math.floor(Date.now() / 1000);
        // Add a grace period of 60 seconds to prevent premature expiration due to clock drift
        const gracePeriod = 60;
        // Check if the token has expired or if it's not yet valid
        if (payload.exp < now - gracePeriod) {
            return true;
        }
        return false;
    } catch (error) {
        // If there's an error decoding the token, assume it's invalid/expired
        console.error("Error decoding token:", error);
        return true;
    }
}


// Redirect to log in if token is expired
if (!jwtToken || isTokenExpired(jwtToken)) {
    alert('Session expired. Please log in again...');
    logout();
}

//fetch the current user name and upadate the UI
async function fetchUserName() {
    try {
        const response = await fetch(`${baseApiUrl}/getCurrentLoggedInCustomer`, {
            method: 'GET', headers: {'Authorization': `Bearer ${jwtToken}`}
        });

        const result = await response.json();
        if (response.status === 200) {
            document.getElementById('userName').textContent = `Welcome, ${result.data.firstName} ${result.data.lastName}`;
        } else {
            alert(result.message);
        }

    } catch (error) {
        alert('An error occurred while fetching the user information.');
        console.error(error);
    }
}

//customer form
function toggleCustomerForm() {
    customerForm.classList.toggle('hidden');
    if (customerForm.classList.contains('hidden')) {
        addCustomerBtn.textContent = 'Add Customer';
        addCustomerBtn.classList.remove('Cancel');
        resetForm();
    } else {
        addCustomerBtn.textContent = 'Cancel';
        addCustomerBtn.classList.add('Cancel');
    }
}

//display or hide the search bar based on selected search criteria
function toggleSearch() {
    if (this.value === "") {
        searchBar.classList.add('hidden');
        searchBtn.classList.add('hidden');
    } else {
        searchBar.classList.remove('hidden');
        searchBtn.classList.remove('hidden');
    }
}


//for the adding customer or updating customer
async function handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(addCustomerForm);
    const uuid = document.getElementById('uuid').value;
    const isEdit = !!uuid; // Check if editing an existing customer

    const customer = {
        uuid: isEdit ? uuid : undefined,
        email: formData.get('email'),
        password: formData.get('password') || '',  // Include password if needed
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        phone: formData.get('phone'),
        street: formData.get('street'),
        address: formData.get('address'),
        city: formData.get('city'),
        state: formData.get('state')
    };

    try {
        const response = await fetch(`${baseApiUrl}/${isEdit ? 'updateCustomer' : 'saveCustomer'}`, {
            method: isEdit ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`,
                'Accept': 'application/json'
            },
            body: JSON.stringify(customer)
        });

        if (response.ok) {
            await response.json();
            alert(`Customer ${isEdit ? 'updated' : 'added'} successfully!`);
            customerForm.classList.add('hidden');
            addCustomerBtn.textContent = 'Add Customer';
            addCustomerBtn.classList.remove('cancel');
            resetForm();
            await fetchAndDisplayCustomers(); // Refresh customer list after adding/updating
        } else {
            const errorResult = await response.json();
            alert(errorResult.message);
        }
    } catch (error) {
        alert('An error occurred while saving the customer...');
        console.error(error);
    }
}

//Add event listener for search button
searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    searchCustomers().then();
});

//search the customers based on selected criteria and query
async function searchCustomers() {
    const searchBy = searchBySelect.value;
    const query = searchBar.value.toLowerCase();

    try {
        if (query) {
            // Filter customers based on the search query
            let filteredCustomers = globalCustomers.filter(customer => {
                const value = (customer[searchBy] || '').toString().toLowerCase();
                return value.includes(query);
            });

            displayCustomers(filteredCustomers);
        }
        // Reset pagination controls
        document.getElementById('paginationControls').innerHTML = '';
    } catch (error) {
        alert('An error occurred while searching customers...');
        console.error(error);
    }
}

//display customers, handle pagination
async function fetchAndDisplayCustomers() {
    let localCustomers = [];

    try {
        //fetch local customers
        try {
            const localResponse = await fetch(`${baseApiUrl}/getAllCustomers`, {
                method: 'GET',
                headers: {'Authorization': `Bearer ${jwtToken}`}
            });
            localCustomers = await localResponse.json();
        } catch (localError) {
            console.error('Failed to fetch local customers:', localError);
        }

        globalCustomers = localCustomers.data;

        // Handle pagination
        const paginatedCustomers = paginationForCustomers(localCustomers.data, currentPage, pageSize);
        displayCustomers(paginatedCustomers);

        // Update pagination controls
        updatePaginationControls(localCustomers.data.length);

        return localCustomers.data;

    } catch (error) {
        alert('An error occurred while fetching customers.');
        console.error(error);
    }
}

//pagination 
function paginationForCustomers(customers, pageNo, pageSize) {
    const start = pageNo * pageSize;
    const end = start + pageSize;
    return customers.slice(start, end);
}

//display list of customers in the table
function displayCustomers(customers) {
    customerTable.innerHTML = '';

    if (customers.length === 1) {
        customerTable.appendChild(createCustomerRow(customers[0]));
        customerTable.appendChild(createSyncMessageRow());
        return; // Exit the function early since there's nothing more to display
    }

    customers.forEach(customer => {
        customerTable.appendChild(createCustomerRow(customer));
    });
}

//create customers
function createCustomerRow(customer) {
    const row = document.createElement('tr');
    row.innerHTML = `
    <td>${customer.firstName || customer.first_name}</td>
    <td>${customer.lastName || customer.last_name}</td>
    <td>${customer.email}</td>
    <td>${customer.phone}</td>
    <td>${customer.street || ''}</td>
    <td>${customer.address || ''}</td>
    <td>${customer.city || ''}</td>
    <td>${customer.state || ''}</td>
    <td>
        <button class="action-btn edit-btn" onclick="editCustomer('${customer.uuid}')">Edit</button>
        <button class="action-btn delete-btn" onclick="deleteCustomer('${customer.uuid}')">Delete</button>
    </td>`;
    return row;
}

//edit or update the customer
window.editCustomer = function (uuid) {
    fetch(`${baseApiUrl}/getCustomerByUuid?uuid=${uuid}`, {
        method: 'GET',
        headers: {'Authorization': `Bearer ${jwtToken}`}
    })
    .then(response => response.json())
    .then(result => {
        if (result.status === 200) {
            const customer = result.data;

            document.getElementById('uuid').value = customer.uuid;
            document.getElementById('firstName').value = customer.firstName || '';
            document.getElementById('lastName').value = customer.lastName || '';
            document.getElementById('email').value = customer.email || '';
            document.getElementById('phone').value = customer.phone || '';
            document.getElementById('street').value = customer.street || '';
            document.getElementById('address').value = customer.address || '';
            document.getElementById('city').value = customer.city || '';
            document.getElementById('state').value = customer.state || '';
            
            formTitle.textContent = 'Edit Customer';
            customerForm.classList.remove('hidden');
            addCustomerBtn.textContent = 'Cancel';
            addCustomerBtn.classList.add('cancel');
        } else {
            alert(result.message);
        }
    })

    .catch(error => {
        alert('An error occurred while fetching customer details...');
        console.error(error);
    });
};

//delete customer
window.deleteCustomer = async function (uuid) {
    if (!confirm("Are you sure you want to delete this customer?")) return;

    try {
        const response = await fetch(`${baseApiUrl}/deleteCustomerByUuid?uuid=${uuid}`, {
            method: 'DELETE', headers: {
                'Authorization': `Bearer ${jwtToken}`, 'Accept': 'application/json'
            }
        });

        const result = await response.json();
        if (result.status === 400) {
            alert(result.message);
            return;
        }

        if (response.ok) {
            await fetchAndDisplayCustomers(); // Refresh customer list after deletion
        } else {
            const result = await response.json();
        }
    } catch (error) {
        alert('An error occurred while deleting the customer...');
        console.error(error);
    }
};


//reset form in its default state
function resetForm() {
    document.getElementById('uuid').value = '';
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('street').value = '';
    document.getElementById('address').value = '';
    document.getElementById('city').value = '';
    document.getElementById('state').value = '';
    formTitle.textContent = 'Add Customer';
}

//for sync data
function createSyncMessageRow() {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 9; // Adjust this according to the number of columns in your table
    cell.textContent = 'Use Sync Button For Fetch Data from Sunbase Database';
    cell.style.textAlign = 'center';
    cell.style.fontSize = '15px';
    cell.style.fontWeight = '900';
    row.appendChild(cell);
    return row;
}

//syncs customers using the sunbase remote API and refresh the page
async function syncCustomers(e) {
    e.preventDefault();

    try {
        const response = await fetch(`${baseApiUrl}/syncCustomerFromSunbaseDatabase`, {
            method: 'GET', headers: {'Authorization': `Bearer ${jwtToken}`}
        });

        const result = await response.json();
        if (result.status === 201) {
            alert(result.message);
        } else {
            alert(result.message);
        }
        location.reload(); // Reload the page to reflect changes
    } catch (error) {
        alert('An error occurred while syncing customers.');
        console.error(error);
    }
}

function previousPage() {
    if (currentPage > 0) {
        currentPage--;
        fetchAndDisplayCustomers().then();
    }
}

function nextPage() {
    currentPage++;
    fetchAndDisplayCustomers().then();
}

//pagination controles based on total number of customers
function updatePaginationControls(totalCustomers) {
    pageInfo.textContent = `Page ${currentPage + 1}`;
    paginationControls.querySelector('button:first-child').disabled = currentPage === 0;
    paginationControls.querySelector('button:last-child').disabled = (currentPage + 1) * pageSize >= totalCustomers;
}




