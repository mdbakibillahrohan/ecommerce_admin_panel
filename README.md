# E-Commerce Admin Panel

A robust and modular **Admin Dashboard** built with **Vue 3**, **TypeScript**, and **Ant Design Vue** for managing a multi-tenant e-commerce platform. This dashboard provides a comprehensive suite of tools for store owners and administrators to manage every aspect of their online business.

## 🚀 Features

The application is structured into modular components, offering a wide range of functionalities:

- **🔐 Authentication & Access Control**
  - Secure login with JWT token management.
  - Role-Based and Attribute-Based Access Control (RBAC/ABAC).
  - Staff management with granular permissions.

- **🏪 Store Management**
  - Create and manage multiple stores.
  - Configure store branding (logos, colors, themes).
  - Domain and URL slug management.
  - SEO and Localization settings.

- **📦 Product & Inventory Management**
  - Comprehensive product listings and editing.
  - Category and collection management.
  - Real-time inventory tracking and adjustments.

- **🛒 Order & Customer Management**
  - View and process customer orders.
  - Manage customer profiles and history.
  - Handle shipping and payment settings.

- **📂 Media Library**
  - Advanced file manager with folder organization.
  - Bulk upload, move, and delete capabilities.
  - Image preview and management.

- **📢 Marketing & Content**
  - Create and manage coupons and promotions.
  - Content Management System (CMS) for store pages.
  - Theme customization and selection.

- **⚙️ Settings & Configuration**
  - Global and store-specific configurations.
  - Regional settings (Currency, Timezone).
  - Billing and subscription management.

- **📊 Dashboard & Analytics**
  - Interactive charts and data visualization using ECharts.
  - Key performance indicators (KPIs) and business insights.

## 🛠️ Technology Stack

- **Framework:** [Vue 3](https://vuejs.org/) (Composition API)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI Library:** [Ant Design Vue](https://www.antdv.com/)
- **State Management:** [Pinia](https://pinia.vuejs.org/)
- **Routing:** [Vue Router](https://router.vuejs.org/)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Charts:** [Vue-ECharts](https://github.com/ecomfe/vue-echarts) & [ECharts](https://echarts.apache.org/)
- **Date Handling:** [Day.js](https://day.js.org/)
- **Formatting/Linting:** ESLint, Prettier

## 📂 Project Structure

The project follows a modular architecture within the `src/modules` directory:

```
src/
├── modules/
│   ├── auth/           # Authentication logic
│   ├── dashboard/      # Dashboard widgets and views
│   ├── media/          # Media library components and services
│   ├── orders/         # Order management
│   ├── products/       # Product management
│   ├── settings/       # Application settings
│   ├── shared/         # Shared components, utilities, and configs
│   ├── stores/         # Store management
│   └── ... (access-control, billing, content, etc.)
```

## 💻 Recommended Setup

### IDE

- [VS Code](https://code.visualstudio.com/)
- Extensions:
  - [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (Volar)
  - [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

### Global Dependencies

- **Node.js**: `^20.19.0` or `>=22.12.0`
- **npm** or **yarn**

## 🚀 Getting Started

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd ECommerceAdmin
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Setup Environment Variables:**
    Copy `.env.example` to `.env` and configure your API endpoints.

    ```bash
    cp .env.example .env
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

## 📜 Scripts

| Script               | Description                                            |
| :------------------- | :----------------------------------------------------- |
| `npm run dev`        | Starts the development server with HMR.                |
| `npm run build`      | Type-checks and builds the application for production. |
| `npm run preview`    | Locally preview the production build.                  |
| `npm run type-check` | Runs TypeScript type checking.                         |
| `npm run lint`       | Runs ESLint to fix and report errors.                  |
| `npm run format`     | Formats code using Prettier.                           |

## 🤝 Contributing

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.
