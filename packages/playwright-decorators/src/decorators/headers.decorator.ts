import { getMetadataStorage } from '@verbalstream/verbaltest-playwright-core';

/**
 * Interface for request headers
 */
export interface Headers {
  [key: string]: string;
}

/**
 * Decorator for specifying request headers for an API endpoint
 * 
 * @example
 * ```
 * @suite()
 * class ApiTests {
 *   @test()
 *   @ApiEndpoint('GET', '/api/users')
 *   @Headers({ 'Authorization': 'Bearer token123' })
 *   async getUsersTest({ request }) {
 *     // Test implementation
 *   }
 * }
 * ```
 * 
 * @param headers Headers object
 * @returns Method decorator
 */
export function Headers(headers: Headers) {
  return function(target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor): any {
    // Handle both stage 2 and stage 3 decorators
    if (descriptor) {
      // Method decorator (stage 3)
      const originalMethod = descriptor.value;
      
      // Store metadata for the test
      const metadata = getMetadataStorage().get(originalMethod) || {
        type: 'test',
        name: String(propertyKey),
        options: {}
      };
      
      // Ensure options.api exists
      if (!metadata.options.api) {
        metadata.options.api = {};
      }
      
      // Set headers
      metadata.options.api.headers = headers;
      
      getMetadataStorage().store(originalMethod, metadata);
      
      return descriptor;
    } else {
      // Stage 2 decorator or direct function call
      const originalMethod = target;
      
      // Store metadata for the test
      const metadata = getMetadataStorage().get(originalMethod) || {
        type: 'test',
        name: originalMethod.name,
        options: {}
      };
      
      // Ensure options.api exists
      if (!metadata.options.api) {
        metadata.options.api = {};
      }
      
      // Set headers
      metadata.options.api.headers = headers;
      
      getMetadataStorage().store(originalMethod, metadata);
      
      return originalMethod;
    }
  };
}
