
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

var circles = [];
 
function Circle(radPath, speed, width, xPos, yPos, num) {
    this.radPath = radPath;
    this.radius = width/2;
    this.speed = speed;
    this.width = width;
    this.xCenter = xPos;
    this.yCenter = yPos;
    this.opacity = 0.8;
    this.xPos = 0;
    this.yPos = 0;

    if(num >= colors.length) {
        this.color = colors[num % colors.length];
        this.audio = audios[num % colors.length];
    }
    else {
        this.color = colors[num];
        this.audio = audios[num];
    }

    this.counter = 0;

    var signHelper = Math.floor(Math.random() * 2);

    if (signHelper == 1) {
        this.sign = -1;
    } else {
        this.sign = 1;
    }
}

var colors = ['244, 67, 54','255, 143, 0','255, 235, 59','139, 195, 74','92, 107, 192','77, 208, 225','156, 39, 176','240, 98, 146'];
var audios = ['sound/c.mp3','sound/d.mp3','sound/e.mp3','sound/f.mp3','sound/g.mp3','sound/a.mp3','sound/b.mp3','sound/c2.mp3'];

Circle.prototype.update = function() {

    this.counter += this.sign * this.speed;
    this.xPos = this.xCenter + Math.cos(this.counter / 100) * this.radPath;
    this.yPos = this.yCenter + Math.sin(this.counter / 100) * this.radPath;

    context.beginPath();

    context.arc(
        this.xPos,
        this.yPos,
        this.width,
        0,
        Math.PI * 2,
        false);

    context.closePath();

    context.fillStyle = 'rgba(' + this.color + ',' + this.opacity +')';
    context.fill();


};

Circle.prototype.isPointInside = function(x,y){
    var dx = this.xPos-x;
    var dy = this.yPos-y;
    var radius = this.width;
    return( dx*dx+dy*dy <= radius*radius );
};

var canvasOffset;
var offsetX;
var offsetY;

function handleMouseDown(e){
    console.log("MOUSE DOWN");
    mouseX=parseInt(e.clientX-offsetX);
    mouseY=parseInt(e.clientY-offsetY);
    var audio;
    clicked = [];       console.log("CN: " + curr_note);

    for(var i=0;i<circles.length;i++){
        if(circles[i].isPointInside(mouseX,mouseY)){
            clicked.push(i % colors.length);
            audio = new Audio(circles[i].audio);
            audio.play();
            
        }
    }
    if(clicked.length > 0) {
        
        for(i = 0; i < clicked.length; i++) { console.log("Clicked: "+ clicked[i] + ", color: " + colors[curr_note]);
            if(colors[clicked[i]] == colors[curr_note]) {    
                console.log("Color Matched " + circles[i].audio);
                curr_index ++;
                curr_note= notes[curr_index];
                break;
            }
            else
                gameover = true;
        }
    }
    
}

var diameter;

function drawCircles() {

    for (var i = 0; i < colors.length * 3; i++) {
        var randomX = getRandomInt(diameter, screen_width-diameter);
        var randomY = getRandomInt(diameter, screen_height-diameter);
        var speed = 0.2 + Math.random() * 3;
        var size = diameter;

        var circle = new Circle(diameter, speed, size/2, randomX, randomY, i);
        circles.push(circle);
    }
    
}

var screen_width = window.innerWidth-20;
var screen_height = window.innerHeight-20;
var score;

function draw() {
    if(curr_index >= notes.length) {
        console.log("PLAY");
        score += 2;
        $("#canvas").unbind('click');
        play();
    }
    else {
        context.clearRect(0, 0, screen_width, screen_height);

        for (var i = 0; i < circles.length; i++) {
            var myCircle = circles[i];
            myCircle.update();
        }
        if(gameover == false) {
            requestAnimationFrame(draw);
        }
        else {
            console.log("GAME OVER")
            $("#canvas").unbind('click');
            showScore();
        }
    }

}

function resizeScreen(w,h) {
 
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    var cont = document.getElementById("container");
    cont.width = w;
    cont.height = h;

    var canv = document.getElementById("canvas");
    canv.width = w;
    canv.height = h;
}

function setScreen() {
    resizeScreen(screen_width,screen_height);
    setOffsets();
}

function setOffsets() {
    diameter = screen_width/12;

    canvasOffset=$("#canvas").offset();
    offsetX=canvasOffset.left;
    offsetY=canvasOffset.top;
}


var lvl1 = [0,1,2,2,1,0];
var lvl2 = [0,0,2,4,2,4,2,0];
var lvl3 = [0,1,2,3,4,5,6,7];
var lvl4 = [4,4,6,6,7,4,6,7];
var lvl5 = [0,2,0,2,4,5,4,0];

var list_lvl = [lvl1, lvl2,lvl3,lvl4];

function drawPattern() {
    var circle;
    var xStart = (screen_width/2) - (70*(notes.length-1));
    console.log("NOTES: " + notes.length);

    for(var i = 0; i < notes.length; i++) {
        color = colors[notes[i]];

        context.beginPath();

        context.arc(
            xStart,
            130,
            50,
            0,
            Math.PI * 2,
            false);

        context.closePath();

        context.fillStyle = 'rgba(' + color + ', 0.8)';
        context.fill();

        xStart += 140;
    }
    
}

var level;
var index;
var pattern;
var notes;

var btn = document.createElement("BUTTON");  
var t = document.createTextNode("Play"); 

btn.addEventListener("click", function(){
    game();
} );        

