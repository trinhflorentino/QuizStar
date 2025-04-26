// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();


var provider = new firebase.auth.GoogleAuthProvider();
firebase.auth().languageCode = 'vi';


// Get the form element
const loginForm = document.querySelector('#form');

// Add a submit event listener to the form
loginForm.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the default form submission

    // Get user inputs
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;


    // Firebase authentication: Sign in the user with email and password
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Successfully signed in
            const user = userCredential.user;
            // console.log('Login successful:', user);

            setTimeout(
                function () {
                    location.href = '/';
                }, 2000
            );

            // successToast("Đăng nhập thành công", 3000, "bottom", "right", false, "radial-gradient(circle at 74.2% 50.9%, rgb(14, 72, 222) 5.2%, rgb(3, 22, 65) 75.3%)", "");
        })
        .catch((error) => {
            // Handle login errors
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Error:', errorCode, errorMessage);

            failToast(`Đăng nhập thất bại: ${errorMessage}`, 3000, "bottom", "right", false, "linear-gradient(to right, #ff5f6d, #ffc371)", "");
        });
});

function signInWithGoogle() {
    firebase.auth()
        .signInWithPopup(provider)
        .then((result) => {
            // This gives you a Google Access Token, which can be used to access the Google API
            const credential = result.credential;
            const token = credential.accessToken;
            const user = result.user;

            console.log('Google Sign-In successful:', user);

            // Redirect or show success message
            setTimeout(
                function () {
                    location.href = '/';
                }, 2000
            );

            successToast("Đăng nhập bằng Google thành công", 3000, "bottom", "right", false, "radial-gradient(circle at 74.2% 50.9%, rgb(14, 72, 222) 5.2%, rgb(3, 22, 65) 75.3%)", "");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.email;
            const credential = error.credential;

            console.error('Error during Google Sign-In:', errorCode, errorMessage, email);
            failToast(`Đăng nhập bằng Google thất bại: ${errorMessage}`, 3000, "bottom", "right", false, "linear-gradient(to right, #ff5f6d, #ffc371)", "");
        });
}


