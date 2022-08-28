import * as THREE from 'three'
import gsap from 'gsap'
import * as lil from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Room {
    constructor() {
        // Load the scene
        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        }

        const scene = new THREE.Scene()
        const canvas = document.querySelector(".room")

        const loader = new GLTFLoader()
        let roomObj = new THREE.Group()
        loader.load("/models/roomBS.glb", (result) => {
            console.log(result.scene)
            roomObj = result.scene

            roomObj.getObjectByName("Plane001").material.roughness = 1
            roomObj.getObjectByName("Plane002").material.roughness = 1
            roomObj.getObjectByName("Plane003").material.roughness = 1
            roomObj.scale.set(0.2,0.2,0.2)
            scene.add(roomObj)
        })


        // Camera
        const camera = new THREE.PerspectiveCamera(20, sizes.width / sizes.height)
        camera.position.z = 7
        camera.position.y = 10
        scene.add(camera)

        // Controls
        const controls = new OrbitControls(camera, canvas)
        controls.enableDamping = true
        controls.enablePan = false
        controls.maxDistance = 4.5
        controls.minAzimuthAngle = -0.3
        controls.maxAzimuthAngle = Math.PI /2 + 0.3
        // controls.minPolarAngle = 0
        controls.minPolarAngle = 1.2
        controls.maxPolarAngle = 1.45

        // Lights
        const lightGroup = new THREE.Group()
    
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.65)
        
        const pointLight1 = new THREE.PointLight(0xffffff, 0.3, 5, 1)
        pointLight1.position.set(0, 1, 0)
    
        const pointLight2 = new THREE.PointLight(0xffffff, 0.3, 5, 1)
        pointLight2.position.set(-1, 1, -1)
    
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.15)
        directionalLight.position.set(-50, 30, 0)
    
        const pointLightHelper = new THREE.PointLightHelper(pointLight1)
        const pointLightHelper2 = new THREE.PointLightHelper(pointLight2)
        const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
        // directionalLightHelper.visible = false

        lightGroup.add(
            ambientLight,
            pointLight1,
            pointLight2,
            directionalLight,

            // directionalLightHelper,
            // pointLightHelper,
            // pointLightHelper2
        )
        scene.add(lightGroup)

        // Renderer
        const renderer = new THREE.WebGLRenderer( {canvas})
        renderer.setSize(sizes.width, sizes.height)
        renderer.setClearColor(0xC3E7F5, 1);
        renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap

        // document.getElementById('room').appendChild(renderer.domElement);
        // document.getElementById('canvas-globe').appendChild(renderer.domElement);
        renderer.render(scene, camera)

        const tick = () => {
            // Clock
            renderer.render(scene, camera)
            controls.update()

            // console.log(camera.rotation.y);

            window.requestAnimationFrame(tick)
        }
    
        tick()

        window.addEventListener("resize", () => {
            sizes.width = window.innerWidth
            sizes.height = window.innerHeight
    
            camera.aspect = sizes.width / sizes.height
            camera.updateProjectionMatrix()
    
            renderer.setSize(sizes.width, sizes.height)
            renderer.setPixelRatio(Math.min(window.devicePixelRatio))
        })
    }
}