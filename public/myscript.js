// const { request } = require("express");

const socket = io("http://localhost:3000");
// Group members
const groupMembersContainer = document.getElementById("groupMembersContainer");
const groupMembersTableBody = document.getElementById("groupMembersTableBody");
const showGroupMembersBtn = document.getElementById("showGroupMembersBtn");
const closeGroupMembersBtn = document.getElementById("closeGroupMembersBtn");
const token = localStorage.getItem("token");
document.addEventListener("DOMContentLoaded", () => {
  sendroom(localStorage.getItem("username"));
  viewRooms();
});
async function viewRooms() {
  try {
    let response = await axios.get("http://localhost:3000/groups", {
      headers: {
        Authorization: token,
      },
    });
    console.log(response);
    if (response.data.data.length == 0) {
      alert("currently you are in no groups");
    }
    // return document.getElementById('no-group').style='display';}
    else {
      for (let i of response.data.data) {
        appendGroups(i.name, i.id);
        // document.getElementById('no-group').style.display="none";
      }
    }
  } catch (err) {
    console.trace(err);
    if (err.response.data.error.name == "TokenExpiredError") {
      alert("your session has expired please login again");
      window.location = "/login.html";
    }
  }
}
// SETTING HEADER OF USERNAEME
document.getElementById("username").innerText =
  localStorage.getItem("username");
// function grouppp() {
//   alert(" i am a group");
// }
// })
async function sendMessage() {
  console.log("i am calling");

  const message = document.getElementById("messageInput").value;
  console.log(message);
  if (message == "") {
    alert("please enter the message");
    return;
  }
  let res = await axios.post(
    `http://localhost:3000/chat`,
    { text: message, group: localStorage.getItem("groupId") },
    { headers: { Authorization: token } }
  );
  // APPENDING SEND MESSAGE
  socket.emit("private message", {
    message: message,
    name: document.getElementById("username").innerText,
    room: document.getElementById("displayhead").innerText,
  });
  sentMessages(message);
  document.getElementById("messageInput").value = "";
}
socket.on("chat message", (msg) => {
  // APPENDING RECIEVED (MESSAGE
  recievedMsg(msg.message, msg.name);
});
function sendroom(roomName) {
  socket.emit("join room", roomName);
  console.log(`Joined room ${roomName}`);
}
function leave() {
  socket.emit("leave room", "room");
  console.log(`leaving room {r$oom}`);
}

