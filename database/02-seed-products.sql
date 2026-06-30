-- Seed realistic vendors
INSERT INTO vendors (id, store_name, store_description, store_logo_url, owner_id, commission_rate, is_approved, created_at, updated_at) VALUES
('vendor-001', 'Apple India', 'Official Apple Store', 'https://via.placeholder.com/100?text=Apple', 'user-001', 5, true, NOW(), NOW()),
('vendor-002', 'Samsung India', 'Samsung Official Store', 'https://via.placeholder.com/100?text=Samsung', 'user-002', 5, true, NOW(), NOW()),
('vendor-003', 'OnePlus India', 'OnePlus Official', 'https://via.placeholder.com/100?text=OnePlus', 'user-003', 5, true, NOW(), NOW()),
('vendor-004', 'Nike India', 'Nike Official Store', 'https://via.placeholder.com/100?text=Nike', 'user-004', 8, true, NOW(), NOW()),
('vendor-005', 'Adidas India', 'Adidas Official', 'https://via.placeholder.com/100?text=Adidas', 'user-005', 8, true, NOW(), NOW()),
('vendor-006', 'Sony India', 'Sony Electronics', 'https://via.placeholder.com/100?text=Sony', 'user-006', 5, true, NOW(), NOW()),
('vendor-007', 'Philips India', 'Philips Appliances', 'https://via.placeholder.com/100?text=Philips', 'user-007', 7, true, NOW(), NOW()),
('vendor-008', 'Logitech India', 'Logitech Tech', 'https://via.placeholder.com/100?text=Logitech', 'user-008', 5, true, NOW(), NOW()),
('vendor-009', 'Amazon Basics', 'Amazon Basics Store', 'https://via.placeholder.com/100?text=Amazon', 'user-009', 10, true, NOW(), NOW()),
('vendor-010', 'Levi''s India', 'Levi''s Official', 'https://via.placeholder.com/100?text=Levis', 'user-010', 8, true, NOW(), NOW());

