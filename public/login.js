let form = document.getElementById("form");
const alertContainer = document.getElementById("alertContainer");
async function login(event) {
  event.preventDefault();

  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  try {
    const response = await axios.post("http://localhost:3000/users/login", {
      email,
      password,
    });
    localStorage.setItem("token", response.data.token);
    localStorage.setItem('username',response.data.username)
    if (response.status == 201) {
      showAlert("Successfully logged in",2000);
     
      // window.location.href = "./chats-frontend.html";
      window.location.href = "./messages.html";
    }
  } catch (error) {
    console.log(error)
    showAlert(error.response.data.message, 4000);
  }
}
function showAlert(message, duration) {
  alertContainer.innerHTML = message;
  alertContainer.style.display = "block";
  setTimeout(() => {
    alertContainer.style.display = "none";
  }, duration);
}
