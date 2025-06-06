# Glober Pilot Service Demo Scripts

This repository contains a collection of demo scripts that demonstrate how to use the Glober Pilot Service client. Each script represents a key user flow and showcases different aspects of the API functionality.

## Prerequisites

- Node.js installed on your system
- Yarn package manager
- Valid Glober Pilot Service credentials

## Environment Setup

1. Install dependencies:

```bash
yarn install
```

2. Set up your credentials:

- The scripts use a demo email (demo@example.com) by default
- You'll need to provide your password as a command-line argument when running the scripts

## Available Demo Scripts

### 1. Login and Create Project (`login_and_create_project.js`)

Demonstrates basic authentication and project creation workflow.

**Features:**

- User authentication with email/password
- Project creation with localization settings
- Apple App Store target platform configuration

**Usage:**

```bash
node login_and_create_project.js PASSWORD=yourpassword
```

**Output:**

- Access token upon successful login
- Project ID upon successful project creation

### 2. Lookup Project (`lookup_project.js`)

Retrieves and displays project information.

**Features:**

- Project information retrieval
- Status checking

**Usage:**

```bash
node lookup_project.js PASSWORD=yourpassword
```

### 3. Upload Assets and Lookup Project Status (`upload_assets_and_lookup_project_status.js`)

Shows how to upload assets and monitor project status.

**Features:**

- Authentication
- Project creation
- Asset upload (supports both text and file-based assets)
- Project status monitoring

**Usage:**

```bash
node upload_assets_and_lookup_project_status.js PASSWORD=yourpassword
```

**Required Assets:**

- Place your assets in the `images/` directory
- Script expects images named `7.jpg` and `8.jpg` by default

**Output:**

- Asset IDs for each uploaded asset
- Current project status

### 4. Lookup Generated Project Result (`lookup_generated_project_result.js`)

Retrieves the generated results for a project.

**Features:**

- Result retrieval for completed projects
- Status verification

**Usage:**

```bash
node lookup_generated_project_result.js PASSWORD=yourpassword
```

### 5. Create Project with Predefined CPP (`create_project_with_predefinedCPP.js`)

Demonstrates project creation with predefined content processing parameters.

**Features:**

- Custom project configuration
- Predefined processing parameters

**Usage:**

```bash
node create_project_with_predefinedCPP.js PASSWORD=yourpassword
```

## API Endpoints

The scripts interact with the following API endpoints:

- Authentication: `https://auth.api.glober.ai`
- Main API: `https://api.glober.ai`

## Error Handling

All scripts include basic error handling and will display appropriate error messages for:

- Authentication failures
- Invalid credentials
- API request failures
- Missing required parameters

## Notes

- All scripts require a valid password to be provided as a command-line argument
- The demo email (demo@example.com) is used by default
- Make sure to have the required assets in place before running asset-related scripts
- API responses are logged to the console for debugging purposes

## Support

For any issues or questions regarding the demo scripts, please contact the Glober Pilot Service support team.
