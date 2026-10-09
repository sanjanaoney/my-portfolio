// ===== 1. Telling CSS that JavaScript is running =====
document.body.classList.add("js");

// ===== 2. Click a poster or video to see it bigger =====
var lightbox = document.getElementById("lightbox");
var lightboxImg = document.getElementById("lightboxImg");
var lightboxVideo = document.getElementById("lightboxVideo");
var posters = document.querySelectorAll("#media .card img, #digital .card img, .video-thumb img");

for (var p = 0; p < posters.length; p++) {
  // skip pictures that are inside a link (like the Facebook one)
  if (posters[p].parentElement.tagName === "A") {
    continue;
  }
  posters[p].addEventListener("click", function () {
    var videoFile = this.getAttribute("data-video");

    if (videoFile) {
      // this picture is a video cover: show the video
      lightboxImg.style.display = "none";
      lightboxVideo.style.display = "block";
      lightboxVideo.src = videoFile;
      lightboxVideo.play();
    } else {
      // normal poster: show the picture
      lightboxVideo.style.display = "none";
      lightboxImg.style.display = "block";
      lightboxImg.src = this.src;
    }
    lightbox.classList.add("open");
  });
}

// clicking the video itself should not close the pop-up (so play/pause works)
lightboxVideo.addEventListener("click", function (event) {
  event.stopPropagation();
});

// clicking the dark area closes it and stops the video
lightbox.addEventListener("click", function () {
  lightbox.classList.remove("open");
  lightboxVideo.pause();
});


// ===== 3. Sections fade in when you scroll to them =====
var revealItems = document.querySelectorAll(".reveal");
var observer = new IntersectionObserver(function (entries) {
  for (var i = 0; i < entries.length; i++) {
    if (entries[i].isIntersecting) {
      entries[i].target.classList.add("show");
    }
  }
}, { threshold: 0.1 });

for (var i = 0; i < revealItems.length; i++) {
  observer.observe(revealItems[i]);
}

// ===== 4. Contact form (sends the message with Formspree) =====
var form = document.getElementById("contactForm");
var formMessage = document.getElementById("formMessage");

form.addEventListener("submit", function (event) {
  event.preventDefault();   // stop the page from reloading

  if (form.action.indexOf("YOUR_FORM_ID") !== -1) {
    formMessage.textContent = "The form is not connected yet. Add your Formspree ID in index.html.";
    return;
  }

  fetch(form.action, {
    method: "POST",
    body: new FormData(form),
    headers: { Accept: "application/json" }
  })
    .then(function (response) {
      if (response.ok) {
        formMessage.textContent = "Thank you! Your message was sent.";
        form.reset();
      } else {
        formMessage.textContent = "Sorry, something went wrong. Please try again.";
      }
    })
    .catch(function () {
      formMessage.textContent = "Sorry, no internet or server problem. Please try again.";
    });
});


// ===== 5. Skills accordion =====
var accItems = document.querySelectorAll(".acc-item");

for (var k = 0; k < accItems.length; k++) {
  // fill the number badge with how many skills are inside
  var howMany = accItems[k].querySelectorAll(".chip").length;
  accItems[k].querySelector(".acc-count").textContent = howMany;

  // click on the bar: open it (and close the others)
  accItems[k].querySelector(".acc-head").addEventListener("click", function () {
    var item = this.parentElement;
    var wasOpen = item.classList.contains("open");

    for (var j = 0; j < accItems.length; j++) {
      accItems[j].classList.remove("open");
    }
    if (!wasOpen) {
      item.classList.add("open");   // clicking an open one just closes it
    }
  });
}

// ===== 6. Progress bar and active nav link =====
var progress = document.getElementById("progress");
var navLinks = document.querySelectorAll("nav a");

function updateScroll() {
  // --- progress bar ---
  var scrolled = window.scrollY;
  var total = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (scrolled / total * 100) + "%";

  // --- which section are we in? ---
  var current = "";
  for (var n = 0; n < navLinks.length; n++) {
    var id = navLinks[n].getAttribute("href");   // for example "#about"
    var section = document.querySelector(id);
    if (section && section.getBoundingClientRect().top <= 120) {
      current = id;   // this section has reached the top, so remember it
    }
  }

  // when we reach the very bottom, the last section is Contact
  if (scrolled >= total - 5) {
    current = "#contact";
  }

  // light up the matching nav link
  for (var m = 0; m < navLinks.length; m++) {
    navLinks[m].classList.remove("active");
    if (navLinks[m].getAttribute("href") === current) {
      navLinks[m].classList.add("active");
    }
  }
}

window.addEventListener("scroll", updateScroll);
updateScroll();   // run once when the page opens