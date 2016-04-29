"use strict";

var scrollback = document.getElementById("scrollback");
var audioControl = document.getElementById("audiocontrol");
var input = document.getElementById("expression");
var currentExpr = window.location.hash ? [8000, window.location.hash.substr(1)] : null;

function addLine(text) {
  var div = document.createElement("div");
  div.className = "output";
  div.innerHTML = text || " ";
  scrollback.appendChild(div);
}

function showHelp() {
  addLine();
  addLine("Enter a valid mathematical expression using basic arithmetic operators " +
          "(+, -, *, /, %), bitwise operators (&, |, ^, <<, >>), parentheses and " +
          "variable 't' (which monotonically increases automatically). The " +
          "resulting generator of 8-bit values will be reconstructed as an " +
          "audio stream.");
  addLine();
  addLine("For example:");
  addLine("  (t>>6|t|t>>(t>>16))*10+((t>>11)&7)");
  addLine("  (t%(t/(t>>9|t>>13)))");
  addLine("  (t*(t>>5|t>>8))>>(t>>16)");
  addLine();
  addLine("See also:");
  addLine(" * <a target=\"_blank\" href=\"https://github.com/rm-hull/8-bit-trip\">https://github.com/rm-hull/8-bit-trip</a>");
  addLine(" * <a target=\"_blank\" href=\"https://www.youtube.com/watch?v=GtQdIYUtAHg\">https://www.youtube.com/watch?v=GtQdIYUtAHg</a>");
  addLine(" * <a target=\"_blank\" href=\"http://wurstcaptures.untergrund.net/music/\">http://wurstcaptures.untergrund.net/music/</a>");
  addLine();
}

function showCommands() {
  addLine();
  addLine(" help     - show some basic help");
  addLine(" clear    - clear the screen");
  addLine(" commands - list all the commands available");
  addLine(" random   - pick a random expression, and play it");
  addLine(" play     - plays a previously paused/stopped audio stream");
  addLine(" pause    - pause a running audio stream");
  addLine(" stop     - stop a running audio stream (also cancels network download)");
  addLine(" restart  - reload and restart the current audio stream");
  addLine(" exit     - quit the system");
  addLine();
}

function clearScrollback() {
  var children = scrollback.childNodes;
  for (var i = 0, n = children.length; i < n; i++) {
    scrollback.removeChild(children[0]);
  }
}

