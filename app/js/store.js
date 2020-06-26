const settingForm = document.getElementById("settings-form");
const nav = document.getElementById("nav");

// Get settings
ipcRenderer.on("settings:get", (e, setting) => {
  document.getElementById("cpu-overload").value = setting.cpuOverload;
  document.getElementById("alert-frequency").value = setting.alertFrequency;
});

// Submit settings
settingForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const cpuOverload = document.getElementById("cpu-overload").value;
  const alertFrequency = document.getElementById("alert-frequency").value;
  //Send new setting to new process
  ipcRenderer.send("settings:set", {
    cpuOverload,
    alertFrequency,
  });
  showAlert("Settings saved");
});

const showAlert = (msg) => {
  const alert = document.getElementById("alert");
  alert.classList.remove("hide");
  alert.classList.add("alert");
  alert.innerText = msg;
  setTimeout(() => {
    alert.classList.add("hide");
  }, 3000);
};

ipcRenderer.on("nav:toggle", () => {
  nav.classList.toggle("hide");
});
