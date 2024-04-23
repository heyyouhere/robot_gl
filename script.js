const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
three_canvas.appendChild(renderer.domElement);



let logoModel;
let mixer;

const loader = new THREE.GLTFLoader();

loader.load('./robot.gltf', function(gltf) {
    const model = gltf.scene;
    mixer = new THREE.AnimationMixer(model);
    mixer.update()


    gltf.animations.forEach((clip) => {
        clip.loop = false;
        const action = mixer.clipAction(clip);
        action.clampWhenFinished = true; // Keep the animation at its last frame when completed
        mixer.clipAction(clip).play();
        mixer.update(0); // Update animation
    });

    scene.add(model);

    const animate = function() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    };

    animate();

}, undefined, function(error) {
    console.error(error);
});

camera.position.z = 5;



function getScrollPercent() {
    var h = document.documentElement, 
        b = document.body,
        st = 'scrollTop',
        sh = 'scrollHeight';
    return (h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight) * 100;
}

function updateAnimation() {
    const scrollFraction = getScrollPercent() / 100;
    if (mixer) {
        if (scrollFraction == 1){
            mixer.setTime(mixer._actions[0]._clip.duration * 0.99); // Set the animation time based on scroll
        } else {
            mixer.setTime(mixer._actions[0]._clip.duration * (scrollFraction)); // Set the animation time based on scroll
        }
        mixer.update(0.001); // Update animation
    }
}

window.addEventListener('scroll', updateAnimation);



function animate() {
    requestAnimationFrame(animate);
    // Perform any desired animation or updates here
    renderer.render(scene, camera);
}

animate();
