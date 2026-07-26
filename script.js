/**
 * SWEET CAKE BAKERY - script.js
 * Implements mobile navigation, interactive product catalog filtering,
 * live interactive Cake Customizer with real-time UI/pricing,
 * virtual cart with local persistence, checkout, and form submissions.
 */

// --- Constants & Global Data ---
const PRODUCTS = [
    // Category: Cakes
    {
        id: "c1",
        name: "Strawberry Dream Cake",
        category: "cakes",
        price: 38.00,
        description: "Fresh orchard strawberries, delicate sponge, and vanilla Chantilly frosting.",
        tag: "Best Seller",
        icon: "fa-solid fa-cake-candles"
    },
    {
        id: "c2",
        name: "Belgian Fudge Truffle",
        category: "cakes",
        price: 42.50,
        description: "Decadent layers of 70% dark Belgian cocoa sponge, filled with chocolate ganache.",
        tag: "Premium",
        icon: "fa-solid fa-cookie-bite"
    },
    {
        id: "c3",
        name: "Luxe Red Velvet",
        category: "cakes",
        price: 39.00,
        description: "Classic crimson crumb, velvet cocoa hint, stacked with luxurious Madagascar vanilla cream cheese icing.",
        tag: "Signature",
        icon: "fa-solid fa-cake-candles"
    },
    // Category: Cupcakes
    {
        id: "cp1",
        name: "Pastel Lemon Sensation",
        category: "cupcakes",
        price: 4.50,
        description: "Zesty lemon cupcakes topped with beautiful buttercream ruffles and sweet lemon curd centers.",
        tag: "Fresh",
        icon: "fa-solid fa-ice-cream"
    },
    {
        id: "cp2",
        name: "Salted Caramel Bliss",
        category: "cupcakes",
        price: 4.75,
        description: "Buttery crumb core injected with homemade sea salt caramel, capped with light gold frosting.",
        tag: "Indulgent",
        icon: "fa-solid fa-candy-cane"
    },
    // Category: Pastries
    {
        id: "p1",
        name: "Parisian Butter Croissant",
        category: "pastries",
        price: 3.50,
        description: "Aged premium French butter layers baked to golden flaky crunch perfection.",
        tag: "Classic",
        icon: "fa-solid fa-bread-slice"
    },
    {
        id: "p2",
        name: "Pistachio Rose Cruffin",
        category: "pastries",
        price: 5.25,
        description: "Crispy croissant muffin hybrid filled with slow-roasted pistachio cream and infused with delicate rosewater.",
        tag: "Trending",
        icon: "fa-solid fa-cookie"
    },
    // Category: Cookies
    {
        id: "ck1",
        name: "NYC Double Chocolate Chunk",
        category: "cookies",
        price: 3.75,
        description: "Giant, thick cookie crispy on the edges and gooey in the center with molten chocolate rivers.",
        tag: "Gooey",
        icon: "fa-solid fa-cookie-bite"
    },
    {
        id: "ck2",
        name: "Salted Pecan White Velvet",
        category: "cookies",
        price: 3.90,
        description: "Gourmet buttery batter packed with toasted pecans and premium white chocolate pieces.",
        tag: "Nutty",
        icon: "fa-solid fa-cookie"
    }
];

// --- State Management ---
let cart = [];
let customizerState = {
    tiers: 2,
    flavor: "vanilla",
    flavorPrice: 0.00,
    flavorColor: "#FFF5EE",
    sponge: "classic",
    spongePrice: 0.00,
    toppings: [],
    customMessage: ""
};

