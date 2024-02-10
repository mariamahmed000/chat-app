const socket = io();
// const socket = io("http://localhost:4000/",{})

const clientTotal = document.getElementById("client-total");
const messageContainer = document.getElementById("message-container");
const nameInput = document.getElementById("name-input");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const Feedback = document.getElementById("feedback");

const music = new Audio("./public_message-tone.mp3");

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();

  sendMessage();
});

socket.on("clients-total", (data) => {
  console.log(data);
  clientTotal.innerText = `Total Clients: ${data}`;
});

function sendMessage() {
  console.log(messageInput.value);
  if (messageInput.value == "") return;
  const data = {
    name: nameInput.value,
    message: messageInput.value,
    dataTime: new Date(),
  };
  // console.log(data);
  socket.emit("message", data);
  addMessage(true, data);
  messageInput.value = "";
}

socket.on("chat-message", (data) => {
  console.log(data);
  music.play();
  addMessage(false, data);
});

function addMessage(isOwnMessage, data) {
  clearFeedback();
  const element = `<li class="${
    isOwnMessage ? "message-right" : "message-left"
  }">
  <p class="message">
    ${data.message}
    <span>${data.name} ● ${moment(data.dataTime).fromNow()}</span>
  </p>
</li>`;

  messageContainer.innerHTML += element;
  scrollBottom();
}

function scrollBottom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

messageInput.addEventListener("focus", (e) => {
  socket.emit("feedback", {
    feedback: `${nameInput.value} is typing a message`,
  });
});
messageInput.addEventListener("keypress", (e) => {
  socket.emit("feedback", {
    feedback: `${nameInput.value} is typing a message`,
  });
});
messageInput.addEventListener("blur", (e) => {
  socket.emit("feedback", {
    feedback: "",
  });
});

socket.on("feedback", (data) => {
  clearFeedback();
  const element = `<li class="message-feedback">
    <p class="feedback" id="feedback">${data.feedback}</p>
  </li>`;

  messageContainer.innerHTML += element;
});

function clearFeedback() {
  document.querySelectorAll("li.message-feedback").forEach((elemnt) => {
    elemnt.parentNode.removeChild(elemnt);
  });
}
