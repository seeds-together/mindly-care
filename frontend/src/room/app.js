import * as THREE from 'three'
import gsap from 'gsap'
import * as lil from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js' 

export class Room{
    constructor(){
        // Load the scene
        const loader = new GLTFLoader()
        loader.load("/models/roomBS.glb", (result)=>{
            console.log(result);
        })


    }
}