// --- DOM Elements ---
const navMenu = document.getElementById("navMenu");
const mobileToggle = document.getElementById("mobileToggle");
const cartBtn = document.getElementById("cartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const menuGrid = document.getElementById("menuGrid");
const filterButtons = document.querySelectorAll(".filter-btn");

// Customizer Controls
const cakeDisplay = document.getElementById("cakeDisplay");
const cakeLayersContainer = document.getElementById("cakeLayersContainer");
const layerTop = document.getElementById("layerTop");
const layerMiddle = document.getElementById("layerMiddle");
const layerBottom = document.getElementById("layerBottom");
const decorationsOverlay = document.getElementById("decorationsOverlay");
const previewBadge = document.getElementById("previewBadge");

const tierRadios = document.getElementsByName("cakeLayers");
const flavorSelector = document.getElementById("flavorSelector");
const cakeSpongeSelect = document.getElementById("cakeSponge");
const toppingsContainer = document.getElementById("toppingsContainer");
const cakeMessageInput = document.getElementById("cakeMessage");

const basePriceLabel = document.getElementById("basePriceLabel");
const addonsPriceLabel = document.getElementById("addonsPriceLabel");
const customCakeTotalPrice = document.getElementById("customCakeTotalPrice");
const addCustomCakeBtn = document.getElementById("addCustomCakeBtn");

// Cart Elements
const cartItemsContainer = document.getElementById("cartItemsContainer");
const emptyCartMessage = document.getElementById("emptyCartMessage");
const cartDrawerFooter = document.getElementById("cartDrawerFooter");
const cartCount = document.getElementById("cartCount");
const cartSubtotal = document.getElementById("cartSubtotal");
const cartTax = document.getElementById("cartTax");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");
const emptyCartExploreBtn = document.getElementById("emptyCartExploreBtn");

// Modals & Toast
const modalOverlay = document.getElementById("modalOverlay");
const checkoutModal = document.getElementById("checkoutModal");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const modalSuccessBtn = document.getElementById("modalSuccessBtn");
const orderReference = document.getElementById("orderReference");
const cartToast = document.getElementById("cartToast");
const toastMessage = document.getElementById("toastMessage");

// Contact & News Forms
const contactForm = document.getElementById("contactForm");
const newsletterForm = document.getElementById("newsletterForm");

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
    loadCartFromLocalStorage();
    renderProducts("all");
    updateCustomizerUI();
    setupEventListeners();
});

// --- Event Listeners Setup ---
function setupEventListeners() {
    // Mobile navigation
    if (mobileToggle) {
        mobileToggle.addEventListener("click", () => {
            navMenu.classList.toggle("active");
            const icon = mobileToggle.querySelector("i");
            if (navMenu.classList.contains("active")) {
                icon.className = "fa-solid fa-xmark";
            } else {
                icon.className = "fa-solid fa-bars";
            }
        });
    }

    // Close mobile nav on link click
    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
            const icon = mobileToggle.querySelector("i");
            if (icon) icon.className = "fa-solid fa-bars";
        });
    });

    // Scroll active link styling
    window.addEventListener("scroll", () => {
        let current = "";
        const sections = document.querySelectorAll("section");
        const navLinks = document.querySelectorAll(".nav-link");

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }
        });
    });

    // Drawer triggers
    if (cartBtn) cartBtn.addEventListener("click", openCartDrawer);
    if (closeCartBtn) closeCartBtn.addEventListener("click", closeCartDrawer);
    if (cartOverlay) cartOverlay.addEventListener("click", closeCartDrawer);
    if (emptyCartExploreBtn) {
        emptyCartExploreBtn.addEventListener("click", () => {
            closeCartDrawer();
        });
    }

    // Menu Category Filtering
    filterButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            filterButtons.forEach(b => b.classList.remove("active"));
            e.currentTarget.classList.add("active");
            const category = e.currentTarget.getAttribute("data-category");
            renderProducts(category);
        });
    });

    // --- Customizer Control Actions ---

    // Tier Selection Change
    tierRadios.forEach(radio => {
        radio.addEventListener("change", (e) => {
            customizerState.tiers = parseInt(e.target.value);
            updateCustomizerUI();
        });
    });

    // Flavor Swatch Change
    const swatches = flavorSelector.querySelectorAll(".flavor-swatch");
    swatches.forEach(swatch => {
        swatch.addEventListener("click", (e) => {
            swatches.forEach(s => s.classList.remove("active"));
            const target = e.currentTarget;
            target.classList.add("active");

            customizerState.flavor = target.getAttribute("data-flavor");
            customizerState.flavorPrice = parseFloat(target.getAttribute("data-price"));
            customizerState.flavorColor = target.getAttribute("data-color");

            updateCustomizerUI();
        });
    });

    // Sponge Select Change
    if (cakeSpongeSelect) {
        cakeSpongeSelect.addEventListener("change", (e) => {
            const selectedOpt = e.target.options[e.target.selectedIndex];
            customizerState.sponge = e.target.value;
            customizerState.spongePrice = parseFloat(selectedOpt.getAttribute("data-price"));
            updateCustomizerUI();
        });
    }

    // Toppings Checkbox Change
    const toppingCheckboxes = toppingsContainer.querySelectorAll("input[type='checkbox']");
    toppingCheckboxes.forEach(cb => {
        cb.addEventListener("change", () => {
            const selected = [];
            toppingCheckboxes.forEach(c => {
                if (c.checked) {
                    selected.push({
                        id: c.value,
                        name: c.parentNode.querySelector("span").innerText.split(" (")[0],
                        price: parseFloat(c.getAttribute("data-price"))
                    });
                }
            });
            customizerState.toppings = selected;
            updateCustomizerUI();
        });
    });

    // Custom piping message input
    if (cakeMessageInput) {
        cakeMessageInput.addEventListener("input", (e) => {
            customizerState.customMessage = e.target.value.trim();
        });
    }

    // Add Custom Cake to basket
    if (addCustomCakeBtn) {
        addCustomCakeBtn.addEventListener("click", addCustomCakeToCart);
    }

    // Checkout Proceed
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", handleCheckout);
    }

    // Modals
    if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);
    if (modalOverlay) modalOverlay.addEventListener("click", closeModal);
    if (modalSuccessBtn) modalSuccessBtn.addEventListener("click", closeModal);

    // Form Submissions
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("contactName").value;
            showNotification(`Thank you, ${name}! Your message was successfully sent.`);
            contactForm.reset();
        });
    }

    if (newsletterForm) {
        newsletterForm.addEventListener("submit", (e) => {
            e.preventDefault();
            showNotification("Welcome to the Sweet Cake family! Check your inbox for a 10% discount.");
            newsletterForm.reset();
        });
    }
}

