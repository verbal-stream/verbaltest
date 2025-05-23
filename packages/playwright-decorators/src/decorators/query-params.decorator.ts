import { getMetadataStorage } from '@verbaltest/playwright-core';

/**
 * Interface for query parameters
 */
export interface QueryParams {
  [key: string]: string | number | boolean | string[];
}

/**
 * Decorator for specifying query parameters for an API endpoint
 * 
 * @example
 * ```
 * @suite()
 * class ApiTests {
 *   @test()
 *   @ApiEndpoint('GET', '/api/users')
 *   @QueryParams({ page: 1, limit: 10 })
 *   async getUsersTest({ request }) {
 *     // Test implementation
 *   }
 * }
 * ```
 * 
 * @param params Query parameters object
 * @returns Method decorator
 */
export function QueryParams(params: QueryParams) {
  return function(target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor): any {
    console.log(`QueryParams decorator applied to ${propertyKey ? String(propertyKey) : 'class'}`);
    
    // Handle both stage 2 and stage 3 decorators
    if (descriptor) {
      // Method decorator (stage 3)
      const originalMethod = descriptor.value;
      
      // Store metadata for the test
      const metadata = getMetadataStorage().get(originalMethod) || {
        type: 'test' as const,
        name: String(propertyKey),
        options: {}
      };
      
      // Ensure options.api exists
      if (!metadata.options.api) {
        metadata.options.api = {};
      }
      
      // Set query parameters
      metadata.options.api.queryParams = params;
      
      // Store metadata in multiple places to ensure it can be retrieved
      getMetadataStorage().store(originalMethod, metadata);
      
      // Store on the descriptor value as well
      getMetadataStorage().store(descriptor.value, metadata);
      
      // Store on the prototype method
      if (propertyKey) {
        getMetadataStorage().store(target.constructor.prototype[propertyKey], metadata);
      }
      
      return descriptor;
    } else if (propertyKey && !descriptor) {
      // Stage 2 decorator (property decorator)
      const metadata = {
        type: 'test' as const,
        name: String(propertyKey),
        options: { api: { queryParams: params } }
      };
      
      // Store metadata on the property
      getMetadataStorage().store(target[propertyKey], metadata);
      
      // Store on the prototype method
      getMetadataStorage().store(target.constructor.prototype[propertyKey], metadata);
      
      return target[propertyKey];
    } else {
      // Direct function application or other case
      const originalMethod = target;
      
      // Store metadata for the test
      const metadata = getMetadataStorage().get(originalMethod) || {
        type: 'test' as const,
        name: originalMethod.name,
        options: {}
      };
      
      // Ensure options.api exists
      if (!metadata.options.api) {
        metadata.options.api = {};
      }
      
      // Set query parameters
      metadata.options.api.queryParams = params;
      
      getMetadataStorage().store(originalMethod, metadata);
      
      return originalMethod;
    }
  };
}
