/**
 * Project Creation with Predefined CPP Script
 * 
 * This script demonstrates how to create a new project with predefined custom product page (CPP):
 * 
 * Step 1: User Authentication
 *    - Logs in using provided email and password credentials
 *    - Obtains an access token for API authorization
 *    - Uses login() function to handle authentication
 * 
 * Step 2: Project Creation
 *    - Creates a new project using createProjectWithPredefinedCPP() function
 *    - Defines project details including:
 *      * Project name
 *      * Description
 *      * Target platform (APPLE_APP_STORE)
 *      * Content type (LOCALIZATION)
 *      * Target content configurations:
 *        - Target language: Arabic 
 *        - Target location: Saudi Arabia
 *        - Target demographics: Males 18-24
 *        - Image specifications: 1920x1080, 3 images
 * 
 * Step 3: Project Information Retrieval
 *    - Retrieves project details using getProject() function 
 *    - Displays project details in a readable format
 * 
 * Usage:
 * node create_project_with_predefinedCPP.js PASSWORD=yourpassword
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
  console.error('Error: Password is required. Usage: node create_project_with_predefinedCPP.js PASSWORD=yourpassword');
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
async function createProjectWithPredefinedCPP(token) {
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
        target_custom_product_page: 'APPLE_APP_CPP',
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

// Script function to get the project info with the project id
async function getProject(token, projectId) {
  const response = await fetch(`${API_URL}/api/v1/projects/${projectId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Project retrieval failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.project;
}


async function main() {
  try {
    // Login
    const token = await login();
    console.log('Login successful. Token:', token);

    // Create project with predefined CPP
    const projectId = await createProjectWithPredefinedCPP(token);
    console.log('Project created successfully. Project ID:', projectId);
    
    // Get project info
    const project = await getProject(token, projectId);
    console.log('Project retrieved successfully:', JSON.stringify(project, null, 2));


  } catch (error) {
    console.error('Error:', error);
  }
}

main();