// --- Dynamic Menu Rendering ---
function renderProducts(category) {
    if (!menuGrid) return;
    menuGrid.innerHTML = "";

    const filtered = category === "all"
        ? PRODUCTS
        : PRODUCTS.filter(p => p.category === category);

    filtered.forEach(p => {
        const card = document.createElement("div");
        card.className = "menu-card";
        card.setAttribute("data-id", p.id);

        card.innerHTML = `
            <div class="menu-img-container">
                <span class="menu-tag">${p.tag}</span>
                <div class="menu-img-fallback">
                    <i class="${p.icon}"></i>
                </div>
            </div>
            <div class="menu-card-body">
                <h3 class="menu-card-title">${p.name}</h3>
                <p class="menu-card-desc">${p.description}</p>
                <div class="menu-card-footer">
                    <span class="menu-card-price">$${p.price.toFixed(2)}</span>
                    <button class="add-cart-btn" onclick="addStandardProductToCart('${p.id}')" aria-label="Add ${p.name} to basket">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
            </div>
        `;
        menuGrid.appendChild(card);
    });
}

// --- Live Cake Customizer Updates ---
function updateCustomizerUI() {
    // 1. Show/hide tiers in visual preview based on selected tiers
    const tierCount = customizerState.tiers;

    if (tierCount === 1) {
        layerTop.style.display = "none";
        layerMiddle.style.display = "none";
        layerBottom.style.display = "flex";
    } else if (tierCount === 2) {
        layerTop.style.display = "none";
        layerMiddle.style.display = "flex";
        layerBottom.style.display = "flex";
    } else {
        layerTop.style.display = "flex";
        layerMiddle.style.display = "flex";
        layerBottom.style.display = "flex";
    }

    // 2. Color layers based on Selected Flavor
    const color = customizerState.flavorColor;
    layerTop.style.backgroundColor = color;
    layerMiddle.style.backgroundColor = color;
    layerBottom.style.backgroundColor = color;

    // 3. Update preview text badge
    const rawFlavorName = customizerState.flavor.charAt(0).toUpperCase() + customizerState.flavor.slice(1);
    const rawSpongeName = cakeSpongeSelect ? cakeSpongeSelect.options[cakeSpongeSelect.selectedIndex].text.split(" (")[0] : "Classic Golden";
    previewBadge.innerText = `${rawFlavorName} on ${rawSpongeName}`;

    // 4. Draw visual decorations/toppings on cake
    decorationsOverlay.innerHTML = "";
    customizerState.toppings.forEach(topping => {
        createVisualToppings(topping.id);
    });

    // 5. Calculate real-time pricing
    // Base Price: $15 for 1 Tier, $25 for 2 Tiers, $35 for 3 Tiers
    let basePrice = 15.00;
    if (tierCount === 2) basePrice = 25.00;
    if (tierCount === 3) basePrice = 35.00;

    let upgradesPrice = customizerState.flavorPrice + customizerState.spongePrice;
    customizerState.toppings.forEach(t => {
        upgradesPrice += t.price;
    });

    const finalTotal = basePrice + upgradesPrice;

    basePriceLabel.innerText = `$${basePrice.toFixed(2)}`;
    addonsPriceLabel.innerText = `$${upgradesPrice.toFixed(2)}`;
    customCakeTotalPrice.innerText = `$${finalTotal.toFixed(2)}`;
}

