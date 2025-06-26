// النجوم العشوائية
function createStars() {
  const starsContainer = document.createElement('div');
  starsContainer.classList.add('stars');
  document.body.appendChild(starsContainer);
  
  for (let i = 0; i < 100; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 4}s`;
    starsContainer.appendChild(star);
  }
}
createStars();

// Add social links styling
document.addEventListener('DOMContentLoaded', function() {
  const footer = document.querySelector('footer');
  if (footer) {
    footer.style.textAlign = 'center';
    footer.style.padding = '20px';
    footer.style.marginTop = '30px';
    
    const socialLinks = document.querySelector('.social-links');
    if (socialLinks) {
      socialLinks.style.display = 'flex';
      socialLinks.style.justifyContent = 'center';
      socialLinks.style.gap = '20px';
    }
  }
});

// تفعيل القائمة المتجاوبة مع الموبايل
const menuToggle = document.getElementById('menu-toggle');
const navMobile = document.getElementById('nav-mobile');

menuToggle.addEventListener('click', () => {
  navMobile.classList.toggle('open');
});

// إخفاء القائمة عند النقر خارجها
document.addEventListener('click', (e) => {
  if (!e.target.closest('#nav-mobile') && !e.target.closest('#menu-toggle') && navMobile.classList.contains('open')) {
    navMobile.classList.remove('open');
  }
});

// السلايدر (موجود عندك سابقا)
const slides = document.querySelectorAll('.slide');
let currentIndex = 0;
function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
}
function nextSlide() {
  currentIndex = (currentIndex + 1) % slides.length;
  showSlide(currentIndex);
}
showSlide(currentIndex);
setInterval(nextSlide, 3000);

// الدوال scroll
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (navMobile.classList.contains('open')) {
    navMobile.classList.remove('open');
  }
}
function scrollToShoes() {
  document.getElementById('shoes-section').scrollIntoView({ behavior: 'smooth' });
  if (navMobile.classList.contains('open')) {
    navMobile.classList.remove('open');
  }
}

// السلة (cart)
const cartBtn = document.getElementById('cart-btn');
const cartBtnMobile = document.getElementById('cart-btn-mobile');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalDisplay = document.getElementById('cart-total');
const confirmOrderBtn = document.getElementById('confirm-order');
const formOverlay = document.getElementById('form-overlay');

// بيانات السلة كمصفوفة
window.cart = [];

// فتح واغلاق السلة
cartBtn.addEventListener('click', () => {
  cartSidebar.classList.add('open');
  renderCart();
});

if (cartBtnMobile) {
  cartBtnMobile.addEventListener('click', () => {
    cartSidebar.classList.add('open');
    navMobile.classList.remove('open');
    renderCart();
  });
}

closeCartBtn.addEventListener('click', () => {
  cartSidebar.classList.remove('open');
});

// اضافة كوتشي للسلة
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
addToCartButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent triggering the parent card click
    const card = e.target.closest('.shoe-card');
    const name = card.getAttribute('data-name');
    const price = parseInt(card.getAttribute('data-price'), 10);

    // تحقق اذا العنصر موجود مسبقا
    const existingItem = window.cart.find(item => item.name === name);
    if(existingItem) {
      existingItem.quantity++;
    } else {
      window.cart.push({ name, price, quantity: 1 });
    }
    alert(`تم إضافة ${name} إلى السلة`);
    renderCart();
  });
});

// Handle product image clicks to redirect to detail page
const productImages = document.querySelectorAll('.product-image');
productImages.forEach(img => {
  img.addEventListener('click', () => {
    const card = img.closest('.shoe-card');
    const name = card.getAttribute('data-name');
    const price = card.getAttribute('data-price');
    const image = card.getAttribute('data-image');
    window.location.href = `product-detail.html?name=${encodeURIComponent(name)}&price=${encodeURIComponent(price)}&image=${encodeURIComponent(image)}`;
  });
});

// Make the whole card clickable except for the add to cart button
const shoeCards = document.querySelectorAll('.shoe-card');
shoeCards.forEach(card => {
  card.addEventListener('click', () => {
    const name = card.getAttribute('data-name');
    const price = card.getAttribute('data-price');
    const image = card.getAttribute('data-image');
    window.location.href = `product-detail.html?name=${encodeURIComponent(name)}&price=${encodeURIComponent(price)}&image=${encodeURIComponent(image)}`;
  });
});

// تحديث عرض السلة
window.renderCart = function() {
  cartItemsContainer.innerHTML = '';
  if(window.cart.length === 0) {
    cartItemsContainer.innerHTML = '<p>السلة فارغة.</p>';
    cartTotalDisplay.textContent = 'المجموع: 0 جنيه';
    return;
  }

  window.cart.forEach((item, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('cart-item');

    itemDiv.innerHTML = `
      <div class="cart-item-name">${item.name}</div>
      <div class="cart-item-price">${item.price} جنيه</div>
      <div class="cart-item-quantity">
        <input type="number" min="1" value="${item.quantity}" data-index="${index}" />
      </div>
      <button class="remove-item-btn" data-index="${index}" style="background:none; border:none; color:#f58224; cursor:pointer; font-size:20px;">&#10005;</button>
    `;

    cartItemsContainer.appendChild(itemDiv);
  });

  updateTotal();

  // إضافة أحداث تغيير الكمية
  const quantityInputs = cartItemsContainer.querySelectorAll('input[type="number"]');
  quantityInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      const idx = e.target.getAttribute('data-index');
      let val = parseInt(e.target.value, 10);
      if(isNaN(val) || val < 1) {
        val = 1;
        e.target.value = 1;
      }
      window.cart[idx].quantity = val;
      updateTotal();
    });
  });

  // زر حذف عنصر من السلة
  const removeButtons = cartItemsContainer.querySelectorAll('.remove-item-btn');
  removeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = e.target.getAttribute('data-index');
      window.cart.splice(idx, 1);
      renderCart();
    });
  });
}

// حساب المجموع
function updateTotal() {
  let total = 0;
  window.cart.forEach(item => {
    total += item.price * item.quantity;
  });
  cartTotalDisplay.textContent = `المجموع: ${total} جنيه`;
}

// تأكيد الطلب
confirmOrderBtn.addEventListener('click', () => {
  if(window.cart.length === 0) {
    alert('السلة فارغة، الرجاء إضافة منتجات قبل تأكيد الطلب.');
    return;
  }
  document.getElementById('customer-form').style.display = 'block';
  document.getElementById('form-overlay').style.display = 'block';
});

// إغلاق نافذة العميل عند النقر خارجها
formOverlay.addEventListener('click', () => {
  document.getElementById('customer-form').style.display = 'none';
  formOverlay.style.display = 'none';
});
