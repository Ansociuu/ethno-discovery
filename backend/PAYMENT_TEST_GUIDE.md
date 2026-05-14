# 🚀 Hướng dẫn Test Thanh Toán với Giá 1đ

## Cách chạy Seed

### Cách 1: Chạy seed payment test riêng
```bash
cd backend
npx ts-node-dev --transpile-only prisma/seed_payment_test.ts
```

### Cách 2: Chạy qua npm script
Thêm script vào `package.json`:
```json
"db:seed:payment": "ts-node-dev --transpile-only prisma/seed_payment_test.ts"
```

Sau đó chạy:
```bash
npm run db:seed:payment
```

## 🎯 Dữ liệu tạo ra

### Tài khoản Test
- **Email**: `payment.test@ethnodiscovery.vn`
- **Mật khẩu**: `test123456`

### Sản phẩm Test
1. **Tour Test 1 Đồng**
   - Tiêu đề: "Tour Test Thanh Toán 1 Đồng"
   - Slug: `test-payment-tour-1dong`
   - Giá: **0.01 đ** (1 đồng)

2. **Homestay Test 1 Đồng**
   - Tên: "Homestay Test Thanh Toán 1 Đồng"
   - Slug: `test-payment-homestay-1dong`
   - Giá: **0.01 đ** (1 đồng)

### Booking Test
- **Booking Tour Test**: ID được tạo tự động
- **Booking Homestay Test**: ID được tạo tự động
- **Giá mỗi booking**: 0.01 đ

## 🧪 Quy trình Test Thanh Toán

1. **Đăng nhập frontend** với:
   - Email: `payment.test@ethnodiscovery.vn`
   - Password: `test123456`

2. **Truy cập trang Bookings** (`/bookings`)

3. **Tìm booking test** (ID được hiển thị sau khi chạy seed)

4. **Nhấn nút Thanh Toán** để test payment gateway

5. **Kiểm tra hành động**:
   - Xác nhận redirect đến trang thanh toán
   - Kiểm tra Payment record được tạo với `amount = 0.01`
   - Test callback/webhook từ SePay (nếu có)

## 💡 Lợi ích của giá 1đ

✅ Chi phí test thực tế rất nhỏ (gần như không)
✅ Kiểm tra quy trình payment end-to-end
✅ Test validate price calculations
✅ Không ảnh hưởng đến dữ liệu production thật
✅ Dễ dàng tạo nhiều test cases khác nhau

## 🔄 Reset dữ liệu test

Nếu muốn xoá toàn bộ dữ liệu test:

```bash
# Trong MySQL
DELETE FROM bookings WHERE user_id IN (SELECT id FROM users WHERE email = 'payment.test@ethnodiscovery.vn');
DELETE FROM payments WHERE user_id IN (SELECT id FROM users WHERE email = 'payment.test@ethnodiscovery.vn');
DELETE FROM users WHERE email = 'payment.test@ethnodiscovery.vn';

# Hoặc reset toàn bộ database
npm run db:reset
```

## 📝 Ghi chú

- File seed: `backend/prisma/seed_payment_test.ts`
- Giá được lưu dưới dạng **Decimal(12, 2)** nên 0.01 = 1 đơn vị tiền tệ nhỏ nhất
- Tất cả dữ liệu test được flags với `PENDING` status để dễ nhận diện
- Có thể tạo nhiều booking từ cùng 1 user để test multiple payments
