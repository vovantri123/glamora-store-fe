# Hướng dẫn cấu hình Cloudinary

## Bước 1: Tạo tài khoản Cloudinary

1. Truy cập [Cloudinary](https://cloudinary.com/)
2. Đăng ký tài khoản miễn phí (Free tier cung cấp 25GB storage)
3. Sau khi đăng ký, bạn sẽ được chuyển đến Dashboard

## Bước 2: Lấy Cloud Name

1. Trong Cloudinary Dashboard, bạn sẽ thấy **Cloud Name** ở góc trên bên trái
2. Copy Cloud Name này
3. Mở file `.env.local` và thay thế:
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
   ```
   Thành:
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your-actual-cloud-name>
   ```

## Bước 3: Tạo Upload Preset

Upload Preset = Bộ quy tắc upload file mà bạn định nghĩa trước trong Cloudinary Dashboard.

1. Trong Cloudinary Dashboard, click vào **Settings** (icon bánh răng ở góc trên phải)
2. Chọn tab **Upload**
3. Scroll xuống phần **Upload presets**
4. Click **Add upload preset**
5. Cấu hình như sau:
   - **Upload preset name**: `glamora_store` (hoặc tên khác, nhớ cập nhật trong .env.local)
   - **Signing Mode**: Chọn **Unsigned** để có thể upload từ client-side mà không cần xác thực bằng cách dùng đến API Keys (API Keys được dùng để xác thực khi bạn upload signed (có ký tên) hoặc thao tác server-side)
   - **Folder**: `glamora/avatars` (hoặc `glamora` thôi cũng được)
   - **Format**: auto
   - **Access mode**: Public
6. Click **Save**
