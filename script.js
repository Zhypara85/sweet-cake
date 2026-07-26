/**
 * Sweet Cake Bakery - Main Interactivity Script
 */

// --- Product Catalog Database ---
const PRODUCTS = [
    {
        id: 1,
        title: "Chocolate Truffle Cake",
        category: "cakes",
        price: 34.99,
        desc: "Triple layer rich Belgian chocolate sponge glazed with chocolate ganache and chocolate curls.",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=80",
        badge: "Best Seller"
    },
    {
        id: 2,
        title: "Almond Butter Croissant",
        category: "pastries",
        price: 4.49,
        desc: "Flaky, buttery French pastry filled with sweet almond frangipane cream and toasted sliced almonds.",
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=80",
        badge: "Fresh Daily"
    },
    {
        id: 3,
        title: "Red Velvet Cupcake",
        category: "cupcakes",
        price: 3.99,
        desc: "Fluffy, cocoa-infused crimson cupcake topped with a generous swirl of rich vanilla cream cheese frosting.",
        image: "https://images.unsplash.com/photo-1614707267537-b85acf00c4b8?w=500&auto=format&fit=crop&q=80",
        badge: "Popular"
    },
    {
        id: 4,
        title: "Chunky Chocolate Chip Cookie",
        category: "cookies",
        price: 2.99,
        desc: "Thick, chewy golden cookies bursting with semi-sweet Belgian chocolate chunks and a pinch of sea salt.",
        image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500&auto=format&fit=crop&q=80",
        badge: ""
    },
    {
        id: 5,
        title: "Strawberry Dream Cake",
        category: "cakes",
        price: 38.99,
        desc: "Light vanilla chiffon layered with organic fresh strawberry slices and sweet whipped cream frosting.",
        image: "https://images.unsplash.com/photo-1464305795204-6f5bdf7af15a?w=500&auto=format&fit=crop&q=80",
        badge: "Seasonal"
    },
    {
        id: 6,
        title: "Cinnamon Glazed Roll",
        category: "pastries",
        price: 4.99,
        desc: "Soft yeast dough swirled with spicy Saigon cinnamon and drizzled with a warm, sweet sugar icing.",
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80",
        badge: "Warm"
    },
    {
        id: 7,
        title: "Double Chocolate Muffin",
        category: "cupcakes",
        price: 3.49,
        desc: "Indulgently rich and moist dark chocolate muffin filled with dark chocolate chips.",
        image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=500&auto=format&fit=crop&q=80",
        badge: ""
    },
    {
        id: 8,
        title: "Macaron Assortment Box",
        category: "pastries",
        price: 15.99,
        desc: "Box of 6 artisanal French macarons including Pistachio, Salted Caramel, Lemon, and Raspberry.",
        image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=500&auto=format&fit=crop&q=80",
        badge: "Gift Idea"
    }
];

// --- Application State ---
let cart = [];

