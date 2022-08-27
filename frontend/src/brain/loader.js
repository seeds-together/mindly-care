import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default class Brain {
  constructor() {
    this.GLTFLoader = new GLTFLoader();
    this.model
  }

  loadModel(loader, url) {
    return new Promise((resolve, reject) => {
      loader.load(
        url,

        gltf => {
          resolve(gltf);
        },

        undefined,

        error => {
          console.error('An error happened.', error);
          reject(error);
        }
      );
    });
  }
}
