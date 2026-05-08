# 🚀 Secure Vault Deployment Guide

This guide explains how to deploy the Secure Vault project using AWS EC2, RDS, and S3.

---

# 🛠️ AWS Services Used

- EC2 → Backend Hosting
- RDS MySQL → Database
- S3 → Frontend Hosting
- Security Groups → Network Access

---

# 📦 Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/secure-vault.git
cd secure-vault
```

---

# ⚙️ Backend Deployment (EC2)

## 1) Connect to EC2

```bash
ssh -i "your-key.pem" ec2-user@YOUR_PUBLIC_IP
```

---

## 2) Install Node.js

Amazon Linux:

```bash
sudo dnf install nodejs -y
```

Ubuntu:

```bash
sudo apt update
sudo apt install nodejs npm -y
```

---

## 3) Go to Backend Folder

```bash
cd secure-vault-backend
```

---

## 4) Install Dependencies

```bash
npm install
```

---

## 5) Install MFA Packages

```bash
npm install speakeasy qrcode
```

---

## 6) Create `.env`

```env
PORT=3000

DB_HOST=YOUR_RDS_ENDPOINT
DB_USER=admin
DB_PASSWORD=yourpassword
DB_NAME=securevault

JWT_SECRET=mysecretkey
JWT_EXPIRES_IN=7d
```

---

## 7) Start Backend

```bash
node src/server.js
```

Expected Output:

```text
Server running on port 3000
MySQL Connected...
```

---

# 🗄️ RDS MySQL Setup

## 1) Create Database

```sql
CREATE DATABASE securevault;
USE securevault;
```

---

## 2) Create users Table

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE,
  authKeyHash TEXT,
  salt TEXT,
  mfaEnabled TINYINT(1) DEFAULT 0,
  mfaSecret TEXT
);
```

---

## 3) Create vaults Table

```sql
CREATE TABLE vaults (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT,
  encryptedBlob TEXT
);
```

---

# 🌐 Frontend Deployment (S3)

## 1) Go to Frontend Folder

```bash
cd secure-vault-frontend
```

---

## 2) Install Dependencies

```bash
npm install
```

---

## 3) Update API URL

Open:

```text
src/services/api.js
```

Replace:

```javascript
baseURL: 'http://OLD_IP:3000/api'
```

with:

```javascript
baseURL: 'http://YOUR_PUBLIC_IP:3000/api'
```

---

## 4) Build Frontend

```bash
npm run build
```

---

## 5) Upload Dist Folder to S3

```bash
aws s3 sync dist/ s3://YOUR_BUCKET_NAME --delete
```

---

# 🔓 Security Group Configuration

Allow these ports:

| Port | Purpose |
|---|---|
| 22 | SSH |
| 80 | HTTP |
| 3000 | Backend API |
| 3306 | MySQL |

Source:

```text
0.0.0.0/0
```

---

# 🔐 MFA Setup Process

## Generate QR

```bash
curl -X POST http://YOUR_PUBLIC_IP:3000/api/auth/mfa/setup \
-H "Content-Type: application/json" \
-d '{"userId":1}'
```

---

## Scan QR in Google Authenticator

- Open Google Authenticator
- Tap +
- Scan QR Code

---

## Verify OTP

```bash
curl -X POST http://YOUR_PUBLIC_IP:3000/api/auth/mfa/verify \
-H "Content-Type: application/json" \
-d '{"userId":1,"token":"123456"}'
```

---

# ✅ Verify MFA Enabled

```sql
SELECT mfaEnabled FROM users WHERE id=1;
```

Result:

```text
1
```

---

# 🚨 Common Issues

## Port 3000 Not Working

Check:

```bash
ss -tulpn | grep 3000
```

---

## Backend Not Starting

Install missing packages:

```bash
npm install
```

---

## Cannot Connect to Database

Check:
- RDS endpoint
- DB username/password
- Security group
- Port 3306

---

# 👨‍💻 Author

Rohan Meshram
