const { ipcRenderer } = require("electron");
const startBtn = document.getElementById("startBtn");
const csvFile = document.getElementById("csvFile");
const log = document.getElementById("log");

startBtn.addEventListener("click", async () => {
  if (!csvFile.files[0]) {
    alert("Please select a CSV file!");
    return;
  }

  const filePath = csvFile.files[0].path;
  log.textContent = "Starting...";

  ipcRenderer.invoke("send-messages", filePath);

  ipcRenderer.on("log", (event, message) => {
    log.textContent += message + "\n";
  });
});
