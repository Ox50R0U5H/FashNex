/* ============================================
   FASHNEX Homepage JavaScript
   Handles: Sliders, Carousels, Dynamic Content Rendering
   ============================================ */

// ============================================
// Mock Data
// ============================================

const mockData = {
    categories: [
        {
            id: 1,
            namePersian: "زنانه",
            nameEnglish: "WOMEN'S CLOTHING",
            image: "linear-gradient(135deg, #D2C1B6 0%, #F9F3EF 100%)"
        },
        {
            id: 2,
            namePersian: "مردانه",
            nameEnglish: "MEN'S CLOTHING",
            image: "linear-gradient(135deg, #1B3C53 0%, #456882 100%)"
        },
        {
            id: 3,
            namePersian: "کودک",
            nameEnglish: "KIDS CLOTHING",
            image: "linear-gradient(135deg, #D2C1B6 0%, #456882 100%)"
        }
    ],
    products: [
        {
            id: 1,
            name: "ترنچ کت نیلیا",
            price: 799000,
            image: "linear-gradient(135deg, #D2C1B6 0%, #F9F3EF 100%)"
        },
        {
            id: 2,
            name: "هودی ایلیا",
            price: 690000,
            image: "linear-gradient(135deg, #456882 0%, #1B3C53 100%)"
        },
        {
            id: 3,
            name: "تیشرت بچگانه",
            price: 350000,
            image: "linear-gradient(135deg, #D2C1B6 0%, #456882 100%)"
        },
        {
            id: 4,
            name: "کاپشن زمستانی",
            price: 1200000,
            image: "linear-gradient(135deg, #1B3C53 0%, #456882 100%)"
        },
        {
            id: 5,
            name: "شلوار جین",
            price: 450000,
            image: "linear-gradient(135deg, #D2C1B6 0%, #F9F3EF 100%)"
        },
        {
            id: 6,
            name: "کت و شلوار مجلسی",
            price: 2500000,
            image: "linear-gradient(135deg, #456882 0%, #1B3C53 100%)"
        }
    ],
    styles: [
        {
            id: 1,
            name: "استایل روزانه زنانه",
            description: "(شامل : کت ، شلوار ، کیف ، شال)",
            price: 2000000,
            image: "../../static/images/styles/dailyWemanStyle.png"
        },
        {
            id: 2,
            name: "استایل زمستانی مردانه",
            description: "(شامل : دورس ، پافر (شلوار))",
            price: 1000000,
            image: "linear-gradient(135deg, #456882 0%, #1B3C53 100%)"
        },
        {
            id: 3,
            name: "استایل زمستانی بچگانه",
            description: "(شامل : ترنج کت ، هودی کلاه)",
            price: 1500000,
            image: "linear-gradient(135deg, #D2C1B6 0%, #456882 100%)"
        },
        {
            id: 4,
            name: "استایل مجلسی زنانه",
            description: "(شامل : لباس مجلسی ، کفش ، کیف)",
            price: 3500000,
            image: "linear-gradient(135deg, #1B3C53 0%, #456882 100%)"
        },
        {
            id: 5,
            name: "استایل ورزشی",
            description: "(شامل : لباس ورزشی ، کفش)",
            price: 800000,
            image: "linear-gradient(135deg, #D2C1B6 0%, #F9F3EF 100%)"
        }
    ],
    sellers: [
        {
            id: 1,
            name: "فروشگاه آرتین",
            rating: 4.4,
            satisfaction: 95,
            image: "../../static/images/sellers/shop-building-vector-icon-illustration.jpg"
        },
        {
            id: 2,
            name: "مزون برجیس",
            rating: 4.4,
            satisfaction: 90,
            image: "../../static/images/sellers/shop-building-vector-icon-illustration.jpg"
        },
        {
            id: 3,
            name: "آرینا کالکشن",
            rating: 4.4,
            satisfaction: 100,
            image: "../../static/images/sellers/shop-building-vector-icon-illustration.jpg"
        },
        {
            id: 4,
            name: "بوتیک سارا",
            rating: 4.6,
            satisfaction: 92,
            image: "../../static/images/sellers/shop-building-vector-icon-illustration.jpg"
        },
        {
            id: 5,
            name: "فشن استایل",
            rating: 4.3,
            satisfaction: 88,
            image: "../../static/images/sellers/shop-building-vector-icon-illustration.jpg"
        }
    ]
};

