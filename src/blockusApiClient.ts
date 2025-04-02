import { env } from "./config";
import { HttpClient, HttpClientOptions } from "./httpClient";

/**
 * Response type for login operation
 */
export interface LoginResponse {
  accessToken: string;
}

/**
 * BlockusApiClient provides specialized methods for interacting with the Blockus API
 */
export class BlockusApiClient {
  private httpClient: HttpClient;
  private projectId: string;
  private projectKey: string;

  /**
   * Creates a new BlockusApiClient
   *
   * @param baseUrl - Base URL of the Blockus API
   * @param projectId - Project ID for authentication
   * @param projectKey - Project key for authentication
   * @param options - Default options for all requests
   */
  constructor(
    baseUrl: string,
    projectId: string,
    projectKey: string,
    options: HttpClientOptions = {}
  ) {
    this.httpClient = new HttpClient(baseUrl, options);
    this.projectId = projectId;
    this.projectKey = projectKey;
  }

  /**
   * Logs in a player using a DID token
   *
   * @param didToken - The DID token for authentication
   * @returns A promise resolving to the login response containing an access token
   */
  async loginPlayer(didToken: string): Promise<LoginResponse> {
    const options = {
      headers: {
        "X-PROJECT-ID": this.projectId,
        "X-PROJECT-KEY": this.projectKey,
      },
    };

    return this.httpClient.post<LoginResponse>(
      "/v1/players/login?type=did",
      { didToken },
      options // Pass as options object with headers property
    );
  }
}

/**
 * Creates a BlockusApiClient with the given base URL and options
 *
 * @param baseUrl - Base URL of the Blockus API
 * @param projectId - Project ID for authentication
 * @param projectKey - Project key for authentication
 * @param options - Default options for all requests
 * @returns A configured BlockusApiClient instance
 */
export const createBlockusApiClient = (
  baseUrl: string = env.BLOCKUS_API_URL,
  projectId: string = env.BLOCKUS_API_PROJECT,
  projectKey: string = env.BLOCKUS_API_KEY,
  options: HttpClientOptions = {}
): BlockusApiClient => {
  return new BlockusApiClient(baseUrl, projectId, projectKey, options);
};
