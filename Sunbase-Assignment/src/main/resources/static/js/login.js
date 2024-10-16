//base url 
const baseApiUrl = 'http://localhost:8080/api/auth';

//toggle between login and signup form
function toggleForm() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    loginForm.classList.toggle('hidden');
    signupForm.classList.toggle('hidden');
}

//handle signup form submission
document.getElementById('signup').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevents the default form submission

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const street = document.getElementById('street').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('signupEmail').value;

    const password = document.getElementById('signupPassword').value;

    try {
        // Sends signup data to the server
        const response = await fetch(`${baseApiUrl}/registerCustomer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({firstName, lastName, email, password, street, address, city, state, phone})
        });

        const result = await response.json(); // Parses JSON response

        if (result.status === 201) {
            alert(result.message); // display success message
            window.location.href = "/login-signup"; // Redirects to login/signup page
        } else {
            alert(result.message); // display error message
        }
    } catch (error) {
        alert('An error occurred during signup.'); // display error alert
        console.error(error); // Logs the error
    }
});

//handle login form submission
document.getElementById('login').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        //Sends login credentials to the server
        const response = await fetch(`${baseApiUrl}/loginCustomer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        });

        const result = await response.json();
        if (response.status === 200) {
            // If login is successful, save JWT token and redirect
            console.log("Login");
            localStorage.setItem('jwtToken', result.jwtToken);
            location.href = '/index'; // Redirects to home page
            console.log("Redirect to index");
        } else {
            console.log(result);
            alert(result.message); // display error message
        }
    } catch (error) {
        alert('An error occurred during login...'); // display error alert
        console.error(error); // Logs the error
    }
});