// ============================================
// Utility Functions
// ============================================

/**
 * Format number to Persian currency format (تومان)
 */
function formatPrice(price) {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
}

/**
 * Create a placeholder image div
 */
function createPlaceholderImage(gradient = "linear-gradient(135deg, #D2C1B6 0%, #F9F3EF 100%)") {
    const img = document.createElement('div');
    img.className = 'placeholder-image';
    img.style.background = gradient;
    return img;
}

// ============================================
// Hero Slider Functionality
// ============================================

let currentSlide = 0;
let slideInterval;
let sliderContainer;

function initHeroSlider() {
    sliderContainer = document.querySelector('.slider-container');
    const track = document.getElementById('sliderTrack');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;

    // Update active dot based on scroll position
    function updateActiveDot() {
        if (!sliderContainer || !slides.length) return;
        const scrollLeft = sliderContainer.scrollLeft;
        const containerWidth = sliderContainer.offsetWidth;
        
        // Calculate which slide is most visible
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
            dot.classList.toggle('active', index === currentIndex);
        });
        currentSlide = currentIndex;
    }

    // Auto-play slider - scrolls automatically
    function startAutoPlay() {
        slideInterval = setInterval(() => {
            if (!sliderContainer || !slides.length) return;
            currentSlide = (currentSlide + 1) % totalSlides;
            const targetSlide = slides[currentSlide];
            if (targetSlide && sliderContainer) {
                sliderContainer.scrollTo({
                    left: targetSlide.offsetLeft,
                    behavior: 'smooth'
                });
            }
        }, 5000); // Change slide every 5 seconds
    }

    // Dot click handlers - scroll to slide
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (!sliderContainer || !slides.length) return;
            currentSlide = index;
            const targetSlide = slides[index];
            if (targetSlide && sliderContainer) {
                sliderContainer.scrollTo({
                    left: targetSlide.offsetLeft,
                    behavior: 'smooth'
                });
            }
            clearInterval(slideInterval);
            startAutoPlay();
        });
    });

    // Update dots on scroll
    if (sliderContainer) {
        sliderContainer.addEventListener('scroll', () => {
            clearInterval(slideInterval);
            updateActiveDot();
            startAutoPlay();
        });
    }

    // Initialize
    updateActiveDot();
    startAutoPlay();
}

// ============================================
// Render Categories
// ============================================

function renderCategories() {
    const container = document.getElementById('categoriesContainer');
    
    mockData.categories.forEach(category => {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.innerHTML = `
            <div class="category-image" style="background: ${category.image};">
                ${category.namePersian}
            </div>
            <div class="category-info">
                <div class="category-title-persian">${category.namePersian}</div>
                <div class="category-title-english">${category.nameEnglish}</div>
            </div>
        `;
        container.appendChild(card);
    });
}

// ============================================
// Render Products Carousel
// ============================================