function validate(s) {
  if (/^[0-9\+\-\/\*\%\&\|\^\<\>etvxy\=\?\:\(\)\[\]\" ]+$/.test(s)) {
    var t = 0;
    var v = 0;
    var x = 0;
    var y = 0
    var res = eval(s);
    return s;
  }
  throw new Error("Invalid expression: " + s);
}

function play(expr) {
  try {

    if (expr) {
      validate(expr[1]);
      currentExpr = expr;
      audioControl.pause();
      audioControl.src = expr[0] + "/" + encodeURIComponent(expr[1]);
    }
    audioControl.play();

  } catch(e) {
    addLine("<span class=\"error\">" + e.message + "</span>");
  }
}

function stop() {
  audioControl.pause();
  audioControl.src = "";
}

function pause() {
  audioControl.pause();
}

function restart(n) {
  stop();
  play(currentExpr);
}

function random() {
  var choices = [
    // attribution: see youtube vids from viznut
    [8000, "(t>>6|t|t>>(t>>16))*10+((t>>11)&7)"],
    [8000, "(t%(t/(t>>9|t>>13)))"],
    [8000, "(t*(t>>5|t>>8))>>(t>>16)"],
    [8000, "t*((t>>9|t>>13)&25&t>>6)"],
    [8000, "t*(t>>11&t>>8&123&t>>3)"],
    [8000, "(t*(t>>8*(t>>15|t>>8)&(20|(t>>19)*5>>t|t>>3)))"],
    [8000, "((-t&4095)*(255&t*(t&t>>13))>>12)+(127&t*(234&t>>8&t>>3)>>(3&t>>14))"],
    [8000, "t*(t>>((t>>9|t>>8))&63&t>>4)"],
    [8000, "(t|(t>>9|t>>7))*t&(t>>11|t>>9)"],
    [8000, "t*t&(t>>7)|t*3&(t*4>>10)"],
    [8000, "(t>>7|t|t>>6)*10+4*(t&t>>13|t>>6)"],
    [8000, "((t&4096)?((t*(t^t%255)|(t>>4))>>1):(t>>3)|((t&8192)?t<<2:t))"],
    [8000, "((t*(t>>8|t>>9)&46&t>>8))^(t&t>>13|t>>6)"],
    [8000, "v=(v>>1)+(v>>4)+t*(((t>>16)|(t>>6))&(69&(t>>9)))"],
    [8000, "t*((t>>3|t>>9)&82&t>>9)"],
    [8000, "(t*t*t)>>t"],
    [8000, "t*((t+13217)/1211)&(t>>2|t>>4|t>>6)/512"],
    [8000, "((1-(((t+10)>>((t>>9)&15))&2))*2)*((((t)>>10)^((t+20)>>10))&1)*32+(((t&4095)-2047)*((t/((t>>10&3)+1))&((t>>10&7)+5))+(t>>(((t>>12)+16)&25)&1)*t%512*(t%256-128)/2)/1024+128"],
    [8000, "((1-(((t+10)>>((t>>9)&((t>>14))))&(t>>4&-2)))*2)*(((t>>10)^((t+((t>>6)&127))>>10))&1)*32+128"],
    [8000, "16 * t*t* (t >>11)/7"],
    [8000, "t>>6^t&37|t+(t^t>>11) -t*((t%24?2:6)&t>>11)^t<<1 &(t&598?t>>4:t>>10)"],
    [8000, "(t<65536)?((2*t*(t>>11)&(t-1)|(t>>4)-1)%64):(((t%98304)>65536)?((17*t*(2*t>>8)&(t-1)|(t>>6)-1)%64|(t>>4)):((15*t*(2*t>>16)&(t-1)|(t>>8)-1)%64|(t>>4)))"],
    [8000, "(t/10000000*t*t+t)%127|t>>3"],
    [8000, "(t|t>>5)&(t|t>>13)-(t|t>>21)"],
    [8000, "(t/((t>>16|t>>8))&((t>>5|t>>11)))-1|t*((t>>16|t>>8))"],
    [8000, "(t&t%255)-(t*3&t>>13&t>>6)"],
    [8000, "t>>4|t&(t>>5)/(t>>7-(t>>15)&-t>>7-(t>>15))"],
    [44100, "((t*(\"36364689\"[t>>13&7]&15))/12&128)+(((((t>>12)^(t>>12)-2)%11*t)/4|t>>13)&127)"],
    [8000, "(t*9&t>>4|t*5&t>>7|t*3&t/1024)-1"],
    [8000, "t*(t^t+(t>>15|1)^(t-1280^t)>>10)"],
    [32000, "(3e3/(y=t&16383)&1)*35+(x=t*\"6689\"[t>>16&3]/24&127)*y/4e4+((t>>8^t>>10|t>>14|x)&63)"]
  ];
  var n = Math.floor(Math.random() * choices.length);
  var expr = choices[n];
  addLine("Playing: " + expr[1]);
  play(expr);
}

document.onclick = function(evt) {
  document.execCommand('copy');
  input.focus();
};

input.focus();
input.onkeypress = function(evt) {

  if (evt.which === 13) {
    addLine("$ " + input.value);

    switch (input.value.toLowerCase().trim()) {
      case "commands":
        showCommands();
        break;

      case "help":
        showHelp();
        break;

      case "clear":
        clearScrollback();
        break;

      case "restart":
        restart();
        break;

      case "play":
        play(currentExpr);
        break;

      case "pause":
        pause();
        break;

      case "stop":
        stop();
        break;

      case "random":
        random();
        break;

      case "exit":
        window.location.href = "https://google.com";
        break;

      default:
        stop();
        play([8000, input.value]);
        break;
    }

    input.value = "";
    input.scrollIntoView({behaviour: "instant", block: "end"});
  }
};

if (currentExpr) {
  addLine("Auto-playing: " + currentExpr[1]);
  play(currentExpr);
}
