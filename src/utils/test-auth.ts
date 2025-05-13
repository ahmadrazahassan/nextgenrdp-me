// src/utils/test-auth.ts
import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();
const API_URL = 'http://localhost:3000/api';

// Test registration endpoint
async function testRegistration() {
  console.log('Testing registration endpoint...');
  
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'TestPassword123!',
    confirmPassword: 'TestPassword123!',
    fullName: 'Test User',
  };
  
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });
    
    const data = await response.json();
    
    if (response.status === 201 && data.success) {
      console.log('✅ Registration test passed');
      console.log('Response:', data);
      return testUser;
    } else {
      console.log('❌ Registration test failed');
      console.log('Response:', data);
      return null;
    }
  } catch (error) {
    console.error('❌ Registration test error:', error);
    return null;
  }
}

// Test login endpoint
async function testLogin(email, password) {
  console.log('Testing login endpoint...');
  
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        rememberMe: true,
      }),
    });
    
    const data = await response.json();
    
    if (response.status === 200 && data.success) {
      console.log('✅ Login test passed');
      console.log('Response:', data);
      
      // Extract cookies for future requests
      const cookies = response.headers.get('set-cookie');
      return { success: true, cookies };
    } else {
      console.log('❌ Login test failed');
      console.log('Response:', data);
      return { success: false };
    }
  } catch (error) {
    console.error('❌ Login test error:', error);
    return { success: false };
  }
}

// Test me endpoint (requires authentication)
async function testMe(cookies) {
  console.log('Testing me endpoint...');
  
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Cookie': cookies,
      },
    });
    
    const data = await response.json();
    
    if (response.status === 200 && data.success) {
      console.log('✅ Me endpoint test passed');
      console.log('Response:', data);
      return true;
    } else {
      console.log('❌ Me endpoint test failed');
      console.log('Response:', data);
      return false;
    }
  } catch (error) {
    console.error('❌ Me endpoint test error:', error);
    return false;
  }
}

// Test logout endpoint
async function testLogout(cookies) {
  console.log('Testing logout endpoint...');
  
  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Cookie': cookies,
      },
    });
    
    const data = await response.json();
    
    if (response.status === 200 && data.success) {
      console.log('✅ Logout test passed');
      console.log('Response:', data);
      return true;
    } else {
      console.log('❌ Logout test failed');
      console.log('Response:', data);
      return false;
    }
  } catch (error) {
    console.error('❌ Logout test error:', error);
    return false;
  }
}

// Test forgot password endpoint
async function testForgotPassword(email) {
  console.log('Testing forgot password endpoint...');
  
  try {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    const data = await response.json();
    
    if (response.status === 200 && data.success) {
      console.log('✅ Forgot password test passed');
      console.log('Response:', data);
      return true;
    } else {
      console.log('❌ Forgot password test failed');
      console.log('Response:', data);
      return false;
    }
  } catch (error) {
    console.error('❌ Forgot password test error:', error);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('Starting authentication system tests...');
  
  // Test registration
  const testUser = await testRegistration();
  
  if (!testUser) {
    console.log('❌ Tests aborted due to registration failure');
    return;
  }
  
  // Test login
  const loginResult = await testLogin(testUser.email, testUser.password);
  
  if (!loginResult.success) {
    console.log('❌ Tests aborted due to login failure');
    return;
  }
  
  // Test me endpoint
  await testMe(loginResult.cookies);
  
  // Test logout
  await testLogout(loginResult.cookies);
  
  // Test forgot password
  await testForgotPassword(testUser.email);
  
  console.log('All tests completed');
}

// Export test functions
export {
  runTests,
  testRegistration,
  testLogin,
  testMe,
  testLogout,
  testForgotPassword,
};
