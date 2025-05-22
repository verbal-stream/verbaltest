import { getMetadataStorage } from '@verbaltest/playwright-core';

/**
 * Interface for API endpoint decorator options
 */
export interface ApiEndpointOptions {
  method: string;
  path: string;
}

/**
 * Decorator for specifying an API endpoint for a test
 * 
 * @example
 * ```
 * @suite()
 * class ApiTests {
 *   @test()
 *   @ApiEndpoint('GET', '/api/users/{id}')
 *   async getUserTest({ request }) {
 *     // Test implementation
 *   }
 * }
 * ```
 * 
 * @param method HTTP method (GET, POST, PUT, DELETE, etc.)
 * @param path API endpoint path
 * @returns Method decorator
 */
export function ApiEndpoint(method: string, path: string) {
  return function(target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor): any {
    // Handle both class and method decorators
    if (descriptor) {
      // Method decorator (stage 3)
      const originalMethod = descriptor.value;
      
      // Get existing metadata or create new one
      const metadata = getMetadataStorage().get(originalMethod) || {
        type: 'test',
        name: String(propertyKey),
        options: {}
      };
      
      // Initialize API options if not present
      if (!metadata.options.api) {
        metadata.options.api = {};
      }
      
      // Set API method and path
      metadata.options.api.method = method;
      metadata.options.api.path = path;
      
      // Store metadata for the test method
      getMetadataStorage().store(originalMethod, metadata);
      
      // Store metadata on the prototype method as well for better retrieval
      if (propertyKey) {
        getMetadataStorage().store(target.constructor.prototype[propertyKey], metadata);
      }
      
      // Also store metadata on the target itself to make it easier to find
      getMetadataStorage().store(target, {
        type: 'suite', // Use 'suite' type which is valid in MetadataType
        name: target.constructor.name,
        options: { hasApiTests: true }
      });
      
      return descriptor;
    } else if (typeof target === 'function') {
      // Class decorator
      return target;
    } else {
      // Property decorator or other
      return target;
    }
  };
}
