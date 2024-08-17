import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { params } from './physic';
const gui = new GUI() ;

const basic = gui.addFolder('basic');
basic.add(params, 'pWater').min(900).max(1050).name('water distancy');
basic.add(params, 'pAir').min(0.9).max(1.5).name('air distancy');
basic.add(params, 'mass').min(100000).max(300000).name('boat mass (kg)');
basic.add(params , 'pushForce').listen()
const additinal = gui.addFolder('additinal');
additinal.add(params , 'g');
additinal.add(params , 'waterSpeed').name('water speed in motorce');
additinal.add(params , 'cd_air').name('cd of air');
additinal.add(params, 'cd_water').name('cd of water');
additinal.add(params, 'deltaTime').name('time step').min(0).max(0.5);

document.addEventListener("keydown", function (event) {
    const key = event.key;
    if (key === "ArrowRight") { params.ang -= 0.02 /*, params.ang = Math.max(-Math.PI / 3, params.ang -= 0.1);*/ }
    else if (key === "ArrowLeft") { params.ang += 0.02/*params.ang = Math.min(Math.PI / 3, params.ang += 0.1);*/ }
    else if ( key == 'w') params.pushForce += 1000 ;
}); 
// const au = new Audio()
//     au.play();