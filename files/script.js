gsap.registerPlugin(ScrollTrigger);

// Page Loader Animation
gsap.to("#loader", {
  opacity: 0,
  duration: 1,
  delay: 1.5,
  onComplete: () => {
    document.getElementById("loader").style.display = "none";
  }
});

// Initialize Lenis
const lenis = new Lenis({ duration: 1.2, smooth: true });
function raf(time) {
  lenis.raf(time);
  ScrollTrigger.update();
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Hero Text Reveal
gsap.from(".hero-text span", {
  y: 100,
  opacity: 0,
  duration: 1.5,
  ease: "power4.out",
  delay: 2
});

// ScrollTrigger Reveal
gsap.from(".content-section p", {
  scrollTrigger: {
    trigger: ".content-section p",
    start: "top 85%",
    toggleActions: "play none none none"
  },
  x: 100,
  opacity: 0,
  duration: 1.2,
  ease: "power2.out"
});

// Magnetic Button Effect
const magneticBtn = document.querySelector(".magnetic-btn");
magneticBtn.addEventListener("mousemove", (e) => {
  const rect = magneticBtn.getBoundingClientRect();
  const offsetX = e.clientX - rect.left - rect.width / 2;
  const offsetY = e.clientY - rect.top - rect.height / 2;
  magneticBtn.style.transform = `translate(${offsetX * 0.3}px, ${offsetY * 0.3}px) scale(1.05)`;
});
magneticBtn.addEventListener("mouseleave", () => {
  magneticBtn.style.transform = `translate(0, 0) scale(1)`;
});
