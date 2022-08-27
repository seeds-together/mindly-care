import * as THREE from "three";
import { VRButton } from "three/examples/jsm/webxr/VRButton";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { XRControllerModelFactory } from "three/examples/jsm/webxr/XRControllerModelFactory.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader"
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry"

import Brain from "./loader.js";
import { Vector3 } from "three";

let startAnimation = false;
let currentFocus = 5;
let makenewCard = false;
let brainPosition;

let delayShowCard = true;

var infoDisease = [
  [4, 6, 5, 0, 2], //depression
  [5, 0], //bipolar
  [7, 5, 0], //dementia
  [8, 9, 10, 11, 2, 3], //schizophrenia
  [8, 9, 4, 0, 2, 3], //OCD
  [0, 1, 2, 3],
];

var diseaseDescrp = [
  {
    title: "Depression",
    description:
      "Brain Regions Affected:\nthe amygdala, hippocampus, thalamus.\n\n          Chemical Deficiency:\nnoradrenaline & serotonin\n\n                        Sadness, loss of interest or pleasure, feelings of guilt or low self-worth, disturbed sleep or appetite, tiredness, and poor concentration. People with depression may also have multiple physical complaints with no apparent physical cause",
  },
  {
    title: "Bipolar disorder",
    description:
      "Brain Regions Affected:\nHippocampus\n                                   \nChemical Deficiency:\nnoradrenaline & serotonin\n\n                        Consists of both manic and depressive episodes separated by periods of normal mood. elevated or irritable mood, over-activity, rapid speech, inflated self-esteem and a decreased need for sleep.",
  },
  {
    title: "Dementia",
    description:
      "Brain Regions Affected:\nentorhinal cortex and hippocampus.            \n\nChemical Deficiency:\nglutamate                                             \n\nthere is deterioration in cognitive function. It affects memory, thinking, orientation, comprehension, calculation, learning capacity, language, and judgement. The impairment in cognitive function is commonly accompanied, and occasionally preceded, by deterioration in emotional control, social behaviour, or motivation.",
  },
  {
    title: "Schizophrenia",
    description:
      "Brain Regions Affected:\nlobe regions.\n\n                                 Chemical Deficiency:\nglutamate\n\n                                        Characterized by distortions in thinking, perception, emotions, language, sense of self and behaviour. Common psychotic experiences include hallucinations (hearing, seeing or feeling things that are not there) and delusions (fixed false beliefs or suspicions that are firmly held even when there is evidence to the contrary). The disorder can make it difficult for people affected to work or study normally.",
  },
  {
    title: "Obsessive-Compulsive Disorder\n",
    description:
      "Brain Regions Affected:\nthe prefrontal cortex, and thalamus.          \n\nChemical Deficiency:\nglutamate                                        \n\nPatients with OCD are bothered by constant fears. These worrying thoughts make them perform repetitive actions. Missing a single step from their ritual increases their anxiety. This urges them to repeat the routine all over again to gain relief from their obsession. These rituals are called compulsions. For example, a person with a fear of germs would wash their hand every 10 minutes.",
  },
];

let infoParts = [[0, 4, 7, 5], [1], [2, 10, 9, 6], [3, 8, 11]];

