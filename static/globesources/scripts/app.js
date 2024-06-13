class App {
  constructor({ animate, setup, preload }) {
    this.preload = preload;
    this.animate = animate;
    this.setup = setup;
    window.app = this;
  }

  init = async () => {
    this.initScene();
    this.initRenderer();
    this.initCamera();
    this.initControls();
    this.initStats();

    if (this.preload) {
      await this.preload();
    }

    this.render();
    this.update();
  }

  initScene = () => {
    this.scene = new THREE.Scene();
  }

  initRenderer = () => {
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setClearColor(0x000000, 1.0);
    this.updateRendererSize(); // Ensure the renderer size is updated after initialization
    this.renderer.setPixelRatio(window.devicePixelRatio * 1.5);
    this.renderer.shadowMap.enabled = true;
    this.renderer.antialias = true;
  }

  updateRendererSize = () => {
    const globeContainer = document.getElementById('globe-container');
    if (globeContainer) {
      const width = globeContainer.offsetWidth;
      const height = globeContainer.offsetHeight;
      this.renderer.setSize(width, height);
      if (this.camera) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
      }
    }
  }

  initCamera = () => {
    this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 10000); // Aspect ratio set to 1 initially
    this.camera.lookAt(this.scene.position);
    this.camera.position.set(0, 15, 30);
    this.updateRendererSize(); // Update the renderer size once the camera is initialized
  }

  initControls = () => {
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
  }

  initStats = () => {
    this.stats = new Stats();
    this.stats.setMode(0);
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.right = '10px';
    this.stats.domElement.style.bottom = '10px';
    document.body.appendChild(this.stats.domElement);
  }

  render = () => {
    this.setup(this);
    const globeContainer = document.getElementById('globe-container');
    if (globeContainer) {
      globeContainer.appendChild(this.renderer.domElement);
    }
  }

  update = () => {
    this.animate(this);
    this.stats.update();
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.update);
  }

  addControlGui = callback => {
    var gui = new dat.GUI();
    callback(gui);
  }

  handleResize = () => {
    this.updateRendererSize();
  }
}

window.onload = () => {
  const app = new App({ setup, animate, preload });
  app.init();
  window.onresize = app.handleResize;
};
