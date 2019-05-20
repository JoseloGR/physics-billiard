var renderer = null, 
scene = null, 
camera = null,
sceneGroup = new THREE.Object3D,
hemisphereLight = null;

var staticBall = null,
staticBall2 = null,
ball = null,
moundBase = null,
moundBaseGreen = null;

// Arrows:
var 
a1 = null,
a2 = null;
a3 = null;

// Electric charge of the balls where 1 means negative (-) and 2 means positive (+)
staticBallCharge = 1;
staticBall2Charge = 1;
ballCharge = 1;


// Q:                   **********
staticBallQ = .01;
staticBall2Q = .53;
ballQ = .05;

CONST_STATICBALLQ = 0.000001;
CONST_STATICBALL2Q = 0.000001;
CONST_BALLQ = 0.000001;

//Arrows:
var a1 = null,
a2 = null;

var controls = null;
var controlBall1 = null,
controlBall2 = null;

var charge1 = {'x': 0, 'y': 0, 'z':0};
var charge2 = {'x': 0, 'y': 0, 'z':0};
var charge3 = {'x': 0, 'y': 0, 'z':0};
console.warn = function(){}; // now warnings do nothing

function animate(){
    //Update arrow position:
    updateArrowPosition(a1, staticBall.position, ball.position)
    updateArrowPosition(a2, ball.position, staticBall.position)

    checkChanges();
}

function run(){
    requestAnimationFrame(function() { run(); });

    // Render the scene
    renderer.render( scene, camera );
    controls.update();
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

    staticBall = createGolfBall('golf-ball-texture.jpg', 0xffffff, 20, 20, 20);
    staticBall.position.set(-500, 0, 0);
    scene.add(staticBall);
    sceneGroup.add(staticBall);

    ball = createGolfBall('golf-ball.jpg', 0xff0000, 20, 20, 20);
    ball.position.set(10, 0, 0);
    scene.add(ball);
    sceneGroup.add(ball);

    staticBall2 = createGolfBall('golf-ball.jpg', 0xff00ff, 20, 20, 20);
    staticBall2.position.set(350, 0, 0);
    scene.add(staticBall2);
    sceneGroup.add(staticBall2);

    //a1 = addArrow(staticBall.position.x, staticBall.position.y, staticBall.position.z, ball.position.x, ball.position.y, ball.position.z, 0xffff00, (ballCharge - staticBallCharge == 0)? 1 : -1)
    a1 = addArrow(staticBall.position, ball.position, 0xffff00, (ballCharge - staticBallCharge == 0)? -1 : 1)
    a2 = addArrow(ball.position, staticBall.position, 0xffff00, (ballCharge - staticBallCharge == 0)? -1 : 1)
    
    scene.add(a1);
    sceneGroup.add(a1);
    
    scene.add(a2);
    sceneGroup.add(a2);

    moundBaseGreen = createMound(30, 20, 0x00ff00);
    moundBaseGreen.position.set(-400, -25, 0);
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
    controls.rotateSpeed = 2.0;
    controls.zoomSpeed = 1.5;
    controls.panSpeed = 1.8;
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

    controlBall1 = new THREE.TransformControls(camera, renderer.domElement);
    controlBall1.addEventListener( 'dragging-changed', function(event) {
        controls.enabled = !event.value;
    });
    controlBall1.attach(staticBall);
    scene.add(controlBall1);

    controlBall2 = new THREE.TransformControls(camera, renderer.domElement);
    controlBall2.addEventListener( 'dragging-changed', function(event) {
        controls.enabled = !event.value;
    });
    controlBall2.attach(ball);
    scene.add(controlBall2);
    listenForKeyboard();

    charge1['x'] = new ChargePosition(document.getElementById("charge1_x"), staticBall.position.x);
    charge1['y'] = new ChargePosition(document.getElementById("charge1_y"), staticBall.position.y);
    charge1['z'] = new ChargePosition(document.getElementById("charge1_z"), staticBall.position.z);

    charge2['x'] = new ChargePosition(document.getElementById("charge2_x"), ball.position.x);
    charge2['y'] = new ChargePosition(document.getElementById("charge2_y"), ball.position.y);
    charge2['z'] = new ChargePosition(document.getElementById("charge2_z"), ball.position.z);

    charge3['x'] = new ChargePosition(document.getElementById("charge3_x"), staticBall2.position.x);
    charge3['y'] = new ChargePosition(document.getElementById("charge3_y"), staticBall2.position.y);
    charge3['z'] = new ChargePosition(document.getElementById("charge3_z"), staticBall2.position.z);
}

// Create skybox
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

// Function to create basic line
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

// Function to create basic arrow helper
function addArrow(origin, target, colorHex, charge){
    var dir = new THREE.Vector3().subVectors(target, origin);

    // Normalize the direction vector (convert to vector of length 1)
    dir.normalize();
    
    var length = 70 * charge;
    var hex = colorHex;
    
    var arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);
    return arrowHelper;
}

// Function to compute vector direction
function updateArrowPosition(arrow, origin, target){
    arrow.position.x = origin.x;
    arrow.position.y = origin.y;
    arrow.position.z = origin.z;
    var dir = new THREE.Vector3().subVectors(target, origin);
    dir.normalize();
    arrow.setDirection(dir);
}

