import * as THREE from 'three'

// Light
export const createLightGroup = () => {
    const lightGroup = new THREE.Group
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 6)
    
    const pointLight1 = new THREE.PointLight(0xffffff, 2.8, 5, 1)
    pointLight1.position.set(-3, -2, 2)

    const pointLight3 = new THREE.PointLight(0xffffff, 1.5, 5, 1)
    pointLight3.position.set(3, 1, -1)

    const pointLight4 = new THREE.PointLight(0xffffff, 1.5, 5, 1)
    pointLight4.position.set(2, -2, -1)

    const pointLight2 = new THREE.PointLight(0xffffff, 2.9, 10)
    pointLight2.position.set(0, 0, 4)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(-10, 30, 50)
    
    const directionalLight3 = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight3.position.set(0, 30, -30)

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight2.position.set(-30, -30, -50)

    const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
    directionalLightHelper.visible = false
    
    const directionalLightHelper2 = new THREE.DirectionalLightHelper(directionalLight2)
    directionalLightHelper2.visible = false
    lightGroup.add(
        ambientLight,
        pointLight1,
        pointLight2,
        pointLight3,
        pointLight4,
        directionalLight,
        directionalLight2,
        directionalLight3,
        directionalLightHelper,
        directionalLightHelper2
    )
    return lightGroup
}