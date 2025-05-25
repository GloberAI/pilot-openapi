import axios from "axios";

const GLOBER_AI_API = "https://api.glober.ai";

interface CreateProjectRequest {
  name: string;
  description?: string;
  instruction?: string;
  target_platform:
    | "APPLE_APP_STORE"
    | "GOOGLE_PLAY_STORE"
    | "APPLE_ADS"
    | "GOOGLE_ADS";
  target_content_type: "LOCALIZATION" | "DEMO_EXPANSION";
  content_url: string;
  target_content_configs: TargetContentConfig[];
}

interface TargetContentConfig {
  target_language: string;
  target_location: string;
  target_demo_age?: string;
  target_demo_gender?: "MALE" | "FEMALE" | "OTHER";
  image_configs?: ImageGenerationConfig[];
}

interface ImageGenerationConfig {
  width: number;
  height: number;
  count: number;
}

interface CreateProjectResponse {
  projectId: string;
}

interface ProjectDetailsResponse extends CreateProjectRequest {
  created_at: string;
  updated_at: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
  assets: AssetDetailEntity[];
}

interface AssetDetailEntity {
  asset_id: string;
  name: string;
  asset_type: "IMAGE" | "VIDEO" | "TEXT" | "GLOSSARY";
  resource_uri: string;
}

interface UploadAssetResponse {
  asset_id: string;
  name: string;
}

interface ProjectResultsResponse {
  project_id: string;
  status: string;
  targets: TargetResult[];
}

interface TargetResult {
  target_content_config_id: string;
  results: GeneratedAsset[];
}

interface GeneratedAsset {
  generated_asset_id: string;
  asset_type: "IMAGE" | "VIDEO" | "TEXT";
  name: string;
  resource_uri: string;
}

interface RerunRequest {
  target_content_config_id: string;
}

export class GloberAIClient {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
    };
  }

  async createProject(
    request: CreateProjectRequest
  ): Promise<CreateProjectResponse> {
    const response = await axios.post(
      `${GLOBER_AI_API}/api/v1/projects`,
      request,
      {
        headers: this.getHeaders(),
      }
    );
    return response.data;
  }

  async getProjectDetails(projectId: string): Promise<ProjectDetailsResponse> {
    const response = await axios.get(
      `${GLOBER_AI_API}/api/v1/projects/${projectId}`,
      {
        headers: this.getHeaders(),
      }
    );
    return response.data;
  }

  async uploadAsset(
    projectId: string,
    assetType: "IMAGE" | "VIDEO" | "TEXT" | "GLOSSARY",
    file: File
  ): Promise<UploadAssetResponse> {
    const formData = new FormData();
    formData.append("assetType", assetType);
    formData.append("file", file);

    const response = await axios.post(
      `${GLOBER_AI_API}/api/v1/projects/${projectId}/assets`,
      formData,
      {
        headers: {
          ...this.getHeaders(),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  async getProjectResults(projectId: string): Promise<ProjectResultsResponse> {
    const response = await axios.get(
      `${GLOBER_AI_API}/api/v1/projects/${projectId}/results`,
      {
        headers: this.getHeaders(),
      }
    );
    return response.data;
  }

  async rerunGeneration(
    projectId: string,
    request: RerunRequest
  ): Promise<{ status: string }> {
    const response = await axios.post(
      `${GLOBER_AI_API}/api/v1/projects/${projectId}/rerun`,
      request,
      {
        headers: this.getHeaders(),
      }
    );
    return response.data;
  }
}
