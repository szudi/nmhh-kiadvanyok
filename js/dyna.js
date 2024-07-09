//LÁBJEGYZETEK

const footnotes = document.querySelectorAll("a[href*=pub-fn]");

footnotes.forEach((footnote) => {
  footnote.addEventListener("click", (event) => {
    if (event.target.nextSibling.className == "publication-footnoote") {
      event.target.nextSibling.remove();
    } else {
      const content = document.querySelector(event.target.getAttribute("href")).innerHTML;
      const template = document.querySelector("#publication-footnote-template");
      const clone = template.content.cloneNode(true);
      clone.querySelector(".content").innerHTML = content;
      event.target.after(clone);
      event.target.nextSibling.querySelector(".close").addEventListener("click", () => {
          event.target.closest(".publication-footnoote").remove();
          event.preventDefault();
        });
    }
    event.preventDefault();
  });
});


//OVERLAYING KÉPEK
function imgMinHeight() {
  const overlayedHeaders = document.querySelectorAll(".publication-article-header.over");
  overlayedHeaders.forEach((header) => {
    const textheight = header.querySelector(".text").offsetHeight;
    header.querySelector("img").style.minHeight = textheight + 80 + "px";
  });
}

imgMinHeight();
window.addEventListener("resize", imgMinHeight);


//Menü float on scroll
const pager = document.getElementById("pager");
const main = document.getElementById("main");
const topnav = document.getElementById("publication-top-navigation");

let tick = false;

document.addEventListener("scroll", (event) => {

  if (!tick) {
    window.requestAnimationFrame(() => {
      
      if(topnav.getBoundingClientRect().bottom < 0) {
      topnav.style.paddingBottom =  pager.offsetHeight + "px";
      pager.classList.add("float");
      } else {

        
      topnav.removeAttribute("style");
      pager.classList.remove("float");
        
      }


      if(main.getBoundingClientRect().bottom < window.innerHeight) {
        pager.classList.add("bottom");
       } else {
        pager.classList.remove("bottom");
       }

      tick = false;
    });

    tick = true;
  }
});




const tocDialog = document.getElementById("toc-container");
const tocCloser = document.getElementById("close-toc");
const tocOpeners = document.querySelectorAll(".toc");


tocDialog.addEventListener("click", (event) => {
 if (event.target === tocDialog) {  
    tocDialog.close();
  }
});

tocCloser.addEventListener("click", (event) => {
  tocDialog.close();
  event.preventDefault();
});

tocOpeners.forEach((tocOpener) => {
  tocOpener.addEventListener("click", (event) => {
    tocDialog.showModal();
    event.preventDefault();
  });
});
