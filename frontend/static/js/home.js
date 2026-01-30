/* ============================================
   FASHNEX Homepage JavaScript
   Handles: Sliders, Carousels, Dynamic Content Rendering
   ============================================ */

// ============================================
// API
// ============================================
const API_BASE = "http://127.0.0.1:8000";
const HOME_ENDPOINT = `${API_BASE}/api/home/`;

// ============================================
// Mock Data (ONLY categories stays mock for now)
// ============================================
const mockData = {
  categories: [
    {
      id: 1,
      namePersian: "زنانه",
      nameEnglish: "WOMEN'S CLOTHING",
      image: "/static/images/categories/weman.png",
    },
    {
      id: 2,
      namePersian: "مردانه",
      nameEnglish: "MEN'S CLOTHING",
      image: "/static/images/categories/men.jpg",
    },
    {
      id: 3,
      namePersian: "کودک",
      nameEnglish: "KIDS CLOTHING",
      image: "/static/images/categories/kids.png",
    },
  ],
};

// ============================================
// Utility Functions
// ============================================

/**
 * Format number to Persian currency format (تومان)
 */
function formatPrice(price) {
  const n = Number(price);
  if (!Number.isFinite(n)) return "";
  return new Intl.NumberFormat("fa-IR").format(n) + " تومان";
}

/**
 * Detect if a string looks like an image URL/path.
 */
function isImageUrl(value) {
  if (!value || typeof value !== "string") return false;
  const v = value.trim();
  if (!v) return false;
  if (v.startsWith("http://") || v.startsWith("https://")) return true;
  // relative paths to images
  return /\.(png|jpe?g|webp|gif|svg)$/i.test(v) || v.startsWith("/media/") || v.startsWith("/static/") || v.includes("/media/");
}

/**
 * Create a placeholder image div (gradient background)
 */
function createPlaceholderImage(
  gradient = "linear-gradient(135deg, #D2C1B6 0%, #F9F3EF 100%)"
) {
  const img = document.createElement("div");
  img.className = "placeholder-image";
  img.style.background = gradient;
  return img;
}

/**
 * Create a media element: <img> if URL is available, otherwise placeholder div with gradient.
 * Returns HTML string.
 */
function createMediaHTML(srcOrGradient, altText = "") {
  if (isImageUrl(srcOrGradient)) {
    const safeAlt = (altText || "").replaceAll('"', "&quot;");
    return `<img src="${srcOrGradient}" alt="${safeAlt}" class="media-img" loading="lazy" />`;
  }
  // fallback to gradient placeholder (keep your existing look)
  return createPlaceholderImage(
    srcOrGradient ||
      "linear-gradient(135deg, #D2C1B6 0%, #F9F3EF 100%)"
  ).outerHTML;
}

/**
 * Safe set innerHTML
 */
function setHTML(el, html) {
  if (!el) return;
  el.innerHTML = html;
}

/**
 * Fetch home data from backend
 */
async function fetchHomeData() {
  const res = await fetch(HOME_ENDPOINT, { method: "GET" });
  if (!res.ok) {
    throw new Error(`Home API failed: ${res.status}`);
  }
  return await res.json();
}

// ============================================
// Hero Slider Functionality
// ============================================

let currentSlide = 0;
let slideInterval;
let sliderContainer;

function initHeroSlider() {
  sliderContainer = document.querySelector(".slider-container");
  const dots = document.querySelectorAll(".slider-dots .dot");
  const slides = document.querySelectorAll(".slide");
  const totalSlides = slides.length;

  function updateActiveDot() {
    if (!sliderContainer || !slides.length) return;
    const containerWidth = sliderContainer.offsetWidth;

    let currentIndex = 0;
    let minDistance = Infinity;

    slides.forEach((slide, index) => {
      const slideLeft = slide.offsetLeft - sliderContainer.scrollLeft;
      const slideCenter = slideLeft + slide.offsetWidth / 2;
      const containerCenter = containerWidth / 2;
      const distance = Math.abs(slideCenter - containerCenter);

      if (distance < minDistance) {
        minDistance = distance;
        currentIndex = index;
      }
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });
    currentSlide = currentIndex;
  }

  function startAutoPlay() {
    slideInterval = setInterval(() => {
      if (!sliderContainer || !slides.length) return;
      currentSlide = (currentSlide + 1) % totalSlides;
      const targetSlide = slides[currentSlide];
      if (targetSlide && sliderContainer) {
        sliderContainer.scrollTo({
          left: targetSlide.offsetLeft,
          behavior: "smooth",
        });
      }
    }, 5000);
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      if (!sliderContainer || !slides.length) return;
      currentSlide = index;
      const targetSlide = slides[index];
      if (targetSlide && sliderContainer) {
        sliderContainer.scrollTo({
          left: targetSlide.offsetLeft,
          behavior: "smooth",
        });
      }
      clearInterval(slideInterval);
      startAutoPlay();
    });
  });

  if (sliderContainer) {
    sliderContainer.addEventListener("scroll", () => {
      clearInterval(slideInterval);
      updateActiveDot();
      startAutoPlay();
    });
  }

  updateActiveDot();
  startAutoPlay();
}