-- Seed products: Electronics
INSERT INTO products (id, name, slug, description, short_description, category_id, vendor_id, price, compare_price, cost_price, sku, stock, rating, review_count, featured, is_active, created_at, updated_at) VALUES
('prod-001', 'iPhone 16 Pro', 'iphone-16-pro', 'Latest Apple iPhone with A18 Pro chip, 6.3-inch display, advanced camera system with ProMotion', 'Apple iPhone 16 Pro with A18 Pro', 'cat-001', 'vendor-001', 139999, 149999, 85000, 'SKU-001', 25, 4.8, 2341, true, true, NOW(), NOW()),
('prod-002', 'iPhone 16 Pro Max', 'iphone-16-pro-max', 'Premium Apple iPhone with 6.9-inch display, 48MP camera, titanium design', 'Apple iPhone 16 Pro Max', 'cat-001', 'vendor-001', 169999, 179999, 105000, 'SKU-002', 20, 4.9, 1856, true, true, NOW(), NOW()),
('prod-003', 'Samsung Galaxy S25 Ultra', 'samsung-galaxy-s25-ultra', 'Flagship Android with 200MP camera, 6.8-inch AMOLED display, S Pen included', 'Samsung Galaxy S25 Ultra', 'cat-001', 'vendor-002', 129999, 139999, 78000, 'SKU-003', 30, 4.7, 2145, true, true, NOW(), NOW()),
('prod-004', 'Samsung Galaxy S25', 'samsung-galaxy-s25', 'Samsung Galaxy S25 with 50MP camera, 6.2-inch display, all-day battery', 'Samsung Galaxy S25', 'cat-001', 'vendor-002', 79999, 89999, 48000, 'SKU-004', 40, 4.6, 1567, true, true, NOW(), NOW()),
('prod-005', 'OnePlus 13', 'oneplus-13', 'OnePlus 13 with Snapdragon 8 Elite, 120Hz display, 50W charging', 'OnePlus 13 Flagship', 'cat-001', 'vendor-003', 64999, 74999, 38000, 'SKU-005', 35, 4.5, 1234, true, true, NOW(), NOW()),
('prod-006', 'MacBook Air M3', 'macbook-air-m3', 'MacBook Air with M3 chip, 13.6-inch display, 8GB RAM, 256GB SSD', 'MacBook Air M3', 'cat-001', 'vendor-001', 119999, 129999, 72000, 'SKU-006', 15, 4.9, 3421, true, true, NOW(), NOW()),
('prod-007', 'MacBook Pro 16 M3 Max', 'macbook-pro-16-m3-max', 'MacBook Pro 16-inch with M3 Max, 36GB RAM, 1TB SSD, ProMotion display', 'MacBook Pro 16 M3 Max', 'cat-001', 'vendor-001', 249999, 269999, 150000, 'SKU-007', 10, 4.9, 2876, true, true, NOW(), NOW()),
('prod-008', 'Sony WH-1000XM5', 'sony-wh-1000xm5', 'Premium noise-cancelling wireless headphones with 30-hour battery, LDAC support', 'Sony WH-1000XM5 Headphones', 'cat-001', 'vendor-006', 29999, 34999, 15000, 'SKU-008', 50, 4.9, 5234, true, true, NOW(), NOW()),
('prod-009', 'AirPods Pro 2', 'airpods-pro-2', 'Apple AirPods Pro with active noise cancellation, spatial audio, 6-hour battery', 'Apple AirPods Pro 2', 'cat-001', 'vendor-001', 24999, 29999, 12000, 'SKU-009', 60, 4.8, 4123, true, true, NOW(), NOW()),
('prod-010', 'Samsung 55-inch 4K Smart TV', 'samsung-55-4k-tv', '55-inch 4K QLED TV with HDR support, smart features, 120Hz refresh rate', 'Samsung 55 4K TV', 'cat-001', 'vendor-002', 49999, 59999, 28000, 'SKU-010', 12, 4.8, 2876, true, true, NOW()),
('prod-011', 'LG 65-inch OLED TV', 'lg-65-oled-tv', '65-inch OLED TV with perfect blacks, 120Hz, AI upscaling, webOS', 'LG 65 OLED TV', 'cat-001', 'vendor-006', 99999, 119999, 60000, 'SKU-011', 8, 4.9, 1234, true, true, NOW()),
('prod-012', 'Dyson V15 Detect', 'dyson-v15-detect', 'Cordless vacuum with laser dust detection, 60-minute runtime, HEPA filter', 'Dyson V15 Detect Vacuum', 'cat-001', 'vendor-007', 74999, 84999, 45000, 'SKU-012', 18, 4.8, 2145, true, true, NOW()),
('prod-013', 'Logitech MX Master 3S', 'logitech-mx-master-3s', 'Advanced wireless mouse with 8K DPI, customizable buttons, USB-C charging', 'Logitech MX Master 3S', 'cat-001', 'vendor-008', 9999, 12999, 5000, 'SKU-013', 80, 4.7, 3456, true, true, NOW()),
('prod-014', 'Instant Pot Duo 7-in-1', 'instant-pot-duo', 'Multi-cooker: pressure cooker, slow cooker, rice cooker, steamer, 6L capacity', 'Instant Pot Duo 7-in-1', 'cat-001', 'vendor-009', 7999, 9999, 3500, 'SKU-014', 100, 4.7, 5678, true, true, NOW()),
('prod-015', 'Philips Air Fryer', 'philips-air-fryer', 'Digital air fryer with 1400W power, 4.1L capacity, 8 presets, rapid air technology', 'Philips Air Fryer', 'cat-001', 'vendor-007', 12999, 15999, 7000, 'SKU-015', 45, 4.6, 3234, true, true, NOW());

