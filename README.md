# AuthGuard - Branch-Aware Authentication System

Hệ thống xác thực dành cho trường học với nhiều chi nhánh, sử dụng Google OAuth2 để đăng nhập.

## 🚀 Tính năng chính

### ✅ Branch-Aware Authentication
- Chọn chi nhánh trước khi đăng nhập
- Xác thực email theo danh sách được phép cho từng chi nhánh
- Chỉ hỗ trợ Google OAuth2 authentication

### ✅ Quản lý Chi nhánh (Admin only)
- Xem danh sách tất cả chi nhánh
- Quản lý email được phép cho từng chi nhánh
- Thêm/xóa email khỏi danh sách

### ✅ Tự động làm mới token
- Auto refresh JWT token trước khi hết hạn
- Xử lý logout tự động khi refresh token hết hạn

## 🏗️ Cấu trúc dự án

```
client/
├── src/
│   ├── components/
│   │   ├── BranchSelector.tsx          # Component chọn chi nhánh
│   │   ├── HumanVerifyScreen.tsx       # Cloudflare Turnstile verification
│   │   └── layout/
│   ├── hooks/
│   │   ├── use-auth.ts                 # Auth hook với OAuth2 support
│   │   ├── use-branch.ts               # Branch management hook
│   │   └── use-toast.ts
│   ├── lib/
│   │   └── apis/
│   │       ├── authApi.ts              # OAuth2 APIs
│   │       ├── branchApi.ts            # Branch management APIs
│   │       └── ...
│   ├── pages/
│   │   ├── login.tsx                   # Branch selection + Google login
│   │   ├── register.tsx                # Info page (redirects to login)
│   │   └── admin/
│   │       ├── branches.tsx            # Branch management
│   │       └── ...
│   ├── types/
│   │   ├── branch.ts                   # Branch types
│   │   ├── auth.ts                     # OAuth2 auth types
│   │   └── ...
│   └── routes/
```

## 🔧 Setup và Cài đặt

### Environment Variables
```env
VITE_BASE_BACKEND_URL=http://localhost:8080
VITE_TURNSTILE_SITEKEY=your_turnstile_sitekey
```

### Cài đặt dependencies
```bash
cd client
npm install
```

### Chạy development server
```bash
npm run dev
```

## 🌊 Luồng đăng nhập mới

### 1. User Flow
1. **Chọn chi nhánh**: User truy cập `/login` và chọn chi nhánh từ danh sách
2. **Google OAuth2**: Hệ thống redirect tới Google với parameter `branch=HCM`
3. **Validation**: Backend validate email với chi nhánh đã chọn
4. **JWT Token**: Nếu hợp lệ, trả về JWT token với thông tin branch
5. **Redirect**: Frontend redirect về `/home` hoặc `/dashboard`

### 2. API Endpoints được sử dụng

#### Branch APIs
- `GET /api/branches` - Lấy danh sách chi nhánh
- `POST /api/branches/select?branchCode=HCM` - Chọn chi nhánh
- `GET /api/branches/validate-email?email=...&branchCode=HCM` - Validate email

#### OAuth2 Flow
- `GET /oauth2/authorization/google?branch=HCM` - Khởi tạo Google login
- Callback tự động xử lý với parameters: `?token=...&refreshToken=...`

#### Admin APIs
- `POST /api/branches/{id}/allowed-emails` - Thêm email được phép
- `DELETE /api/branches/{id}/allowed-emails` - Xóa email
- `GET /api/branches/{id}/allowed-emails` - Lấy danh sách email

## 🎨 Components chính

### BranchSelector
```tsx
// Hiển thị danh sách chi nhánh để user chọn
<BranchSelector onBranchSelected={(branch) => console.log(branch)} />
```

### useAuth Hook
```tsx
const { user, isAuthenticated, logout, handleOAuth2Callback } = useAuth();

// User object bao gồm:
interface AuthUser {
  username: string;
  email?: string;
  roles: string[];
  branchCode?: string;    // Mã chi nhánh (HCM, HN)
  branchName?: string;    // Tên chi nhánh
}
```

### useBranch Hook
```tsx
const { 
  branches, 
  selectBranch, 
  loginWithGoogle,
  addAllowedEmail,
  removeAllowedEmail 
} = useBranch();
```

## 🔐 Security Features

