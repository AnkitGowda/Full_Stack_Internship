import React, { useState } from 'react';
import axios from 'axios';
import { CreditCard, User, Mail, Hash, DollarSign } from 'lucide-react';

interface StudentInfo {
  name: string;
  id: string;
  email: string;
}

const CreatePayment: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');

  const [formData, setFormData] = useState({
    trustee_id: '65b0e552dd31950a9b41c5ba',
    student_info: {
      name: '',
      id: '',
      email: '',
    },
    gateway_name: 'PhonePe',
    order_amount: 0,
    transaction_amount: 0,
    payment_mode: 'upi',
  });

  const API_URL = 'http://localhost:3001/api';

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await axios.post(`${API_URL}/payment/create-payment`, formData);
      setSuccess(true);
      setPaymentUrl(response.data.payment_url);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Payment creation failed');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      trustee_id: '65b0e552dd31950a9b41c5ba',
      student_info: {
        name: '',
        id: '',
        email: '',
      },
      gateway_name: 'PhonePe',
      order_amount: 0,
      transaction_amount: 0,
      payment_mode: 'upi',
    });
    setSuccess(false);
    setPaymentUrl('');
    setError('');
  };

  if (success) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <CreditCard className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Created Successfully</h1>
            <p className="text-gray-600 dark:text-gray-400">Your payment request has been processed</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Payment Request Created
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The payment has been successfully initiated. Use the link below to complete the payment.
            </p>
            
            {paymentUrl && (
              <div className="mb-6">
                <a
                  href={paymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  Complete Payment
                </a>
              </div>
            )}

            <button
              onClick={resetForm}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Create Another Payment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <CreditCard className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Payment</h1>
          <p className="text-gray-600 dark:text-gray-400">Initialize a new payment request</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Student Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <User className="h-5 w-5 mr-2" />
            Student Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Student Name
              </label>
              <input
                type="text"
                value={formData.student_info.name}
                onChange={(e) => handleInputChange('student_info.name', e.target.value)}
                required
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter student name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Student ID
              </label>
              <input
                type="text"
                value={formData.student_info.id}
                onChange={(e) => handleInputChange('student_info.id', e.target.value)}
                required
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter student ID"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Student Email
              </label>
              <input
                type="email"
                value={formData.student_info.email}
                onChange={(e) => handleInputChange('student_info.email', e.target.value)}
                required
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter student email"
              />
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Payment Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Order Amount (₹)
              </label>
              <input
                type="number"
                value={formData.order_amount}
                onChange={(e) => handleInputChange('order_amount', Number(e.target.value))}
                required
                min="1"
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter order amount"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Transaction Amount (₹)
              </label>
              <input
                type="number"
                value={formData.transaction_amount}
                onChange={(e) => handleInputChange('transaction_amount', Number(e.target.value))}
                required
                min="1"
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter transaction amount"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Gateway
              </label>
              <select
                value={formData.gateway_name}
                onChange={(e) => handleInputChange('gateway_name', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="PhonePe">PhonePe</option>
                <option value="Razorpay">Razorpay</option>
                <option value="Paytm">Paytm</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Mode
              </label>
              <select
                value={formData.payment_mode}
                onChange={(e) => handleInputChange('payment_mode', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="upi">UPI</option>
                <option value="card">Card</option>
                <option value="netbanking">Net Banking</option>
                <option value="wallet">Wallet</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
            ) : (
              <CreditCard className="h-5 w-5 mr-2" />
            )}
            {loading ? 'Creating Payment...' : 'Create Payment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePayment;