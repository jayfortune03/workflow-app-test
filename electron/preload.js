import { contextBridge, ipcRenderer } from "electron";
// Expose safe APIs to the renderer
contextBridge.exposeInMainWorld("api", {
  ping: (msg) => ipcRenderer.invoke("ping", msg),
});
