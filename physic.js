import * as THREE from 'three';
export let group = new THREE.Group();
// تعريف مجموعة يمكن من خلالها إضافة الأشكال ثلاثية الأبعاد وتحريكها معًا.

// تعريف كلاس يمثل المتجهات ثلاثية الأبعاد ويتيح إجراء العمليات الحسابية عليها مثل الجمع.
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

// مجموعة من المتغيرات الفيزيائية الرئيسية والخصائص التي ستتحكم في حركة الجسم.
export var params = {
    pWater: 1025 , // كثافة الماء بالكيلوغرام لكل متر مكعب
    v : 300 , // حجم الجسم تحت الماء
    g : 9.8 , // تسارع الجاذبية الأرضية
    pAir : 1.25 , // كثافة الهواء
    mass: 200000, // كتلة الجسم بالكيلوغرام
    force: new Vector(), // متجه القوة المؤثرة على الجسم
    acceleration: new Vector(), // متجه التسارع
    velocity: new Vector(), // متجه السرعة
    position: new Vector(), // متجه الموقع الحالي للجسم
    deltaTime: 0.05, // الفاصل الزمني للتحديثات
    cd_water : 0.5 , // معامل السحب في الماء
    cd_air : 0.05 , // معامل السحب في الهواء
    ang : 0, // الزاوية التي يتحرك بها الجسم
    waterSpeed : 300 , // سرعة الماء بالمتر في الثانية
    pushForce : 0 // القوة التي تدفع الجسم
}

// دالة تحسب تأثير مقاومة الهواء على الجسم وتعيد متجه القوة الناتج.
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

// دالة تحسب تأثير مقاومة الماء على الجسم وتعيد متجه القوة الناتج.
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

// دالة تحسب قوة الدفع التي تؤثر على الجسم بناءً على الزاوية.
function push(){
    const pushForce = params.pushForce ; // استخدام القوة الدفع المعطاة
    var push = new Vector();
    push.x = pushForce * Math.sin(params.ang) ;
    push.z = pushForce * Math.cos([params.ang]);
    return push ;
}

// دالة تحسب قوة الطفو التي تؤثر على الجسم نتيجة كثافة الماء.
function boument(){
    var boument = new Vector() ;
    boument.y += params.pWater * volUnderWater() * params.g ;
    return boument ;
}

// دالة تحسب تأثير الجاذبية على الجسم وتعيد متجه القوة الناتج.
function gravity(){
    var gravity = new Vector()
    gravity.y -= params.mass * params.g ;
    return gravity ;
}

// دالة تحسب التسارع بناءً على القوى المؤثرة على الجسم.
function accelerations(){
    params.acceleration.x = params.force.x / params.mass;
    params.acceleration.y = params.force.y / params.mass;
    params.acceleration.z = params.force.z / params.mass;
}

// دالة تحسب السرعة الجديدة للجسم بناءً على التسارع.
function velocites(){
    params.velocity.x += params.acceleration.x * params.deltaTime;
    params.velocity.y += params.acceleration.y * params.deltaTime;
    params.velocity.z += params.acceleration.z * params.deltaTime;
}

// دالة تحسب الموقع الجديد للجسم بناءً على السرعة.
function position(){
    params.position.x += params.velocity.x * params.deltaTime;
    params.position.y += params.velocity.y * params.deltaTime;
    params.position.z += params.velocity.z * params.deltaTime;
}

// دالة تحسب مساحة السطح المتعامد على محور X المعرض للهواء أو الماء.
function faceX(){
    return percent() * 10 * 5 ;
}

// دالة تحسب مساحة السطح المتعامد على محور Y.
function faceY() {
    return 10 * 5;
}

// دالة تحسب مساحة السطح المتعامد على محور Z المعرض للهواء أو الماء.
function  faceZ(){
    return percent() * 5 * 5 ;
}

// دالة تحسب النسبة المئوية من الجسم الموجودة تحت الماء.
function percent(){
    var percent = - params.position.y + 20; // حساب النسبة بناءً على موقع الجسم
    percent = Math.min(percent, 40); // تحديد الحد الأعلى للنسبة
    percent = Math.max(percent, 0); // تحديد الحد الأدنى للنسبة
    percent = percent / 40;
    return percent ;
}

// دالة تحسب حجم الجزء المغمور من الجسم تحت الماء.
function volUnderWater(){
    return params.v * percent() ;
}

// دالة التحديث الرئيسية التي تستدعى في كل إطار وتقوم بتحديث القوى والحركات والموقع.
function update(){
    params.force = new Vector() ; // إعادة تعيين متجه القوة
    params.force.add(boument()); // إضافة قوة الطفو
    params.force.add(gravity()); // إضافة قوة الجاذبية
    params.force.add(airRes()); // إضافة مقاومة الهواء
    params.force.add(airWater()); // إضافة مقاومة الماء
    params.force.add(push()); // إضافة قوة الدفع

    console.log(params.force)
    group.rotation.y = params.ang ; // تحديث زاوية دوران الجسم
    accelerations(); // حساب التسارع
    velocites(); // حساب السرعة
    position(); // حساب الموقع الجديد
    group.position.set(params.position.x, params.position.y, params.position.z); // تعيين الموقع الجديد للمجموعة

    window.requestAnimationFrame(update); // استدعاء الدالة في الإطار التالي
}

update(); // بدء عملية التحديث