// ============================================
// Render Categories (still mock)
// ============================================

function renderCategories() {
  const container = document.getElementById("categoriesContainer");
  if (!container) return;

  mockData.categories.forEach((category) => {
    const card = document.createElement("div");
    card.className = "category-card";
    card.innerHTML = `
      <div class="category-image" style="${
        category.image?.startsWith('/static/')
            ? `background-image:url('${category.image}'); background-size:cover; background-position:center;`
            : `background:${category.image};`
      }"></div>
    `;
    container.appendChild(card);
  });
}

// ============================================
// Render Products Carousel (from API best_sellers)
// ============================================

function renderProducts(products) {
  const container = document.getElementById("productsCarousel");
  if (!container) return;

  setHTML(
    container,
    (products || [])
      .map(
        (product) => `
        <div class="product-card">
          <div class="product-image-wrapper">
            ${createMediaHTML(product.image_url, product.title)}
            <button class="product-favorite" aria-label="افزودن به علاقه‌مندی‌ها">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>
          <div class="product-info">
            <div class="product-name">${product.title ?? ""}</div>
            <div class="product-price">${formatPrice(product.price)}</div>
          </div>
        </div>
      `
      )
      .join("")
  );

  container.querySelectorAll(".product-favorite").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      btn.classList.toggle("active");
    });
  });
}

// ============================================
// Render Styles Carousel (from API styles)
// ============================================

function renderStyles(styles) {
  const container = document.getElementById("stylesCarousel");
  if (!container) return;

  setHTML(
    container,
    (styles || [])
      .map(
        (style) => `
        <div class="style-card">
          <div class="product-image-wrapper">
            ${createMediaHTML(style.image_url, style.title)}
            <button class="product-favorite" aria-label="افزودن به علاقه‌مندی‌ها">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>
          <div class="style-info">
            <div class="style-name">${style.title ?? ""}</div>
            <div class="style-description">${style.description ?? ""}</div>
            <div class="style-price">${formatPrice(style.price)}</div>
          </div>
        </div>
      `
      )
      .join("")
  );

  container.querySelectorAll(".product-favorite").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      btn.classList.toggle("active");
    });
  });
}

// ============================================
// Render Sellers Carousel (from API vendors)
// ============================================

function renderSellers(vendors) {
  const container = document.getElementById("sellersCarousel");
  if (!container) return;

  setHTML(
    container,
    (vendors || [])
      .map(
        (seller) => `
        <div class="seller-card">
          <div class="seller-image ${seller.logo_url ? "has-img" : ""}">
            ${
              seller.logo_url
                ? `<img src="${seller.logo_url}" alt="${seller.name ?? ""}" class="seller-img" loading="lazy">`
                : ""
            }
          </div>
          <div class="seller-info">
            <div class="seller-name">${seller.name ?? ""}</div>
            <div class="seller-rating">
              <span>⭐</span>
              <span>${seller.rating ?? ""}</span>
            </div>
            <div class="seller-satisfaction">${seller.satisfaction_percent ?? ""}% رضایت از کالا</div>
          </div>
        </div>
      `
      )
      .join("")
  );
}

// ============================================
// Carousel Navigation Functions (FINAL RTL-FIXED VERSION)
// ============================================

