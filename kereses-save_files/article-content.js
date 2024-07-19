// JavaScript Document
var ToC =
  "<nav role='navigation' class='table-of-contents'>" +
    "<h2>Tartalomjegyzék</h2>" +
    "<ul>";

var newLine, el, title, link;

$(".cikk-tartalomjegyzekkel h2").each(function() {

  el = $(this);
  title = el.text();
  link = "#" + el.attr("id");

  newLine =
    "<li>" +
      "<a href='" + link + "'>" +
        title +
      "</a>" +
    "</li>";

  ToC += newLine;

});

ToC +=
   "</ul>" +
  "</nav>";

$(".cikk-tartalomjegyzekkel").prepend(ToC);

