var renderer = null, 
scene = null, 
camera = null,
sceneGroup = new THREE.Object3D,
hemisphereLight = null;

var staticBall = null,
ball = null;

function animate(){

}

function run(){
    requestAnimationFrame(function() { run(); });

    // Render the scene
    renderer.render( scene, camera );

    // Spin the cube for next frame
    animate();
}

function createScene(canvas){
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Create a new Three.js scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0.2, 0.2, 0.2 );

    // Set the background color 
    scene.background = new THREE.Color( 0.2, 0.2, 0.2 );
    // scene.background = new THREE.Color( "rgb(100, 100, 100)" );

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 15000 );
    camera.position.z = 900;
    scene.add(camera);

    // Adding Skybox:
    createSkybox();

     // Light
    hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x999999, 1);
    hemisphereLight.position.set(3000, 1000, -5000);
    scene.add(hemisphereLight);

    // Add a directional light to show off the objects
    var light = new THREE.DirectionalLight( 0xffffff, 1.0);

    // Position the light out from the scene, pointing at the origin
    light.position.set(-.5, .2, 1);
    light.target.position.set(0,-2,0);
    scene.add(light);

    // This light globally illuminates all objects in the scene equally.
    // Cannot cast shadows
    var ambientLight = new THREE.AmbientLight(0xffcc00, 0.5);
    scene.add(ambientLight);

    staticBall = createGolfBall('golf-ball.jpg', 20, 20, 20);
    staticBall.position.set(0, 0, 0);
    scene.add(staticBall);

    scene.add(sceneGroup);
}

function createSkybox() {
    var skyboxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
    var skyboxMaterials = [
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('images/cwd_bk.jpg'),
            side: THREE.DoubleSide
        }),
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('images/cwd_bk.jpg'),
            side: THREE.DoubleSide
        }),
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('images/cwd_up.jpg'),
            side: THREE.DoubleSide
        }),
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('images/cwd_dn.jpg'),
            side: THREE.DoubleSide
        }),
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('images/cwd_rt.jpg'),
            side: THREE.DoubleSide
        }),
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('images/cwd_lf.jpg'),
            side: THREE.DoubleSide
        })
    ];

    var skyboxMaterial = new THREE.MeshFaceMaterial(skyboxMaterials);
    var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
    skybox.position.set(0, 0, 0);
    scene.add(skybox);
    sceneGroup.add(skybox);
}

// Create 3D Object with configuration of any sphere
function createGolfBall(path, radius, width, height) {
    var texture = new THREE.TextureLoader().load(`images/${path}`);
    var material = new THREE.MeshPhongMaterial({ map: texture });
    // Create the sphere geometry
    var geometry = new THREE.SphereGeometry(radius, width, height);
    // And put the geometry and material together into a mesh
    var spherePlanet = new THREE.Mesh(geometry, material);
    return spherePlanet;
}