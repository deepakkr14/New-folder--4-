const submitbtn = document.querySelector("#submitbtn");
const alertContainer = document.getElementById("alertContainer");
// const alertElement = document.getElementById("autoCloseAlert");

async function singup(event) {
  event.preventDefault();

  const name = document.querySelector("#name").value;
  const phone = document.querySelector("#phone").value;
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  try {
    const response = await axios.post("http://localhost:3000/users/singup", {
      name,
      email,
      password,
      phone,
    });

    if (response.data.length > 0) {
      showAlert("Email already exists", 3000);
    } else {
      showAlert("succesfull sing up", 3000);
      window.location.href = "./login.html";
      co;
    }
  } catch (error) {
    console.log(error);
  }
}

function showAlert(message, duration) {
  // alertElement.innerHTML = message;
  alertContainer.innerHTML = message;
  alertContainer.style.display = "block";
  // alertContainer.style.display = "block";
  setTimeout(() => {
    alertContainer.style.display = "none";
  }, duration);
}
