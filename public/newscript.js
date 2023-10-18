let token = localStorage.getItem("token");
const messageContainer = document.getElementById("messageContainer");
const grouplist =document.getElementById("grouplist");

const iconElement = document.querySelector('#plane');


// Add an event listener for the click event
iconElement.addEventListener('click',sendMessage);
async function clearChat() {
  try {
    const chat = await axios.get("http://localhost:3001/users/clear", {
      headers: { Authorization: token },
    });
    if (chat) {
      localStorage.removeItem("messages");
      getMessage();
      window.location.reload();
      alert("messages deleted");
    }
  } catch (err) {
    console.log("error while deleting", err);
  }
}

async function sendMessage(event) {
  const messageInput = document.getElementById("messageInput");
  const message = messageInput.value.trim();

  if (message !== "") {
    const message = document.getElementById("messageInput").value;
    const data = {
      message: message,
    };
    const chat = await axios.post("http://localhost:3001/users/message", data, {
      headers: { Authorization: token },
    });
    if (chat.status == 200) {
    }

    // ANOTHER ONE
// Create the main container for messages
const container2 = document.createElement('div');
container2.classList.add('d-flex', 'flex-row', 'justify-content-end');
container2.style.paddingLeft = '90px';

// Create the inner container for message and timestamp
const innerContainer = document.createElement('div');

// Create the message element
const mesage = document.createElement('p');
mesage.classList.add('medium', 'p-2', 'me-3', 'mb-1', 'ml-2');
mesage.style.backgroundColor = '#5fda8c';
mesage.style.borderRadius = '10px';
mesage.textContent = message;

// Create the timestamp element
const timestmp = document.createElement('p');
timestmp.classList.add('small', 'me-3', 'mb-3', 'text-muted');
timestmp.textContent = '12:00 PM | Aug 13';

// Append the message and timestamp to the inner container
innerContainer.appendChild(mesage);
innerContainer.appendChild(timestmp);

// Append the inner container to the main container
container2.appendChild(innerContainer);

// Append the main container to a parent element (assuming you have a parent element with id 'parentElement')
const parentElemen = document.getElementById('messagediv');
parentElemen.appendChild(container2);


    // const messageDiv = document.createElement("div");
    // messageDiv.className = "message outgoing-message";
    // messageDiv.textContent = message;
    // messageContainer.appendChild(messageDiv);
    messageInput.value = "";
    // messageContainer.scrollTop = messageContainer.scrollHeight;
    parentElemen.scrollTop = parentElemen.scrollHeight;

  }
}


const messageContaine = document.getElementById('messagediv');

// Function to scroll to the bottom of the messages container
function scrollToBottom() {
  messageContaine.scrollTop = messageContainer.scrollHeight;
}



document.addEventListener("DOMContentLoaded", getMessage());

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});

async function getMessage() {
  console.log('i am here')
  // const loadButton = document.createElement("button");
  // loadButton.textContent = "Load Older Messages";
  // loadButton.className = "btn-sm btn-primary";
  // loadButton.addEventListener("click", loadOlderMessages);

  // messageContainer.prepend(loadButton);

  // function loadOlderMessages() {
  //   alert("Loading older messages...");
  // }

  try {
    const limit = 10;
    const lsMessages = JSON.parse(localStorage.getItem("messages"));
    let Lastmsgid = 0;
    if(lsMessages==null){
      localStorage.setItem("messages",'[]');}
    if (lsMessages.length!==0) {
      Lastmsgid = lsMessages[lsMessages.length - 1].id;
    }
    console.log("lsMessages")
    console.log(lsMessages)
    const responseChat = await axios.get(
      `http://localhost:3001/users/viewmessage?lastid=${Lastmsgid}`,
      {
        headers: { Authorization: token },
      }
      );
      console.log(responseChat)
    if (lsMessages) {
      allmsg = [...lsMessages, ...responseChat.data.msg];
    } else {
      allmsg = [...responseChat.data.msg];
    }
    if (limit < allmsg.length) {
      allmsg = allmsg.splice(allmsg.length - limit);
    }
    addMessageToLs(allmsg);
    showmessageLS();
    showGroups(responseChat.data.groups)
  }catch {
    (err) => {
      console.log("error");
      alert(err);
    };
  }
}

function addMessageToLs(data) {
  localStorage.setItem("messages", JSON.stringify(data));
}

