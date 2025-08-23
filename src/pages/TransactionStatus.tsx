import React, { useState } from 'react';
import axios from 'axios';
import { Search, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

interface TransactionStatus {
  custom_order_id: string;
  status: string;
  order_amount: number;
  transaction_amount: number;
  payment_mode: string;
  payment_details: string;
  bank_reference: string;
  payment_message: string;
  payment_time: string;
  error_message: string;
}

const TransactionStatus: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = 'http://localhost:3001/api';

  const checkStatus = async () => {
    if (!orderId.trim()) {
      setError('Please enter a valid order ID');
      return;
    }

    setLoading(true);
    setError('');
    setTransactionStatus(null);

    try {
      const response = await axios.get(`${API_URL}/transactions/status/${orderId}`);
      setTransactionStatus(response.data);
    } catch (err) {
      setError('Transaction not found or an error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'pending':
        return <Clock className="h-8 w-8 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-8 w-8 text-red-500" />;
      default:
        return <AlertCircle className="h-8 w-8 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Search className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transaction Status Check</h1>
          <p className="text-gray-600 dark:text-gray-400">Check the current status of any transaction</p>
        </div>
      </div>

      {/* Search Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Custom Order ID
            </label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter custom order ID (e.g., ORD_1704067200_abc123)"
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && checkStatus()}
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={checkStatus}
              disabled={loading || !orderId.trim()}
              className="inline-flex items-center px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Check Status
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Transaction Status Display */}
      {transactionStatus && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              {getStatusIcon(transactionStatus.status)}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Transaction Details
                </h3>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transactionStatus.status)}`}>
                  {transactionStatus.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Order Information
                  </h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Order ID:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {transactionStatus.custom_order_id}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Order Amount:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        ₹{transactionStatus.order_amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Transaction Amount:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        ₹{transactionStatus.transaction_amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Payment Details
                  </h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Payment Mode:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {transactionStatus.payment_mode}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Payment Details:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {transactionStatus.payment_details || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Bank Reference:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {transactionStatus.bank_reference || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Status Information
                  </h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Payment Time:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {new Date(transactionStatus.payment_time).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Message:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {transactionStatus.payment_message || 'N/A'}
                      </span>
                    </div>
                    {transactionStatus.error_message && transactionStatus.error_message !== 'NA' && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Error:</span>
                        <span className="text-sm font-medium text-red-600 dark:text-red-400">
                          {transactionStatus.error_message}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionStatus;