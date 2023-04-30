const $bubble_container = document.querySelector(".bubble-container");
const $text_input = document.querySelector(".text-input");
const $text_send  = document.querySelector(".text-send");

const socket = new WebSocket("ws://localhost:3000");

// ketika berhasil terhubung ke server.
socket.addEventListener("open", () => {
      sendInitialData();
});

// ketika button send di click.
$text_send.addEventListener("click", () => {
      sendMessage();
});

// ketika input text
$text_input.addEventListener("keydown", event => {
      // ketika user click enter tapi tanpa shiftKey, kirim messagenya.
      if (event.which === 13 && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
      } 
});

// ketika ada message baru dari server.
socket.addEventListener("message", event => {
      const data = JSON.parse(event.data);
      renderMessage(data);
});

function sendInitialData() {
      // munculin prompt buat dapetin nama user
      const name = prompt("siapa namamu?");

      socket.send(JSON.stringify({
            initial: true,
            name: name
      }));
}

function sendMessage() {
      const value = $text_input.textContent;

      // kalo valuenya kosong, jangan kirim. 
      // tapi bikin text inputnya focus.
      if (!value.trim()) {
            return $text_input.focus();
      }

      socket.send(JSON.stringify({
            initial: false,
            message: value
      }));

      // reset text inputnya setelah message dikirim
      $text_input.textContent = "";
}

function renderMessage(data) {
      const $bubble = document.createElement("div");

      $bubble.innerHTML = `
            <div class="bubble-message" style="background-color: ${stringToColor(data.user.id)}">${data.message}</div>
            <div class="bubble-name">${data.user.name}</div>
      `;

      $bubble.className = "bubble " + (data.me ? "bubble-out" : "bubble-in");
      $bubble_container.append($bubble);
}

function stringToColor(str) {
      let hash = 0;

      for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }

      let color = "#";

      for (let i = 0; i < 3; i++) {
            let value = (hash >> (i * 8)) & 0xFF;
            color += ("00" + value.toString(16)).substr(-2);
      }

      return color;
}
