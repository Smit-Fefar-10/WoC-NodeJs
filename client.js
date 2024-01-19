const socket = io("http://localhost:5500");
function joinRoom() {
  const section1 = document.getElementById("entry_room");
  const section2 = document.getElementById("second");
  section1.style.display = "none";
  section2.style.display = "block";
  const username = document.getElementById("username_join_room").value;
  const roomId = document.getElementById("room_id_join_room").value;
  socket.emit("joinRoom", { username, roomId });
}
function createroom() {
  const section1 = document.getElementById("entry_room");
  const section2 = document.getElementById("second");
  section1.style.display = "none";
  section2.style.display = "block";
  const username = document.getElementById("username_create_room").value;
  socket.emit("createroom", { username });
}
socket.on("userList", (usernames) => {
  const usernamesContainer = document.getElementById("usernames");
  usernamesContainer.innerHTML =
    '<h1 style="font-colot:black">Usernames</h1><hr>';

  usernames.forEach((username) => {
    usernamesContainer.innerHTML += `<div style="font-colot:black">${username}</div>`;
  });
});

socket.on("joinRoomResponse", (response) => {
  alert(response);
});
