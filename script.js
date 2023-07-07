var acc = document.getElementsByClassName("accordion");
var i;
var currentlyOpen = null;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    if (currentlyOpen && currentlyOpen !== this) {
      currentlyOpen.classList.remove("active");
      currentlyOpen.nextElementSibling.style.maxHeight = null;
    }

    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }

    currentlyOpen = this.classList.contains("active") ? this : null;
  });
}
