import { Howl } from "howler";
import API from "src/API";

export class Sound {
  constructor(src, callback) {
    this.src = src;
    this.callback = callback;
    this.sound = null;
  }
  play() {
    this.sound = new Howl({
      src: [this.src],
      onend: () => {
        this.callback();
        this.sound = null;
      },
    });
    this.sound.play();
    this.playing = true;
  }
  stop() {
    if (this.sound === null) {
      this.playing = false;
      return;
    }
    this.sound.stop();
    this.playing = false;
  }
  update(src, callback) {
    this.src = src;
    if (callback) {
      this.callback = callback;
    }
  }
  isPlaying() {
    return this.playing;
  }
}

/**
 * Función que verifica si una URL es de una imagen
 * @param {string} url - URL de la imagen
 * @returns {boolean}
 */
export async function isImage(url) {
  try {
    const response = await fetch(url, {
      method: "HEAD",
    });
    if (!response.ok) {
      throw new Error("Error al traer la imagen (Utils.isImage)");
    }
    const contentType = response.headers.get("content-type");
    return contentType.includes("image");
  } catch (err) {
    console.log("Error al traer la imagen (Utils.isImage)");
    return false;
  }
}

export function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export async function isAllowedImage(base64) {
  const mimetypes = ["image/jpeg", "image/png", "image/jpeg"];
  try {
    const mimeType = base64.match(/^data:(image\/[a-zA-Z0-9-.+]+);base64,/);
    if (!mimeType) return false;
    if (!mimetypes.includes(mimeType[1])) return false;

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = base64;
    });
  } catch (err) {
    return false;
  }
}

export async function updateAvatar(file) {
  try {
    const base64 = await toBase64(file);
    const { data, status } = await API.put("/update-avatar", {
      avatar: base64,
      name: file.name,
      type: file.type,
    });
    console.log(data?.message);
    data.avatar = base64;
    return { data, status };
  } catch (err) {
    console.log(err);
    return { data: null, status: 500 };
  }
}

export class Loop {
  constructor(callback, interval) {
    if (!callback) throw new Error("El callback es necesario.");
    if (!interval) interval = 1000;
    if (isNaN(interval)) throw new Error("El intervalo debe ser un número.");
    if (typeof callback !== "function")
      throw new Error("El callback debe ser una función.");
    if (interval < 0) throw new Error("El intervalo no puede ser negativo.");
    if (interval < 100) interval = 100;
    this.callback = callback;
    this.interval = interval;
  }
  start() {
    this.callback();
    this.intervalId = setInterval(this.callback, this.interval);
  }
  stop() {
    clearInterval(this.intervalId);
  }
}
