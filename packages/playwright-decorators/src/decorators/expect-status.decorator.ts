import { getMetadataStorage } from '@verbalstream/verbaltest-playwright-core';

/**
 * Decorator for expecting a specific status code from an API response
 * 
 * @example
 * ```
 * @suite()
 * class ApiTests {
 *   @test()
 *   @ApiEndpoint('GET', '/api/users')
 *   @ExpectStatus(200)
 *   async getUsersTest({ request }) {
 *     // Test implementation
 *   }
 * }
 * ```
 * 
 * @param status Expected status code
 * @returns Method decorator
 */
export function ExpectStatus(status: number) {
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
      
      // Ensure options.api.expect exists
      if (!metadata.options.api.expect) {
        metadata.options.api.expect = {};
      }
      
      // Set expected status
      metadata.options.api.expect.status = status;
      
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
      
      // Ensure options.api.expect exists
      if (!metadata.options.api.expect) {
        metadata.options.api.expect = {};
      }
      
      // Set expected status
      metadata.options.api.expect.status = status;
      
      getMetadataStorage().store(originalMethod, metadata);
      
      return originalMethod;
    }
  };
}
