"use strict";

var scrollback = document.getElementById("scrollback");
var expr = document.getElementById("expression");

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
  addLine();
  addLine("See also:");
  addLine(" * <a target=\"_blank\" href=\"https://github.com/rm-hull/8-bit-trip\">https://github.com/rm-hull/8-bit-trip</a>");
  addLine(" * <a target=\"_blank\" href=\"https://www.youtube.com/watch?v=GtQdIYUtAHg\">https://www.youtube.com/watch?v=GtQdIYUtAHg</a>");
  addLine(" * <a target=\"_blank\" href=\"http://wurstcaptures.untergrund.net/music/\">http://wurstcaptures.untergrund.net/music/</a>");
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
  expr.focus();
};

expr.focus();
expr.onkeypress = function(evt) {

  if (evt.charCode === 13) {
    addLine("$ " + expr.value);

    switch (expr.value) {
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

    expr.value = "";
    expr.scrollIntoView({behaviour: "instant", block: "end"});
  }
};
