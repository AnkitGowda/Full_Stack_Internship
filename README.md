# School Payment Dashboard - Full Stack Application

A comprehensive full-stack application for managing school payments and transactions with a modern dashboard interface.

## 🏗️ Architecture

### Backend (NestJS + MongoDB)
- **Framework**: NestJS with TypeScript
- **Database**: MongoDB Atlas
- **Authentication**: JWT-based authentication
- **Payment Integration**: Custom payment gateway API integration
- **Validation**: class-validator and class-transformer

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: React Context API

## 🚀 Features

### Backend API
- ✅ JWT Authentication (Register/Login)
- ✅ Payment Gateway Integration with signed JWT payloads
- ✅ Webhook handling for payment status updates
- ✅ MongoDB aggregation pipelines for complex queries
- ✅ Comprehensive transaction management
- ✅ Data validation and error handling
- ✅ Pagination, sorting, and filtering
- ✅ Audit logging for webhooks

### Frontend Dashboard
- ✅ Modern, responsive dashboard interface
- ✅ Dark/Light theme toggle
- ✅ Advanced transaction filtering and search
- ✅ Real-time transaction status checking
- ✅ Pagination with smooth navigation
- ✅ Column sorting with visual indicators
- ✅ Multi-select filters for status and schools
- ✅ Date range filtering
- ✅ Payment creation form
- ✅ Hover effects and micro-interactions

## 📁 Project Structure

```
├── backend/                    # NestJS Backend
│   ├── src/
│   │   ├── auth/              # Authentication module
│   │   ├── payment/           # Payment gateway integration
│   │   ├── transaction/       # Transaction management
│   │   ├── webhook/           # Webhook handling
│   │   ├── schemas/           # MongoDB schemas
│   │   └── data-seeder/       # Dummy data seeding
│   └── package.json
├── src/                       # React Frontend
│   ├── components/            # Reusable components
│   ├── contexts/              # React contexts
│   ├── pages/                 # Page components
│   └── App.tsx
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account
- Payment gateway API credentials

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Update `backend/.env` with your actual values:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/school-payments
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=7d
   PG_KEY=edvtest01
   API_KEY=your-payment-api-key
   SCHOOL_ID=65b0e6293e9f76a9694d84b4
   PAYMENT_API_URL=https://api.paymentgateway.com
   PORT=3001
   ```

4. **Start the development server**:
   ```bash
   npm run start:dev
   ```

The backend will run on `http://localhost:3001`

### Frontend Setup

1. **Install dependencies** (from root directory):
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Payment Endpoints

#### Create Payment
```http
POST /api/payment/create-payment
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "trustee_id": "65b0e552dd31950a9b41c5ba",
  "student_info": {
    "name": "John Doe",
    "id": "STU001",
    "email": "john@example.com"
  },
  "gateway_name": "PhonePe",
  "order_amount": 2000,
  "transaction_amount": 2200,
  "payment_mode": "upi"
}
```

### Transaction Endpoints

#### Get All Transactions
```http
GET /api/transactions?page=1&limit=10&sort=payment_time&order=desc&status=success&school_id=65b0e6293e9f76a9694d84b4
Authorization: Bearer <jwt-token>
```

#### Get Transactions by School
```http
GET /api/transactions/school/65b0e6293e9f76a9694d84b4
Authorization: Bearer <jwt-token>
```

#### Check Transaction Status
```http
GET /api/transactions/status/ORD_1704067200_abc123
Authorization: Bearer <jwt-token>
```

### Webhook Endpoint

#### Payment Status Update
```http
POST /api/webhook
Content-Type: application/json

{
  "status": 200,
  "order_info": {
    "order_id": "ORD_1704067200_abc123",
    "order_amount": 2000,
    "transaction_amount": 2200,
    "gateway": "PhonePe",
    "bank_reference": "YESBNK222",
    "status": "success",
    "payment_mode": "upi",
    "payemnt_details": "success@ybl",
    "Payment_message": "payment success",
    "payment_time": "2025-04-23T08:14:21.945+00:00",
    "error_message": "NA"
  }
}
```

## 🧪 Testing

### Using Postman
1. Import the API endpoints into Postman
2. Set up environment variables for base URL and JWT token
3. Test authentication endpoints first to get JWT token
4. Use the token for protected endpoints

### Dummy Data
- Access `/api/seed/dummy-data` (POST) to populate the database with sample transactions
- Requires JWT authentication

## 🔒 Security Features

- JWT-based authentication for all protected routes
- Input validation using class-validator
- MongoDB injection prevention
- CORS configuration for frontend integration
- Password hashing with bcryptjs
- Comprehensive error handling and logging

## 🎨 Frontend Features

### Dashboard
- Real-time transaction overview with advanced filtering
- Sortable columns with visual indicators
- Multi-select filters for status and school IDs
- Date range filtering
- Search functionality across multiple fields
- Responsive pagination

### Transaction Management
- School-specific transaction views
- Real-time status checking by order ID
- Payment creation with form validation
- Success/error state handling

### UI/UX
- Dark/Light theme toggle with system preference detection
- Responsive design for mobile, tablet, and desktop
- Smooth animations and hover effects
- Loading states and error handling
- Accessible color contrast ratios

## 🚀 Deployment

### Backend Deployment
Recommended platforms: Heroku, Railway, or AWS

1. Set environment variables on your hosting platform
2. Configure MongoDB Atlas connection
3. Deploy using platform-specific instructions

### Frontend Deployment
Recommended platforms: Vercel, Netlify, or AWS Amplify

1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting platform
3. Configure environment variables if needed

## 🔧 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/school-payments
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
PG_KEY=edvtest01
API_KEY=your-payment-api-key
SCHOOL_ID=65b0e6293e9f76a9694d84b4
PAYMENT_API_URL=https://api.paymentgateway.com
PORT=3001
NODE_ENV=development
```

## 📊 Database Schema

### Order Collection
```javascript
{
  _id: ObjectId,
  school_id: String,
  trustee_id: String,
  student_info: {
    name: String,
    id: String,
    email: String
  },
  gateway_name: String,
  custom_order_id: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Status Collection
```javascript
{
  _id: ObjectId,
  collect_id: ObjectId, // Reference to Order._id
  order_amount: Number,
  transaction_amount: Number,
  payment_mode: String,
  payment_details: String,
  bank_reference: String,
  payment_message: String,
  status: String,
  error_message: String,
  payment_time: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Webhook Logs Collection
```javascript
{
  _id: ObjectId,
  event_type: String,
  payload: Object,
  status_code: Number,
  error_message: String,
  received_at: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.#   F u l l _ S t a c k _ I n t e r n s h i p  
 