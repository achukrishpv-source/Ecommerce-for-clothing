require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const Product  = require('./models/Product');
const User     = require('./models/User');
const Order    = require('./models/Order');

// ─── PRODUCTS ───────────────────────────────────────────────────────────────
const products = [
  // MEN
  { name:'Oxford Formal Shirt',       price:1199, originalPrice:1799, discount:33, category:'men', subcategory:'shirts',  image:'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400&q=80', sizes:['S','M','L','XL','XXL'], colors:['White','Blue','Black'], stock:80,  rating:5, reviews:147, badge:'New' },
  { name:'Graphic Oversize Tee',      price:799,  originalPrice:1199, discount:33, category:'men', subcategory:'tshirts', image:'https://images.unsplash.com/photo-1565693413579-8ff3fdc1b03b?w=400&q=80', sizes:['S','M','L','XL','XXL'], colors:['Black','White','Grey'], stock:120, rating:5, reviews:302, badge:'Trending' },
  { name:'Slim Fit Dark Wash Jeans',  price:1599, originalPrice:2499, discount:36, category:'men', subcategory:'jeans',   image:'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80', sizes:['28','30','32','34','36'], colors:['Dark Blue','Black'], stock:60, rating:4, reviews:189, badge:'' },
  { name:'Fleece Pullover Hoodie',    price:1499, originalPrice:2199, discount:32, category:'men', subcategory:'hoodies', image:'https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?w=400&q=80', sizes:['S','M','L','XL','XXL'], colors:['Black','Grey','Navy'], stock:90, rating:5, reviews:267, badge:'New' },
  { name:'Leather Bomber Jacket',     price:3999, originalPrice:6499, discount:38, category:'men', subcategory:'jackets', image:'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80', sizes:['S','M','L','XL'], colors:['Black','Brown'], stock:40, rating:5, reviews:143, badge:'Trending' },
  { name:'Linen Casual Shirt',        price:899,  originalPrice:1399, discount:36, category:'men', subcategory:'shirts',  image:'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=400&q=80', sizes:['S','M','L','XL','XXL'], colors:['White','Beige','Blue'], stock:100, rating:4, reviews:98, badge:'Sale' },
  { name:'Cargo Jogger Pants',        price:1299, originalPrice:1999, discount:35, category:'men', subcategory:'jeans',   image:'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&q=80', sizes:['S','M','L','XL','XXL'], colors:['Olive','Black','Grey'], stock:75, rating:5, reviews:211, badge:'New' },
  { name:'Plain Cotton T-Shirt',      price:499,  originalPrice:799,  discount:38, category:'men', subcategory:'tshirts', image:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80', sizes:['S','M','L','XL','XXL'], colors:['White','Black','Navy','Grey'], stock:200, rating:4, reviews:534, badge:'' },
  { name:'Denim Street Jacket',       price:2299, originalPrice:3499, discount:34, category:'men', subcategory:'jackets', image:'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400&q=80', sizes:['S','M','L','XL'], colors:['Light Blue','Dark Blue'], stock:50, rating:5, reviews:176, badge:'Trending' },
  { name:'Polo Collar T-Shirt',       price:649,  originalPrice:999,  discount:35, category:'men', subcategory:'tshirts', image:'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&q=80', sizes:['S','M','L','XL','XXL'], colors:['White','Black','Navy'], stock:110, rating:4, reviews:312, badge:'' },
  { name:'Relaxed Fit Chinos',        price:1199, originalPrice:1799, discount:33, category:'men', subcategory:'jeans',   image:'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&q=80', sizes:['28','30','32','34','36'], colors:['Khaki','Navy','Olive'], stock:65, rating:5, reviews:178, badge:'New' },
  { name:'Zip-Up Hoodie',             price:1799, originalPrice:2699, discount:33, category:'men', subcategory:'hoodies', image:'https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?w=400&q=80', sizes:['S','M','L','XL','XXL'], colors:['Black','Grey','Maroon'], stock:85, rating:5, reviews:245, badge:'Trending' },
  { name:'Mandarin Collar Shirt',     price:1099, originalPrice:1599, discount:31, category:'men', subcategory:'shirts',  image:'https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=400&q=80', sizes:['S','M','L','XL'], colors:['White','Black'], stock:55, rating:4, reviews:134, badge:'' },
  { name:'Puffer Winter Jacket',      price:3499, originalPrice:5499, discount:36, category:'men', subcategory:'jackets', image:'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80', sizes:['S','M','L','XL','XXL'], colors:['Black','Navy','Olive'], stock:35, rating:5, reviews:89, badge:'New' },
  { name:'Striped Casual Shirt',      price:799,  originalPrice:1199, discount:33, category:'men', subcategory:'shirts',  image:'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80', sizes:['S','M','L','XL','XXL'], colors:['Blue/White','Black/White'], stock:90, rating:4, reviews:201, badge:'Sale' },
  // WOMEN
  { name:'Premium Banarasi Silk Saree', price:2999, originalPrice:4999, discount:40, category:'women', subcategory:'sarees',  image:'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80', sizes:['Free Size'], colors:['Red','Blue','Green','Pink'], stock:45, rating:5, reviews:234, badge:'Premium' },
  { name:'Embroidered Cotton Kurti',    price:999,  originalPrice:1599, discount:38, category:'women', subcategory:'kurtis',  image:'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400&q=80', sizes:['XS','S','M','L','XL','XXL'], colors:['White','Yellow','Pink'], stock:100, rating:5, reviews:187, badge:'New' },
  { name:'Floral Maxi Dress',           price:1799, originalPrice:2799, discount:36, category:'women', subcategory:'dresses', image:'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=400&q=80', sizes:['XS','S','M','L','XL'], colors:['Floral','Blue','Pink'], stock:70, rating:5, reviews:312, badge:'Trending' },
  { name:'Casual Crop Top',             price:599,  originalPrice:899,  discount:33, category:'women', subcategory:'tops',    image:'https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=400&q=80', sizes:['XS','S','M','L','XL'], colors:['White','Black','Pink','Yellow'], stock:150, rating:4, reviews:423, badge:'' },
  { name:'High Waist Skinny Jeans',     price:1299, originalPrice:1999, discount:35, category:'women', subcategory:'jeans',   image:'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&q=80', sizes:['26','28','30','32','34'], colors:['Blue','Black'], stock:80, rating:5, reviews:278, badge:'Sale' },
  { name:'Anarkali Ethnic Suit Set',    price:2199, originalPrice:3499, discount:37, category:'women', subcategory:'kurtis',  image:'https://images.unsplash.com/photo-1594897030264-ab7d87efc473?w=400&q=80', sizes:['XS','S','M','L','XL','XXL'], colors:['Red','Green','Blue'], stock:50, rating:5, reviews:156, badge:'Premium' },
  { name:'Women Formal Blazer',         price:2499, originalPrice:3999, discount:38, category:'women', subcategory:'tops',    image:'https://images.unsplash.com/photo-1548549557-dbe9155463e0?w=400&q=80', sizes:['XS','S','M','L','XL'], colors:['Black','White','Navy'], stock:40, rating:5, reviews:119, badge:'New' },
  { name:'Printed Cotton Saree',        price:1299, originalPrice:2099, discount:38, category:'women', subcategory:'sarees',  image:'https://images.unsplash.com/photo-1617627143233-8cf1d3f29a25?w=400&q=80', sizes:['Free Size'], colors:['Blue','Pink','Yellow','Green'], stock:60, rating:4, reviews:203, badge:'Sale' },
  { name:'Floral Mini Skirt',           price:899,  originalPrice:1499, discount:40, category:'women', subcategory:'dresses', image:'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&q=80', sizes:['XS','S','M','L','XL'], colors:['Floral','Black'], stock:65, rating:5, reviews:287, badge:'Trending' },
  { name:'Palazzo Pants',               price:899,  originalPrice:1399, discount:36, category:'women', subcategory:'jeans',   image:'https://images.unsplash.com/photo-1533659124865-d6072dc035e1?w=400&q=80', sizes:['XS','S','M','L','XL','XXL'], colors:['Black','White','Navy'], stock:90, rating:5, reviews:189, badge:'New' },
  { name:'Ruffle Sleeve Top',           price:749,  originalPrice:1199, discount:38, category:'women', subcategory:'tops',    image:'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&q=80', sizes:['XS','S','M','L','XL'], colors:['White','Pink','Black'], stock:85, rating:4, reviews:211, badge:'Trending' },
  { name:'Chanderi Silk Kurti',         price:1599, originalPrice:2499, discount:36, category:'women', subcategory:'kurtis',  image:'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80', sizes:['XS','S','M','L','XL','XXL'], colors:['Gold','Pink','Green'], stock:45, rating:5, reviews:143, badge:'Premium' },
  { name:'Wrap Midi Dress',             price:1399, originalPrice:2199, discount:36, category:'women', subcategory:'dresses', image:'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80', sizes:['XS','S','M','L','XL'], colors:['Floral','Black','Red'], stock:55, rating:5, reviews:267, badge:'' },
  { name:'Banarasi Georgette Saree',    price:3499, originalPrice:5999, discount:42, category:'women', subcategory:'sarees',  image:'https://images.unsplash.com/photo-1617627143233-8cf1d3f29a25?w=400&q=80', sizes:['Free Size'], colors:['Red','Purple','Green','Pink'], stock:30, rating:5, reviews:98, badge:'Premium' },
  { name:'Printed Crop Hoodie',         price:1099, originalPrice:1699, discount:35, category:'women', subcategory:'tops',    image:'https://images.unsplash.com/photo-1548549557-dbe9155463e0?w=400&q=80', sizes:['XS','S','M','L','XL'], colors:['Pink','White','Black'], stock:70, rating:4, reviews:176, badge:'New' },
  // KIDS
  { name:'Fun Graphic T-Shirt',    price:399, originalPrice:599,  discount:33, category:'kids', subcategory:'boys',   image:'https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=400&q=80', sizes:['4Y','6Y','8Y','10Y','12Y'], colors:['Red','Blue','Yellow'], stock:120, rating:5, reviews:89, badge:'New' },
  { name:'Princess Floral Frock',  price:699, originalPrice:999,  discount:30, category:'kids', subcategory:'girls',  image:'https://images.unsplash.com/photo-1476234251651-f353703a034d?w=400&q=80', sizes:['2Y','4Y','6Y','8Y'], colors:['Pink','Purple','White'], stock:80, rating:5, reviews:132, badge:'Trending' },
  { name:'Soft Baby Romper Set',   price:499, originalPrice:799,  discount:38, category:'kids', subcategory:'infant', image:'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=400&q=80', sizes:['0-3M','3-6M','6-12M','12-18M'], colors:['Yellow','White','Blue'], stock:100, rating:5, reviews:78, badge:'New' },
  { name:'Slim Fit Kids Jeans',    price:799, originalPrice:1199, discount:33, category:'kids', subcategory:'boys',   image:'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&q=80', sizes:['5Y','7Y','9Y','11Y','13Y'], colors:['Dark Blue','Black'], stock:70, rating:4, reviews:54, badge:'' },
  { name:'Cute Printed Leggings',  price:349, originalPrice:549,  discount:36, category:'kids', subcategory:'girls',  image:'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=400&q=80', sizes:['3Y','5Y','7Y','9Y','11Y'], colors:['Pink','Black','Blue'], stock:130, rating:5, reviews:98, badge:'Sale' },
  { name:'Cozy Winter Sweatshirt', price:899, originalPrice:1399, discount:36, category:'kids', subcategory:'school', image:'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&q=80', sizes:['5Y','7Y','9Y','11Y','13Y'], colors:['Navy','Grey','Red'], stock:85, rating:5, reviews:67, badge:'' },
  { name:'Boys Cargo Shorts',      price:449, originalPrice:699,  discount:36, category:'kids', subcategory:'boys',   image:'https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=400&q=80', sizes:['5Y','7Y','9Y','11Y'], colors:['Khaki','Black','Blue'], stock:95, rating:5, reviews:112, badge:'New' },
  { name:'Girls Floral Dress',     price:599, originalPrice:999,  discount:40, category:'kids', subcategory:'girls',  image:'https://images.unsplash.com/photo-1476234251651-f353703a034d?w=400&q=80', sizes:['2Y','4Y','6Y','8Y'], colors:['Floral','Pink','White'], stock:75, rating:5, reviews:156, badge:'Trending' },
  { name:'Baby Bodysuit Set',      price:399, originalPrice:649,  discount:39, category:'kids', subcategory:'infant', image:'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=400&q=80', sizes:['0-3M','3-6M','6-12M'], colors:['White','Yellow','Blue'], stock:110, rating:5, reviews:87, badge:'New' },
  { name:'Kids School Uniform Set',price:899, originalPrice:1299, discount:31, category:'kids', subcategory:'school', image:'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&q=80', sizes:['5Y','7Y','9Y','11Y','13Y'], colors:['White/Navy'], stock:200, rating:4, reviews:203, badge:'' },
  { name:'Girls Embroidered Kurti',price:499, originalPrice:799,  discount:38, category:'kids', subcategory:'girls',  image:'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=400&q=80', sizes:['4Y','6Y','8Y','10Y','12Y'], colors:['Pink','Yellow','Green'], stock:70, rating:5, reviews:134, badge:'Sale' },
  { name:'Boys Printed Hoodie',    price:799, originalPrice:1199, discount:33, category:'kids', subcategory:'boys',   image:'https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?w=400&q=80', sizes:['6Y','8Y','10Y','12Y','14Y'], colors:['Blue','Red','Black'], stock:80, rating:5, reviews:91, badge:'New' },
  // ACCESSORIES
  { name:'Premium Leather Wallet',    price:899,  originalPrice:1499, discount:40, category:'accessories', subcategory:'wallets',   image:'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80', sizes:['One Size'], colors:['Brown','Black'], stock:150, rating:5, reviews:234, badge:'New' },
  { name:'Aviator Sunglasses UV400',  price:699,  originalPrice:1199, discount:42, category:'accessories', subcategory:'eyewear',   image:'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&q=80', sizes:['One Size'], colors:['Black','Gold'], stock:120, rating:5, reviews:178, badge:'Trending' },
  { name:'Steel Chain Bracelet',      price:599,  originalPrice:999,  discount:40, category:'accessories', subcategory:'jewellery', image:'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80', sizes:['One Size'], colors:['Silver'], stock:100, rating:4, reviews:112, badge:'' },
  { name:'Street Baseball Cap',       price:449,  originalPrice:749,  discount:40, category:'accessories', subcategory:'caps',      image:'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&q=80', sizes:['One Size'], colors:['Black','White','Red'], stock:180, rating:5, reviews:289, badge:'New' },
  { name:'Premium Analog Watch',      price:2499, originalPrice:4999, discount:50, category:'accessories', subcategory:'watches',   image:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80', sizes:['One Size'], colors:['Silver','Gold'], stock:60, rating:5, reviews:345, badge:'Trending' },
  { name:'Genuine Leather Belt',      price:599,  originalPrice:999,  discount:40, category:'accessories', subcategory:'belts',     image:'https://images.unsplash.com/photo-1624222247344-550fb60fe8ff?w=400&q=80', sizes:['32','34','36','38'], colors:['Black','Brown'], stock:130, rating:4, reviews:156, badge:'Sale' },
  { name:'Gold Pendant Necklace',     price:1299, originalPrice:2199, discount:41, category:'accessories', subcategory:'jewellery', image:'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80', sizes:['One Size'], colors:['Gold'], stock:90, rating:5, reviews:412, badge:'New' },
  { name:'Gold Hoop Earrings',        price:799,  originalPrice:1299, discount:38, category:'accessories', subcategory:'jewellery', image:'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400&q=80', sizes:['One Size'], colors:['Gold'], stock:110, rating:5, reviews:298, badge:'Trending' },
  { name:'Premium Tote Handbag',      price:1899, originalPrice:3499, discount:46, category:'accessories', subcategory:'bags',      image:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80', sizes:['One Size'], colors:['Tan','Black','Brown'], stock:55, rating:5, reviews:367, badge:'New' },
  { name:'Gold Bangle Set (Set of 6)',price:1099, originalPrice:1799, discount:39, category:'accessories', subcategory:'jewellery', image:'https://images.unsplash.com/photo-1573408301185-9519f94ddb72?w=400&q=80', sizes:['2.4','2.6','2.8'], colors:['Gold'], stock:80, rating:5, reviews:523, badge:'' },
  { name:'Silk Printed Scarf',        price:599,  originalPrice:999,  discount:40, category:'accessories', subcategory:'scarves',   image:'https://images.unsplash.com/photo-1601924351433-3d7544f03dcc?w=400&q=80', sizes:['One Size'], colors:['Multicolor'], stock:100, rating:4, reviews:144, badge:'Sale' },
  { name:'Silver Stone Ring',         price:499,  originalPrice:899,  discount:44, category:'accessories', subcategory:'jewellery', image:'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80', sizes:['5','6','7','8','9'], colors:['Silver'], stock:120, rating:5, reviews:267, badge:'Trending' },
  { name:'Kids Floral Hairband Set',  price:299,  originalPrice:499,  discount:40, category:'accessories', subcategory:'kids',      image:'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400&q=80', sizes:['One Size'], colors:['Multicolor'], stock:200, rating:5, reviews:189, badge:'New' },
  { name:'Kids Cartoon Backpack',     price:799,  originalPrice:1299, discount:38, category:'accessories', subcategory:'bags',      image:'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80', sizes:['One Size'], colors:['Blue','Red','Pink'], stock:90, rating:5, reviews:312, badge:'Trending' },
  { name:'Bead Bracelet Set (Pack 3)',price:199,  originalPrice:349,  discount:43, category:'accessories', subcategory:'jewellery', image:'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80', sizes:['One Size'], colors:['Multicolor'], stock:250, rating:5, reviews:224, badge:'' },
  { name:'Kids Summer Cap',           price:349,  originalPrice:599,  discount:42, category:'accessories', subcategory:'kids',      image:'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=400&q=80', sizes:['One Size'], colors:['Yellow','Blue','Red'], stock:160, rating:4, reviews:98, badge:'New' },
  { name:'Kids Butterfly Necklace',   price:249,  originalPrice:449,  discount:45, category:'accessories', subcategory:'jewellery', image:'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&q=80', sizes:['One Size'], colors:['Pink','Purple'], stock:180, rating:5, reviews:167, badge:'Sale' },
  { name:'Kids UV Sunglasses',        price:299,  originalPrice:549,  discount:46, category:'accessories', subcategory:'eyewear',   image:'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=400&q=80', sizes:['One Size'], colors:['Blue','Pink','Red'], stock:140, rating:5, reviews:143, badge:'Trending' },
];

// ─── SEED ────────────────────────────────────────────────────────────────────
async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected to:', mongoose.connection.name);

  // 1. PRODUCTS
  await Product.deleteMany({});
  const insertedProducts = await Product.insertMany(products);
  console.log(`✅ Products seeded: ${insertedProducts.length}`);

  // 2. USERS — 2 sample users
  await User.deleteMany({});
  const hash1 = await bcrypt.hash('password123', 10);
  const hash2 = await bcrypt.hash('password123', 10);
  const users = await User.insertMany([
    {
      name: 'Ashwath Krishna',
      email: 'ashwath@askrclothing.com',
      phone: '+91 98765 43210',
      password: hash1,
      cart: [],
      wishlist: []
    },
    {
      name: 'Test Customer',
      email: 'customer@example.com',
      phone: '+91 99999 88888',
      password: hash2,
      cart: [
        { productId: insertedProducts[0]._id.toString(), name: insertedProducts[0].name, price: insertedProducts[0].price, image: insertedProducts[0].image, size: 'M', color: 'Black', qty: 1 },
        { productId: insertedProducts[3]._id.toString(), name: insertedProducts[3].name, price: insertedProducts[3].price, image: insertedProducts[3].image, size: 'L', color: 'Grey',  qty: 2 }
      ],
      wishlist: [
        { productId: insertedProducts[4]._id.toString(), name: insertedProducts[4].name, price: insertedProducts[4].price, image: insertedProducts[4].image, category: 'men' }
      ]
    }
  ]);
  console.log(`✅ Users seeded: ${users.length}`);

  // 3. ORDERS — 3 sample orders linked to test customer
  await Order.deleteMany({});
  const orders = await Order.insertMany([
    {
      user: users[1]._id,
      items: [
        { productId: insertedProducts[0]._id.toString(), name: insertedProducts[0].name, price: insertedProducts[0].price, image: insertedProducts[0].image, size: 'M', color: 'White', qty: 1 },
        { productId: insertedProducts[2]._id.toString(), name: insertedProducts[2].name, price: insertedProducts[2].price, image: insertedProducts[2].image, size: '32', color: 'Dark Blue', qty: 1 }
      ],
      address: { name: 'Test Customer', phone: '+91 99999 88888', street: 'Ganapathy Main Road', city: 'Coimbatore', state: 'Tamil Nadu', pincode: '641006' },
      payment: { method: 'UPI', status: 'paid' },
      total: insertedProducts[0].price + insertedProducts[2].price,
      status: 'delivered',
      trackingId: 'ASKR-TRK-001'
    },
    {
      user: users[1]._id,
      items: [
        { productId: insertedProducts[16]._id.toString(), name: insertedProducts[16].name, price: insertedProducts[16].price, image: insertedProducts[16].image, size: 'Free Size', color: 'Red', qty: 1 }
      ],
      address: { name: 'Test Customer', phone: '+91 99999 88888', street: 'Ganapathy Main Road', city: 'Coimbatore', state: 'Tamil Nadu', pincode: '641006' },
      payment: { method: 'Credit/Debit Card', status: 'paid' },
      total: insertedProducts[16].price,
      status: 'shipped',
      trackingId: 'ASKR-TRK-002'
    },
    {
      user: users[1]._id,
      items: [
        { productId: insertedProducts[3]._id.toString(), name: insertedProducts[3].name, price: insertedProducts[3].price, image: insertedProducts[3].image, size: 'L', color: 'Black', qty: 2 }
      ],
      address: { name: 'Test Customer', phone: '+91 99999 88888', street: 'Ganapathy Main Road', city: 'Coimbatore', state: 'Tamil Nadu', pincode: '641006' },
      payment: { method: 'Cash on Delivery', status: 'pending' },
      total: insertedProducts[3].price * 2,
      status: 'placed',
      trackingId: 'ASKR-TRK-003'
    }
  ]);
  console.log(`✅ Orders seeded: ${orders.length}`);

  console.log('\n📦 MongoDB Atlas Collections Summary:');
  console.log(`   products : ${insertedProducts.length} documents`);
  console.log(`   users    : ${users.length} documents`);
  console.log(`   orders   : ${orders.length} documents`);
  console.log('\n🔑 Test Login Credentials:');
  console.log('   Email    : customer@example.com');
  console.log('   Password : password123');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => { console.error('❌ Seed failed:', err.message); process.exit(1); });
