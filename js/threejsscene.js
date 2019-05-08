var renderer = null, 
scene = null, 
camera = null,
sceneGroup = new THREE.Object3D,
hemisphereLight = null;

var staticBall = null,
ball = null,
moundBase = null,
moundBaseGreen = null;

// Arrows:
var 
a1 = null,
a2 = null;

// Electric charge of the balls where 1 means negative (-) and 2 means positive (+)
staticBallCharge = 1;
ballCharge = 1;

//Arrows:
var a1 = null,
a2 = null;

var controls = null;

function animate(){
    //Update arrow position:
    updateArrowPosition(a1, staticBall.position, ball.position)
    updateArrowPosition(a2, ball.position, staticBall.position)
}

function run(){
    requestAnimationFrame(function() { run(); });

    // Render the scene
    renderer.render( scene, camera );
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
    createLines();

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
    sceneGroup.add(staticBall);

    ball = createGolfBall('golf-ball.jpg', 0xff0000, 20, 20, 20);
    ball.position.set(350, 0, 0);
    scene.add(ball);
    sceneGroup.add(ball);

    //a1 = addArrow(staticBall.position.x, staticBall.position.y, staticBall.position.z, ball.position.x, ball.position.y, ball.position.z, 0xffff00, (ballCharge - staticBallCharge == 0)? 1 : -1)
    a1 = addArrow(staticBall.position, ball.position, 0xffff00, (ballCharge - staticBallCharge == 0)? -1 : 1)
    a2 = addArrow(ball.position, staticBall.position, 0xffff00, (ballCharge - staticBallCharge == 0)? -1 : 1)
    
    scene.add(a1);
    sceneGroup.add(a1);
    
    scene.add(a2);
    sceneGroup.add(a2);

    moundBaseGreen = createMound(30, 20, 0x00ff00);
    moundBaseGreen.position.set(-400, -30, 0);
    moundBaseGreen.rotation.set(Math.PI, 0, 0);

    moundBase = createMound(25, 80, 0x614126);
    moundBase.position.set(-400, -60, 0);
    moundBase.rotation.set(Math.PI, 0, 0);

    scene.add(moundBase);
    scene.add(moundBaseGreen);

    sceneGroup.add(moundBase);
    sceneGroup.add(moundBaseGreen);
    scene.add(sceneGroup);

    controls = new THREE.TrackballControls( camera, renderer.domElement );
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
    

    var dragControls = new THREE.DragControls( [staticBall, ball], camera, renderer.domElement );
    dragControls.addEventListener( 'dragstart', function () {

        controls.enabled = false;

    } );
    dragControls.addEventListener( 'dragend', function () {

        controls.enabled = true;

    } );
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

// Create lines:
function createLines(){
    addLine(0, 0, 0, 1000, 0, 0, 0x000fff);
    addLine(0, 0, 0, 0, 1000, 0, 0xff0000 );
    addLine(0, 0, 0, 0, 0, -1000, 0xffff33);
}

function addLine(posXi, posYi, posZi, posXf, posYf, posZf, colorHex){
    var geometry = new THREE.Geometry();
    geometry.vertices.push(
        new THREE.Vector3(posXi, posYi, posZi),
        new THREE.Vector3(posXf, posYf, posZf));
    // The Line
    var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
                color: colorHex
            }));
    scene.add(line);
    sceneGroup.add(line);
}

function addArrow(origin, target, colorHex, charge){
    var dir = new THREE.Vector3().sub(target, origin);

    // Normalize the direction vector (convert to vector of length 1)
    dir.normalize();
    
    var length = 70 * charge;
    var hex = colorHex;
    
    var arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);
    return arrowHelper;
}

function updateArrowPosition(arrow, origin, target){
    arrow.position.x = origin.x;
    arrow.position.y = origin.y;
    arrow.position.z = origin.z;
    var dir = new THREE.Vector3().sub(target, origin);
    dir.normalize();
    arrow.setDirection(dir);
}
