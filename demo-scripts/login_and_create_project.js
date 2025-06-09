/**
 * Client Authentication and Project Creation Script
 * 
 * This script demonstrates how to authenticate a client and create a new project.
 * 
 * Step 1: User Authentication
 *    - Logs in using provided email and password
 *    - Returns an access token for API authorization
 * 
 * Step 2: Project Creation
 *    - Creates a new project using the createProject() function
 *    - Configures project with localization settings for Apple App Store
 *    - Sets up target content configurations for Arabic localization
 * 
 * Usage:
 * node login_and_create_project.js PASSWORD=yourpassword
 * 
 * Note: The script uses a demo email (demo@example.com) by default. 
 * 
 * Make sure to provide your password as a command line argument.
 */

import fetch from 'node-fetch';
const API_URL = 'https://api.glober.ai';
const AUTH_API_URL = 'https://auth.api.glober.ai';

const email = 'demo@example.com';

// Get password from command line arguments
const args = process.argv.slice(2);
const passwordArg = args.find(arg => arg.startsWith('PASSWORD='));
if (!passwordArg) {
  console.error('Error: Password is required. Usage: node login_and_create_project.js PASSWORD=yourpassword');
  process.exit(1);
}
const password = passwordArg.split('=')[1];

// Script function to login and get the token
async function login() {
  const response = await fetch(`${AUTH_API_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.accessToken;
}

// Script function to create a new project 
async function createProject(token) {
  const projectPayload = {
    name: 'test_project',
    description: 'test_description',
    target_platform: 'APPLE_APP_STORE',
    target_content_type: 'LOCALIZATION',
    content_url: 'https://www.content-page-for-optimization.com',
    target_content_configs: [
      {
        target_language: 'Arabic',
        target_location: 'Saudi Arabia',
        target_demo_age: '18-24',
        target_demo_gender: 'MALE',
        image_configs: [{ width: 1920, height: 1080, count: 3 }],
      },
    ],
  };

  // Create the project
  const response = await fetch(`${API_URL}/api/v1/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(projectPayload),
  });

  if (!response.ok) {
    throw new Error(`Project creation failed: ${response.statusText}`); 
  }

  const data = await response.json();
  return data.projectId;
}

// Script function to main
async function main() {
  try {
    // Login
    const token = await login();
    console.log('Login successful. Token:', token);
    
    // Create project
    const projectId = await createProject(token);
    console.log('Project created successfully. Project ID:', projectId);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

main();