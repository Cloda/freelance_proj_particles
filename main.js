'use strict';

// генератор чисел
function genereNombre(min, max){
    return Math.floor((Math.random()*(max-min))+min)
}

// рандомные цвета 
function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++)
        color += letters[Math.floor(Math.random() * 16)];
    return color;
}

// объявление основых переменных
var mainObject = document.getElementById("affichage"),
    colorId = document.getElementById("color"),
    masseId = document.getElementById("range"),
    color = document.getElementById("color").value,
    masse = document.getElementById("range").value,
    ctx = mainObject.getContext("2d");

var N = 10, x, y;

class Models {
    constructor(weight, positionX, positionY){
      this.weight = weight;
      this.positionX = positionX;
      this.positionY = positionY;
    }
    color = getRandomColor();
    vx = 0;
    vy = 0;
    fx = 0;
    fy = 0;
    radius = genereNombre(2, 10);
    move = true;
    draw = function(){ 
        ctx.beginPath(); 
        ctx.fillStyle = this.color;
        ctx.arc(this.positionX, this.positionY, this.radius, 0, Math.PI*2, true); 
        ctx.closePath();
        ctx.fill();
    };
}


let arrayOfP = [];  //массив частиц
for (let i = 0; i < N; i++){
    var masse = genereNombre(10, 100),
        rad = 0.0,
        ang = 2*Math.PI*i / N;
    if (masse < 50){
        rad = genereNombre(50,100);
    } else {
        rad = genereNombre(100,200);
    }
    x = $('#affichage').attr('width')/2 + rad*Math.sin(ang);
    y = $('#affichage').attr('height')/2 + rad*Math.cos(ang);

    var p = new Models(masse, x, y);
    p.vx = -0.01*rad*Math.cos(ang);
    p.vy = 0.01*rad*Math.sin(ang);
    p.draw();
    arrayOfP.push(p);
}

// добавление статичной частицы
x = $('#affichage').attr('width')/2;
y = $('#affichage').attr('height')/2;

var stat = new Models(3000, x, y);
stat.move = false;
stat.radius = 11;
stat.draw();
arrayOfP.push(stat);


// анимация ползунка
var slider = document.getElementById("range");
var output = document.getElementById("demo");
output.innerHTML = slider.value;

slider.oninput = function() {
    output.innerHTML = this.value;
}

// анимация меню
document.getElementById('header').onclick = function() {
    $("#layer").slideToggle("slow");
    if(document.getElementsByClassName("header__title")[0].innerHTML != "Masquer les controles"){
        document.getElementsByClassName("header__title")[0].innerHTML = "Masquer les controles";
    } else {
        document.getElementsByClassName("header__title")[0].innerHTML = "Close"; 
    }
}

mainObject.addEventListener('mouseup', function (e) {
    x = e.pageX - e.target.offsetLeft,
    y = e.pageY - e.target.offsetTop;
    let p = new Models(masse, x, y);
    p.color = document.getElementById("color").value;;
    p.draw();
    arrayOfP.push(p);
});

colorId.addEventListener('click', function (e) {
    color = document.getElementById("color").value;
});

masseId.addEventListener('click', function (e) {
    masse = document.getElementById("range").value;
});

function calculDeplacements(particules, dt){
    var r, dx, dy, f, G = 1, ax, ay;
    for(let i = 0; i < particules.length; i++){
        if(particules[i].positionX > mainObject.width || particules[i].positionY > mainObject.height || particules[i].positionX < 0 || particules[i].positionY < 0){
            particules.splice(i, 1);
        }
    }
    for (let i = 0; i < particules.length; i++){
        if(!particules[i].move){
            continue;
        }
        particules[i].fx = 0;
        particules[i].fy = 0;
        for(let j = 0; j < particules.length; j++){
            if(i == j){
                continue;
            }
            dx = particules[j].positionX - particules[i].positionX;
            dy = particules[j].positionY - particules[i].positionY;
            r = Math.sqrt(dx*dx + dy*dy);
            f = (G * particules[j].weight) / (r*r);
            particules[i].fx = particules[i].fx + f*dx/r;
            particules[i].fy = particules[i].fy + f*dy/r;
        }
        ax = particules[i].fx / particules[i].weight;
        ay = particules[i].fy / particules[i].weight;

        particules[i].vx = particules[i].vx + ax * dt;
        particules[i].vy = particules[i].vy + ay * dt;

        particules[i].positionX = particules[i].positionX + particules[i].vx * dt;
        particules[i].positionY = particules[i].positionY + particules[i].vy * dt;
    }
}


var intervalID;
function animer(){
    intervalID = setInterval(function(){
        var dt = 0.2;
        calculDeplacements(arrayOfP, dt);
        ctx.fillStyle = "#222222";
        ctx.fillRect(0,0, mainObject.width, mainObject.height);
        for (let p = 0; p < arrayOfP.length; p++){ 
            arrayOfP[p].draw();
        }
    }, 10);
}


document.getElementById("begin").addEventListener('click', function (e) {
    animer();
});

document.getElementById("stop").addEventListener('click', function (e) {
    clearInterval(intervalID);
});


