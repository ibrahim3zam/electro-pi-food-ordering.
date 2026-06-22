import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

const translations = {
  en: {
    title: "Electro Pi Food",
    menu: "Explore Menu",
    cart: "My Cart",
    orders: "Track Orders",
    admin: "Admin Panel",
    login: "Sign In",
    logout: "Log Out",
    addToCart: "Add to Cart",
    total: "Order Total",
    checkout: "Place Order",
    payment: "Choose Payment Method",
    cod: "Cash on Delivery",
    online: "Pay with Card",
    status: "Status",
    addProd: "Add New Delicious Item",
    orderManagement: "Live Order Monitoring",
    track: "Your Active Orders",
    items: "Ordered Items",
    prodNameEn: "Product Name (English)",
    prodNameAr: "Product Name (Arabic)",
    price: "Price (EGP)",
    imgUrl: "Food Image URL",
    submit: "Publish Item",
    category: "Food Category",
    noProducts: "No meals cooked yet. Login as Admin to add some tasty food!",
  },
  ar: {
    title: "إلكترو باي فود",
    menu: "قائمة الطعام",
    cart: "عربة التسوق",
    orders: "تتبع طلباتي",
    admin: "لوحة التحكم",
    login: "تسجيل الدخول",
    logout: "تسجيل الخروج",
    addToCart: "أضف للسلة",
    total: "إجمالي الحساب",
    checkout: "تأكيد الطلب",
    payment: "اختر طريقة الدفع",
    cod: "الدفع عند الاستلام",
    online: "الدفع بالبطاقة الإلكترونية",
    status: "الحالة",
    addProd: "إضافة وجبة جديدة للقائمة",
    orderManagement: "المراقبة الحية للطلبات",
    track: "طلباتك الحالية",
    items: "الوجبات المطلوبة",
    prodNameEn: "اسم الوجبة (إنجليزي)",
    prodNameAr: "اسم الوجبة (عربي)",
    price: "السعر (جنيه)",
    imgUrl: "رابط صورة الطعام",
    submit: "نشر الوجبة الآن",
    category: "تصنيف الطعام",
    noProducts: "لا توجد وجبات حالياً. سجل دخول كمسؤول لإضافة طعام شهي!",
  },
};

