import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Building, Wallet, Truck, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Address, PaymentMethod, Order } from '../types';
import { formatIndianCurrency } from '../utils/currency';

interface CheckoutStep {
  id: 'shipping' | 'payment' | 'review' | 'confirmation';
  title: string;
  completed: boolean;
}

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    closeCheckout, 
    getCartItemsWithProducts, 
    calculateTotals,
    createOrder 
  } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [currentStep, setCurrentStep] = useState<CheckoutStep['id']>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const [shippingAddress, setShippingAddress] = useState<Address>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    address1: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    phone: user?.phoneNumber || '',
  });

  const [billingAddress, setBillingAddress] = useState<Address>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    address1: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    phone: user?.phoneNumber || '',
  });

  const [useSameAddress, setUseSameAddress] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>({
    type: 'cod',
  });

  const cartItems = getCartItemsWithProducts();
  const totals = calculateTotals();

  const steps: CheckoutStep[] = [
    { id: 'shipping', title: 'Shipping Address', completed: currentStep !== 'shipping' },
    { id: 'payment', title: 'Payment Method', completed: ['review', 'confirmation'].includes(currentStep) },
    { id: 'review', title: 'Review Order', completed: currentStep === 'confirmation' },
    { id: 'confirmation', title: 'Confirmation', completed: false },
  ];

  if (!isCheckoutOpen) return null;
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-8 rounded-lg max-w-md">
          <h3 className="text-lg font-semibold mb-4">Please Sign In</h3>
          <p className="text-gray-600 mb-6">You need to be signed in to proceed with checkout.</p>
          <button
            onClick={closeCheckout}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (useSameAddress) {
      setBillingAddress(shippingAddress);
    }
    setCurrentStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('review');
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const order = await createOrder(
        shippingAddress,
        useSameAddress ? shippingAddress : billingAddress,
        selectedPaymentMethod
      );
      setCompletedOrder(order);
      setCurrentStep('confirmation');
    } catch (error) {
      console.error('Order failed:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setCurrentStep('shipping');
    setCompletedOrder(null);
    closeCheckout();
  };

  const paymentMethods = [
    { type: 'cod' as const, label: 'Cash on Delivery', icon: Truck },
    { type: 'card' as const, label: 'Credit/Debit Card', icon: CreditCard },
    { type: 'upi' as const, label: 'UPI', icon: Smartphone },
    { type: 'netbanking' as const, label: 'Net Banking', icon: Building },
    { type: 'wallet' as const, label: 'Wallet', icon: Wallet },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              {currentStep === 'confirmation' ? 'Order Confirmed!' : 'Checkout'}
            </h2>
            <button
              onClick={handleClose}
              className="rounded-md p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex">
            {/* Main Content */}
            <div className="flex-1 p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* Progress Steps */}
              {currentStep !== 'confirmation' && (
                <div className="flex items-center justify-between mb-8">
                  {steps.slice(0, -1).map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step.completed || step.id === currentStep
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {step.completed ? '✓' : index + 1}
                      </div>
                      <span className={`ml-2 text-sm ${
                        step.completed || step.id === currentStep
                          ? 'text-blue-600 font-medium'
                          : 'text-gray-500'
                      }`}>
                        {step.title}
                      </span>
                      {index < steps.length - 2 && (
                        <div className={`ml-4 w-12 h-0.5 ${
                          step.completed ? 'bg-blue-600' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Shipping Address Form */}
              {currentStep === 'shipping' && (
                <form onSubmit={handleShippingSubmit} className="space-y-6">
                  <h3 className="text-lg font-medium">Shipping Address</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.firstName}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, firstName: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.lastName}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, lastName: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.address1}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, address1: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.address2 || ''}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, address2: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.postalCode}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, postalCode: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={shippingAddress.phone || ''}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="sameAddress"
                      checked={useSameAddress}
                      onChange={(e) => setUseSameAddress(e.target.checked)}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="sameAddress" className="ml-2 text-sm text-gray-700">
                      Billing address same as shipping address
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Continue to Payment
                  </button>
                </form>
              )}

              {/* Payment Method Selection */}
              {currentStep === 'payment' && (
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <h3 className="text-lg font-medium">Payment Method</h3>
                  
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.type}
                        className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                          selectedPaymentMethod.type === method.type
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.type}
                          checked={selectedPaymentMethod.type === method.type}
                          onChange={(e) => setSelectedPaymentMethod({ type: e.target.value as any })}
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <method.icon className="h-5 w-5 ml-3 text-gray-600" />
                        <span className="ml-3 text-sm font-medium text-gray-900">
                          {method.label}
                        </span>
                      </label>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep('shipping')}
                      className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Review Order
                    </button>
                  </div>
                </form>
              )}

              {/* Order Review */}
              {currentStep === 'review' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Review Your Order</h3>
                  
                  {/* Order Items */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-4">Order Items</h4>
                    <div className="space-y-3">
                      {cartItems.map((item) => (
                        <div key={item.productId} className="flex justify-between text-sm">
                          <span>{item.product.name} × {item.quantity}</span>
                          <span className="font-medium">
                            {formatIndianCurrency((item.product.discountedPrice || item.product.regularPrice) * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Addresses */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Shipping Address</h4>
                      <p className="text-sm text-gray-600">
                        {shippingAddress.firstName} {shippingAddress.lastName}<br />
                        {shippingAddress.address1}<br />
                        {shippingAddress.address2 && <>{shippingAddress.address2}<br /></>}
                        {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
                      </p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Payment Method</h4>
                      <p className="text-sm text-gray-600">
                        {paymentMethods.find(m => m.type === selectedPaymentMethod.type)?.label}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep('payment')}
                      className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="flex-1 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {isProcessing ? 'Processing...' : `Place Order - ${formatIndianCurrency(totals.total)}`}
                    </button>
                  </div>
                </div>
              )}

              {/* Order Confirmation */}
              {currentStep === 'confirmation' && completedOrder && (
                <div className="text-center space-y-6">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                      Order Placed Successfully!
                    </h3>
                    <p className="text-gray-600">
                      Your order #{completedOrder.orderNumber} has been confirmed.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6 text-left">
                    <h4 className="font-medium mb-4">Order Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Order Number:</span>
                        <span className="font-medium">{completedOrder.orderNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Amount:</span>
                        <span className="font-medium">{formatIndianCurrency(completedOrder.totalAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Delivery:</span>
                        <span className="font-medium">
                          {completedOrder.estimatedDelivery?.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleClose}
                    className="bg-blue-600 text-white py-3 px-8 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            {currentStep !== 'confirmation' && (
              <div className="w-80 border-l bg-gray-50 p-6">
                <h3 className="text-lg font-medium mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.productId} className="flex gap-3">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="h-12 w-12 object-cover rounded border"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        <p className="text-sm font-medium">
                          {formatIndianCurrency((item.product.discountedPrice || item.product.regularPrice) * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatIndianCurrency(totals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{totals.shippingCost === 0 ? 'Free' : formatIndianCurrency(totals.shippingCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (GST)</span>
                    <span>{formatIndianCurrency(totals.tax)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-base font-semibold">
                    <span>Total</span>
                    <span>{formatIndianCurrency(totals.total)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};