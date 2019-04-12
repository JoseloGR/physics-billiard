var renderer = null, 
scene = null, 
camera = null,
sceneGroup = new THREE.Object3D,
hemisphereLight = null;

var staticBall = null,
ball = null,
moundBase = null,
moundBaseGreen = null;

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

    staticBall = createGolfBall('golf-ball.jpg', 0xffffff, 20, 20, 20);
    staticBall.position.set(100, 0, 0);
    scene.add(staticBall);

    staticBall = createGolfBall('golf-ball.jpg', 0xff0000, 20, 20, 20);
    staticBall.position.set(350, 0, 0);
    scene.add(staticBall);

    moundBaseGreen = createMound(30, 20, 0x00ff00);
    moundBaseGreen.position.set(-400, -30, 0);
    moundBaseGreen.rotation.set(Math.PI, 0, 0);

    moundBase = createMound(25, 80, 0x614126);
    moundBase.position.set(-400, -60, 0);
    moundBase.rotation.set(Math.PI, 0, 0);

    scene.add(moundBase);
    scene.add(moundBaseGreen);

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
function createGolfBall(path, color, radius, width, height) {
    // Put the geometry and material together into a mesh
    var sphere = new THREE.Mesh(
        new THREE.SphereGeometry(radius, width, height), 
        new THREE.MeshPhongMaterial({ 
            map: new THREE.TextureLoader().load(`images/${path}`), 
            color: color 
        })
    );
    return sphere;
}

// Create mound
function createMound(radius, height, color) {
    var mound = new THREE.Mesh(
        new THREE.ConeGeometry(radius, height, 8),
        new THREE.MeshLambertMaterial({color: color})
    )
    return mound;
}