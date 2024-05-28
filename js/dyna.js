const q = document.getElementById("q");
const q2 = document.getElementById("q2");

function fillq() {
  q.innerHTML = '';
  addchars((Math.max(screen.width,screen.height)/20)*10);
}
function addchars(n) {
  w = 0;
  while (w < n) {
    q.innerHTML += String.fromCodePoint(9585 + Math.round(Math.random()));
    w++;
  }
}
function removechars(n) {
    q.innerHTML = q.innerHTML.substring(n);
}

scr = 0;
function scroll() {
  q.style.marginLeft = scr+'px';
  scr-=1;
  if(scr<-19){
    scr=0;
    q.style.marginLeft = '0';
    addchars(1);
    removechars(1);
  }
  setTimeout(() => {
    window.requestAnimationFrame(scroll);
  }, 30);
}

//q2:
w = 0;
  while (w < 64) {
    q2.innerHTML += String.fromCodePoint(9585 + Math.round(Math.random()));
    w++;
  }

fillq();
scroll();

window.onresize = fillq;