import axios from "axios";

export default axios.create({
  baseURL: "https://kb-json-server.glitch.me",
  headers: {
    "Content-Type": "application/json",
  },
});