### 1. Cloudflare Turnstile
- Human verification trước khi truy cập hệ thống
- Bỏ qua khi chạy localhost
- Token được cache trong localStorage

### 2. JWT Auto Refresh
- Tự động refresh token trước khi hết hạn 30s
- Logout tự động khi refresh token hết hạn
- Sync trạng thái qua nhiều tabs

### 3. Branch Validation
- Email phải có trong danh sách allowed của chi nhánh
- Admin có thể quản lý danh sách email

## 📊 Error Handling

### OAuth2 Errors
- `Email_not_allowed_for_selected_branch` - Email không được phép
- `Branch_not_found` - Chi nhánh không tồn tại  
- `Branch_parameter_required` - Thiếu parameter chi nhánh
- `OAuth2_authentication_failed` - Lỗi Google authentication

### UI Feedback
- Toast notifications cho tất cả actions
- Loading states cho async operations
- Error boundaries cho React errors

## 🚀 Deployment

### Build production
```bash
npm run build
```

### Preview build
```bash
npm run preview
```

## 📝 API Integration

Hệ thống frontend tương thích với API documentation:
- `authentication-api.md` - OAuth2 flow
- `branch-authentication-api.md` - Branch management

### Test Accounts
- **HCM Branch**: `anhcvdse182894@fpt.edu.vn` (STUDENT role)
- **HN Branch**: Các email trong danh sách allowed của HN branch

## 🔄 Migration từ hệ thống cũ

### ❌ Removed Features
- Traditional username/password login
- Manual user registration
- Session-based authentication

### ✅ New Features  
- Google OAuth2 only
- Branch-aware authentication
- Email validation per branch
- Admin branch management

## 🐛 Troubleshooting

### Common Issues

1. **"Failed to resolve import"**
   - Đảm bảo file exists và path đúng
   - Check TypeScript import paths

2. **OAuth2 callback errors**
   - Kiểm tra backend CORS settings
   - Verify OAuth2 redirect URIs

3. **Branch selection không hoạt động**
   - Check API endpoint `/api/branches`
   - Verify backend branch data

4. **Token refresh issues**
   - Clear localStorage và đăng nhập lại
   - Check token expiration times

---

## 📞 Support

Nếu có vấn đề, check:
1. Browser console errors
2. Network tab trong DevTools
3. Backend logs
4. API documentation matching

## Kiến trúc mới

### 🏗️ Thay đổi chính
1. **Loại bỏ hoàn toàn traditional login** - Không còn form username/password
2. **Chỉ sử dụng Google OAuth2** - Tất cả authentication qua Google
3. **Branch-aware system** - User phải chọn chi nhánh trước khi login
4. **Email validation** - Chỉ email được phép mới có thể login cho từng chi nhánh

### 📁 Files mới được tạo
- `src/types/branch.ts` - Type definitions cho branch system
- `src/lib/apis/branchApi.ts` - API calls cho branch management
- `src/hooks/use-branch.ts` - Hook quản lý branch logic
- `src/components/BranchSelector.tsx` - Component chọn chi nhánh
- `src/pages/admin/branches.tsx` - Admin page quản lý branch và emails

### 🔄 Files đã được cập nhật
- `src/hooks/use-auth.ts` - Refactor để xử lý OAuth2 callback và loại bỏ traditional login
- `src/pages/login.tsx` - Chỉ hiển thị BranchSelector thay vì login form
- `src/pages/register.tsx` - Chỉ hiển thị thông báo redirect về login
- `src/lib/apis/authApi.ts` - Loại bỏ login/register functions
- `src/types/auth.ts` - Cập nhật types cho OAuth2
- `src/components/layout/AppHeader.tsx` - Hiển thị thông tin branch
- `src/components/layout/sidebar.tsx` - Thêm menu Quản lý Chi nhánh
- `src/routes/AppRoutes.tsx` - Thêm route `/branches`
- `src/App.tsx` - Xử lý OAuth2 callback với useAuth hook

## 🔐 Authentication Flow

### 1. Branch Selection Flow
```
1. User truy cập /login
2. BranchSelector hiển thị danh sách chi nhánh từ API /api/branches
3. User chọn chi nhánh (HCM/HN)
4. Frontend gọi /api/branches/select để lưu branch vào session
5. Frontend redirect tới /oauth2/authorization/google?branch=HCM
```