let App = class App {
  constructor() {
    const container = document.createElement("div");
    document.body.appendChild(container);

    this.camera = this.createCamera();
    this.scene = this.createScene();
    this.renderer = this.createRenderer();
    container.appendChild(this.renderer.domElement);

    this.cameraGroup = new THREE.Group();
    this.cameraGroup.position.set(0, 1, 4);

    this.addLight();
    this.addRoom();
    this.sceneObjects = [];
    this.cards = [];
    this.lines = [];
    this.touchBox = false;
    this.touchSphere = false;
    this.touchOct = false;
    this.touchTet = false;

    this.controls = new OrbitControls(this.camera, container);
    this.controls.target.set(0, 1.6, 0);
    this.controls.update();

    this.session;
    this.renderer.xr.addEventListener("sessionstart", (event) => {
      this.session = this.renderer.xr.getSession();
      this.scene.add(this.cameraGroup);
      this.cameraGroup.add(this.camera);
    });
    this.renderer.xr.addEventListener("sessionend", (event) => {
      this.scene.remove(this.cameraGroup);
      this.cameraGroup.remove(this.camera);
      this.session = null;
    });

    this.raycaster = new THREE.Raycaster();
    this.workingMatrix = new THREE.Matrix4();

    this.setupVR();

    document.addEventListener("keyup", function (e) {
      if (e.key == "a") {
        startAnimation = true;
        // makenewCard = true;
      } else if (e.key == "s") {
        currentFocus = (currentFocus + 1) % 5;
        makenewCard = true;
      } else if (e.key == "d") {
        currentFocus = (currentFocus - 1) % 5 < 0 ? 4 : (currentFocus - 1) % 5;
        makenewCard = true;
      }
    });

    this.renderer.setAnimationLoop(this.render.bind(this));
    window.addEventListener("resize", this.resize.bind(this));
  }

  createCamera() {
    const camera = new THREE.PerspectiveCamera(
      25,
      window.innerWidth / window.innerHeight
    );

    camera.position.x = 3;
    camera.position.y = 3;
    camera.position.z = 10;
    // camera.lookAt(new Vector3(0,0,0))
    return camera;
  }

  createScene() {
    const scene = new THREE.Scene();
    // scene.background = new THREE.Color(0x808080);

    // loader.load("/textures/sky.jpg", function (texture) {
    //   scene.background = texture;
    // });
    return scene;
  }

  createRenderer() {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    // renderer.xr.enabled = true;
    renderer.setClearColor(0xC3E7F5, 1);
    return renderer;
  }

  addLight() {
    const ambient = new THREE.HemisphereLight(0x606060, 0x404040, 0.5);
    this.scene.add(ambient);
    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1).normalize();
    this.scene.add(light);
  }

  setupVR() {
    this.renderer.xr.enabled = true;
    document.body.appendChild(VRButton.createButton(this.renderer));

    const self = this;

    this.controllers = this.buildControllers();

    function onSelectStart() {
      // this.children[0].scale.z = 10;
      this.userData.selectPressed = true;
      startAnimation = true;

      if (!delayShowCard) {
        currentFocus = (currentFocus + 1) % 4;
        makenewCard = true;
      }
    }
  }
  render() {
    if (this.brain) {
      if (this.brain.model) {
        startAnimation ? this.animateBrain() : null;
      }
    }

    if (startAnimation == true) {
      delayShowCard = false;
    }

    this.renderer.render(this.scene, this.camera);

    // Loop FUnctions Here

    if (this.controllers) {
      const self = this;
      this.controllers.forEach((controller) => {
        self.handleController(controller);
      });
    }
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  buildControllers() {
    const controllerModelFactory = new XRControllerModelFactory();

    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -1),
    ]);

    const line = new THREE.Line(geometry);
    line.name = "line";
    line.scale.z = 10;

    const controllers = [];

    for (let i = 0; i <= 1; i++) {
      const controller = this.renderer.xr.getController(i);
      controller.add(line.clone());
      controller.userData.selectPressed = false;
      this.scene.add(controller);

      // controller.position.set(10,10,10)

      controllers.push(controller);

      const grip = this.renderer.xr.getControllerGrip(i);
      grip.add(controllerModelFactory.createControllerModel(grip));

      // grip.position.set(10,10,10)

      this.scene.add(grip);
    }

    return controllers;
  }

  handleController(controller) {
    if (controller.userData.selectPressed) {
      controller.children[0].scale.z = 10;

      this.workingMatrix.identity().extractRotation(controller.matrixWorld);

      this.raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
      this.raycaster.ray.direction
        .set(0, 0, -100)
        .applyMatrix4(this.workingMatrix);

      // this.scene.children.forEach( (c)=>{
      //     if(c.type === 'Mesh'){
      //         let name = Object.keys(c.geometry)
      //         console.log(c)
      //     }
      // })

      let intersects = this.raycaster.intersectObjects(this.scene.children);

      intersects.forEach((c) => {
        console.log(intersects);
        console.log(c.object.geometry.type);
      });

      // let intersectsObj = intersects.filter( (sceneChild) => {
      //     Object.keys(sceneChild.geometry)[0] ==
      // })

      // console.log(intersects)

      // if (intersects.length>0){
      //     intersects[0].object.add(this.highlight);
      //     this.highlight.visible = true;
      //     controller.children[0].scale.z = intersects[0].distance;
      // }else{
      //     this.highlight.visible = false;
      // }
    }
  }

  addRoom() {
    var mesh;
    var textureLoader = new THREE.TextureLoader();
    var map = textureLoader.load("/textures/military.jpg");
    map.encoding = THREE.sRGBEncoding;
    map.flipY = false;

    var lightMap = textureLoader.load("/textures/white.jpg");
    lightMap.encoding = THREE.sRGBEncoding;
    lightMap.flipY = false;
    const loader = new GLTFLoader().load("/models/room3.glb", (gltf) => {
      // gltf.scene.scale.set( 400,400,400 );
      mesh = gltf.scene.children[0];
      console.log("room", mesh)
      mesh.material = new THREE.MeshPhongMaterial({
        lightMap: map,
        map: map,
        color: 0xffffff,
        lightMapIntensity: 1,
        reflectivity: 0.3,
      });
      this.addBrain();
      this.createMainCard({
        title: "Brain-Waffle",
        description: "Welcome to our project!!",
        size: [4, 4],
        orientation: {
          translate: [-8, 5, 0],
          rotation: [0, Math.PI / 2, 0],
        },
        color: "#000000",
        text: "#ffffff",
      });
      mesh.translateY(-2);

      // this.scene.add(mesh);
    });
  }

  addBrain() {
    var mesh;

    this.markers = [];

    this.brain = new Brain(); // Don't load in constructor...
    // Perform load call here
    const loaded = this.brain
      .loadModel(this.brain.GLTFLoader, "/models/brain.glb")
      .then((result) => {
        result.scene.scale.set(0.3, 0.3, 0.3);

        for (var i = 0; i < result.scene.children.length; i++) {
          mesh = result.scene.children[i];
          mesh.material = new THREE.MeshPhongMaterial({
            color: i < 4 ? 0xcd3149 : 0xffffff,
            reflectivity: 0.3,
            transparent: true,
            opacity: i < 4 ? 1 : 0.2,
          });
          // this.scene.add(mesh)
          this.markers.push(mesh);
        }

        this.brain.model = result.scene;
        brainPosition = this.brain.model.position;
        this.scene.add(this.brain.model);
      });

    loaded
      .then((res) => {
        this.brain.model.translateY(1.5);
        // console.log(this.brain.model.position);
        // x: 0, y: 1.5, z: 0
        // console.log( this.markers[0].material.opacity );
        // this.markers[0].opacity
      })
      .catch((err) => {
        console.log(err);
      });
  }

  addCard(
    arg = {
      title: "",
      description: "",
      size: [],
      orientation: {},
      color: "",
      text: "",
    }
  ) {
    // Card
    const geometry = new THREE.PlaneGeometry(arg.size[0], arg.size[1]);
    const material = new THREE.MeshBasicMaterial({
      color: arg.color,
      side: THREE.DoubleSide,
      opacity: 0.8,
      transparent: true,
    });
    var plane = new THREE.Mesh(geometry, material);

    if (arg.orientation.translate) {
      plane.position.set(
        arg.orientation.translate[0],
        arg.orientation.translate[1],
        arg.orientation.translate[2]
      );
    }

    if (arg.orientation.rotation) {
      plane.rotation.set(
        arg.orientation.rotation[0],
        arg.orientation.rotation[1],
        arg.orientation.rotation[2]
      );
    }

    this.cardModel = plane;

    this.scene.add(plane);

    // Text
    const loader = new FontLoader();
    loader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
      let materials = [
        new THREE.MeshPhongMaterial({ color: arg.text, flatShading: true }), // front
        new THREE.MeshPhongMaterial({ color: arg.text }), // side
      ];

      let textGeo1 = new TextGeometry(arg.title, {
        font: font,
        size: 0.07,
        height: 0.01,
      });
      this.cardTitle = new THREE.Mesh(textGeo1, materials);
      if (arg.orientation.translate) {
        this.cardTitle.position.set(
          arg.orientation.translate[0] - arg.size[0] / 2 + 0.1,
          arg.orientation.translate[1] + arg.size[1] / 2 - 0.15,
          arg.orientation.translate[2]
        );
      }
      if (arg.orientation.rotation) {
        this.cardTitle.rotation.set(
          arg.orientation.rotation[0],
          arg.orientation.rotation[1],
          arg.orientation.rotation[2]
        );
      }

      var result = "";
      while (arg.description.length > 0) {
        result += arg.description.substring(0, 72) + "\n";
        arg.description = arg.description.substring(72);
      }

      let textGeo2 = new TextGeometry(result, {
        font: font,
        size: 0.04,
        height: 0.01,
      });

      this.cardDesc = new THREE.Mesh(textGeo2, materials);
      if (arg.orientation.translate) {
        this.cardDesc.position.set(
          arg.orientation.translate[0] - arg.size[0] / 2 + 0.1,
          arg.orientation.translate[1] + arg.size[1] / 2 - 0.25,
          arg.orientation.translate[2]
        );
      }
      if (arg.orientation.rotation) {
        this.cardDesc.rotation.set(
          arg.orientation.rotation[0],
          arg.orientation.rotation[1],
          arg.orientation.rotation[2]
        );
      }

      this.scene.add(this.cardTitle);
      this.scene.add(this.cardDesc);
    });
  }

  animateBrain() {
    // x: 0, y: 1.5, z: 0
    this.focusDisease(currentFocus);
    if (this.brain.model.children[1].position.y > brainPosition.y + 0.1) {
      // +0.1
      //Cerebellum
      this.brain.model.children[1].translateZ(0.007);
      this.brain.model.children[1].translateY(-0.01);
    }
    if (this.brain.model.children[2].position.x < brainPosition.x + 0.5) {
      //+0.5
      // //Cerebrum-left
      this.brain.model.children[2].translateX(0.01);
      this.brain.model.children[10].translateX(0.01); //back
      this.brain.model.children[9].translateX(0.01); //front
      this.brain.model.children[6].translateX(0.01); //amygdalla
    }
    //
    if (this.brain.model.children[0].position.y > brainPosition.y + 0.1) {
      //+0.1
      this.createConnection();
      // //Brainstem
      this.brain.model.children[0].translateZ(0.02);
      this.brain.model.children[4].translateY(-0.02); //upper in thalamus
      this.brain.model.children[7].translateY(-0.02); //lower out enthorinal
      this.brain.model.children[5].translateY(-0.02); //upperout hippocampus
    }
    if (this.brain.model.children[3].position.x > brainPosition.x - 2) {
      //-2
      // //Cerebrum-right
      this.brain.model.children[3].translateX(-0.01);
      this.brain.model.children[8].translateX(-0.01); //Front
      this.brain.model.children[11].translateX(-0.01); //Back
    }
  }

  focusPart(part) {
    if (part != null) {
      for (var i = 0; i < this.markers.length; i++) {
        this.markers[i].material.opacity = 0.2;
        this.markers[i].material.color.setHex(0xffffff);
      }

      infoParts[part].forEach((item) => {
        if (item < 4) {
          this.markers[item].material.opacity = 1;
          this.markers[item].material.color.setHex(0xcd3149);
        } else {
          this.markers[item].material.opacity = 1;
          this.markers[item].material.color.setHex(0xff0000);
        }
      });
    } else {
      return;
    }
    // this.markers[0].material.opacity = 0.2
  }

  focusDisease(disease) {
    // console.log(disease);
    this.changeCard();
    if (disease != null) {
      for (var i = 0; i < this.markers.length; i++) {
        this.markers[i].material.opacity = 0.2;
        this.markers[i].material.color.setHex(0xffffff);
      }

      infoDisease[disease].forEach((item) => {
        if (item < 4) {
          this.markers[item].material.opacity = 1;
          this.markers[item].material.color.setHex(0xcd3149);
        } else {
          this.markers[item].material.opacity = 1;
          this.markers[item].material.color.setHex(0xff0000);
        }
      });
    } else {
      return;
    }
    // this.markers[0].material.opacity = 0.2
  }

  changeCard() {
    // this.cardModel
    if (makenewCard) {
      console.log("making new card");
      this.scene.remove(this.cardModel);
      this.scene.remove(this.cardTitle);
      this.scene.remove(this.cardDesc);

      this.addCard({
        title: diseaseDescrp[currentFocus].title,
        description: diseaseDescrp[currentFocus].description,
        size: [2, 1.3],
        orientation: {
          translate: [2, 2.5, 0],
          // rotation : [0,10,0]
        },
        color: "#000000",
        text: "#ffffff",
      });
      this.createConnection();
    }
    makenewCard = false;
    // this.cardDesc
  }

  createConnection() {
    this.scene.updateMatrixWorld(true);
    if (this.cardModel) {
      var positionCard = new THREE.Vector3(
        this.cardModel.position.x -
        this.cardModel.geometry.parameters.width / 2,
        this.cardModel.position.y,
        this.cardModel.position.z
      );

      this.lines.forEach((item) => {
        this.scene.remove(item);
      });

      infoDisease[currentFocus].forEach((item) => {
        if (item > 3) {
          var positionMarker = new THREE.Vector3();
          positionMarker.setFromMatrixPosition(this.markers[item].matrixWorld);
          const points = [positionMarker, positionCard]; // instances of Vector3
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

          const line = new THREE.Line(geometry, material);

          this.lines.push(line);

          this.scene.add(line);
        }
      });
    }
  }

  createMainCard(
    arg = {
      title: "",
      description: "",
      size: [],
      orientation: {},
      color: "",
      text: "",
    }
  ) {
    // Card
    const geometry = new THREE.PlaneGeometry(arg.size[0], arg.size[1]);
    const material = new THREE.MeshBasicMaterial({
      color: arg.color,
      side: THREE.DoubleSide,
      opacity: 0.8,
      transparent: true,
    });
    var plane = new THREE.Mesh(geometry, material);

    if (arg.orientation.translate) {
      plane.position.set(
        arg.orientation.translate[0],
        arg.orientation.translate[1],
        arg.orientation.translate[2]
      );
    }

    if (arg.orientation.rotation) {
      plane.rotation.set(
        arg.orientation.rotation[0],
        arg.orientation.rotation[1],
        arg.orientation.rotation[2]
      );
    }

    this.mainCard = plane;

    this.scene.add(plane);

    // Text
    const loader = new FontLoader();
    loader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
      let materials = [
        new THREE.MeshPhongMaterial({ color: arg.text, flatShading: true }), // front
        new THREE.MeshPhongMaterial({ color: arg.text }), // side
      ];

      let textGeo1 = new TextGeometry(arg.title, {
        font: font,
        size: 0.2,
        height: 0.01,
      });

      this.maincardTitle = new THREE.Mesh(textGeo1, materials);
      if (arg.orientation.translate) {
        this.maincardTitle.position.set(
          arg.orientation.translate[0],
          arg.orientation.translate[1] + arg.size[1] / 2 - 0.4,
          arg.orientation.translate[2] + arg.size[0] / 2 - 0.1
        );
      }
      if (arg.orientation.rotation) {
        this.maincardTitle.rotation.set(
          arg.orientation.rotation[0],
          arg.orientation.rotation[1],
          arg.orientation.rotation[2]
        );
      }

      var result = "";
      while (arg.description.length > 0) {
        result += arg.description.substring(0, 72) + "\n";
        arg.description = arg.description.substring(72);
      }

      let textGeo2 = new TextGeometry(result, {
        font: font,
        size: 0.12,
        height: 0.01,
      });

      this.maincardDesc = new THREE.Mesh(textGeo2, materials);
      if (arg.orientation.translate) {
        this.maincardDesc.position.set(
          arg.orientation.translate[0],
          arg.orientation.translate[1] + arg.size[1] / 2 - 0.7,
          arg.orientation.translate[2] + arg.size[0] / 2 - 0.1
        );
      }
      if (arg.orientation.rotation) {
        this.maincardDesc.rotation.set(
          arg.orientation.rotation[0],
          arg.orientation.rotation[1],
          arg.orientation.rotation[2]
        );
      }

      this.scene.add(this.maincardTitle);
      this.scene.add(this.maincardDesc);

      var button_geometry = new THREE.PlaneGeometry(1.9, 1);
      var button_material = new THREE.MeshBasicMaterial({
        color: arg.color,
        side: THREE.DoubleSide,
        opacity: 0.8,
        transparent: true,
      });
      var button_plane = new THREE.Mesh(button_geometry, button_material);
      button_plane.position.set(
        arg.orientation.translate[0],
        arg.orientation.translate[1] - 2.6,
        arg.orientation.translate[2] + 1.05
      );
      button_plane.rotation.set(
        arg.orientation.rotation[0],
        arg.orientation.rotation[1],
        arg.orientation.rotation[2]
      );
      let prev_g = new TextGeometry("previous", {
        font: font,
        size: 0.2,
        height: 0.01,
      });
      var previous = new THREE.Mesh(prev_g, materials);
      previous.position.set(
        arg.orientation.translate[0],
        arg.orientation.translate[1] - 2.7,
        arg.orientation.translate[2] + 1.6
      );
      previous.rotation.set(
        arg.orientation.rotation[0],
        arg.orientation.rotation[1],
        arg.orientation.rotation[2]
      );
      this.scene.add(button_plane);
      this.scene.add(previous);

      var button_plane_1 = new THREE.Mesh(button_geometry, button_material);
      button_plane_1.position.set(
        arg.orientation.translate[0],
        arg.orientation.translate[1] - 2.6,
        arg.orientation.translate[2] - 1.05
      );
      button_plane_1.rotation.set(
        arg.orientation.rotation[0],
        arg.orientation.rotation[1],
        arg.orientation.rotation[2]
      );
      let next_g = new TextGeometry("next", {
        font: font,
        size: 0.2,
        height: 0.01,
      });
      var next = new THREE.Mesh(next_g, materials);
      next.position.set(
        arg.orientation.translate[0],
        arg.orientation.translate[1] - 2.7,
        arg.orientation.translate[2] - 0.8
      );
      next.rotation.set(
        arg.orientation.rotation[0],
        arg.orientation.rotation[1],
        arg.orientation.rotation[2]
      );
      this.scene.add(button_plane_1);
      this.scene.add(next);
    });
  }
};
export default App;
