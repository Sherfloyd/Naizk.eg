// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDXlaUmCPPfTZpu-l_gYZVyFIDy4nWZMSM",
  authDomain: "naizkeg-2785a.firebaseapp.com",
  projectId: "naizkeg-2785a",
  storageBucket: "naizkeg-2785a.firebasestorage.app",
  messagingSenderId: "113007370107",
  appId: "1:113007370107:web:3086d0872ff9ff8a0267de",
  measurementId: "G-FTXL0LF5VJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// إرسال طلب للفايربيس
window.submitCustomerForm = function() {
  const name = document.getElementById('customer-name').value.trim();
  const address = document.getElementById('customer-address').value.trim();
  const phone = document.getElementById('customer-phone').value.trim();
  const altPhone = document.getElementById('customer-alt-phone').value.trim();

  if (!name || !address || !phone || !altPhone) {
    alert("يرجى ملء جميع الحقول قبل تأكيد الطلب.");
    return;
  }

  const orderData = {
    name,
    address,
    phone,
    altPhone,
    cart: window.cart.map(item => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity
    })),
    total: window.cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    timestamp: new Date().toISOString()
  };

  // إرسال البيانات للفايربيس
  const ordersRef = ref(database, 'orders');
  push(ordersRef, orderData)
    .then(() => {
      alert('تم إرسال الطلب بنجاح!');
      document.getElementById('customer-form').style.display = 'none';
      document.getElementById('form-overlay').style.display = 'none';
      window.cart = []; // تفريغ السلة
      window.renderCart();
    })
    .catch((error) => {
      console.error("خطأ في إرسال الطلب:", error);
      alert("حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى.");
    });
};
