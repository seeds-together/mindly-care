import * as THREE from 'three'
import gsap from 'gsap'

export const createAnimatedRings = ()=>{
    const animatedRing = new THREE.Group()
    const ringl = new THREE.Mesh(
        new THREE.TorusBufferGeometry(1,0.05,32,32),
        new THREE.MeshBasicMaterial({color: 'white', transparent:true})
    )
    const ringm = new THREE.Mesh(
        new THREE.TorusBufferGeometry(0.7,0.05,32,32),
        new THREE.MeshBasicMaterial({color: 'white', transparent:true})
    )
    const rings = new THREE.Mesh(
        new THREE.TorusBufferGeometry(0.4,0.05,32,32),
        new THREE.MeshBasicMaterial({color: 'white', transparent:true})
    )
    ringl.rotation.x = Math.PI * 0.5
    ringl.scale.z = 0.4
    ringm.rotation.x = Math.PI * 0.5
    ringm.scale.z = 0.4
    rings.rotation.x = Math.PI * 0.5
    rings.scale.z = 0.4
    animatedRing.add(rings,ringm,ringl)

    return animatedRing
}

export const animateRing = (group, elapsedTime)=>{
    elapsedTime = elapsedTime * 1.5
    group.children[0].position.y = Math.abs(Math.cos(elapsedTime))
    group.children[0].material.opacity = 1- group.children[0].position.y
    group.children[0].scale.x = 1-group.children[0].material.opacity
    group.children[0].scale.y = 1-group.children[0].material.opacity

    group.children[1].position.y = Math.abs(Math.cos(elapsedTime)) + 0.2
    group.children[1].material.opacity = 1- group.children[1].position.y
    group.children[1].scale.x = 1-group.children[1].material.opacity
    group.children[1].scale.y = 1-group.children[1].material.opacity

    group.children[2].position.y = Math.abs(Math.cos(elapsedTime)) + 0.4
    group.children[2].material.opacity = 1- group.children[2].position.y
    group.children[2].scale.x = 1-group.children[2].material.opacity
    group.children[2].scale.y = 1-group.children[2].material.opacity
}