export default function App() {
  const [lang, setLang] = useState("en");
  const [view, setView] = useState("menu");
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const t = translations[lang];

  const [newProd, setNewProd] = useState({
    name_en: "",
    name_ar: "",
    desc_en: "",
    desc_ar: "",
    price: "",
    image: "",
    category: "Fast Food",
  });

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  useEffect(() => {
    fetchProducts();
    if (user?.role === "admin") fetchAllOrders();
    if (user && user.role !== "admin") fetchUserOrders();
  }, [view, user]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/products`);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  const fetchAllOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/orders`);
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders", err);
    }
  };

  const fetchUserOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/orders/user/${user.id}`);
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching user orders", err);
    }
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const handleCheckout = async (method) => {
    if (!user) return setView("login");
    try {
      const orderData = {
        userId: user.id,
        items: cart,
        total: cart.reduce((sum, item) => sum + item.price, 0),
        paymentMethod: method,
      };
      await axios.post(`${API_URL}/orders`, orderData);
      setCart([]);
      setView("orders");
      alert(
        lang === "ar"
          ? " تم إرسال طلبك بنجاح وجاري تحضيره!"
          : " Order placed successfully!",
      );
    } catch (err) {
      alert("Checkout failed");
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/products`, newProd);
      setNewProd({
        name_en: "",
        name_ar: "",
        desc_en: "",
        desc_ar: "",
        price: "",
        image: "",
        category: "Fast Food",
      });
      fetchProducts();
      setView("menu");
    } catch (err) {
      alert("Failed to add product");
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`${API_URL}/orders/${orderId}`, { status: newStatus });
      fetchAllOrders();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 font-sans antialiased">
      <nav className="bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 p-4 sticky top-0 z-50 transition-all">
        <div className="container mx-auto flex justify-between items-center">
          <h1
            className="text-2xl font-black bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent tracking-tight cursor-pointer"
            onClick={() => setView("menu")}
          >
            {t.title}
          </h1>

          <div className="flex gap-6 items-center">
            <button
              onClick={() => setView("menu")}
              className={`hover:text-orange-600 font-semibold transition-colors ${view === "menu" ? "text-orange-500 border-b-2 border-orange-500 pb-1" : "text-gray-650"}`}
            >
              {t.menu}
            </button>

            <button
              onClick={() => setView("cart")}
              className={`relative hover:text-orange-600 font-semibold transition-colors ${view === "cart" ? "text-orange-500 border-b-2 border-orange-500 pb-1" : "text-gray-650"}`}
            >
              {t.cart}
              <span className="absolute -top-2 -right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-[10px] w-5 h-5 flex items-center justify-center font-bold shadow-sm animate-pulse">
                {cart.length}
              </span>
            </button>

            {user && (
              <button
                onClick={() => setView("orders")}
                className={`hover:text-orange-600 font-semibold transition-colors ${view === "orders" ? "text-orange-500 border-b-2 border-orange-500 pb-1" : "text-gray-650"}`}
              >
                {t.orders}
              </button>
            )}

            {user?.role === "admin" && (
              <button
                onClick={() => setView("admin")}
                className="bg-amber-50 text-amber-700 hover:bg-amber-100 px-3 py-1.5 rounded-full font-bold text-xs shadow-sm transition-all border border-amber-200"
              >
                {t.admin}
              </button>
            )}

            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="border border-gray-200 hover:bg-gray-50 px-3 py-1 rounded-md text-xs font-bold shadow-2xs transition-all"
            >
              {lang === "en" ? "العربية 🇪🇬" : "English 🇬🇧"}
            </button>

            {user ? (
              <button
                onClick={() => setUser(null)}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold px-3 py-1.5 rounded-md transition-colors"
              >
                {t.logout}
              </button>
            ) : (
              <button
                onClick={() => setView("login")}
                className="text-xs bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-1.5 rounded-md font-bold shadow-md hover:opacity-90 transition-opacity"
              >
                {t.login}
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto p-6 max-w-7xl">
        {view === "menu" && (
          <div>
            {products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-xs border max-w-xl mx-auto p-8">
                <p className="text-gray-400 font-medium mb-4">{t.noProducts}</p>
                <button
                  onClick={() => setView("login")}
                  className="bg-orange-500 text-white font-bold text-sm px-4 py-2 rounded-md shadow-xs"
                >
                  {t.login}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {products.map((p) => (
                  <div
                    key={p._id}
                    className="bg-white rounded-2xl shadow-xs hover:shadow-xl transition-all duration-300 border border-gray-100/80 overflow-hidden flex flex-col group"
                  >
                    <div className="relative overflow-hidden h-48 bg-gray-100">
                      <img
                        src={
                          p.image ||
                          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500"
                        }
                        alt={p.name_en}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-xs font-bold px-2.5 py-1 rounded-full text-orange-600 shadow-2xs">
                        {p.category}
                      </span>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-500 transition-colors">
                          {lang === "en" ? p.name_en : p.name_ar}
                        </h3>
                        <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                          {lang === "en" ? p.desc_en : p.desc_ar}
                        </p>
                      </div>
                      <div className="flex justify-between items-center mt-6 pt-3 border-t border-gray-50">
                        <span className="font-extrabold text-xl text-orange-600">
                          {p.price}{" "}
                          <span className="text-xs font-normal text-gray-400">
                            EGP
                          </span>
                        </span>
                        <button
                          onClick={() => addToCart(p)}
                          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all transform active:scale-95"
                        >
                          {t.addToCart}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === "cart" && (
          <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-xl border border-gray-50">
            <h2 className="text-xl font-black mb-6 border-b pb-3 text-gray-800 flex justify-between items-center">
              <span>{t.cart}</span>
              <span className="text-xs bg-orange-100 text-orange-600 px-2.5 py-1 rounded-full font-bold">
                {cart.length} Items
              </span>
            </h2>
            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-400 font-medium">
                Your cart is empty right now.
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-gray-50/60 p-3 rounded-xl border border-gray-100 text-sm"
                  >
                    <span className="font-medium text-gray-700">
                      {lang === "en" ? item.name_en : item.name_ar}
                    </span>
                    <span className="font-bold text-gray-950">
                      {item.price} EGP
                    </span>
                  </div>
                ))}
                <div className="mt-6 pt-4 border-t border-dashed font-black text-lg flex justify-between text-orange-600">
                  <span>{t.total}:</span>
                  <span>{cart.reduce((sum, i) => sum + i.price, 0)} EGP</span>
                </div>
                <div className="mt-8 pt-2">
                  <h4 className="font-bold mb-3 text-xs uppercase tracking-wider text-gray-400">
                    {t.payment}
                  </h4>
                  <button
                    onClick={() => handleCheckout("COD")}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-emerald-600/10 transition-all mb-3 text-sm"
                  >
                    {t.cod}
                  </button>
                  <button
                    onClick={() => handleCheckout("Online")}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-600/10 transition-all text-sm"
                  >
                    {t.online}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {view === "orders" && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-black mb-6 text-gray-800">
              {t.track}
            </h2>
            {orders.length === 0 ? (
              <p className="text-gray-400 text-center py-10 bg-white rounded-xl border">
                No orders placed yet.
              </p>
            ) : (
              orders.map((o) => (
                <div
                  key={o._id}
                  className="bg-white p-5 rounded-2xl shadow-xs mb-4 border-l-4 border-orange-500 border-y border-r border-gray-100"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-mono">
                        ID: {o._id}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(o.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span className="bg-orange-50 text-orange-600 font-extrabold px-3 py-1 rounded-full text-xs shadow-2xs border border-orange-100">
                      {o.status}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 my-2 text-xs text-gray-600">
                    <span className="font-bold text-gray-400 block mb-1">
                      {t.items}:
                    </span>
                    {o.items
                      .map((i) => (lang === "en" ? i.name_en : i.name_ar))
                      .join(", ")}
                  </div>
                  <p className="font-black text-right text-gray-900 mt-3 text-sm">
                    {t.total}:{" "}
                    <span className="text-lg text-orange-600">
                      {o.total} EGP
                    </span>{" "}
                    <span className="text-xs font-normal text-gray-400">
                      ({o.paymentMethod})
                    </span>
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {view === "admin" && (
          <div className="space-y-10 max-w-4xl mx-auto">
            {/* نموذج الإضافة */}
            <form
              onSubmit={handleAddProduct}
              className="bg-white p-6 rounded-2xl shadow-md border border-gray-50 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <h2 className="text-xl font-black col-span-1 md:col-span-2 text-orange-600 mb-2">
                {t.addProd}
              </h2>
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-400 mb-1">
                  {t.prodNameEn}
                </label>
                <input
                  type="text"
                  value={newProd.name_en}
                  onChange={(e) =>
                    setNewProd({ ...newProd, name_en: e.target.value })
                  }
                  className="border border-gray-200 p-2.5 rounded-xl text-sm focus:outline-orange-500"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-400 mb-1">
                  {t.prodNameAr}
                </label>
                <input
                  type="text"
                  value={newProd.name_ar}
                  onChange={(e) =>
                    setNewProd({ ...newProd, name_ar: e.target.value })
                  }
                  className="border border-gray-200 p-2.5 rounded-xl text-sm focus:outline-orange-500"
                  required
                />
              </div>
              <div className="flex flex-col col-span-1 md:col-span-2">
                <label className="text-xs font-bold text-gray-400 mb-1">
                  Description (EN)
                </label>
                <textarea
                  value={newProd.desc_en}
                  onChange={(e) =>
                    setNewProd({ ...newProd, desc_en: e.target.value })
                  }
                  className="border border-gray-200 p-2.5 rounded-xl text-sm focus:outline-orange-500 h-20"
                  required
                />
              </div>
              <div className="flex flex-col col-span-1 md:col-span-2">
                <label className="text-xs font-bold text-gray-400 mb-1">
                  Description (AR)
                </label>
                <textarea
                  value={newProd.desc_ar}
                  onChange={(e) =>
                    setNewProd({ ...newProd, desc_ar: e.target.value })
                  }
                  className="border border-gray-200 p-2.5 rounded-xl text-sm focus:outline-orange-500 h-20"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-400 mb-1">
                  {t.price}
                </label>
                <input
                  type="number"
                  value={newProd.price}
                  onChange={(e) =>
                    setNewProd({ ...newProd, price: Number(e.target.value) })
                  }
                  className="border border-gray-200 p-2.5 rounded-xl text-sm focus:outline-orange-500"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-400 mb-1">
                  {t.imgUrl}
                </label>
                <input
                  type="text"
                  value={newProd.image}
                  onChange={(e) =>
                    setNewProd({ ...newProd, image: e.target.value })
                  }
                  className="border border-gray-200 p-2.5 rounded-xl text-sm focus:outline-orange-500"
                  placeholder="https://..."
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-3 rounded-xl col-span-1 md:col-span-2 font-black shadow-lg shadow-orange-500/20 hover:opacity-95 transition-opacity mt-2 text-sm"
              >
                {t.submit}
              </button>
            </form>

            <div className="bg-white rounded-2xl shadow-md border border-gray-50 overflow-hidden">
              <div className="p-5 bg-gray-50/50 border-b border-gray-100">
                <h2 className="text-lg font-black text-gray-800">
                  {t.orderManagement}
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr className="bg-gray-150/40 text-xs font-bold text-gray-400 uppercase tracking-wider border-b">
                      <th className="p-4">Customer</th>
                      <th className="p-4">{t.total}</th>
                      <th className="p-4">{t.status}</th>
                      <th className="p-4">Change Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr
                        key={o._id}
                        className="border-b hover:bg-gray-50/50 transition-colors text-sm"
                      >
                        <td className="p-4 font-semibold text-gray-700">
                          {o.user?.name || "Customer"}
                        </td>
                        <td className="p-4 font-black text-orange-600">
                          {o.total} EGP
                        </td>
                        <td className="p-4">
                          <span className="bg-amber-50 text-amber-700 font-bold px-2.5 py-1 rounded-full text-xs border border-amber-100">
                            {o.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <select
                            onChange={(e) =>
                              updateOrderStatus(o._id, e.target.value)
                            }
                            value={o.status}
                            className="border border-gray-200 rounded-xl text-xs p-2 bg-white font-medium focus:outline-orange-500 shadow-2xs"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Out for Delivery">
                              Out for Delivery
                            </option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 5. بوابة الدخول المحاكية السريعة */}
        {view === "login" && (
          <div className="max-w-sm mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center transform transition-all">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-500 text-2xl font-black">
              🍟
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-1">
              {t.login}
            </h2>
            <p className="text-gray-400 text-xs mb-8">
              Choose a profile to evaluate the full workspace flow:
            </p>
            <button
              onClick={() => {
                setUser({
                  id: "647f1a2b3c4d5e6f7a8b9c01",
                  name: "Ahmed Mohamed",
                  role: "user",
                });
                setView("menu");
              }}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl mb-3 font-bold shadow-lg shadow-orange-500/10 hover:opacity-95 transition-opacity text-sm"
            >
              Login as Customer (Ahmed)
            </button>
            <button
              onClick={() => {
                setUser({
                  id: "647f1a2b3c4d5e6f7a8b9c02",
                  name: "Omnia Magdy (Electro Pi)",
                  role: "admin",
                });
                setView("admin");
              }}
              className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold shadow-lg shadow-gray-900/10 hover:bg-gray-800 transition-colors text-sm"
            >
              Login as Electro Pi Admin
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