async function invite() {
  const username = prompt(
    "enter your friend's name to be invited in this chat"
  );
  let sender = localStorage.getItem("username");
  let group = document.getElementById("displayhead").textContent;
  if (!username) {
    return;
  }
  try {
    socket.emit("invite", { username, sender, group });
    // console.log("i am callllllllll");
  } catch {
    (Err) => {
      console.log(err);
    };
  }
}
socket.on("request", async (response) => {
  const status = confirm(
    `request from ${response.email.sender} to join ${response.email.group}`
  );
  if (status == true) {
    console.log(status);
    try {
      const join = await axios.post(
        "http://localhost:3000/acceptrequest",
        { group: response.email.group },
        {
          headers: { Authorization: token },
        }
      );

      console.log(join);
      console.log("accepted");
    } catch {
      (error) => {
        console.log(error);
      };
    }
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});
//----------------------------------------------------------------------------//
async function submitGroup() {
  let roomName = document.getElementById("groupName").value;

  let room = await axios.post(
    "http://localhost:3000/createRoom",
    { roomName: roomName },
    {
      headers: { Authorization: token },
    }
  );
  if (room.data.success == true) {
    appendGroups(room.data.name, room.data.id);
  } else {
    alert(`${room.data.msg}`);
  }
  document.getElementById("submitButton").click();
}

function sentMessages(msg) {
  const container2 = document.createElement("div");
  container2.classList.add("d-flex", "flex-row", "justify-content-end");
  container2.style.paddingLeft = "90px";
  const innerContainer = document.createElement("div");
  const mesage = document.createElement("p");
  mesage.classList.add("medium", "p-2", "me-3", "mb-1", "ml-2");
  mesage.style.backgroundColor = "#5fda8c";
  mesage.style.borderRadius = "10px";
  mesage.textContent = msg;
  const timestmp = document.createElement("p");
  timestmp.classList.add("small", "me-3", "mb-3", "text-muted");
  timestmp.textContent = `${new Date().toLocaleTimeString()}`;
  innerContainer.appendChild(mesage);
  innerContainer.appendChild(timestmp);
  container2.appendChild(innerContainer);
  const parentElemen = document.getElementById("messagediv");
  parentElemen.appendChild(container2);
  parentElemen.scrollTop = parentElemen.scrollHeight;
}

function recievedMsg(msg, name) {
  const container2 = document.createElement("div");
  container2.classList.add("d-flex", "flex-row", "justify-content-start");
  container2.style.paddingRight = "90px";
  const innerContainer = document.createElement("div");
  const mesage = document.createElement("p");
  mesage.classList.add("medium", "p-2", "ms-3", "mb-1");
  mesage.style.backgroundColor = "#b7b4c3";
  mesage.style.borderRadius = "10px";
  mesage.innerHTML = `<i>${name}</i> : ${msg}`;
  const timestmp = document.createElement("p");
  timestmp.classList.add("small", "ms-3", "mb-3", "text-muted", "float-end");
  timestmp.textContent = `${new Date().toLocaleTimeString()}`;
  innerContainer.appendChild(mesage);
  innerContainer.appendChild(timestmp);
  container2.appendChild(innerContainer);
  const parentElemen = document.getElementById("messagediv");
  parentElemen.appendChild(container2);
  parentElemen.scrollTop = parentElemen.scrollHeight;
}

function appendGroups(gname, id) {
  const outerDiv = document.createElement("div");
  outerDiv.classList.add(
    "p-1",
    "d-flex",
    "justify-content-between",
    "border-bottom"
  );
  outerDiv.dataset.groupName = gname;
  const innerDiv = document.createElement("div");
  innerDiv.classList.add("d-flex", "flex-row");
  const iconElement = document.createElement("i");
  iconElement.classList.add(
    "fa-solid",
    "fa-user-group",
    "fa-2xl",
    "mt-2",
    "ms-2",
    "me-2"
  );
  const nameElement = document.createElement("p");
  nameElement.classList.add("fw-bold", "mt-2");
  nameElement.textContent = gname;
  outerDiv.appendChild(innerDiv);
  innerDiv.appendChild(iconElement);
  innerDiv.appendChild(nameElement);
  const container = document.getElementById("groupdiv");
  container.appendChild(outerDiv);

  outerDiv.addEventListener("click", () => {
    document.getElementById("messagediv").innerHTML = "";
    document.getElementById("displayhead").innerText = gname;
    localStorage.setItem("groupId", id);
    groupData(id);
    sendroom(gname);
    // getGroupMembers(id)
  });
}
// Function to send a request to a group
async function groupData(gname) {
  const group = await axios.get(`http://localhost:3000/group?name=${gname}`, {
    headers: { Authorization: token },
  });
  console.log(group);
  // alert(`user connected to room ${gname}`);
  if (group.data.chats.length == 0) {
    document.getElementById("messagediv").innerHTML = "<h1>NO CHATS!</h1>";
  }

  for (let i of group.data.chats) {
    if (i.user.name == localStorage.getItem("username")) {
      sentMessages(i.message);
    } else {
      recievedMsg(i.message, i.user.name);
    }
  }
  console.log("request sent yo ", gname);
}
///
document
  .getElementById("getGroupMembers")
  .addEventListener("click", async () => {
    let id = localStorage.getItem("groupId");
    // let isAdmin=group.data.chats[0].group.admin==document.getElementById("username").innerText?true:false;
    try {
      const res = await axios.get(
        `http://localhost:3000/group/members?groupId=${id}`,
        { headers: { Authorization: token } }
      );

      console.log(res);
      const members = res.data.members;
      const admins = res.data.admin;
      console.log(" i a  amf herer");

      groupMembersContainer.style.display = "block";
      groupMembersTableBody.innerText = "";

      // const currentUserAdminCheck = admins.filter((admin) => admin.user.email === USER_EMAIL);
      const currentUserAdmin =
        res.data.admin.admin == localStorage.getItem("username") ? true : false;
      console.log(currentUserAdmin);
      members.forEach((members) =>
        addGroupMemberInDOM(members, admins, currentUserAdmin)
      );
    } catch {
      (err) => {
        let msg = "Could not fetch group members :(";
        if (err.response && err.response.data && err.response.data.msg) {
          msg = err.response.data.msg;
          console.log(msg);
        }
      };
    }
  });
// function getGroupMembers(){

function addGroupMemberInDOM(member, admins, currentUserAdmin) {
  const UserAdmin = member.name == admins.admin ? true : false;

  const tr = document.createElement("tr");
  // if (member.username === USERNAME) {
  tr.classList.add("table-info");
  // }

  tr.innerHTML = `
      <td>${member.name}</td>
      <td>${member.email}</td>
      <td style="color: ${UserAdmin ? "green" : "black"};">
          ${UserAdmin ? "Admin" : "Member"}
      </td>
      <td>
          <button class='btn btn-sm btn-outline-success'>
              Admin
          </button>
          <button class='btn btn-sm btn-outline-danger'>
              Remove
          </button>
      </td>
  `;

  groupMembersTableBody.appendChild(tr);

  if (UserAdmin) {
    tr.children[3].innerText = "None";
    return;
  }

  const promoteToAdminBtn = tr.children[3].children[0];
  promoteToAdminBtn.addEventListener("click", (e) => {
    console.log("i am 3,0");
    const tr = e.target.parentElement.parentElement;
    const memberName = tr.children[0].innerText;
    const memberEmail = tr.children[1].innerText;
    if (confirm(`Promote "${memberName}" to Admin ?`)) {
      promoteMemberToAdmin(memberEmail);
    }
  });

  const removeMemberBtn = tr.children[3].children[1];
  removeMemberBtn.addEventListener("click", (e) => {
    console.log("i am 3,1");
    const tr = e.target.parentElement.parentElement;
    const memberName = tr.children[0].innerText;
    const memberEmail = tr.children[1].innerText;
    if (confirm(`Remove "${memberName}" from group ?`)) {
      removeGroupMember(memberEmail, tr);
    }
  });

  //group members
  function promoteMemberToAdmin(memberEmail) {
    const memberObj = {
      memberEmail,
    };
    let id = localStorage.getItem("groupId");
    axios
      .post(
        `http://localhost:3000/group/admin/promoteGroupMemberToAdmin?groupId=${id}`,
        memberObj,
        { headers: { Authorization: token } }
      )
      .then((res) => {
        const msg = res.data.msg;
        alert(msg);
      })
      .catch((err) => {
        console.log(err);
        let msg = "Could not promote group member to Admin :(";
        alert(err.response.data.msg);
      });
  }

  async function removeGroupMember(memberEmail, tr) {
    let id = localStorage.getItem("groupId");
    try {
      let res = await axios.get(
        `http://localhost:3000/group/admin/removeGroupMember?groupId=${id}&email=${memberEmail}`,
        { headers: { Authorization: token } }
      );

      const msg = res.data.msg;
      // showSuccessInDOM(msg, 5000);
      alert(msg);
      groupMembersTableBody.removeChild(tr);
    } catch {
      (err) => {
        let msg = "Could not delete group member :(";
        // if(err.response && err.response.data && err.response.data.msg){
        //     msg = err.response.data.msg;
        // }
        // showErrorInDOM(msg);
        alert(err.response.data.msg);
      };
    }
  }

  closeGroupMembersBtn.addEventListener("click", () => {
    groupMembersContainer.style.display = "none";
  });
}

const sendbtn = document.getElementById("sendbtnn");
sendbtn.addEventListener("click", async (e) => {
  // e.preventDefault();
  const file = document.querySelector('input[type=file]').files;
  console.log("ye hfa ffike", file[0]);
  const formData = new FormData();
  formData.append("file", file[0]);
  const id = localStorage.getItem("groupId");
  try {
    const res = await axios.post(
      `http://localhost:3000/group/uploadFile?groupId=${id}`,
      formData,
      {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      }
    );


    console.log(res);
    // addChatInDOM(chat);
  } catch {
    (err) => {
      let msg = "Failed to upload image.";
      if (err.response && err.response.data && err.response.data.msg) {
        msg = err.response.data.msg;
      }
      // showErrorInDOM(msg);
      alert(err)
    };
  }
});
// })