// --- DOM Elements ---
document.addEventListener("DOMContentLoaded", () => {
    // Nav elements
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const navLinks = document.getElementById("navLinks");
    const navLinksList = document.querySelectorAll(".nav-links a");

    // Cart drawer elements
    const cartToggleBtn = document.getElementById("cartToggleBtn");
    const cartCloseBtn = document.getElementById("cartCloseBtn");
    const cartDrawer = document.getElementById("cartDrawer");
    const cartOverlay = document.getElementById("cartOverlay");
    const cartCountBadge = document.getElementById("cartCountBadge");
    const cartItemsContainer = document.getElementById("cartItemsContainer");
    const cartSubtotal = document.getElementById("cartSubtotal");
    const cartTotal = document.getElementById("cartTotal");
    const checkoutBtn = document.getElementById("checkoutBtn");
    const startShoppingBtn = document.getElementById("startShoppingBtn");

    // Product Grid & Filter Elements
    const productsGrid = document.getElementById("productsGrid");
    const filterButtons = document.querySelectorAll(".filter-btn");

    // Contact form elements
    const contactForm = document.getElementById("contactForm");
    const contactFeedback = document.getElementById("contactFeedback");

    // Newsletter form elements
    const newsletterForm = document.getElementById("newsletterForm");
    const newsletterFeedback = document.getElementById("newsletterFeedback");

    // Checkout Modal elements
    const checkoutModal = document.getElementById("checkoutModal");
    const checkoutModalOverlay = document.getElementById("checkoutModalOverlay");
    const checkoutCloseBtn = document.getElementById("checkoutCloseBtn");
    const checkoutForm = document.getElementById("checkoutForm");
    const checkoutItemsList = document.getElementById("checkoutItemsList");
    const checkoutTotalAmount = document.getElementById("checkoutTotalAmount");

    // Success Modal elements
    const successModal = document.getElementById("successModal");
    const successModalOverlay = document.getElementById("successModalOverlay");
    const successCloseBtn = document.getElementById("successCloseBtn");
    const successOrderId = document.getElementById("successOrderId");


    /* ==========================================================================
       Navigation Interactivity
       ========================================================================== */
    // Toggle Mobile Navigation Menu
    mobileMenuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        const icon = mobileMenuBtn.querySelector("i");
        if (navLinks.classList.contains("active")) {
            icon.className = "fa-solid fa-xmark";
        } else {
            icon.className = "fa-solid fa-bars";
        }
    });

    // Close Menu when clicking outside or clicking link
    navLinksList.forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            mobileMenuBtn.querySelector("i").className = "fa-solid fa-bars";

            // Set active class
            navLinksList.forEach(lnk => lnk.classList.remove("active"));
            link.classList.add("active");
        });
    });

    // Simple scrollspy to highlight active nav link on scroll
    window.addEventListener("scroll", () => {
        let current = "";
        const sections = document.querySelectorAll("section");
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute("id");
            }
        });

        navLinksList.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }
        });
    });


    /* ==========================================================================
       Products Display & Filtering
       ========================================================================== */
    // Render Products Grid
    function renderProducts(categoryFilter = "all") {
        productsGrid.innerHTML = "";
        const filteredProducts = categoryFilter === "all"
            ? PRODUCTS
            : PRODUCTS.filter(p => p.category === categoryFilter);

        filteredProducts.forEach(product => {
            const card = document.createElement("div");
            card.className = "product-card";
            card.setAttribute("data-product-id", product.id);

            const badgeHTML = product.badge
                ? `<span class="product-badge">${product.badge}</span>`
                : "";

            card.innerHTML = `
                <div class="product-img-wrapper">
                    <img src="${product.image}" alt="${product.title}" class="product-img" loading="lazy">
                    ${badgeHTML}
                </div>
                <div class="product-body">
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-desc">${product.desc}</p>
                    <div class="product-footer">
                        <span class="product-price">$${product.price.toFixed(2)}</span>
                        <button class="add-to-cart-btn" aria-label="Add ${product.title} to Cart" onclick="addToCart(${product.id})">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                </div>
            `;
            productsGrid.appendChild(card);
        });
    }

    // Initialize Menu Rendering
    renderProducts();

    // Setup Category Filter Click Handlers
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            const category = button.getAttribute("data-category");
            renderProducts(category);
        });
    });


    /* ==========================================================================
       Shopping Cart Functionality
       ========================================================================== */
    // Open/Close Cart Drawer
    const toggleCartDrawer = () => {
        cartDrawer.classList.toggle("active");
        cartOverlay.classList.toggle("active");
    };

    cartToggleBtn.addEventListener("click", toggleCartDrawer);
    cartCloseBtn.addEventListener("click", toggleCartDrawer);
    cartOverlay.addEventListener("click", toggleCartDrawer);

    if (startShoppingBtn) {
        startShoppingBtn.addEventListener("click", (e) => {
            e.preventDefault();
            toggleCartDrawer();
            document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
        });
    }

    // Add To Cart Global Controller Function
    window.addToCart = (productId) => {
        const product = PRODUCTS.find(p => p.id === productId);
        if (!product) return;

        const existingCartItem = cart.find(item => item.id === productId);
        if (existingCartItem) {
            existingCartItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }

        updateCartUI();

        // Open Cart Drawer automatically to provide feedback
        if (!cartDrawer.classList.contains("active")) {
            toggleCartDrawer();
        }
    };

    // Update Quantity
    window.changeQuantity = (productId, change) => {
        const cartItem = cart.find(item => item.id === productId);
        if (!cartItem) return;

        cartItem.quantity += change;
        if (cartItem.quantity <= 0) {
            cart = cart.filter(item => item.id !== productId);
        }

        updateCartUI();
    };

    // Remove From Cart
    window.removeFromCart = (productId) => {
        cart = cart.filter(item => item.id !== productId);
        updateCartUI();
    };

    // Calculate Totals & Render Cart Items
    function updateCartUI() {
        // Calculate totals
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const subtotalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Update badge
        cartCountBadge.innerText = totalItems;

        // Render drawer list
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart-message">
                    <i class="fa-solid fa-basket-shopping"></i>
                    <p>Your cart is empty.</p>
                    <a href="#menu" class="btn btn-primary" id="startShoppingBtn">Start Shopping</a>
                </div>
            `;
            // Rebind newly created button
            document.getElementById("startShoppingBtn").addEventListener("click", (e) => {
                e.preventDefault();
                toggleCartDrawer();
                document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
            });

            cartSubtotal.innerText = "$0.00";
            cartTotal.innerText = "$0.00";
            checkoutBtn.disabled = true;
            checkoutBtn.style.opacity = "0.5";
            checkoutBtn.style.cursor = "not-allowed";
        } else {
            checkoutBtn.disabled = false;
            checkoutBtn.style.opacity = "1";
            checkoutBtn.style.cursor = "pointer";

            cartItemsContainer.innerHTML = "";
            cart.forEach(item => {
                const itemEl = document.createElement("div");
                itemEl.className = "cart-item";
                itemEl.innerHTML = `
                    <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                    <div class="cart-item-info">
                        <h4>${item.title}</h4>
                        <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <div class="cart-item-controls">
                        <button class="qty-btn" aria-label="Decrease quantity" onclick="changeQuantity(${item.id}, -1)">
                            <i class="fa-solid fa-minus"></i>
                        </button>
                        <span class="cart-item-qty">${item.quantity}</span>
                        <button class="qty-btn" aria-label="Increase quantity" onclick="changeQuantity(${item.id}, 1)">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                    <button class="cart-item-remove-btn" aria-label="Remove item" onclick="removeFromCart(${item.id})">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                `;
                cartItemsContainer.appendChild(itemEl);
            });

            // Update footer totals
            cartSubtotal.innerText = `$${subtotalAmount.toFixed(2)}`;
            cartTotal.innerText = `$${subtotalAmount.toFixed(2)}`;
        }
    }


    /* ==========================================================================
       Checkout Modal Process
       ========================================================================== */
    // Open/Close Checkout Modal
    const toggleCheckoutModal = () => {
        checkoutModal.classList.toggle("active");
        checkoutModalOverlay.classList.toggle("active");
    };

    checkoutBtn.addEventListener("click", () => {
        if (cart.length === 0) return;

        // Hide cart drawer
        toggleCartDrawer();

        // Pop up checkout modal
        toggleCheckoutModal();

        // Populate Order Summary
        checkoutItemsList.innerHTML = "";
        cart.forEach(item => {
            const row = document.createElement("div");
            row.className = "checkout-item-row";
            row.innerHTML = `
                <span>${item.title} <strong>x${item.quantity}</strong></span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            `;
            checkoutItemsList.appendChild(row);
        });

        const totalAmt = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        checkoutTotalAmount.innerText = `$${totalAmt.toFixed(2)}`;
    });

    checkoutCloseBtn.addEventListener("click", toggleCheckoutModal);
    checkoutModalOverlay.addEventListener("click", toggleCheckoutModal);


    // Handle Checkout Form Submission
    checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Simulate secure API Order Processing
        const submitBtn = document.getElementById("submitOrderBtn");
        submitBtn.disabled = true;
        submitBtn.innerText = "Processing Order...";

        setTimeout(() => {
            // Close checkout modal
            toggleCheckoutModal();

            // Clear Cart
            cart = [];
            updateCartUI();

            // Generate Order Number
            const randomOrderNum = "SC-" + Math.floor(100000 + Math.random() * 900000);
            successOrderId.innerText = randomOrderNum;

            // Open Success Modal
            successModal.classList.add("active");
            successModalOverlay.classList.add("active");

            // Reset checkout button
            submitBtn.disabled = false;
            submitBtn.innerText = "Place Bakery Order";
            checkoutForm.reset();
        }, 1500);
    });

    // Close Success Modal
    const closeSuccessModal = () => {
        successModal.classList.remove("active");
        successModalOverlay.classList.remove("active");
    };

    successCloseBtn.addEventListener("click", closeSuccessModal);
    successModalOverlay.addEventListener("click", closeSuccessModal);


    /* ==========================================================================
       Forms & Interactions (Newsletter & Contact)
       ========================================================================== */
    // Contact Form Submission Handler
    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector("button[type='submit']");
        submitBtn.disabled = true;
        submitBtn.innerText = "Sending...";

        setTimeout(() => {
            contactFeedback.innerText = "Thank you! Your message has been sent successfully. We will get back to you soon.";
            contactFeedback.className = "form-feedback success";
            contactFeedback.classList.remove("hidden");

            contactForm.reset();
            submitBtn.disabled = false;
            submitBtn.innerText = "Send Message";

            // Hide feedback after 5 seconds
            setTimeout(() => {
                contactFeedback.classList.add("hidden");
            }, 5000);
        }, 1200);
    });

    // Newsletter Form Submission Handler
    newsletterForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const emailInput = document.getElementById("newsletterEmail");
        const submitBtn = newsletterForm.querySelector("button");

        submitBtn.disabled = true;
        submitBtn.innerText = "Subscribing...";

        setTimeout(() => {
            newsletterFeedback.innerText = `Awesome! ${emailInput.value} has been subscribed. Check your inbox for the 10% coupon.`;
            newsletterFeedback.className = "newsletter-feedback success";
            newsletterFeedback.classList.remove("hidden");

            emailInput.value = "";
            submitBtn.disabled = false;
            submitBtn.innerText = "Subscribe";

            // Hide feedback after 5 seconds
            setTimeout(() => {
                newsletterFeedback.classList.add("hidden");
            }, 5000);
        }, 1000);
    });
});