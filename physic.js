import * as THREE from 'three';
export let group = new THREE.Group();
// export const group =new THREE.Mesh(new THREE.BoxGeometry(50 , 50,100) , new THREE.MeshNormalMaterial());
// group.material.wireframe = true ;
class Vector {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x; this.y = y; this.z = z;
    }
    add(v){
        this.x += v.x ;
        this.y += v.y;
        this.z += v.z;
    }
}

export var params = {
    pWater:1025 ,
    v : 300 ,
    g : 9.8 ,
    pAir : 1.25 ,
    mass: 200000,
    force: new Vector(),
    acceleration: new Vector(),
    velocity: new Vector(),
    position: new Vector(),
    deltaTime: 0.05,
    cd_water : 0.5 ,
    cd_air : 0.05 , 
    ang : 0,
    waterSpeed : 300 , // m.s
    pushForce : 0 
}
function airRes(){
    var res = new Vector() ;
    res.x = -0.5 * params.pAir * faceX() * Math.pow(params.velocity.x ,2 )* params.cd_air;
    res.z = -0.5 * params.pAir * faceZ() * Math.pow(params.velocity.z, 2) * params.cd_air;
    res.y = -0.5 * params.pAir * faceY() * Math.pow(params.velocity.y, 2) * params.cd_air;
    if (params.velocity.y < 0)res.y = 0 ; 
    if (params.velocity.x < 0) res.x *= -1;
    if (params.velocity.z < 0) res.z *= -1;
    return res ;
}
function airWater() {
    var res = new Vector();
    res.x = -0.5 * params.pWater * faceX() * Math.pow(params.velocity.x, 2) * params.cd_water;
    res.z = -0.5 * params.pWater * faceZ() * Math.pow(params.velocity.z, 2) * params.cd_water;
    res.y = +0.5 * params.pWater * faceY() * Math.pow(params.velocity.y, 2) * params.cd_water;
    if (params.velocity.y > 0) res.y = 0;
    if (params.velocity.x < 0) res.x *= -1 ;
    if (params.velocity.z < 0) res.z *= -1;
    return res;
}
function push(){
    // 0.3 is the space of force 

    // const pushForce = params.pWater * params.waterSpeed * 0.3 ; 
    const pushForce = params.pushForce ;
    var push = new Vector();
    push.x = pushForce * Math.sin(params.ang) ;
    push.z = pushForce * Math.cos([params.ang]);
    return push ;
    
}
function boument(){
    var boument = new Vector() ;
    boument.y += params.pWater * volUnderWater() * params.g ;
    // console.log(boument);
    return boument ;
}

function gravity(){
    var gravity = new Vector()
    gravity.y -= params.mass * params.g ;
    // console.log(gravity);
    return gravity ;

}
function accelerations(){
    params.acceleration.x = params.force.x / params.mass;
    params.acceleration.y = params.force.y / params.mass;
    params.acceleration.z = params.force.z / params.mass;
}
function velocites(){
    params.velocity.x += params.acceleration.x * params.deltaTime;
    params.velocity.y += params.acceleration.y * params.deltaTime;
    params.velocity.z += params.acceleration.z * params.deltaTime;
}
function position(){
    params.position.x += params.velocity.x * params.deltaTime;
    params.position.y += params.velocity.y * params.deltaTime;
    params.position.z += params.velocity.z * params.deltaTime;
}
function faceX(){
    return percent() * 10 * 5 ;
}
function faceY() {
    return 10 * 5;
}
function  faceZ(){
    return percent() * 5 * 5 ;
}
function percent(){
    //percent is the y under the water 
    // mult by - becaus the y vertecies is nigative 
    var percent = - params.position.y + 20;
    // max value will be 40 
    percent = Math.min(percent, 40);
    // min val is zero 

    percent = Math.max(percent, 0)
    percent = percent / 40;
    return percent ;
}
function volUnderWater(){
   
    return params.v * percent() ;
    
}
function update(){
    params.force = new Vector() ;
    params.force.add(boument());
    params.force.add(gravity());
    params.force.add(airRes());
    params.force.add(airWater());
    params.force.add(push());

    console.log(params.force)
    group.rotation.y = params.ang ;
    accelerations();
    velocites();
    position();
    group.position.set(params.position.x, params.position.y, params.position.z);
    // group.position.z++ ;
    window.requestAnimationFrame(update);
}
update();


