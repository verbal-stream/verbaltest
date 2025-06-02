import { getMetadataStorage } from '@verbalstream/verbaltest-playwright-core';

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
    console.log(`PathParams decorator applied to ${propertyKey ? String(propertyKey) : 'class'}`);
    
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
      
      // Set path parameters
      metadata.options.api.pathParams = params;
      
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
    } else if (propertyKey && !descriptor) {
      // Stage 2 decorator (property decorator)
      const metadata = {
        type: 'test' as const,
        name: String(propertyKey),
        options: { api: { pathParams: params } }
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
      
      // Set path parameters
      metadata.options.api.pathParams = params;
      
      getMetadataStorage().store(originalMethod, metadata);
      
      return originalMethod;
    }
  };
}