-- Seed products: Fashion
INSERT INTO products (id, name, slug, description, short_description, category_id, vendor_id, price, compare_price, cost_price, sku, stock, rating, review_count, featured, is_active, created_at, updated_at) VALUES
('prod-016', 'Nike Air Force 1', 'nike-air-force-1', 'Classic Nike sneakers with Air cushioning, leather upper, iconic design', 'Nike Air Force 1', 'cat-002', 'vendor-004', 8999, 10999, 4500, 'SKU-016', 100, 4.6, 4123, true, true, NOW()),
('prod-017', 'Nike Air Max 90', 'nike-air-max-90', 'Nike Air Max with visible Air unit, comfortable fit, multiple color options', 'Nike Air Max 90', 'cat-002', 'vendor-004', 9999, 11999, 5000, 'SKU-017', 90, 4.7, 3876, true, true, NOW()),
('prod-018', 'Adidas Ultraboost 22', 'adidas-ultraboost-22', 'High-performance running shoes with Boost technology, responsive cushioning', 'Adidas Ultraboost 22', 'cat-002', 'vendor-005', 12999, 15999, 7000, 'SKU-018', 70, 4.7, 3456, true, true, NOW()),
('prod-019', 'Adidas Stan Smith', 'adidas-stan-smith', 'Classic Adidas sneaker with minimalist design, comfortable fit, iconic look', 'Adidas Stan Smith', 'cat-002', 'vendor-005', 7999, 9999, 4000, 'SKU-019', 120, 4.5, 2876, true, true, NOW()),
('prod-020', 'Levi''s 501 Jeans', 'levis-501-jeans', 'Classic Levi''s denim jeans with straight fit, durable construction, timeless style', 'Levi''s 501 Jeans', 'cat-002', 'vendor-010', 4999, 6999, 2000, 'SKU-020', 150, 4.6, 5234, true, true, NOW()),
('prod-021', 'Tommy Hilfiger Polo', 'tommy-hilfiger-polo', 'Premium polo shirt with embroidered logo, comfortable cotton, classic colors', 'Tommy Hilfiger Polo', 'cat-002', 'vendor-010', 3999, 5999, 1500, 'SKU-021', 200, 4.5, 2145, true, true, NOW()),
('prod-022', 'Columbia Jacket', 'columbia-jacket', 'Waterproof outdoor jacket with thermal insulation, adjustable hood, multiple pockets', 'Columbia Outdoor Jacket', 'cat-002', 'vendor-005', 8999, 11999, 4500, 'SKU-022', 60, 4.6, 1876, true, true, NOW()),
('prod-023', 'Ray-Ban Aviator', 'ray-ban-aviator', 'Classic Ray-Ban aviator sunglasses with UV protection, metal frame, polarized lenses', 'Ray-Ban Aviator', 'cat-002', 'vendor-004', 14999, 17999, 7000, 'SKU-023', 80, 4.7, 3234, true, true, NOW()),
('prod-024', 'Apple Watch Series 9', 'apple-watch-series-9', 'Apple Watch with always-on display, fitness tracking, ECG, 18-hour battery', 'Apple Watch Series 9', 'cat-002', 'vendor-001', 39999, 44999, 20000, 'SKU-024', 40, 4.8, 2876, true, true, NOW()),
('prod-025', 'Samsung Galaxy Watch 6', 'samsung-galaxy-watch-6', 'Samsung smartwatch with AMOLED display, health tracking, 3-day battery', 'Samsung Galaxy Watch 6', 'cat-002', 'vendor-002', 24999, 29999, 12000, 'SKU-025', 50, 4.7, 2145, true, true, NOW());

-- Seed products: Home & Kitchen
INSERT INTO products (id, name, slug, description, short_description, category_id, vendor_id, price, compare_price, cost_price, sku, stock, rating, review_count, featured, is_active, created_at, updated_at) VALUES
('prod-026', 'Amazon Basics Bedsheet', 'amazon-basics-bedsheet', '100% cotton bedsheet with 400 thread count, soft and durable, multiple colors', 'Amazon Basics Bedsheet', 'cat-003', 'vendor-009', 1499, 2499, 600, 'SKU-026', 300, 4.5, 4567, true, true, NOW()),
('prod-027', 'Amazon Basics Towel Set', 'amazon-basics-towel-set', 'Set of 4 premium cotton towels, absorbent, machine washable, various colors', 'Amazon Basics Towel Set', 'cat-003', 'vendor-009', 999, 1999, 400, 'SKU-027', 250, 4.6, 3456, true, true, NOW()),
('prod-028', 'Prestige Pressure Cooker', 'prestige-pressure-cooker', '5L stainless steel pressure cooker with safety valve, induction compatible', 'Prestige Pressure Cooker', 'cat-003', 'vendor-009', 2999, 4499, 1200, 'SKU-028', 80, 4.7, 2876, true, true, NOW()),
('prod-029', 'Pigeon Non-Stick Cookware', 'pigeon-non-stick-cookware', 'Non-stick frying pan with heat-resistant handle, even heating, 28cm diameter', 'Pigeon Non-Stick Pan', 'cat-003', 'vendor-009', 1299, 2499, 500, 'SKU-029', 120, 4.6, 2145, true, true, NOW()),
('prod-030', 'Borosil Glass Containers', 'borosil-glass-containers', 'Set of 3 glass food containers with lids, microwave safe, oven safe up to 350°C', 'Borosil Glass Containers', 'cat-003', 'vendor-009', 1599, 2999, 600, 'SKU-030', 150, 4.7, 1876, true, true, NOW()),
('prod-031', 'Bajaj Mixer Grinder', 'bajaj-mixer-grinder', '750W mixer grinder with 3 jars, stainless steel blades, overload protection', 'Bajaj Mixer Grinder', 'cat-003', 'vendor-009', 3499, 5499, 1500, 'SKU-031', 60, 4.6, 2234, true, true, NOW()),
('prod-032', 'Black+Decker Toaster', 'black-decker-toaster', '2-slice toaster with 6 browning levels, bagel mode, crumb tray, 800W', 'Black+Decker Toaster', 'cat-003', 'vendor-009', 1999, 3499, 800, 'SKU-032', 90, 4.5, 1567, true, true, NOW()),
('prod-033', 'Crompton Ceiling Fan', 'crompton-ceiling-fan', '1200mm ceiling fan with 3 blades, 5-speed controller, energy efficient', 'Crompton Ceiling Fan', 'cat-003', 'vendor-009', 2499, 4499, 1000, 'SKU-033', 100, 4.6, 2876, true, true, NOW()),
('prod-034', 'Havells LED Bulb', 'havells-led-bulb', '9W LED bulb with 6500K cool white, 800 lumens, 25000 hour lifespan', 'Havells LED Bulb', 'cat-003', 'vendor-009', 299, 599, 100, 'SKU-034', 500, 4.7, 5234, true, true, NOW()),
('prod-035', 'Godrej Refrigerator', 'godrej-refrigerator', '240L double door refrigerator with inverter compressor, frost-free, energy efficient', 'Godrej Refrigerator', 'cat-003', 'vendor-009', 24999, 34999, 12000, 'SKU-035', 20, 4.6, 1234, true, true, NOW());