function renderProducts() {
    const container = document.getElementById('productsCarousel');
    
    mockData.products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image-wrapper">
                ${createPlaceholderImage(product.image).outerHTML}
                <button class="product-favorite" aria-label="افزودن به علاقه‌مندی‌ها">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">${formatPrice(product.price)}</div>
            </div>
        `;
        container.appendChild(card);
    });

    // Favorite button handlers
    container.querySelectorAll('.product-favorite').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            btn.classList.toggle('active');
        });
    });
}

// ============================================
// Render Styles Carousel
// ============================================

function renderStyles() {
    const container = document.getElementById('stylesCarousel');
    
    mockData.styles.forEach(style => {
        const card = document.createElement('div');
        card.className = 'style-card';
        card.innerHTML = `
            <div class="product-image-wrapper">
                ${createPlaceholderImage(style.image).outerHTML}
                <button class="product-favorite" aria-label="افزودن به علاقه‌مندی‌ها">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
            </div>
            <div class="style-info">
                <div class="style-name">${style.name}</div>
                <div class="style-description">${style.description}</div>
                <div class="style-price">${formatPrice(style.price)}</div>
            </div>
        `;
        container.appendChild(card);
    });

    // Favorite button handlers
    container.querySelectorAll('.product-favorite').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            btn.classList.toggle('active');
        });
    });
}

// ============================================
// Render Sellers Carousel
// ============================================

function renderSellers() {
    const container = document.getElementById('sellersCarousel');
    
    mockData.sellers.forEach(seller => {
        const card = document.createElement('div');
        card.className = 'seller-card';
        card.innerHTML = `
            <div class="seller-image ${seller.image ? 'has-img' : ''}">
                ${seller.image ? `<img src="${seller.image}" alt="${seller.name}" class="seller-img">` : ''}
            </div>
            <div class="seller-info">
                <div class="seller-name">${seller.name}</div>
                <div class="seller-rating">
                    <span>⭐</span>
                    <span>${seller.rating}</span>
                </div>
                <div class="seller-satisfaction">${seller.satisfaction}% رضایت از کالا</div>
            </div>
        `;
        container.appendChild(card);
    });
}

// ============================================
// Carousel Navigation Functions
// ============================================

function initCarousel(carouselId, prevBtnId, nextBtnId) {
    const carousel = document.getElementById(carouselId);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);

    if (!carousel || !prevBtn || !nextBtn) return;

    const scrollAmount = 300; // Pixels to scroll

    prevBtn.addEventListener('click', () => {
        carousel.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });

    nextBtn.addEventListener('click', () => {
        carousel.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });

    // Show/hide navigation buttons based on scroll position
    function updateNavButtons() {
        const isAtStart = carousel.scrollLeft <= 10;
        const isAtEnd = carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth - 10;
        
        prevBtn.style.opacity = isAtStart ? '0.5' : '1';
        nextBtn.style.opacity = isAtEnd ? '0.5' : '1';
        
        prevBtn.disabled = isAtStart;
        nextBtn.disabled = isAtEnd;
    }

    carousel.addEventListener('scroll', updateNavButtons);
    updateNavButtons();

    // Also check on resize
    window.addEventListener('resize', updateNavButtons);
}

// ============================================
// Support Form Handler
// ============================================

function initSupportForm() {
    const form = document.querySelector('.support-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('.support-email-input').value;
        if (email) {
            alert('ایمیل شما با موفقیت ثبت شد!');
            form.reset();
        }
    });
}

// ============================================
// Search Functionality
// ============================================

function initSearch() {
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');

    if (!searchBtn || !searchInput) return;

    const handleSearch = () => {
        const query = searchInput.value.trim();
        if (query) {
            console.log('جستجو برای:', query);
            // Here you would implement actual search logic
            alert(`در حال جستجو برای: ${query}`);
        }
    };

    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
}

// ============================================
// Initialize Everything on DOM Load
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Render dynamic content
    renderCategories();
    renderProducts();
    renderStyles();
    renderSellers();

    // Initialize interactive features
    initHeroSlider();
    initCarousel('productsCarousel', 'productsPrev', 'productsNext');
    initCarousel('stylesCarousel', 'stylesPrev', 'stylesNext');
    initCarousel('sellersCarousel', 'sellersPrev', 'sellersNext');
    initSupportForm();
    initSearch();

    console.log('FASHNEX homepage initialized successfully!');
});

