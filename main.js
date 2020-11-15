"use strict"
function print(v){
    console.log(v)
}
print("were up and running")

//Grabbing the canvas and the variable that allows us to start drawing
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
let wid = c.width
let hei = c.height
let mouse = document.getElementsByClassName("mouse")[0]
let cheese = document.getElementsByClassName("cheese")[0]
let innerBar = document.querySelector(".inside")





class Obj {
    constructor(width,height,x,y){
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
    }
}

let cheeseObj = new Obj(50,50,200,200)

function drawCheese(){
    ctx.drawImage(cheese,cheeseObj.x,cheeseObj.y,cheeseObj.width,cheeseObj.height)
}

function randPos(){
    return (Math.random()*400 + 50)
}

function changeCheese(){
    cheeseObj.x = randPos();
    cheeseObj.y = randPos();
}

function cheeseAte(){
    if(ysame()&& xsame()){
        changeCheese()
        winning()
    }
}
let distance = 40;
function ysame(){
    if(mouseObj.y > cheeseObj.y - distance && mouseObj.y < cheeseObj.y + distance){
        return true
    }
}
function xsame(){
    if(mouseObj.x > cheeseObj.x - distance && mouseObj.x < cheeseObj.x + distance){
        return true
    }
}



class Mouse extends Obj{
    constructor(width,height,x,y,dx,dy){
        super(width,height,x,y);
        this.dx = dx;
        this.dy = dy;
    }
}

let mouseObj = new Mouse(50,50,0,450,0,0)

function drawMouse(){
    ctx.drawImage(mouse,mouseObj.x,mouseObj.y,mouseObj.width,mouseObj.height)

}
function newPos(){
    mouseObj.x += mouseObj.dx;
    mouseObj.y += mouseObj.dy
    barrierReached()
}

function barrierReached(){
    if(mouseObj.x<0){
        mouseObj.dx *=-1;
        mouseObj.x = 0;
    }
    if(mouseObj.y<0){
        mouseObj.dy *=-1;
        mouseObj.y = 0;
    }
    if(mouseObj.x>wid - 50){
        mouseObj.dx *=-1;
        mouseObj.x = wid-50;
    }
    if(mouseObj.y>hei - 50){
        mouseObj.dy *=-1;
        mouseObj.y = wid-50;
    }
}
let startGun = 0;
function startGunCheck(){
    if(mouseObj.x != 0 || mouseObj.y !=450){
        startGun++;
    }

}


window.addEventListener("keydown",keyD)

let speed = 10;
function keyD(e){
e.preventDefault()
barrierReached()
if(e.key == "ArrowUp"){
    resetDir()
    mouseObj.dy = -speed;
}
if(e.key == "ArrowDown"){
    resetDir()
    mouseObj.dy = speed;
}
if(e.key == "ArrowRight"){
    resetDir()
    mouseObj.dx = speed;
}
if(e.key == "ArrowLeft"){
    resetDir()
    mouseObj.dx = -speed;
}

}
function resetDir(){
    mouseObj.dx = 0;
    mouseObj.dy = 0;
}



//function that adds to the bar

function winning(){
    innerBar.style.right = `${perRemover(innerBar.style.right) - 10}%`
    if(perRemover(innerBar.style.right) <= 5 ){
        addLevel()
        innerBar.style.right = `85%`
    }
    
}

function perRemover(p){
    return Number(p.slice(0,-1))
}

function loosing(){
    if(innerBar.style.right != "100%" && startGun>0){
        innerBar.style.right = `${perRemover(innerBar.style.right) + 1.5}%`
    }
    
}


function hasLost(){
    return perRemover(innerBar.style.right) >= 100 ? true : false
}

let loosingInt = setInterval(() => {
    loosing()
}, 500);



//level update
let levelText = document.getElementById("level")
let level = 1;

// function addLevel(){
//     level++;
//     levelText.textContent = `Level: ${level}`
//     harderCheese()
//     speedIncreaser()
//     resetTraps()
//     increaseTraps()
    
// }
//some functions that alter difficulty
function harderCheese(){
    if(cheeseRefreshRate > 1500){
        cheeseRefreshRate -= 300
    }
}

