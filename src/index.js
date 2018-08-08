let container, scene, camera, renderer;

var pinsFormation = [];
var pins = [1];
var pinAmount = 1;

pinsFormation.push( pins );

pins = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
pinsFormation.push( pins );

pins = [ 0 ];
pinsFormation.push( pins );

pins = []; // cut the rope ;)
pinsFormation.push( pins );

pins = [ 0, cloth.w ]; // classic 2 pins
pinsFormation.push( pins );

pins = pinsFormation[pinAmount];

let amount = 2;

// cloth
let clothGeometry, object;

const init = () => {
  container = document.createElement('div');
  document.body.appendChild( container );

  // scene
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog( '#000', 500, 10000 );

  // camera
  camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 5000 );
  camera.position.z = 300;
  camera.position.x = 1300;
  camera.position.y = 0;

  camera.lookAt(scene);
  // camera.position.x = 200;
  // camera.position.y = -200;

  // lights
  var light, materials;

  scene.add( new THREE.AmbientLight( 0x666666 ) );

  light = new THREE.DirectionalLight( 0xdfebff, .5 );
  light.position.set( 50, 200, 100 );
  light.position.multiplyScalar( 1.3 );

  light.castShadow = true;

  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;

  var d = 300;

  light.shadow.camera.left = - d;
  light.shadow.camera.right = d;
  light.shadow.camera.top = d;
  light.shadow.camera.bottom = - d;

  light.shadow.camera.far = 1000;

  scene.add( light );

  // cloth material
  let loader = new THREE.TextureLoader();
  let clothTexture = loader.load( './img/testimg.jpg' );
  clothTexture.wrapS = clothTexture.wrapT = THREE.RepeatWrapping;
  clothTexture.repeat.y = - 1;
  clothTexture.anisotropy = 32;

  let clothMaterial = new THREE.MeshPhongMaterial({
    specular: 0x030303,
    map: clothTexture,
    side: THREE.DoubleSide,
    alphaTest: 0.5
  });

  // cloth geometry
  clothGeometry = new THREE.ParametricGeometry(clothFunction, cloth.w, cloth.h);
  clothGeometry.dynamic = true;

  let uniforms = {
    texture: {value: clothTexture}
  };
  let vertexShader = document.getElementById( 'vertexShaderDepth' ).textContent;
  let fragmentShader = document.getElementById( 'fragmentShaderDepth' ).textContent;

  // cloth mesh
  makePole(800, 0, 0);

  const material = makeMaterial('./img/testimg2.jpg');
  const material2 = makeMaterial('./img/testimg.jpg');
  const flag = makeCloth(material, -50, 0, 0);
  const flag2 = makeCloth(material2, 0, 0, 0);
  scene.add(flag);
  scene.add(flag2);


  // object = new THREE.Mesh(clothGeometry, clothMaterial2);
  // object.position.set(-800, -200, 0);

  flag.customDepthMaterial = new THREE.ShaderMaterial( {
		uniforms,
		vertexShader,
		fragmentShader,
		side: THREE.DoubleSide
	});

  flag2.customDepthMaterial = new THREE.ShaderMaterial( {
		uniforms,
		vertexShader,
		fragmentShader,
		side: THREE.DoubleSide
	});

  // poles



  // renderer
  renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor( scene.fog.color );

	container.appendChild( renderer.domElement );

	renderer.gammaInput = true;
	renderer.gammaOutput = true;

	renderer.shadowMap.enabled = true;

  // controls
  var controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.maxPolarAngle = Math.PI * 0.5;
  controls.minDistance = 20;
  controls.maxDistance = 7500;
}

const makeCloth = (material, x, y, z) => {
  object = new THREE.Mesh(clothGeometry, material);
  object.position.set(x, y, z);
  makePole(x, y, z);
  return object;
}

const makePole = (x, y, z) => {
  let geometry = new THREE.CylinderBufferGeometry(5, 5, 70, 32);
  let material = new THREE.MeshBasicMaterial({color: 0xD3D3D3});
  let pole = new THREE.Mesh(geometry, material);
  pole.position.set(x - 400, y + 190, z);
  pole.rotation.x = Math.PI / 2;
  pole.rotation.z = Math.PI / 2;
  scene.add(pole);
}

const makeMaterial = (file) => {
  let loader = new THREE.TextureLoader();
  let texture = loader.load(file);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.y = - 1;
  texture.anisotropy = 16;

  let material = new THREE.MeshPhongMaterial({
    specular: 0x030303,
    map: texture,
    side: THREE.DoubleSide,
    alphaTest: 0.5
  });
  return material;
}

const animate = () => {
  requestAnimationFrame(animate);
  var time = Date.now();

  var windStrength = Math.cos( time / 7000 ) * 10 + 5;

  windForce.set( Math.sin( time / 2000 ), Math.cos( time / 3000 ), Math.sin( time / 1000 ) )
  windForce.normalize()
  windForce.multiplyScalar( windStrength );
  simulate(time);
  render();
}

const render = () => {
  var p = cloth.particles;
  // console.log("cloth.particles is = ", p.length);

  for ( var i = 0, il = p.length; i < il; i ++ ) {
    clothGeometry.vertices[ i ].copy( p[ i ].position );
  }

  clothGeometry.computeFaceNormals();
  clothGeometry.computeVertexNormals();

  clothGeometry.normalsNeedUpdate = true;
  clothGeometry.verticesNeedUpdate = true;


  camera.lookAt( scene.position );

  renderer.render( scene, camera );

}

function keyDownTextField(e) {
var keyCode = e.keyCode;
		togglePins();
}


function togglePins() {
	var maximum = 4;
	var i = 1;

	if (pinAmount < 4){
		pinAmount ++
	}

	else{
		pinAmount = 1;
	}
	// var randomnumber = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;


	pins = pinsFormation[pinAmount];
	console.log("pinsformation length is ", pinsFormation.length);

}

init();
animate();