### 2. Google OAuth2 Flow
```
1. Google OAuth2 authentication
2. Backend validate email với branch đã chọn
3. Nếu email được phép: tạo JWT token với thông tin branch
4. Redirect về frontend với token trong URL params
5. Frontend xử lý callback và lưu token
```

### 3. Error Handling
Các lỗi có thể xảy ra:
- `Email_not_allowed_for_selected_branch` - Email không được phép cho chi nhánh
- `Branch_not_found` - Chi nhánh không tồn tại  
- `Branch_parameter_required` - Thiếu thông tin chi nhánh
- `OAuth2_authentication_failed` - Lỗi xác thực Google

## 🏢 Branch Management

### Admin Functions
Chỉ ADMIN mới có quyền:
- Xem danh sách tất cả chi nhánh
- Thêm/xóa email được phép cho từng chi nhánh
- Quản lý trạng thái chi nhánh

### User Experience
- User thấy danh sách chi nhánh khi login
- Thông tin chi nhánh hiển thị trên header sau khi login
- JWT token chứa `branchCode` và `branchName`

## 🔧 API Integration

### Các API được sử dụng:
- `GET /api/branches` - Lấy danh sách chi nhánh
- `POST /api/branches/select?branchCode=HCM` - Chọn chi nhánh
- `GET /api/branches/validate-email` - Validate email cho branch
- `GET /oauth2/authorization/google?branch=HCM` - Khởi tạo OAuth2 login
- `POST /api/branches/{id}/allowed-emails` - Thêm email được phép (Admin)
- `DELETE /api/branches/{id}/allowed-emails` - Xóa email được phép (Admin)

## 🚀 Development

### Environment Variables
```bash
VITE_BASE_BACKEND_URL=http://localhost:8080
VITE_TURNSTILE_SITEKEY=0x4AAAAAABwUJEbeH28XFEpH
```

### Chạy ứng dụng
```bash
cd client
npm install
npm run dev
```

### Test Accounts
Theo API documentation:
- **HCM Branch**: `anhcvdse182894@fpt.edu.vn` (STUDENT)
- **HN Branch**: emails trong allowed list của HN

## 📱 UI/UX Changes

### Login Page
- Hiển thị danh sách chi nhánh dạng cards
- Mỗi card có thông tin chi nhánh và button "Đăng nhập với Google"
- Thông báo về email được phép

### Register Page  
- Không còn form đăng ký
- Chỉ hiển thị thông báo hướng dẫn liên hệ admin
- Auto redirect về login sau 3 giây

### Admin Panel
- Thêm menu "Chi nhánh" cho admin
- Table hiển thị danh sách chi nhánh
- Quản lý allowed emails cho từng chi nhánh
- Form thêm/xóa email với validation

### Header
- Hiển thị tên user và chi nhánh hiện tại
- Icon chi nhánh với màu sắc phân biệt

## 🔄 Migration Notes

### Breaking Changes
1. **Traditional login hoàn toàn bị loại bỏ** - Không còn username/password
2. **Register không còn hoạt động** - Chỉ admin thêm email vào allowed list
3. **Phải chọn chi nhánh** - Bắt buộc trước khi login
4. **OAuth2 dependency** - Phụ thuộc hoàn toàn vào Google OAuth2

### Migration Steps cho Users
1. Admin phải thêm email của user vào allowed list của chi nhánh
2. User truy cập hệ thống, chọn chi nhánh phù hợp
3. Đăng nhập bằng Google với email đã được phép

## 🛡️ Security

### Authentication Security
- Chỉ email được phép mới login được vào từng chi nhánh
- JWT token chứa thông tin chi nhánh, không thể fake
- OAuth2 flow đảm bảo xác thực qua Google
- Session-based branch selection để tránh branch parameter manipulation

### Authorization
- Admin có thể quản lý all branches và emails
- User chỉ thấy được thông tin chi nhánh của mình
- Branch information trong JWT để phân quyền theo chi nhánh

## 📞 Support

Nếu có vấn đề:
1. Kiểm tra email đã được admin thêm vào allowed list của chi nhánh chưa
2. Đảm bảo chọn đúng chi nhánh trước khi login
3. Kiểm tra Google account có accessible không
4. Xem console/network tab để debug API errors
