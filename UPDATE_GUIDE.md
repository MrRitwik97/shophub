# ShopHub Update Guide - Cart & Authentication Fixes

## 🚀 Quick Setup Commands

```bash
# 1. Clone/Navigate to your project
git clone https://github.com/yourusername/shophub.git
cd shophub

# 2. Install dependencies
npm install
npm install js-cookie @types/js-cookie lucide-react

# 3. Create new branch for updates
git checkout -b cart-auth-improvements

# 4. Copy the updated files (see below)

# 5. Run the project
npm run dev
```

## 📁 Files That Need Updates

### 🆕 NEW FILES TO CREATE:

1. **`src/context/CartContext.tsx`** - Complete cart management
2. **`src/components/CartSidebar.tsx`** - Shopping cart UI
3. **`src/components/CheckoutModal.tsx`** - Checkout process

### ✏️ EXISTING FILES TO UPDATE:

1. **`src/types/index.ts`** - Add cart/order interfaces
2. **`src/components/auth/LoginForm.tsx`** - Enhanced login with demo buttons
3. **`src/context/EcommerceContext.tsx`** - Fixed admin panel logic
4. **`src/components/Header.tsx`** - Cart integration + fixed admin access
5. **`src/components/ProductCard.tsx`** - Add to cart functionality
6. **`src/components/ProductDetail.tsx`** - Add to cart with quantity
7. **`src/App.tsx`** - Integrate cart provider and components

## 🔧 VS Code Setup

### Recommended Extensions:
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Importer
- Auto Rename Tag
- Prettier - Code formatter

### VS Code Settings (Optional):
Create `.vscode/settings.json`:
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

## 🏃‍♂️ Running the Project

### Development Mode:
```bash
npm run dev
```
This will start the development server at `http://localhost:5173`

### Build for Production:
```bash
npm run build
npm run preview
```

## 🧪 Testing the Features

### 1. Test Authentication:
- Go to `http://localhost:5173`
- Click "Sign In"
- Try the demo account buttons:
  - **Admin**: `admin@shophub.com` / `AdminPassword123!`
  - **Customer**: `customer@example.com` / `CustomerPass123!`

### 2. Test Cart System:
- Add products to cart
- Open cart sidebar (cart icon in header)
- Modify quantities
- Proceed to checkout (requires login)

### 3. Test Admin Panel:
- Login as admin
- Click user menu → "Admin Panel"
- Try adding/editing products

## 🔄 Git Workflow

### After copying all files:
```bash
# Stage all changes
git add .

# Commit with descriptive message
git commit -m "feat: Add complete cart system and fix authentication

- Added CartContext for cart state management
- Added CartSidebar component with quantity controls
- Added CheckoutModal with multi-step process
- Fixed admin panel access logic
- Enhanced LoginForm with demo account buttons
- Integrated cart with existing product components
- Added proper role-based access control"

# Push to GitHub
git push origin cart-auth-improvements

# Create Pull Request on GitHub
# Then merge to main branch
```

## 🐛 Troubleshooting

### Common Issues:

1. **Node modules error:**
```bash
rm -rf node_modules package-lock.json
npm install
```

2. **TypeScript errors:**
```bash
npm run type-check
```

3. **Missing dependencies:**
```bash
npm install js-cookie @types/js-cookie
```

4. **Port already in use:**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
npm run dev
```

## 📱 Features Added

### ✅ Complete Cart System:
- Add to cart from product cards/details
- Quantity management
- Cart persistence (localStorage)
- Real-time calculations (subtotal, tax, shipping)
- Multi-step checkout process

### ✅ Enhanced Authentication:
- Demo account buttons for easy testing
- Fixed admin panel access
- Role-based permissions
- Improved login UX

### ✅ Better Admin Controls:
- Admin panel only for admin users
- Product management (CRUD)
- Category management
- Proper role separation

## 🌐 Deployment Options

### Vercel (Recommended):
1. Push to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Netlify:
1. Run `npm run build`
2. Upload `dist` folder to Netlify

### GitHub Pages:
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json scripts: `"deploy": "gh-pages -d dist"`
3. Run: `npm run build && npm run deploy`

The cart and authentication system is now fully functional! 🎉