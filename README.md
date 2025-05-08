# Glober Pilot API Guide

The Glober Pilot API allows authenticated users to create content optimization projects, upload assets, track progress, fetch results, and re-run specific configurations. This guide outlines the required endpoints and expected request/response formats.

---

## 🔐 Authentication

All API endpoints require a **Bearer token** to be passed via the `Authorization` header.

```http
Authorization: Bearer <your_token_here>
```

---

## 🧭 User Flow Overview

1. **Create a new project** using `POST /api/v1/projects`
2. **Upload assets** (image, video, text, or glossary) using `POST /api/v1/projects/{projectId}/assets`
3. **Check project status and assets** using `GET /api/v1/projects/{projectId}`
4. Once the project is marked as `COMPLETED`, **fetch results** using `GET /api/v1/projects/{projectId}/results`
5. If needed, **rerun a single target config** using `POST /api/v1/projects/{projectId}/rerun`

---

## 📘 API Reference

### 1. Create a New Project

**Endpoint:** `POST /api/v1/projects`  
**Description:** Initialize a new content optimization project.

**Request Example:**

```json
{
  "name": "test_project",
  "description": "test_description",
  "target_platform": "APPLE_APP_STORE",
  "target_content_type": "LOCALIZATION",
  "content_url": "https://www.content_page_for_optimiazation.com",
  "target_content_configs": [
    {
      "target_language": "Arabic",
      "target_location": "Saudi Arabia",
      "target_demo_age": "18-24",
      "target_demo_gender": "MALE",
      "image_configs": [
        { "width": 1920, "height": 1080, "count": 3 }
      ]
    }
  ]
}
```

**Response Example:**

```json
{
  "projectId": "b84d24c3-2781-4d3f-90d5-2e7dd0632180"
}
```

- Returns the unique project ID.

---

### 2. Upload Assets to the Project

**Endpoint:** `POST /api/v1/projects/{projectId}/assets`  
**Description:** Upload files associated with a project.

**Request (multipart/form-data):**

- `assetType`: `IMAGE`, `VIDEO`, `TEXT`, or `GLOSSARY`
- `file`: The actual file to upload

**Curl Example:**

```bash
curl -X POST https://api.glober.ai/api/v1/projects/{projectId}/assets \
  -H "Authorization: Bearer <token>" \
  -F "assetType=IMAGE" \
  -F "file=@image.png"
```

**Response Example:**

```json
{
    "asset-id": "b84d24c3-2781-4d3f-90d5-2e7dd0632180",
    "name": "image.png"
}
```

- Confirms the asset is uploaded and linked to the project.

---

### 3. View Project Metadata & Uploaded Assets

**Endpoint:** `GET /api/v1/projects/{projectId}`  
**Description:** Retrieve the full configuration of a project, including creation timestamps, current processing status, target localization settings, and all uploaded assets.

**Response Example:**

```json
{
  "name": "test_project",
  "description": "This is a localization project for new users in the Middle East.",
  "instruction": "Ensure cultural sensitivity and optimize for CTR.",
  "target_platform": "APPLE_APP_STORE",
  "target_content_type": "LOCALIZATION",
  "content_url": "https://www.example.com",
  "target_content_configs": [
    {
      "target_language": "Arabic",
      "target_location": "Saudi Arabia",
      "target_demo_age": "18-24",
      "target_demo_gender": "MALE",
      "image_configs": [
        {
          "width": 1920,
          "height": 1080,
          "count": 3
        }
      ]
    }
  ],
  "created_at": "2025-04-29T10:22:34Z",
  "upload_at": "2025-04-29T10:35:12Z",
  "status": "IN_PROGRESS",
  "assets": [
    {
      "project": {
        "id": "b84d24c3-2781-4d3f-90d5-2e7dd0632180",
        "name": "example.jpg"
      }
    }
  ]
}
```

📝 This response shows a single localization project targeting Arabic-speaking users in Saudi Arabia aged 18–24, with one uploaded image asset. The project is still in progress. The taget
will generate 3 1920x1080 images.

---
### 4. Fetch Project Results

**Endpoint:** `GET /api/v1/projects/{projectId}/results`  
**Description:** Fetch generated content or translation results.

**Response Example:**

```json
{
  "projectId": "b84d24c3-2781-4d3f-90d5-2e7dd0632180",
  "status": "COMPLETED",
  "targets": [
    {
      "target-content-config-id": "target-uuid",
      "results": [
        {
          "id": "asset-result-id",
          "asset_type": "IMAGE",
          "name": "result.png",
          "resource_uri": "https://s3.example.com/path/result"
        }
      ]
    }
  ]
}
```

- Includes asset download links for each target configuration.

---

### 5. Rerun a Target Configuration

**Endpoint:** `POST /api/v1/projects/{projectId}/rerun`  
**Description:** Rerun content generation for a specific target.

**Request Example:**

```json
{
  "target-content-config-id": "target-uuid"
}
```

**Response Example:**

```json
{
  "status": "ok"
}
```

- Confirms the rerun has been triggered.

---

## 📝 Notes

- **Asset types supported**: `IMAGE`, `VIDEO`, `TEXT`, `GLOSSARY`
- **Project status values**: `PENDING`, `IN_PROGRESS`, `COMPLETED`, `FAILED`
- **Timestamps** use ISO 8601 format
- **All IDs** are UUID strings

---