import { GUI } from 'three/addons/libs/lil-gui.module.min.js'; // استيراد مكتبة GUI لإنشاء واجهة المستخدم الرسومية.
import { params } from './physic'; // استيراد المتغيرات الفيزيائية من ملف الفيزياء.

const gui = new GUI(); // إنشاء واجهة المستخدم الرسومية.

const basic = gui.addFolder('basic'); // إنشاء مجلد "basic" في واجهة المستخدم الرسومية.
basic.add(params, 'pWater').min(900).max(1050).name('water distancy'); // إضافة تحكم لتعديل كثافة الماء مع تحديد نطاق القيم.
basic.add(params, 'pAir').min(0.9).max(1.5).name('air distancy'); // إضافة تحكم لتعديل كثافة الهواء مع تحديد نطاق القيم.
basic.add(params, 'mass').min(100000).max(300000).name('boat mass (kg)'); // إضافة تحكم لتعديل كتلة القارب مع تحديد نطاق القيم.
basic.add(params, 'pushForce').listen(); // إضافة تحكم لتعديل قوة الدفع مع الاستماع للتغييرات دون تحديد نطاق القيم.

const additinal = gui.addFolder('additinal'); // إنشاء مجلد "additinal" في واجهة المستخدم الرسومية.
additinal.add(params, 'g'); // إضافة تحكم لتعديل تسارع الجاذبية.
additinal.add(params, 'waterSpeed').name('water speed in motorce'); // إضافة تحكم لتعديل سرعة الماء في المحرك.
additinal.add(params, 'cd_air').name('cd of air'); // إضافة تحكم لتعديل معامل السحب في الهواء.
additinal.add(params, 'cd_water').name('cd of water'); // إضافة تحكم لتعديل معامل السحب في الماء.
additinal.add(params, 'deltaTime').name('time step').min(0).max(0.5); // إضافة تحكم لتعديل الفاصل الزمني للتحديث مع تحديد نطاق القيم.

document.addEventListener("keydown", function (event) {
    const key = event.key;
    if (key === "ArrowRight") {
        // عند الضغط على السهم الأيمن، يتم تقليل زاوية دوران الجسم.
        params.ang -= 0.02;
    }
    else if (key === "ArrowLeft") {
        // عند الضغط على السهم الأيسر، يتم زيادة زاوية دوران الجسم.
        params.ang += 0.02;
    }
    else if (key == 'w') {
        // عند الضغط على حرف "w"، يتم زيادة قوة الدفع بمقدار 1000.
        params.pushForce += 1000;
    }
}); 

// Uncomment the following lines if you want to add audio functionality.
// const au = new Audio();
// au.play();