// Draw cute particle toppings on the visual layers
function createVisualToppings(toppingId) {
    if (!decorationsOverlay) return;

    // Define random/semi-structured placement areas depending on which tiers are visible
    const visibleLayers = [];
    if (customizerState.tiers >= 3) visibleLayers.push("layerTop");
    if (customizerState.tiers >= 2) visibleLayers.push("layerMiddle");
    visibleLayers.push("layerBottom");

    visibleLayers.forEach(layerId => {
        const layerEl = document.getElementById(layerId);
        if (!layerEl) return;

        // Draw multiple visual sprinkles/berries/flakes per layer
        let dotsCount = 6;
        if (toppingId === "sprinkles") dotsCount = 14;
        if (toppingId === "goldflakes") dotsCount = 5;

        for (let i = 0; i < dotsCount; i++) {
            const dot = document.createElement("div");
            dot.className = `preview-topping topping-${toppingId}`;

            // Random styling for authentic decoration layer positioning
            const leftRand = Math.random() * 80 + 10; // 10% to 90% width
            const topRand = Math.random() * 40 + 10;  // 10% to 50% height

            dot.style.left = `${leftRand}%`;
            dot.style.top = `${topRand}%`;

            // Specific styles
            if (toppingId === "sprinkles") {
                const colors = ["#FF5733", "#FFC300", "#DAF7A6", "#33FF57", "#33FFF0", "#9A33FF", "#FF33F6"];
                dot.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                dot.style.transform = `rotate(${Math.random() * 360}deg)`;
            }

            layerEl.appendChild(dot);
        }
    });
}

// --- Cart Core Functionality ---

// Add normal product
function addStandardProductToCart(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    // Check if exists
    const existing = cart.find(item => item.id === product.id && !item.isCustom);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            isCustom: false,
            description: product.description,
            icon: product.icon
        });
    }

    saveCartAndSync();
    showNotification(`Added ${product.name} to your basket!`);
}

// Add Custom Customizer Cake to cart
function addCustomCakeToCart() {
    const tierCount = customizerState.tiers;
    let basePrice = 15.00;
    if (tierCount === 2) basePrice = 25.00;
    if (tierCount === 3) basePrice = 35.00;

    let upgradesPrice = customizerState.flavorPrice + customizerState.spongePrice;
    customizerState.toppings.forEach(t => {
        upgradesPrice += t.price;
    });

    const finalUnitPrice = basePrice + upgradesPrice;

    // Compile nice list of configuration strings for cart display
    const formattedFlavor = customizerState.flavor.charAt(0).toUpperCase() + customizerState.flavor.slice(1);
    const spongeOpt = cakeSpongeSelect.options[cakeSpongeSelect.selectedIndex].text.split(" (")[0];
    const toppingsList = customizerState.toppings.length > 0
        ? customizerState.toppings.map(t => t.name).join(", ")
        : "No extra toppings";
    const msgMeta = customizerState.customMessage ? `Piping: "${customizerState.customMessage}"` : "No custom piping";

    const customMetaString = `${tierCount} Tier, ${formattedFlavor} Frosting, ${spongeOpt} Sponge, ${toppingsList}. ${msgMeta}`;

    const customCakeItem = {
        id: `custom-${Date.now()}`, // Unique id
        name: "Custom Masterpiece Cake",
        price: finalUnitPrice,
        quantity: 1,
        isCustom: true,
        meta: customMetaString,
        icon: "fa-solid fa-wand-magic-sparkles"
    };

    cart.push(customCakeItem);
    saveCartAndSync();
    openCartDrawer();
    showNotification("Added your custom designed cake to your basket!");

    // Reset customizations visually
    if (cakeMessageInput) cakeMessageInput.value = "";
    customizerState.customMessage = "";
    customizerState.toppings = [];
    const checkboxes = toppingsContainer.querySelectorAll("input[type='checkbox']");
    checkboxes.forEach(c => c.checked = false);
    updateCustomizerUI();
}

// Update quantities in Cart Drawer
function updateCartItemQty(itemId, change) {
    const item = cart.find(i => i.id === itemId);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== itemId);
    }

    saveCartAndSync();
}

