import {saveToStorage} from "./utils.js";

const setColorSwither = (settings) => {
    const switchColorBtn = document.getElementById('switch-color-btn');
    const colors = ['#3c74db', '#6a3cdb', '#db3c59', '#BD1550', '#3c99db', '#E97F02', '#16a085', '#27ae60', '#2c3e50', '#f39c12',
                    '#e74c3c', '#9b59b6', '#FB6964', '#472E32', '#77B1A9', '#73A857'];
                    
    let step = settings.currentColor ? settings.currentColor : 0;
    setColorByStep();

    switchColorBtn.addEventListener('click', () => {
        step < colors.length - 1 ? step++ : step = 0;
        setColorByStep();
        settings.currentColor = step;
        saveToStorage('settings', settings);
    });

    function setColorByStep () {
        document.documentElement.style.setProperty('--main-color', colors[step]);
    }
};

export default setColorSwither;