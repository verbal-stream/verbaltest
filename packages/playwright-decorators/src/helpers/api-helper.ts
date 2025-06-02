import { APIRequestContext, APIResponse, expect } from '@playwright/test';

/**
 * Interface for API request options
 */
export interface ApiRequestOptions {
  method: string;
  path: string;
  pathParams?: Record<string, string | number>;
  queryParams?: Record<string, string | number | boolean | string[]>;
  headers?: Record<string, string>;
  body?: Record<string, any> | string;
  expect?: {
    status?: number;
    body?: Record<string, {
      assertion: string;
      value?: any;
    }>;
    schema?: Record<string, any>;
  };
}

/**
 * Helper function to get a value from an object using a path
 * 
 * @param obj Object to get value from
 * @param path Path to the value
 * @returns Value at the path
 */
function getValueByPath(obj: any, path: string): any {
  const parts = path.split('.');
  let current = obj;
  
  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = current[part];
  }
  
  return current;
}

/**
 * Process an API request based on decorator metadata
 * 
 * @param request Playwright request context
 * @param options API request options from decorators
 * @returns API response
 */
export async function processApiRequest(
  request: APIRequestContext,
  options: ApiRequestOptions
): Promise<APIResponse> {
  console.log('Processing API request with options:', options);
  
  // Process path parameters
  let url = options.path;
  if (options.pathParams) {
    console.log('Processing path parameters:', options.pathParams);
    // Make multiple passes to ensure all occurrences are replaced
    Object.entries(options.pathParams).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      // Use global regex to replace all occurrences
      const regex = new RegExp(`\\{${key}\\}`, 'g');
      if (url.includes(placeholder)) {
        url = url.replace(regex, String(value));
        console.log(`Replaced ${placeholder} with ${value}`);
      } else {
        console.warn(`Path parameter ${key} not found in URL: ${url}`);
      }
    });
  }
  console.log('Processed URL:', url);

  // Build request options
  const requestOptions: any = {
    headers: options.headers || {},
  };

  // Add query parameters
  if (options.queryParams) {
    const searchParams = new URLSearchParams();
    Object.entries(options.queryParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, String(v)));
      } else {
        searchParams.append(key, String(value));
      }
    });
    
    // Append query string to URL
    const queryString = searchParams.toString();
    if (queryString) {
      url = `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
    }
  }
  console.log('URL with query parameters:', url);

  // Add request body
  if (options.body) {
    if (typeof options.body === 'string') {
      requestOptions.data = options.body;
    } else {
      // For Playwright, we need to use 'data' for the request body
      requestOptions.data = JSON.stringify(options.body);
      // Set content-type if not already set
      if (!requestOptions.headers['content-type'] && !requestOptions.headers['Content-Type']) {
        requestOptions.headers['Content-Type'] = 'application/json';
      }
    }
    console.log('Request body:', options.body);
  }

  console.log('Making request with options:', requestOptions);
  
  // Make the request based on method
  let response: APIResponse;
  const method = options.method.toLowerCase();
  
  // Convert our requestOptions to Playwright's format
  // Playwright expects { headers, data } format
  const playwrightOptions: any = {
    headers: requestOptions.headers || {}
  };
  
  // Handle request body correctly for Playwright
  if (requestOptions.data) {
    // Playwright expects JSON data as an object, not a string
    if (playwrightOptions.headers['Content-Type']?.includes('application/json') || 
        playwrightOptions.headers['content-type']?.includes('application/json')) {
      try {
        // If it's a string that looks like JSON, parse it
        if (typeof requestOptions.data === 'string') {
          playwrightOptions.data = JSON.parse(requestOptions.data);
        } else {
          // If it's already an object, use it directly
          playwrightOptions.data = requestOptions.data;
        }
      } catch (e) {
        // If parsing fails, use as is
        playwrightOptions.data = requestOptions.data;
      }
    } else {
      // For other content types, use as is
      playwrightOptions.data = requestOptions.data;
    }
  }
  
  console.log('Making request with Playwright options:', playwrightOptions);
  
  try {
    switch (method) {
      case 'get':
        response = await request.get(url, playwrightOptions);
        break;
      case 'post':
        response = await request.post(url, playwrightOptions);
        break;
      case 'put':
        response = await request.put(url, playwrightOptions);
        break;
      case 'delete':
        response = await request.delete(url, playwrightOptions);
        break;
      case 'patch':
        response = await request.patch(url, playwrightOptions);
        break;
      case 'head':
        response = await request.head(url, playwrightOptions);
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${options.method}`);
    }
    
    console.log(`API response status: ${response.status()}`);
    
    // Process expectations
    if (options.expect) {
      // Check status code
      if (options.expect.status) {
        console.log(`Expecting status code: ${options.expect.status}`);
        expect(response.status()).toBe(options.expect.status);
      }

      // Check body expectations
      if (options.expect.body) {
        const responseBody = await response.json();
        console.log('Response body for validation:', responseBody);
        
        Object.entries(options.expect.body).forEach(([path, assertion]) => {
          const value = getValueByPath(responseBody, path);
          console.log(`Validating path '${path}' with value:`, value);
          
          switch (assertion.assertion) {
            case 'toBeDefined':
              expect(value).toBeDefined();
              break;
            case 'toEqual':
              expect(value).toEqual(assertion.value);
              break;
            case 'toContain':
              expect(value).toContain(assertion.value);
              break;
            default:
              throw new Error(`Unsupported assertion: ${assertion.assertion}`);
          }
        });
      }

      // Check schema
      if (options.expect.schema) {
        // For schema validation, we would typically use a library like ajv
        // This is a placeholder for future implementation
        console.log('Schema validation would be performed here');
        // In a real implementation, we would do something like:
        // const ajv = new Ajv();
        // const validate = ajv.compile(options.expect.schema);
        // const valid = validate(responseBody);
        // expect(valid).toBe(true);
      }
    }

    return response;
  } catch (error) {
    console.error(`Error making API request to ${url}:`, error);
    throw error;
  }
}
