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
    Object.entries(options.pathParams).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      if (url.includes(placeholder)) {
        url = url.replace(placeholder, String(value));
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
  
  try {
    switch (method) {
      case 'get':
        response = await request.get(url, requestOptions);
        break;
      case 'post':
        response = await request.post(url, requestOptions);
        break;
      case 'put':
        response = await request.put(url, requestOptions);
        break;
      case 'delete':
        response = await request.delete(url, requestOptions);
        break;
      case 'patch':
        response = await request.patch(url, requestOptions);
        break;
      case 'head':
        response = await request.head(url, requestOptions);
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
