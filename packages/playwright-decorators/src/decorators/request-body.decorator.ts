import { getMetadataStorage } from '@verbalstream/verbaltest-playwright-core';

/**
 * Interface for request body
 */
export type RequestBody = Record<string, any> | string;

/**
 * Decorator for specifying request body for an API endpoint
 * 
 * @example
 * ```
 * @suite()
 * class ApiTests {
 *   @test()
 *   @ApiEndpoint('POST', '/api/users')
 *   @RequestBody({ name: 'John Doe', email: 'john@example.com' })
 *   async createUserTest({ request }) {
 *     // Test implementation
 *   }
 * }
 * ```
 * 
 * @param body Request body
 * @returns Method decorator
 */
export function RequestBody(body: RequestBody) {
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
      
      // Set request body
      metadata.options.api.body = body;
      
      // Store metadata in multiple places to ensure it can be retrieved
      getMetadataStorage().store(originalMethod, metadata);
      
      // Store on the descriptor value as well
      getMetadataStorage().store(descriptor.value, metadata);
      
      // Store on the prototype method
      if (propertyKey) {
        getMetadataStorage().store(target.constructor.prototype[propertyKey], metadata);
      }
      
      // Store on the property key itself
      if (propertyKey) {
        getMetadataStorage().store(propertyKey, metadata);
      }
      
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
      
      // Set request body
      metadata.options.api.body = body;
      
      getMetadataStorage().store(originalMethod, metadata);
      
      return originalMethod;
    }
  };
}
