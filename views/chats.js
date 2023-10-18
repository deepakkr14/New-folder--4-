let token = localStorage.getItem("token");
const messageContainer = document.getElementById("messageContainer");
const grouplist =document.getElementById("grouplist");
async function clearChat() {
  try {
    const chat = await axios.get("http://localhost:3001/users/clear", {
      headers: { Authorization: token },
    });

    if (chat) {
      getMessage();
      window.location.reload();
      alert("messages deleted");
      localStorage.removeItem("messages");
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

    const messageDiv = document.createElement("div");
    messageDiv.className = "message outgoing-message";
    messageDiv.textContent = message;
    messageContainer.appendChild(messageDiv);
    messageInput.value = "";
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }
}

document.addEventListener("DOMContentLoaded", getMessage());

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});

async function getMessage() {
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
    if (lsMessages.length!==0) {
      Lastmsgid = lsMessages[lsMessages.length - 1].id;
    }
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
  } catch {
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
    const messageDiv = document.createElement("div");
    messageDiv.className = "message outgoing-message";
    messageDiv.textContent = msg.messages;
    messageContainer.appendChild(messageDiv);
    messageInput.value = "";
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }
}
function showGroups(res){
  console.log(res)
  for (const msg of res) {
  const li = document.createElement('li');
  li.innerText = msg.id;
  // const addMemberBtn = document.createElement('button');
  // addMemberBtn.innerText = 'Add';
  // li.appendChild(addMemberBtn);
  grouplist.appendChild(li);}
}
const createGroupForm = document.getElementById('groupNameForm');
const createGroupBtn = document.getElementById('Createbtn');
const groupName = document.getElementById('groupName');
// 7806844946
createGroupForm.addEventListener('submit', async (e) => {
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
});
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