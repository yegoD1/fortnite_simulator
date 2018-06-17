function pD(div, x_pos, y_pos) {
    var d = document.getElementById(div);
    d.style.position = "absolute";
    d.style.left = x_pos + 'px';
    d.style.top = y_pos + 'px';
}

var time;
var minutes = 3;
var seconds = 00;
var e;
var ele = [];
var peppa_opened = false;
var peppa_cardtaken = false;
var haskey = false;
var interval = 1000;
var counter_key = false;
var counteropened = false;

function createEle(x, y, x1, y1, link) {
    try {
        e = document.createElement("div");
        e.id = "node" + ele.length;
        ele.push(e.id);
        document.getElementById("level").appendChild(e);
        pD(e.id, x, y);
        document.getElementById(e.id).style.width = x1;
        document.getElementById(e.id).style.height = y1;
        document.getElementById(e.id).onclick = link;
        //document.getElementById(e.id).style.background = "red";
    } catch (e) {
        alert(e);
    }
}

function rN() {
    document.getElementById("level").innerHTML = "";
}

function room1() {
    document.getElementById("game").style.background = "url('room1.png')";
    rN();

    // Peppa Pig
    createEle(440, 130, 180, 200, function() { peppa(); });
    // Hole
    createEle(288, 460, 258, 123, function() { room2(); });
    // Door
    createEle(275, 173, 134, 134, function() { door(); });
    // Counter
    createEle(128, 258, 147, 145, function() { counter(); });

}


function paperground() {
    document.getElementById("game").style.background = "url('paper_ground.png')";
    rN();

    // Back
    createEle(468, 428, 132, 172, function() { room2(); });
}

function room2() {
    document.getElementById("game").style.background = "url('room2.png')";
    rN();

    // Back
    createEle(460, 22, 132, 177, function() { room1(); });
    // Paper_wall
    createEle(9, 193, 75, 173, function() { paper_wall(); });
    // Paper_ground
    createEle(216, 391, 178, 126, function() { paperground(); });

}

function paper_wall() {
    document.getElementById("game").style.background = "url('paper_wall.png')";
    rN();
    createEle(12, 401, 142, 164, function() { room2(); });
}

function peppa() {
    rN();
    switch (peppa_opened) {
        case true:
            if (peppa_cardtaken == true) {
                document.getElementById("game").style.background = "url('peppa_open_nc.png')";
            } else if (peppa_cardtaken == false) {
                document.getElementById("game").style.background = "url('peppa_open.png')";
                createEle(107, 76, 374, 374, function() { peppa_tc(); });
            }
            break;
        case false:
            document.getElementById("game").style.background = "url('peppa_closed.png')";
            // Peppa Pig Image
            createEle(107, 76, 374, 374, function() { peppa_unlock(); });
            break;
    }

    // Back button
    createEle(405, 396, 200, 200, function() { room1(); });
}

function door_unlock() {
    if (peppa_cardtaken == true) {
        rN();
        document.getElementById("game").style.background = "url('door_open.png')";
        createEle(0, 0, 600, 600, function() { escape(); });
    } else { alert("You need a key card to open this door!"); }
}

function door() {
    rN();
    document.getElementById("game").style.background = "url('door_closed.png')";
    // Back
    createEle(0, 404, 170, 196, function() { room1(); });

    // Unlock
    createEle(166, 153, 434, 447, function() { door_unlock(); });
}

var arrowpressed = [];

// UP = 1
// DOWN = 2
// LEFT = 3
// RIGHT = 4

function selectItem(item) {
    if (arrowpressed.length !== 3) {
        arrowpressed.push(item);
    } else {
        alert("The combo needs to be 3 chars!");
        arrowpressed = [];
    }
}

function sendItem() {
    if (arrowpressed[0] == 2) {
        if (arrowpressed[1] == 2) {
            if (arrowpressed[2] == 4) {
                counteropened = true;
                counter();
                console.log("unlocked success");
            } else {
                alert("Incorrect combo.");
            }
        } else {
            alert("Incorrect combo.");
        }
    } else {
        alert("Incorrect combo.");
    }
}

function counter() {
    // ↓ ↓ →
    rN();
    switch (counteropened) {
        case false:
            document.getElementById("game").style.background = "url('counter_closed.png')";

            // Enter
            createEle(45, 472, 94, 71, function() { sendItem(); });

            // Up   
            createEle(261, 440, 75, 55, function() { selectItem(1); });

            // Down
            createEle(257, 521, 80, 63, function() { selectItem(2); });

            // Left
            createEle(156, 462, 93, 79, function() { selectItem(3); });

            // Right
            createEle(348, 469, 95, 77, function() { selectItem(4); });

            // Clear
            createEle(457, 471, 87, 75, function() { arrowpressed = []; });
            break;
        case true:
            if (counter_key) {
                document.getElementById("game").style.background = "url('counter_open.png')"
            } else {
                document.getElementById("game").style.background = "url('counter_open_nc.png')"
                createEle(49, 139, 501, 292, function() {
                    counter_key = true;
                    haskey = true;
                    counter();
                });
            }
    }
    createEle(2, 4, 224, 136, function() { room1(); });
}

function peppa_unlock() {
    if (haskey) {
        peppa_opened = true;
        peppa();
    } else {
        alert("You need a key to open this!");
    }
}

function peppa_tc() {
    peppa_cardtaken = true;
    peppa();
}

function paper_ground() {
    rN();
    document.getElementById("game").style.background = "url('paper_ground.png')";
}

function countdown() {
    if (time == "0:00") {
        alert("clock has ended!");
        clearInterval(interval);
    } else {
        if (seconds - 1 >= 0) {
            seconds--
        } else if (seconds == 0) {
            minutes--;
            seconds = 59;
        }
        time = minutes + ":" + ("0" + seconds).slice(-2);
        document.getElementById("ctext").innerHTML = time;
        console.log(time);
        firebase.database().ref('timer/').set({
            timer: time
        });
    }
}

var interval = setInterval(function() {
    countdown();
}, 1000);

function escape() {
    clearInterval(interval);
    document.getElementById("game").style.background = "black";
    e = document.createElement("div");
    e.id = "escape";
    ele.push(e.id);
    document.getElementById("level").appendChild(e);
    pD(e.id, 0, 0);
    document.getElementById(e.id).style.width = 600;
    document.getElementById(e.id).style.height = 600;
    document.getElementById(e.id).style.color = "white";
    document.getElementById(e.id).innerHTML = "<h1><b>You escaped!</b><br>Time: " + time + "</h1>";
    document.getElementById("ctext").innerHTML = "";
    alert("You escaped in " + (2 - minutes) + ":" + ("0" + (59 - seconds)).slice(-2) + "\nTime: " + time);
}

room1();