-- Seed product images
INSERT INTO product_images (id, product_id, image_url, alt_text, is_primary, created_at) VALUES
('img-001', 'prod-001', 'https://via.placeholder.com/400?text=iPhone+16+Pro', 'iPhone 16 Pro', true, NOW()),
('img-002', 'prod-002', 'https://via.placeholder.com/400?text=iPhone+16+Pro+Max', 'iPhone 16 Pro Max', true, NOW()),
('img-003', 'prod-003', 'https://via.placeholder.com/400?text=Galaxy+S25+Ultra', 'Galaxy S25 Ultra', true, NOW()),
('img-004', 'prod-004', 'https://via.placeholder.com/400?text=Galaxy+S25', 'Galaxy S25', true, NOW()),
('img-005', 'prod-005', 'https://via.placeholder.com/400?text=OnePlus+13', 'OnePlus 13', true, NOW()),
('img-006', 'prod-016', 'https://via.placeholder.com/400?text=Nike+Air+Force+1', 'Nike Air Force 1', true, NOW()),
('img-007', 'prod-017', 'https://via.placeholder.com/400?text=Nike+Air+Max+90', 'Nike Air Max 90', true, NOW()),
('img-008', 'prod-018', 'https://via.placeholder.com/400?text=Adidas+Ultraboost', 'Adidas Ultraboost', true, NOW()),
('img-009', 'prod-026', 'https://via.placeholder.com/400?text=Bedsheet', 'Bedsheet', true, NOW()),
('img-010', 'prod-027', 'https://via.placeholder.com/400?text=Towel+Set', 'Towel Set', true, NOW());

-- Seed product variants
INSERT INTO product_variants (id, product_id, variant_name, variant_value, price_adjustment, stock, sku) VALUES
('var-001', 'prod-001', 'Storage', '256GB', 0, 10, 'SKU-001-256GB'),
('var-002', 'prod-001', 'Storage', '512GB', 10000, 8, 'SKU-001-512GB'),
('var-003', 'prod-001', 'Storage', '1TB', 20000, 7, 'SKU-001-1TB'),
('var-004', 'prod-016', 'Size', '6', 0, 20, 'SKU-016-6'),
('var-005', 'prod-016', 'Size', '7', 0, 25, 'SKU-016-7'),
('var-006', 'prod-016', 'Size', '8', 0, 30, 'SKU-016-8'),
('var-007', 'prod-016', 'Size', '9', 0, 25, 'SKU-016-9'),
('var-008', 'prod-020', 'Size', '28', 0, 30, 'SKU-020-28'),
('var-009', 'prod-020', 'Size', '30', 0, 40, 'SKU-020-30'),
('var-010', 'prod-020', 'Size', '32', 0, 35, 'SKU-020-32');

COMMIT;
