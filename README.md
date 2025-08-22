# HeThongQuanLyTiemChung
Đồ án hệ thống tiêm chủng


# Các điều kiện để chạy dự án 
- Sqlserver 
- node.js v22
- Asp.net core api version 8.0

# Các tool 
- postman 
- docker

# Cách cách để chạy dự án Hệ thống tiêm chủng 
## 1. Chạy tại máy local 
### 1.1. Chạy file HeThongQuanLyTiemChung.bacpac
### 1.2. Di chuyển đến dự án server
```
cd server/
```
### 1.3. Build source code server
```
dotnet run build
```
### 1.4. Chạy source code server
```
dotnet watch run
```
### 1.5. Di chuyển đến dự án client
```
cd ..
cd client/
```

### 1.6. Tải các gói package cho react.js 
```
npm i
```
### 1.7. Chạy srouce code client 
```
npm run dev
```
## 2. chạy bằng docker
