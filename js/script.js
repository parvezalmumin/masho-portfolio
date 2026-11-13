var menuToggle = document.getElementById("menuToggle");
var navLinks = document.getElementById("navLinks");
var navItems = document.querySelectorAll(".nav-links a");

menuToggle.addEventListener("click", function () {
    var isOpen = navLinks.classList.toggle("show");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navItems.forEach(function (item) {
    item.addEventListener("click", function () {
        navItems.forEach(function (link) {
            link.classList.remove("active");
        });
        item.classList.add("active");
        navLinks.classList.remove("show");
        menuToggle.setAttribute("aria-expanded", "false");
    });
});

var sections = document.querySelectorAll("main section[id]");

window.addEventListener("scroll", function () {
    var currentSection = "";

    sections.forEach(function (section) {
        var sectionTop = section.offsetTop - 150;
        var sectionBottom = sectionTop + section.offsetHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
            currentSection = section.getAttribute("id");
        }
    });

    navItems.forEach(function (item) {
        item.classList.toggle("active", item.getAttribute("href") === "#" + currentSection);
    });
});

var themeButtons = document.querySelectorAll(".theme-btn");
var themeNames = ["dark", "light", "purple", "green", "red"];

function setTheme(name) {
    document.documentElement.setAttribute("data-theme", name);

    themeButtons.forEach(function (button) {
        var isOn = button.getAttribute("data-theme") === name;
        button.classList.toggle("active", isOn);
        button.setAttribute("aria-pressed", String(isOn));
    });

    try {
        localStorage.setItem("masho-theme", name);
    } catch (error) {}
}

themeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        setTheme(button.getAttribute("data-theme"));
    });
});

var savedTheme = "dark";

try {
    savedTheme = localStorage.getItem("masho-theme") || "dark";
} catch (error) {}

if (themeNames.indexOf(savedTheme) === -1) {
    savedTheme = "dark";
}

setTheme(savedTheme);

var fallbackImages = document.querySelectorAll("img[data-fallback]");

function handleMissingImage(image) {
    image.style.display = "none";

    if (image.getAttribute("data-fallback") === "photo") {
        document.getElementById("photoFrame").classList.add("no-photo");
    }
}

fallbackImages.forEach(function (image) {
    if (image.complete && image.naturalWidth === 0) {
        handleMissingImage(image);
    }

    image.addEventListener("error", function () {
        handleMissingImage(image);
    });
});

var scrollProgress = document.getElementById("scrollProgress");
var toTop = document.getElementById("toTop");

function updateScrollUi() {
    var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    var ratio = maxScroll > 0 ? window.scrollY / maxScroll : 0;

    scrollProgress.style.transform = "scaleX(" + ratio + ")";
    toTop.classList.toggle("show", window.scrollY > 600);
}

window.addEventListener("scroll", updateScrollUi);
window.addEventListener("resize", updateScrollUi);
updateScrollUi();

document.addEventListener("click", function (event) {
    var clickedInsideNav = event.target.closest(".navbar");

    if (!clickedInsideNav && navLinks.classList.contains("show")) {
        navLinks.classList.remove("show");
        menuToggle.setAttribute("aria-expanded", "false");
    }
});

var revealTargets = document.querySelectorAll(
    ".section-heading, .about-main, .detail-card, .identity-card, .skill-card, .learning-note, .project-card, .edu-card, .cert-card, .creative-content, .creative-box, .creative-interests div, .social-card, .collab-card, .contact-links"
);
var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && !reduceMotion) {
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var element = entry.target;
                element.classList.add("in-view");
                observer.unobserve(element);

                setTimeout(function () {
                    element.classList.remove("reveal");
                    element.classList.remove("in-view");
                }, 800);
            }
        });
    }, { threshold: 0.12 });

    revealTargets.forEach(function (element) {
        element.classList.add("reveal");
        observer.observe(element);
    });
}
