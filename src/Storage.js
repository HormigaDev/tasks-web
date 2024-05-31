class Storage {
  constructor() {
    this._data = {};
  }
  get(key) {
    return this._data[key];
  }
  set(key, value) {
    this._data[key] = value;
  }
  remove(key) {
    delete this._data[key];
  }
  clear() {
    this._data = {};
  }
}

export default Storage;
