import { getMetadataStorage } from '@verbaltest/playwright-core';

/**
 * Interface for path parameters
 */
export interface PathParams {
  [key: string]: string | number;
}

/**
 * Decorator for specifying path parameters for an API endpoint
 * 
 * @example
 * ```
 * @suite()
 * class ApiTests {
 *   @test()
 *   @ApiEndpoint('GET', '/api/users/{id}')
 *   @PathParams({ id: '123' })
 *   async getUserTest({ request }) {
 *     // Test implementation
 *   }
 * }
 * ```
 * 
 * @param params Path parameters object
 * @returns Method decorator
 */
export function PathParams(params: PathParams) {
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
      
      // Set path parameters
      metadata.options.api.pathParams = params;
      
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
      
      // Set path parameters
      metadata.options.api.pathParams = params;
      
      getMetadataStorage().store(originalMethod, metadata);
      
      return originalMethod;
    }
  };
}
