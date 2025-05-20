import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { showToast } from '../ui/Toast';
import { useAuthStore } from '../../store/authStore';

const AadhaarVerification: React.FC = () => {
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const { verifyAadhaar, verifyOtp } = useAuthStore();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (aadhaarNumber.length !== 12 || !/^\d+$/.test(aadhaarNumber)) {
      showToast.error('Please enter a valid 12-digit Aadhaar number');
      return;
    }
    
    setLoading(true);
    
    try {
      await verifyAadhaar(aadhaarNumber);
      setOtpSent(true);
      showToast.success('OTP sent to your registered mobile number');
    } catch (error) {
      if (error instanceof Error) {
        showToast.error(error.message);
      } else {
        showToast.error('Failed to send OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6 || !/^\d+$/.test(otp)) {
      showToast.error('Please enter a valid 6-digit OTP');
      return;
    }
    
    setLoading(true);
    
    try {
      await verifyOtp(aadhaarNumber, otp);
      showToast.success('Verification successful!');
      navigate('/profile/complete');
    } catch (error) {
      if (error instanceof Error) {
        showToast.error(error.message);
      } else {
        showToast.error('Failed to verify OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Format Aadhaar number with spaces for better readability (like XXXX XXXX XXXX)
  const formatAadhaarNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    const formatted = digits.match(/.{1,4}/g)?.join(' ') || digits;
    return formatted;
  };

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAadhaarNumber(e.target.value);
    setAadhaarNumber(formatted.replace(/\s/g, ''));
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-2xl font-bold">{otpSent ? 'Verify OTP' : 'Aadhaar Verification'}</h1>
        <p className="mt-2 text-gray-600">
          {otpSent 
            ? 'Enter the OTP sent to your registered mobile number' 
            : 'Please enter your Aadhaar number to proceed'}
        </p>
      </div>
      
      {!otpSent ? (
        <form className="mt-8 space-y-6" onSubmit={handleSendOtp}>
          <div>
            <label htmlFor="aadhaar" className="block text-sm font-medium text-gray-700">
              Aadhaar Number
            </label>
            <input
              id="aadhaar"
              type="text"
              maxLength={12}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={aadhaarNumber}
              onChange={handleAadhaarChange}
              placeholder="XXXX XXXX XXXX"
            />
          </div>
          
          <Button 
            type="submit" 
            fullWidth
            isLoading={loading}
            variant="primary"
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a 
                href="/login" 
                className="font-medium text-primary-600 hover:text-primary-500"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/login');
                }}
              >
                Sign in
              </a>
            </p>
          </div>
        </form>
      ) : (
        <form className="mt-8 space-y-6" onSubmit={handleVerifyOtp}>
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
              One-Time Password (OTP)
            </label>
            <input
              id="otp"
              type="text"
              maxLength={6}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 6-digit OTP"
            />
          </div>
          
          <Button 
            type="submit" 
            fullWidth
            isLoading={loading}
            variant="primary"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </Button>
          
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setOtpSent(false)}
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              Change Aadhaar Number
            </button>
            
            <button
              type="button"
              onClick={handleSendOtp}
              className="text-sm text-primary-600 hover:text-primary-500"
              disabled={loading}
            >
              Resend OTP
            </button>
          </div>
        </form>
      )}
      
      <div className="pt-4 mt-6 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          <p className="mb-2">By continuing, you agree to our:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><a href="/terms" className="text-primary-600 hover:text-primary-500">Terms of Service</a></li>
            <li><a href="/privacy" className="text-primary-600 hover:text-primary-500">Privacy Policy</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AadhaarVerification;