function speedIncreaser(){
    if(speed<20){
        speed += .15;
    }
}

// change the cheese after a set time
let cheeseRefreshRate = 10000

function cheeseRegen(){
    changeCheese()
    setTimeout(cheeseRegen,cheeseRefreshRate)
}
cheeseRegen()



//timer 

let secondsSmall = 0;
let secondsBig = 0;

let minutesSmall = 0;
let minutesBig = 0;


const timerInt = setInterval(() => {
    if(startGun>0){
        secondsSmall++;
        if(secondsSmall>9){
            secondsSmall = 0;
            secondsBig++
            if(secondsBig>5){
                minutesSmall++;
                secondsBig = 0;
                if(minutesSmall>9){
                    minutesBig++;
                    minutesSmall = 0;
                }
            }
        }
 }
   document.querySelector("#time").textContent = `${minutesBig}${minutesSmall}:${secondsBig}${secondsSmall}`

}, 1000);

//modal stuff
let outerBar = document.querySelector(".outside")
let modal = document.querySelector(".modal")
let retryBtn = document.querySelector(".modal h3")
retryBtn.addEventListener("click",refresh)
let levelSurvived = document.querySelector("#levelSurvived")
let timeSurvived = document.querySelector("#timeSurvived")


function refresh(){
    window.location.reload()
}

function openModal(){
    if(hasLost()){
        outerBar.style.backgroundColor = "red"
        innerBar.style.height = "1px"
        innerBar.style.top = "7px"
        clearInterval(timerInt)
        cancelAnimationFrame(update)
        levelSurvived.textContent = level
        timeSurvived.textContent = `${minutesBig}${minutesSmall}:${secondsBig}${secondsSmall}`


        setTimeout(() => {
            
            modal.style.display = ""
        }, 800);
    }
}

//poison objects
let trap = document.querySelector(".trap")
let trapArr = []

class xandy{
    constructor(x,y){
        this.x = x,
        this.y = y
    }
}

function generateTrapPos(){
    trapArr.push(new xandy(randPos(),randPos()))
}

function drawTraps(){
    for(let i of trapArr){
        ctx.drawImage(trap,i.x,i.y,50,50)
    }
}

//timing the traps
let trapInterval = 10000
let count = 0;
function increaseTraps(){
    trapInterval -= 250
}
function trapTiming(){
    generateTrapPos()
    setTimeout(trapTiming,trapInterval)
}
setTimeout(trapTiming,trapInterval)



function resetTraps(){
    trapArr = []
}

function trapCollide(){
    for(let i of trapArr){
        if(tXSame(i)&& tYSame(i)){
            damageHealth()
            trapArr = trapArr.filter((v)=>{
                if(v.x != i.x && v.y != i.y){
                    return v
                }

            })
        }
    }
}

function tXSame(i){
    if(i.x > mouseObj.x - distance && i.x < mouseObj.x + distance){
        return true
    }
}

function tYSame(i){
    if(i.y > mouseObj.y - distance && i.y < mouseObj.y + distance){
        return true
    }
}

function damageHealth(){
    innerBar.style.backgroundColor="red"
    moveBack()
    innerBar.style.right = `${perRemover(innerBar.style.right) + 5}%`
    setTimeout(() => {
    innerBar.style.backgroundColor=""
        
    }, 500);
}

function moveBack(){
    mouseObj.dy != 0 ? mouseObj.dy *= -1 : mouseObj.dy
    mouseObj.dx != 0 ? mouseObj.dx *= -1 : mouseObj.dx

        
}




function addLevel(){
    level++;
    levelText.textContent = `Level: ${level}`
    harderCheese()
    speedIncreaser()
    resetTraps()
    increaseTraps()
    
}


function update(){
    ctx.clearRect(0,0,wid,hei)
    newPos()
    drawMouse()
    drawCheese()
    cheeseAte()
    ysame()
    startGunCheck()
    requestAnimationFrame(update)
    startGunCheck()
    openModal()
    drawTraps()
    trapCollide()
}
update()