// Update position static charge
function updatePosition(i, j, k){
    ball.position.x += i;
    ball.position.y += j;
    ball.position.z += k;
    setTimeout(function() {
        startInteraction();
    }, 15);
}
var cont = 1;
// Compute the force
function startInteraction(){
    setTimeout(() => {
        $("#bntReload").removeClass("d-none");
    }, 2000);
    if (cont < 10000){
        // Distances: (for example, distance between principal ball -1- and static ball -2- would be d12)
        var d12 = calculateDistanceBetweenTwoPoints(ball.position, staticBall.position);
        var d13 = calculateDistanceBetweenTwoPoints(ball.position, staticBall2.position);
        // Forces within axis:
        var f12 = calculateForceWithinAnAxis(ballQ, staticBallQ, d12);
        var f13 = calculateForceWithinAnAxis(ballQ, staticBall2Q, d13);
        // r:
        var i12 = (ball.position.x - staticBall.position.x) / d12;
        var i13 = (ball.position.x - staticBall2.position.x) / d13;
        var j12 = (ball.position.y - staticBall.position.y) / d12;
        var j13 = (ball.position.y - staticBall2.position.y) / d13;
        var k12 = (ball.position.z - staticBall.position.z) / d12;
        var k13 = (ball.position.z - staticBall2.position.z) / d13;  
        // Forces with axis:
        f12i = Math.abs(f12 * i12);
        f13i = Math.abs(f13 * i13);
        f12j = Math.abs(f12 * j12);
        f13j = Math.abs(f13 * j13);
        f12k = Math.abs(f12 * k12);
        f13k = Math.abs(f13 * k13);
        // Is the summation of forces equivalent to cero?
        if ((f12i - f13i) >= -5 && (f12i - f13i) <= 5){
            console.log("Ei = 0");
            if ((f12j - f13j) >= -5 && (f12j - f13j) <= 5)
                console.log("Ej = 0");
                if ((f12k - f13k) >= -5 && (f12k - f13k) <= 5)
                    console.log("Ef = 0");
                    alert("Total force equals cero")
        }
        else{
            // Calculate final direction:
            if ((f12i - f13i) == 0)
                var i = 0;
            else
                var i = ((f12i - f13i) > 0 )? 1:-1;
            if ((f12j - f13j) == 0)
                var j = 0;
            else
                var j = ((f12j - f13j) > 0)? 1:-1;
            if ((f12k - f13k) == 0)
                var k = 0;
            else
                var k = ((f12k - f13k) > 0)? 1:-1;
            
            cont += 1;
            updatePosition(i, j, k);
        }
        
    }
}

// Reload the page
function reload() {
    location.reload();
}

// Event listeners for when movement keys are pressed and released
function listenForKeyboard() {
    // A key has been pressed
    var onKeyDown = function(event) {
        switch (event.keyCode) {
            case 65: // a
                controlBall1.showX = !controlBall1.showX;
                controlBall1.showY = !controlBall1.showY;
                controlBall1.showZ = !controlBall1.showZ;
                break;
            case 66: // b
                controlBall2.showX = !controlBall2.showX;
                controlBall2.showY = !controlBall2.showY;
                controlBall2.showZ = !controlBall2.showZ;
                break;
      }
    };
    document.addEventListener('keydown', onKeyDown, false);
}

// function to check any changes for charges positions
function checkChanges() {
    charge1['x'].change(parseInt(staticBall.position.x));
    charge1['y'].change(parseInt(staticBall.position.y));
    charge1['z'].change(parseInt(staticBall.position.z));

    charge2['x'].change(parseInt(ball.position.x));
    charge2['y'].change(parseInt(ball.position.y));
    charge2['z'].change(parseInt(ball.position.z));

    charge3['x'].change(parseInt(staticBall2.position.x));
    charge3['y'].change(parseInt(staticBall2.position.y));
    charge3['z'].change(parseInt(staticBall2.position.z));
}

// function to change value charge 1
function scaleCharge1(value) {
    var _value = parseInt(value);
    if (_value !== 0) {
        staticBall.scale.set(value, value, value);
        staticBallQ = CONST_STATICBALLQ * Math.abs(_value);
    }
    staticBallCharge = _value < 0 ? 1 : 2;
}

// function to change value charge 2
function scaleCharge2(value) {
    var _value = parseInt(value);
    if (_value !== 0) {
        ball.scale.set(value, value, value);
        staticBall2Q = CONST_STATICBALL2Q * Math.abs(_value);
    }
    staticBall2Charge = _value < 0 ? 1 : 2;
}

// Binding input text with charges position
function ChargePosition(element, data) {
    this.data = data;
    this.element = element;
    element.value = data;
    element.addEventListener("change", this, false);
}

// Event handler for input text
ChargePosition.prototype.handleEvent = function(event) {
    switch (event.type) {
        case "change": this.change(this.element.value);
    }
};

// Change event for input text
ChargePosition.prototype.change = function(value) {
    this.data = value;
    this.element.value = value;
};