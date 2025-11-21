const { ipcRenderer } = require("electron");

const startBtn = document.getElementById("startBtn");
const log = document.getElementById("log");

startBtn.addEventListener("click", async () => {
  log.textContent = "";

  const filePath = await ipcRenderer.invoke("select-file");

  if (!filePath) {
    alert("No CSV file selected!");
    return;
  }

  log.textContent = "Starting...\n";

  ipcRenderer.invoke("send-messages", filePath);

  ipcRenderer.on("log", (event, message) => {
    log.textContent += message + "\n";
  });
});
