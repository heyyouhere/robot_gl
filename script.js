const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
three_canvas.appendChild(renderer.domElement);

let logoModel;

const loader = new THREE.GLTFLoader();
loader.load('robot.gltf', function (gltf) {
    logoModel = gltf.scene;
    logoModel.scale.set(1, 1, 1); // Adjust scale if needed
    gltf.scene.traverse((child) => {
        if (child.isLight) {
            console.log(child)
        }
    });
    scene.add(logoModel);
});

camera.position.z = 5;



function setCameraPosition(pos) {
    camera.position.x = pos.x
    camera.position.y = pos.y
    camera.position.z = pos.z
}

let camera_positions = [
    {
        x: 0,
        y: -0.6,
        z: 5,
    },
    {
        x: 0,
        y: 0.5,
        z: 1,
    },
    {
        x: -0.75,
        y: 0,
        z: 2,
    }
]

setCameraPosition(camera_positions[0])

function larp_positions(camera, target, delta) {
    let current = camera.position;
    let distance = Math.sqrt((camera.position.x - target.x) * (camera.position.x - target.x) +
        (camera.position.y - target.y) * (camera.position.y - target.y) +
        (camera.position.z - target.z) * (camera.position.z - target.z))
    camera.position.x += (target.x - current.x) / distance * delta;
    camera.position.y += (target.y - current.y) / distance * delta;
    camera.position.z += (target.z - current.z) / distance * delta;
    distance = Math.sqrt((camera.position.x - target.x) * (camera.position.x - target.x) +
        (camera.position.y - target.y) * (camera.position.y - target.y) +
        (camera.position.z - target.z) * (camera.position.z - target.z))
    return distance < 0.1
}

let current_position = 1;
function rotateLogo(event) {
    if (!logoModel) return;


    if (larp_positions(camera, camera_positions[current_position], 0.1)) {
        current_position += 1
        console.log(current_position, camera_positions.length)
        console.log(current_position == camera_positions.length)
        if (current_position >= camera_positions.length) {
            current_position = 0
        }
    }
}

document.addEventListener('wheel', rotateLogo);

function animate() {
    requestAnimationFrame(animate);
    // Perform any desired animation or updates here
    renderer.render(scene, camera);
}

animate();
