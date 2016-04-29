"use strict";

var scrollback = document.getElementById("scrollback");
var input = document.getElementById("expression");

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
      case "exit":
        window.location.href = "https://google.com";
        break;
      default:
        break;
    }

    input.value = "";
    input.scrollIntoView({behaviour: "instant", block: "end"});
  }
};