function initCarousel(carouselId, prevBtnId, nextBtnId) {
  const carousel = document.getElementById(carouselId);
  const prevBtn = document.getElementById(prevBtnId);
  const nextBtn = document.getElementById(nextBtnId);

  if (!carousel || !prevBtn || !nextBtn) {
    console.warn(`Carousel initialization failed for: ${carouselId}`);
    return;
  }

  // A helper to check if an element is RTL.
  const isRTL = getComputedStyle(carousel).direction === 'rtl';

  const scrollCarousel = (direction) => {
    const firstCard = carousel.querySelector('div[class*="-card"]');
    if (!firstCard) return;

    // The distance to scroll is one card's width plus the gap.
    const scrollAmount = firstCard.offsetWidth + 16;
    
    // In RTL, the scroll direction is inverted.
    const scrollDirection = isRTL ? -direction : direction;

    carousel.scrollBy({
      left: scrollAmount * scrollDirection,
      behavior: "smooth",
    });
  };

  prevBtn.addEventListener("click", () => {
    scrollCarousel(-1); // Scroll "back"
  });

  nextBtn.addEventListener("click", () => {
    scrollCarousel(1); // Scroll "forward"
  });

  const updateNavButtons = () => {
    // A small tolerance for floating point inaccuracies.
    const tolerance = 10;
    
    let isAtStart, isAtEnd;

    if (isRTL) {
      // In RTL (for modern browsers like Chrome/Firefox):
      // Start (right edge) is scrollLeft near 0.
      // End (left edge) is scrollLeft near -(scrollWidth - clientWidth).
      isAtStart = Math.abs(carousel.scrollLeft) < tolerance;
      isAtEnd = Math.abs(carousel.scrollLeft + (carousel.scrollWidth - carousel.clientWidth)) < tolerance;
    } else {
      // In LTR:
      // Start (left edge) is scrollLeft near 0.
      // End (right edge) is scrollLeft near (scrollWidth - clientWidth).
      isAtStart = carousel.scrollLeft < tolerance;
      isAtEnd = Math.abs(carousel.scrollWidth - carousel.clientWidth - carousel.scrollLeft) < tolerance;
    }
    
    // Disable buttons and change opacity based on position.
    prevBtn.disabled = isAtStart;
    nextBtn.disabled = isAtEnd;
    prevBtn.style.opacity = isAtStart ? "0.3" : "1";
    nextBtn.style.opacity = isAtEnd ? "0.3" : "1";
  };
  
  // Use a single, reliable MutationObserver to wait for cards to be added.
  const observer = new MutationObserver((mutations) => {
    // We only need to run this once after the first batch of cards is added.
    if (mutations.some(m => m.addedNodes.length > 0)) {
        updateNavButtons();
        // Optional: you could disconnect the observer if content doesn't change later.
        // observer.disconnect();
    }
  });

  observer.observe(carousel, { childList: true });

  // Add listeners for user interaction and window resizing.
  carousel.addEventListener("scroll", updateNavButtons);
  window.addEventListener("resize", updateNavButtons);
  
  // Initial check in case content is already there (less likely with async data).
  updateNavButtons();
}


// ============================================
// Support Form Handler
// ============================================

function initSupportForm() {
  const form = document.querySelector(".support-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = form.querySelector(".support-email-input").value;
    if (email) {
      alert("ایمیل شما با موفقیت ثبت شد!");
      form.reset();
    }
  });
}

// ============================================
// Search Functionality
// ============================================

function initSearch() {
  const searchBtn = document.querySelector(".search-btn");
  const searchInput = document.querySelector(".search-input");

  if (!searchBtn || !searchInput) return;

  const handleSearch = () => {
    const query = searchInput.value.trim();
    if (query) {
      console.log("جستجو برای:", query);
      alert(`در حال جستجو برای: ${query}`);
    }
  };

  searchBtn.addEventListener("click", handleSearch);
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSearch();
  });
}

// ============================================
// Initialize Everything on DOM Load (FIXED VERSION)
// ============================================

document.addEventListener("DOMContentLoaded", async () => {
  // Render static/mock content first
  renderCategories();
  
  // Initialize features that don't depend on API data
  initHeroSlider();
  initSupportForm();
  initSearch();

  // Fetch + render backend data
  try {
    console.log("Fetching home data from API...");
    const data = await fetchHomeData();
    console.log("HOME API DATA:", data);

    // --- RENDER CONTENT AND THEN INITIALIZE CAROUSEL FOR EACH SECTION ---

    // 1. Render Products and THEN initialize its carousel
    renderProducts(data.best_sellers || []);
    initCarousel("productsCarousel", "productsPrev", "productsNext");

    // 2. Render Styles and THEN initialize its carousel
    renderStyles(data.styles || []);
    initCarousel("stylesCarousel", "stylesPrev", "stylesNext");

    // 3. Render Sellers and THEN initialize its carousel
    renderSellers(data.vendors || []);
    initCarousel("sellersCarousel", "sellersPrev", "sellersNext");

    console.log("FASHNEX homepage initialized successfully (API)!");
  } catch (err) {
    console.error("Failed to load homepage data:", err);
    // In case of an error, you might want to render empty states
    renderProducts([]);
    renderStyles([]);
    renderSellers([]);
  }
});