function showmessageLS() {
  let lsMessages = JSON.parse(localStorage.getItem("messages"));
  for (const msg of lsMessages) {

// ANOTHER ONE
// Create the main container for messages
const container2 = document.createElement('div');
container2.classList.add('d-flex', 'flex-row', 'justify-content-end');
container2.style.paddingLeft = '90px';

// Create the inner container for message and timestamp
const innerContainer = document.createElement('div');

// Create the message element
const mesage = document.createElement('p');
mesage.classList.add('medium', 'p-2', 'me-3', 'mb-1', 'ml-2');
mesage.style.backgroundColor = '#5fda8c';
mesage.style.borderRadius = '10px';
mesage.textContent =msg.messages;

// Create the timestamp element
const timestmp = document.createElement('p');
timestmp.classList.add('small', 'me-3', 'mb-3', 'text-muted');
timestmp.textContent = '12:00 PM | Aug 13';

// Append the message and timestamp to the inner container
innerContainer.appendChild(mesage);
innerContainer.appendChild(timestmp);

// Append the inner container to the main container
container2.appendChild(innerContainer);

// Append the main container to a parent element (assuming you have a parent element with id 'parentElement')
const parentElemen = document.getElementById('messagediv');
parentElemen.appendChild(container2);
    // const messageDiv = document.createElement("div");
    // messageDiv.className = "message outgoing-message";
    // messageDiv.textContent = msg.messages;
    // messageContainer.appendChild(messageDiv);
    messageInput.value = "";
    parentElemen.scrollTop = parentElemen.scrollHeight;

    // messageContainer.scrollTop = messageContainer.scrollHeight;
  }
}
function showGroups(res){
  console.log(res)
  for (const msg of res) {

// Create the main container for groups
const groupContainer = document.querySelector("#groupdiv");
const container = document.createElement('div');
container.classList.add('p-1', 'd-flex', 'justify-content-between', 'border-bottom', 'hover');

// Create the left part with user details
const leftPart = document.createElement('div');
leftPart.classList.add('d-flex', 'flex-row');

const avatarDiv = document.createElement('div');
const avatarImg = document.createElement('img');
avatarImg.src = 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp';
avatarImg.alt = 'avatar';
avatarImg.classList.add('d-flex', 'align-self-center', 'me-3');
avatarImg.width = '60';
avatarDiv.appendChild(avatarImg);

const userDetailsDiv = document.createElement('div');
const username = document.createElement('p');
username.classList.add('fw-bold', 'mb-0');
username.textContent = msg.groupName;
const message = document.createElement('p');
message.classList.add('small', 'text-muted');
message.textContent = 'Hello, how are you?';
userDetailsDiv.appendChild(username);
userDetailsDiv.appendChild(message);

leftPart.appendChild(avatarDiv);
leftPart.appendChild(userDetailsDiv);

// Create the right part with timestamp
const rightPart = document.createElement('div');
const timestamp = document.createElement('p');
timestamp.classList.add('small', 'text-muted', 'mb-1');
timestamp.textContent = 'Just now';
rightPart.appendChild(timestamp);

// Add left and right parts to the main container
container.appendChild(leftPart);
container.appendChild(rightPart);

// Append the container to a parent element (assuming you have a parent element with id 'parentElement')
// const parentElement = document.getElementById('parentElement');
groupContainer.appendChild(container);





//   const li = document.createElement('li');
//   li.innerText = msg.id;
//   // const addMemberBtn = document.createElement('button');
//   // addMemberBtn.innerText = 'Add';
//   // li.appendChild(addMemberBtn);
//   grouplist.appendChild(li);
}
}
// const createGroupForm = document.getElementById('groupNameForm');
const createGroupBtn = document.getElementById('Createbtn');
const groupName = document.getElementById('groupName');
// 7806844946
async function createGroup(e)
// createGroupForm.addEventListener('submit', async (e) =>
{
  e.preventDefault();
  const token = localStorage.getItem('token');
  try {
      const obj = {
          groupName: groupName.value
      };
      const res = await axios.post('http://localhost:3001/creategroup', obj, { headers: { 'Authorization': token } });
      console.log(res);
      alert(`created with group id ${res.data.groupId}`)
      res.data.users.forEach(result => {
          displayUsers(result,res.data.groupId);
          console.log(result,res.data.groupId)
      });
  } catch (err) {
      console.log(err);
      alert(err.response.data.message);
  }
};
function displayUsers(res,groupId) {

  const userList = document.getElementById('user-list');
  const li = document.createElement('li');
  li.innerText = res.name;
  const addMemberBtn = document.createElement('button');
  addMemberBtn.innerText = 'Add';
  li.appendChild(addMemberBtn);
  userList.appendChild(li);
  addMemberBtn.addEventListener('click', async (e) => {
      const obj={
          userId:res.id,
          groupId: groupId
      }
      try{
         await axios.post('http://localhost:3001/add-member',obj, { headers: { 'Authorization': token } })
         alert("Successfully added")
      }catch(err){
          console.log(err);
      }
  });
}