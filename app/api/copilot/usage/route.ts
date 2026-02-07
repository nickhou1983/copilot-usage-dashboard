import type { OrgType } from "../../../../types/copilot";
import type { CopilotUsageData } from "../../../../types/copilot";
import { GitHubCopilotClient } from "../../../../lib/github-api";
import { transformUsageData } from "../../../../lib/data-transformer";

interface RequestBody {
  token: string;
  orgName: string;
  orgType: OrgType;
  startDate?: string;
  endDate?: string;
}

/**
 * Validate incoming request body
 */
function validateRequest(body: any): { valid: boolean; error?: string } {
  if (!body.token || typeof body.token !== "string") {
    return { valid: false, error: "缺少或无效的 token 参数" };
  }

  if (!body.orgName || typeof body.orgName !== "string") {
    return { valid: false, error: "缺少或无效的 orgName 参数" };
  }

  if (!body.orgType || typeof body.orgType !== "string") {
    return { valid: false, error: "缺少或无效的 orgType 参数" };
  }

  if (body.orgType !== "organization" && body.orgType !== "enterprise") {
    return {
      valid: false,
      error: 'orgType 必须是 "organization" 或 "enterprise"',
    };
  }

  return { valid: true };
}

/**
 * Handle POST requests to fetch Copilot usage data
 */
export async function POST(request: Request): Promise<Response> {
  try {
    // Parse request body
    let body: any;
    try {
      body = await request.json();
    } catch (error) {
      return Response.json({ error: "无效的 JSON 格式" }, { status: 400 });
    }

    // Validate request
    const validation = validateRequest(body);
    if (!validation.valid) {
      return Response.json({ error: validation.error }, { status: 400 });
    }

    const { token, orgName, orgType, startDate, endDate } = body as RequestBody;

    // Create GitHub Copilot Client and fetch data
    const client = new GitHubCopilotClient(token);
    let usageData: CopilotUsageData[];

    try {
      if (orgType === "organization") {
        usageData = await client.fetchOrgUsage(orgName, startDate, endDate);
      } else {
        usageData = await client.fetchEnterpriseUsage(
          orgName,
          startDate,
          endDate,
        );
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "未知错误";

      // Check if it's an authentication error
      if (
        errorMessage.includes("Bad credentials") ||
        errorMessage.includes("Unauthorized") ||
        errorMessage.includes("Invalid") ||
        errorMessage.includes("无权限")
      ) {
        return Response.json(
          { error: "认证失败，请检查 Token 是否有效" },
          { status: 401 },
        );
      }

      // Return generic server error
      return Response.json(
        { error: "获取数据失败：" + errorMessage },
        { status: 500 },
      );
    }

    // Transform and return data
    const transformedData = transformUsageData(usageData);

    return Response.json(transformedData, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "未知错误";
    return Response.json(
      { error: "服务器内部错误：" + errorMessage },
      { status: 500 },
    );
  }
}
