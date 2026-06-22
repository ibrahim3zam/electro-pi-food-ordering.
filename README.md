#  Online Food Ordering Web Application (MVP Prototype)

This repository contains a fully responsive, fully functional **Full-Stack Online Food Ordering Web Application** prototype built in a rapid-development environment for the **Electro Pi** hiring challenge.

The application satisfies all engineering core guidelines, handles dynamic data persistence via a decoupled architecture, and features modern UI presentation alongside full localization layout mechanisms.

---

##  Key Features

*   **Complete Dynamic Menu:** Displays food items fetching information in real-time from the backend database complete with images, categories, and prices.
*   **Active Shopping Cart System:** Allows users to interactively add items to a shopping cart, recalculate totals, and securely place orders.
*   **Simulated Authentication/Login:** Mock profile handling that changes structural behavior instantly depending on user roles (`Customer` or `Admin`).
*   **Dual Payment Capability:** Flexible ordering flows supporting both *Cash on Delivery (COD)* or integrated *Online Payment via Cards*.
*   **Order Status Tracking:** Customers can view historical order items alongside active, real-time stage progression.
*   **Admin Dashboard View:** Administrative dashboard for tracking user orders, modifying order status lifecycles, and dynamically publishing new delicious meals to the store menu.
*   **Multi-language Support (Arabic & English):** Dynamic local translation context changes the entire structural orientation supporting complete **RTL (Right-to-Left)** mirroring when Arabic is selected.

---

## 🛠️ The Technology Stack

*   **Frontend UI Engine:** React.js (Vite), Axios, Tailwind CSS (Modern dynamic layout).
*   **Backend Server Runtime:** Node.js, Express.js micro-routing architecture.
*   **Database Management:** MongoDB, ODM via Mongoose Schema Modeling.

---

## 📦 Project Directory Layout

```text
Full-Stack/
├── Backend/
│   ├── server.js          # Core Express Server & RESTful Endpoints
│   ├── package.json       # Backend Dependencies
│   └── .env               # Server Environment variables
├── Frontend/
│   ├── src/
│   │   ├── App.jsx        # Unified Component UI Architecture & Language Dictionary
│   │   └── main.jsx       # React DOM Mounting Engine
│   ├── index.html         # HTML Template Entry & Tailwind Processing
│   └── package.json       # Frontend Development Tooling Scripts
└── README
