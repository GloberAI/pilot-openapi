// A script that lets the client upload assets of existing and look up project status.

import fetch from 'node-fetch';
import fs from 'fs';
import FormData from 'form-data';

const API_URL = 'https://api.glober.ai';
const AUTH_API_URL = 'https://auth.api.glober.ai';

const email = 'demo@example.com';

// Get password from command line arguments
const args = process.argv.slice(2);
const passwordArg = args.find(arg => arg.startsWith('PASSWORD='));
if (!passwordArg) {
  console.error('Error: Password is required. Usage: node script4.js PASSWORD=yourpassword');
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

// Script function to upload an asset to the project
async function uploadAsset(token, projectId, assetItem) {
  // Handle text assets
  if (assetItem.type === 'TEXT') {
    const textPayload = {
      assetType: assetItem.type,
      textField: assetItem.textField,
      textContent: assetItem.textContent
    };

    console.log('Uploading text asset:', textPayload);
    const response = await fetch(`${API_URL}/api/v1/projects/${projectId}/textAssets`, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(textPayload)
    });

    if (!response.ok) {
      throw new Error(`Text asset upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.asset_id;
  }

  // Handle file assets

  const formData = new FormData();
  
  formData.append('assetType', assetItem.type);
  formData.append('file', fs.createReadStream(assetItem.path));

  const response = await fetch(`${API_URL}/api/v1/projects/${projectId}/assets`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      ...formData.getHeaders(),
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error(`Asset upload failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.asset_id;
}

// Script function to let client upload assets of existing project and look up project status
async function uploadAssetsAndLookUpStatus(token, projectId, assetItems) {
  try {
    // Upload each asset
    for (const assetItem of assetItems) {
      const assetId = await uploadAsset(token, projectId, assetItem);
      console.log('Asset uploaded successfully. Asset ID:', assetId);
    }

    // look up status
    const response = await fetch(`${API_URL}/api/v1/projects/${projectId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error(`Project retrieval failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Current project status:', data.project.status);
    
  } catch (error) {
    console.error('Error in upload and track:', error);
  }
}

async function main() {
  try {
    // Login
    const token = await login();
    console.log('Login successful. Token:', token);

    // Create project
    const projectId = await createProject(token);
    console.log('Project created successfully. Project ID:', projectId);
    
    // Upload assets and look up status
    const assetItems = [
      { type: 'IMAGE', path: 'images/7.jpg' },
      { type: 'IMAGE', path: 'images/8.jpg' },
    ];

    await uploadAssetsAndLookUpStatus(token, projectId, assetItems);

  } catch (error) {
    console.error('Error:', error);
  }
}

main();