// function playPattern() {
//     var audio = new Audio(audios[notes[0]]);
//     audio.pause();
//     for(var i = 0; i < notes.length; i++) {
//          console.log("PLAYING AUDIO: " + audios[notes[i]]);
//         if(!audio.paused)
//             i--;
//         else  {
//             audio.play(); 
//             //setTimeout(function() { audio.p();}, 1000);
//         }
//         audio = new Audio(audios[notes[i]]);
//     }
// }

function showPattern() {
    var note;
     var lvl = list_lvl[level-1];
    var base = index + 2;
    console.log("Index: " + index + " , Base: " + base);
    while(index < base) {
        note = lvl[index];
        notes.push(note);

        // if(note == 0)
        //     pattern += "do ";
        // else if(note == 1)
        //     pattern += "re ";
        // else if(pattern == 2)
        //     pattern += "mi ";
        // else if(pattern == 3)
        //     pattern += "fa";
        // else if(pattern == 4)
        //     pattern += "so ";
        // else if(pattern == 5)
        //     pattern += "la ";
        // else if(pattern == 6)
        //     pattern += "ti";
        // else
        //     pattern += "hi-do ";
        index++;
    }
    
    context.font = "30px Lucida Console";

    var text = "Level "+ level + " \n ";
    context.fillText(text,(screen_width/2)-(text.length/2)*10,50);

    drawPattern();
    //playPattern();

    btn.appendChild(t);      
    btn.style.width = screen.width-17;
    btn.style.height = 30;
    btn.style.background = "transparent";
    document.body.appendChild(btn);  
    
}

function initialize_game() {
    level = 1;
    index = 0;
    notes = [];
    score = 0;
}

var clicked = [];
var curr_index;
var curr_note;

function checkClicked() {
    if(gameover == true) {
        circles = [];
        start();
    }
    else
        updateNote();
}

function updateNote() {
    curr_index ++;
    curr_note= notes[curr_index];
}

function game() {
    btn.removeChild(t);
    btn.parentNode.removeChild(btn);
    circles = [];
    curr_index = 0;
    curr_note = notes[curr_index];
    gameover = false;
    setScreen();
    $("#canvas").click(handleMouseDown);
    drawCircles();
    draw();
    
}

function play() {
    resizeScreen(screen_width,200);
   
    var lvl = list_lvl[level-1];
     console.log(">>" + lvl.length);
    if(notes.length >= lvl.length) {
        notes = [];
        index = 0;
        level++;
    } console.log("LEVEL: " + level);
    showPattern();
    
}

function start() { 
    showMenu();
}


////////////////MENU////////////////
var menuCircles;
var text;

function showMenu() {
    setScreen();
    text = "Round Colored Notes";

    menuCircles = [];
    var circle = new Circle(screen_width/4, 1, 50, screen_width/2, 300,getRandomInt(0, colors.length));
    menuCircles.push(circle);
    circle.sign = -1;
    circle = new Circle(screen_width/4, 1, 50, screen_width/2, 300,getRandomInt(0, colors.length));
    menuCircles.push(circle);
    circle.sign = 1;

    what = 0;
    game_na = false;

    drawSingleCircle();
    $("#canvas").click(handleMouseDownonMenu);
}

var game_na = false;
var what  = 0;

function drawSingleCircle() {
    context.clearRect(0, 0, screen_width, screen_height);

    showText();

    for(var i = 0; i < menuCircles.length; i++) {
        menuCircles[i].update();
    }
    
    if(game_na == false)
        requestAnimationFrame(drawSingleCircle);
    else {
         $("#canvas").unbind('click');
        if(what == 0) {
            initialize_game();
            play();
        }
        else if(what == 1) {
            start();
        }
    }
}

function drawText(text,centerX,centerY,fontsize,fontface){
    context.save();
    context.fillStyle = "Black";
    context.font=fontsize+'px '+fontface;
    context.textAlign='center';
    context.textBaseline='middle';
    context.fillText(text,centerX,centerY);
    context.restore();
}

function showText() {
    if(what == 0) {
        drawText('Just Circles',canvas.width/2,100,40,'Lucida Console');
        drawText('of',canvas.width/2,150,30,'Courier');
        drawText('Single Notes',canvas.width/2,200,40,'Lucida Console');
        drawText('Just a game of memory and sound.',canvas.width/2,300,20,'Courier');
        drawText('Memorize a given series of colored circles.',canvas.width/2,325,20,'Courier');
        drawText('Click the circles in order of the pattern.',canvas.width/2,350,20,'Courier');
        drawText('Click only the right color! It\'s touch move tho!',canvas.width/2,375,20,'Courier');
        drawText('Each colored circle corresponds to a single note.',canvas.width/2,400,20,'Courier');
        drawText('Discover which one is! Have a \'little\' fun! :D',canvas.width/2,425,20,'Courier');
        drawText('Click one of the revolving circles to PLAY.',canvas.width/2,500,20,'Courier');
    }
    else if(what == 1) {
        var text = "Points: " + score;
        drawText(text,canvas.width/2,screen_height/2,40,'Lucida Console');
        drawText('You know what to do with the circles!',canvas.width/2,400,20,'Courier');
    }
}

function handleMouseDownonMenu(e){
    console.log("MOUSE DOWN MENU");
    mouseX=parseInt(e.clientX-offsetX);
    mouseY=parseInt(e.clientY-offsetY);
    var audio;

    for(var i=0;i<menuCircles.length;i++){
        if(menuCircles[i].isPointInside(mouseX,mouseY)){
            audio = new Audio(menuCircles[i].audio);
            audio.play();
            game_na = true;
        }
    }
}

function showScore() {

    game_na = false;
    setScreen();  
    what = 1;
    drawSingleCircle();
    $("#canvas").click(handleMouseDownonMenu);
}

start();