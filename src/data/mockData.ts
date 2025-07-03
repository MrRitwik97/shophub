import { Product, Category } from '../types';

export const categories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    slug: 'electronics',
    subcategories: [
      { id: '1-1', name: 'Smartphones', slug: 'smartphones', parentId: '1' },
      { id: '1-2', name: 'Laptops', slug: 'laptops', parentId: '1' },
      { id: '1-3', name: 'Headphones', slug: 'headphones', parentId: '1' },
    ]
  },
  {
    id: '2',
    name: 'Clothing',
    slug: 'clothing',
    subcategories: [
      { id: '2-1', name: 'Men\'s Clothing', slug: 'mens-clothing', parentId: '2' },
      { id: '2-2', name: 'Women\'s Clothing', slug: 'womens-clothing', parentId: '2' },
      { id: '2-3', name: 'Accessories', slug: 'accessories', parentId: '2' },
    ]
  },
  {
    id: '3',
    name: 'Home & Garden',
    slug: 'home-garden',
    subcategories: [
      { id: '3-1', name: 'Furniture', slug: 'furniture', parentId: '3' },
      { id: '3-2', name: 'Decor', slug: 'decor', parentId: '3' },
      { id: '3-3', name: 'Kitchen', slug: 'kitchen', parentId: '3' },
    ]
  },
  {
    id: '4',
    name: 'Sports & Fitness',
    slug: 'sports-fitness',
    subcategories: [
      { id: '4-1', name: 'Equipment', slug: 'equipment', parentId: '4' },
      { id: '4-2', name: 'Apparel', slug: 'apparel', parentId: '4' },
      { id: '4-3', name: 'Accessories', slug: 'accessories', parentId: '4' },
    ]
  }
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    images: [
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/8534088/pexels-photo-8534088.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    regularPrice: 24999,
    discountedPrice: 20799,
    category: 'Electronics',
    subcategory: 'Headphones',
    description: 'Experience premium sound quality with our wireless headphones. Features noise cancellation, 30-hour battery life, and comfortable over-ear design.',
    stock: 25,
    featured: true,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Modern Laptop Computer',
    images: [
      'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/374074/pexels-photo-374074.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    regularPrice: 108299,
    discountedPrice: 91599,
    category: 'Electronics',
    subcategory: 'Laptops',
    description: 'High-performance laptop with 16GB RAM, 512GB SSD, and Intel i7 processor. Perfect for work and entertainment.',
    stock: 12,
    featured: true,
    createdAt: new Date('2024-01-20')
  },
  {
    id: '3',
    name: 'Stylish Men\'s Jacket',
    images: [
      'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    regularPrice: 12499,
    category: 'Clothing',
    subcategory: 'Men\'s Clothing',
    description: 'Premium quality jacket made from sustainable materials. Water-resistant and perfect for all seasons.',
    stock: 18,
    featured: false,
    createdAt: new Date('2024-01-10')
  },
  {
    id: '4',
    name: 'Elegant Women\'s Dress',
    images: [
      'https://images.pexels.com/photos/1007018/pexels-photo-1007018.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1566412/pexels-photo-1566412.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    regularPrice: 7499,
    discountedPrice: 5829,
    category: 'Clothing',
    subcategory: 'Women\'s Clothing',
    description: 'Elegant dress perfect for special occasions. Made from premium fabric with attention to detail.',
    stock: 22,
    featured: true,
    createdAt: new Date('2024-01-25')
  },
  {
    id: '5',
    name: 'Modern Coffee Table',
    images: [
      'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    regularPrice: 33299,
    discountedPrice: 29129,
    category: 'Home & Garden',
    subcategory: 'Furniture',
    description: 'Sleek and modern coffee table made from sustainable oak wood. Perfect centerpiece for your living room.',
    stock: 8,
    featured: false,
    createdAt: new Date('2024-01-12')
  },
  {
    id: '6',
    name: 'Professional Yoga Mat',
    images: [
      'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/4498151/pexels-photo-4498151.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    regularPrice: 6659,
    discountedPrice: 4999,
    category: 'Sports & Fitness',
    subcategory: 'Equipment',
    description: 'Premium yoga mat with excellent grip and cushioning. Perfect for yoga, pilates, and general fitness.',
    stock: 35,
    featured: true,
    createdAt: new Date('2024-01-18')
  },
  {
    id: '7',
    name: 'Smartphone Pro Max',
    images: [
      'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2643698/pexels-photo-2643698.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    regularPrice: 83299,
    discountedPrice: 74999,
    category: 'Electronics',
    subcategory: 'Smartphones',
    description: 'Latest flagship smartphone with advanced camera system, 5G connectivity, and all-day battery life.',
    stock: 15,
    featured: true,
    createdAt: new Date('2024-01-22')
  },
  {
    id: '8',
    name: 'Designer Handbag',
    images: [
      'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    regularPrice: 16659,
    category: 'Clothing',
    subcategory: 'Accessories',
    description: 'Luxury handbag crafted from genuine leather. Features multiple compartments and adjustable strap.',
    stock: 20,
    featured: false,
    createdAt: new Date('2024-01-08')
  }
];