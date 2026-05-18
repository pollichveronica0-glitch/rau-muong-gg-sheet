# Hướng Dẫn Tạo Google Apps Script URL

## Bước 1: Tạo Google Sheet

1. Vào [sheets.google.com](https://sheets.google.com) → tạo sheet mới
2. Thêm tiêu đề hàng 1:

| Ngày | Giờ | Họ Tên | Số Điện Thoại | Địa Chỉ | Số Lượng | Giá | IP | Ghi Chú | Trạng thái |
|------|-----|--------|---------------|---------|----------|-----|----|---------|------------|

3. Copy ID từ URL:
```
https://docs.google.com/spreadsheets/d/[COPY_PHẦN_NÀY]/edit
```

---

## Bước 2: Tạo Apps Script

1. Vào [script.google.com](https://script.google.com)
2. Đăng nhập bằng tài khoản Google (cùng tài khoản với Google Sheet)
3. Click nút **"+ Dự án mới"** ở góc trên bên trái
4. Giao diện editor hiện ra, bên trái có file **"Mã.gs"** → click vào
5. Bôi đen toàn bộ code mặc định (`function myFunction() {...}`) → xóa đi
6. Dán đoạn code bên dưới vào:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp
      .openById('DÁN_ID_SHEET_VÀO_ĐÂY')
      .getActiveSheet();
    
    const data = JSON.parse(e.postData.contents);
    
    const now = new Date();
    const date = Utilities.formatDate(now, 'Asia/Ho_Chi_Minh', 'dd/MM/yyyy');
    const time = Utilities.formatDate(now, 'Asia/Ho_Chi_Minh', 'HH:mm:ss');

    sheet.appendRow([
      date,
      time,
      data.name     || '',
      data.phone    || '',
      data.address  || '',
      data.quantity || '',
      data.price    || '',
      data.ip       || '',
      data.note     || '',
      'Mới'
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

7. Thay `DÁN_ID_SHEET_VÀO_ĐÂY` bằng ID Sheet vừa copy ở Bước 1
8. Đặt tên project: click vào **"Dự án không có tiêu đề"** góc trên → đặt tên ví dụ `order-sheet`
9. **Ctrl+S** để lưu

---

## Bước 3: Deploy

```
Click "Triển khai" → "Triển khai mới"
→ Click icon ⚙️ → chọn "Ứng dụng web"
→ Thực thi với tư cách: "Tôi"
→ Người có quyền truy cập: "Mọi người"
→ Click "Triển khai"
→ Chọn tài khoản Gmail → "Nâng cao" → "Truy cập (không an toàn)" → "Cho phép"
→ Copy URL
```

---

## Bước 4: Test bằng curl

```bash
curl -L -X POST "DÁN_URL_VÀO_ĐÂY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nguyễn Văn A",
    "phone": "0909123456",
    "address": "123 đường test",
    "quantity": "10",
    "price": "150000",
    "ip": "1.2.3.4",
    "note": "test"
  }'
```

Thấy `{"status":"ok"}` → vào Sheet kiểm tra có data là thành công ✅

---

## Bước 5: Tích hợp vào FE

```javascript
await fetch('URL_CỦA_BẠN', {
  method: 'POST',
  mode: 'no-cors', // bắt buộc để tránh CORS
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Nguyễn Văn A',
    phone: '0909123456',
    address: '123 đường test',
    quantity: '10',
    price: '150000',
    ip: '1.2.3.4',
    note: 'ghi chú'
  })
});
```

> ⚠️ Dùng `mode: 'no-cors'` thì không đọc được response nhưng data vẫn ghi vào Sheet bình thường.

---

## Lưu Ý Quan Trọng

### Mỗi lần sửa code phải deploy lại
```
Triển khai → Quản lý các lần triển khai → ✏️ → Triển khai
```

### Bảo mật cơ bản (khuyến nghị)
Thêm token để chống spam:

### Tài khoản google sheet vào cùng 1 tài khoản với tài khoản tạo Apps Script

```javascript
// Apps Script - kiểm tra token
if (data.token !== 'your_secret_token') return;
```

```javascript
// FE - gửi kèm token
body: JSON.stringify({
  ...data,
  token: 'your_secret_token'
})
```

### Key data FE phải khớp với Apps Script

| FE gửi | Apps Script đọc |
|--------|----------------|
| `name` | `data.name` |
| `phone` | `data.phone` |
| `address` | `data.address` |
| `quantity` | `data.quantity` |
| `price` | `data.price` |
| `ip` | `data.ip` |
| `note` | `data.note` |