// Delete from Cart Drawer
function removeCartItem(itemId) {
    cart = cart.filter(i => i.id !== itemId);
    saveCartAndSync();
    showNotification("Item removed from basket.");
}

// State Sync with UI & Storage
function saveCartAndSync() {
    localStorage.setItem("sweet_cake_cart", JSON.stringify(cart));
    renderCartDrawerUI();
}

function loadCartFromLocalStorage() {
    const saved = localStorage.getItem("sweet_cake_cart");
    if (saved) {
        try {
            cart = JSON.parse(saved);
        } catch(e) {
            cart = [];
        }
    }
    renderCartDrawerUI();
}

function renderCartDrawerUI() {
    if (!cartItemsContainer) return;

    // Clear dynamic portion
    const itemCards = cartItemsContainer.querySelectorAll(".cart-item");
    itemCards.forEach(card => card.remove());

    if (cart.length === 0) {
        emptyCartMessage.style.display = "flex";
        cartDrawerFooter.style.display = "none";
        cartCount.innerText = "0";
        return;
    }

    emptyCartMessage.style.display = "none";
    cartDrawerFooter.style.display = "block";

    let totalItemsCount = 0;
    let subtotalValue = 0.00;

    cart.forEach(item => {
        totalItemsCount += item.quantity;
        subtotalValue += (item.price * item.quantity);

        const card = document.createElement("div");
        card.className = "cart-item";

        const descriptionMeta = item.isCustom
            ? `<p class="cart-item-meta">${item.meta}</p>`
            : `<p class="cart-item-meta">${item.description || ""}</p>`;

        card.innerHTML = `
            <div class="cart-item-img">
                <i class="${item.icon}"></i>
            </div>
            <div class="cart-item-details">
                <div>
                    <h4 class="cart-item-title">${item.name}</h4>
                    ${descriptionMeta}
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="updateCartItemQty('${item.id}', -1)" aria-label="Decrease quantity"><i class="fa-solid fa-minus"></i></button>
                        <span class="qty-val">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateCartItemQty('${item.id}', 1)" aria-label="Increase quantity"><i class="fa-solid fa-plus"></i></button>
                    </div>
                    <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                    <button class="remove-item-btn" onclick="removeCartItem('${item.id}')" aria-label="Remove item"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(card);
    });

    cartCount.innerText = totalItemsCount;

    // Calculate tax (approx 8.5%) and grand total
    const estimatedTax = subtotalValue * 0.085;
    const grandTotal = subtotalValue + estimatedTax;

    cartSubtotal.innerText = `$${subtotalValue.toFixed(2)}`;
    cartTax.innerText = `$${estimatedTax.toFixed(2)}`;
    cartTotal.innerText = `$${grandTotal.toFixed(2)}`;
}

// --- Cart Slide Action ---
function openCartDrawer() {
    if (cartDrawer && cartOverlay) {
        cartDrawer.classList.add("active");
        cartOverlay.classList.add("active");
        document.body.style.overflow = "hidden"; // Prevent background scroll
    }
}

function closeCartDrawer() {
    if (cartDrawer && cartOverlay) {
        cartDrawer.classList.remove("active");
        cartOverlay.classList.remove("active");
        document.body.style.overflow = "auto";
    }
}

// --- Checkout Logic ---
function handleCheckout() {
    if (cart.length === 0) return;

    // Generate random order reference number
    const ref = `SC-${Math.floor(100000 + Math.random() * 900000)}`;
    if (orderReference) orderReference.innerText = ref;

    // Open Success Modal
    openModal();
    closeCartDrawer();

    // Clear cart
    cart = [];
    saveCartAndSync();
}

function openModal() {
    if (checkoutModal && modalOverlay) {
        checkoutModal.classList.add("active");
        modalOverlay.classList.add("active");
    }
}

function closeModal() {
    if (checkoutModal && modalOverlay) {
        checkoutModal.classList.remove("active");
        modalOverlay.classList.remove("active");
    }
}

// --- Toast Notifications ---
let toastTimeout;
function showNotification(message) {
    if (!cartToast || !toastMessage) return;

    toastMessage.innerText = message;
    cartToast.classList.add("active");

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        cartToast.classList.remove("active");
    }, 4000);
}

// Global functions exposes for simple standard HTML triggers
window.addStandardProductToCart = addStandardProductToCart;
window.updateCartItemQty = updateCartItemQty;
window.removeCartItem = removeCartItem;
