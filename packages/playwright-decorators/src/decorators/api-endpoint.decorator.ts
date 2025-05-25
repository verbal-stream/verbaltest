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
    console.log(`ApiEndpoint decorator applied to ${propertyKey ? String(propertyKey) : 'class'}`); 
    
    // Handle both stage 2 and stage 3 decorators
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
      
      // Store metadata in multiple places to ensure it can be retrieved
      getMetadataStorage().store(originalMethod, metadata);
      
      // Store on the descriptor value as well
      getMetadataStorage().store(descriptor.value, metadata);
      
      // Store on the prototype method
      if (propertyKey) {
        // Store on the prototype method
        getMetadataStorage().store(target.constructor.prototype[propertyKey], metadata);
        
        // Store directly on the property key for easier lookup
        const keyMetadata = {
          type: 'test' as const,
          name: String(propertyKey),
          options: { api: { method, path } }
        };
        getMetadataStorage().store(propertyKey, keyMetadata);
      }
      
      // Also store metadata on the target class to mark it as having API tests
      getMetadataStorage().store(target.constructor, {
        type: 'suite',
        name: target.constructor.name,
        options: { hasApiTests: true }
      });
      
      return descriptor;
    } else if (propertyKey && !descriptor) {
      // Stage 2 decorator (property decorator)
      const metadata = {
        type: 'test' as const,
        name: String(propertyKey),
        options: { api: { method, path } }
      };
      
      // Store metadata on the property
      getMetadataStorage().store(target[propertyKey], metadata);
      
      // Store on the prototype method
      getMetadataStorage().store(target.constructor.prototype[propertyKey], metadata);
      
      // Store directly on the property key
      getMetadataStorage().store(propertyKey, metadata);
      
      return target[propertyKey];
    } else if (typeof target === 'function') {
      // Class decorator
      console.warn('ApiEndpoint decorator should be applied to methods, not classes');
      return target;
    } else {
      // Direct function application or other case
      const metadata = {
        type: 'test' as const,
        name: target.name || 'unknown',
        options: { api: { method, path } }
      };
      
      getMetadataStorage().store(target, metadata);
      return target;
    }
  };
}
