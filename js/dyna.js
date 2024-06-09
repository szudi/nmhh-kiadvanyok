const footnotes = document.querySelectorAll("a[href*=pub-fn]");

footnotes.forEach((footnote) => {
  footnote.addEventListener("click", () => {
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
