export function navButton() {
  if (document.querySelector('.navigation__menu-btn')) {
    const navBtn = document.querySelector('.navigation__menu-btn');
    const navItems = document.querySelector('.navigation__nav-items');

    navBtn.addEventListener('click', function () {
      navItems.classList.toggle('navigation__show');
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const scrollToTopBtn = document.getElementById("scrollToTop");
  
  // Only add scroll-to-top functionality if the button exists on the page
  if (scrollToTopBtn) {
    let ticking = false;
    
    // Use requestAnimationFrame for smooth scroll performance
    window.addEventListener("scroll", function () {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.scrollY > 300) {
            scrollToTopBtn.classList.add("show");
          } else {
            scrollToTopBtn.classList.remove("show");
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    scrollToTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
