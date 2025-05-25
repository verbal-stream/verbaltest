import { getMetadataStorage } from '@verbalstream/verbaltest-playwright-core';

/**
 * Factory for creating body expectation decorators
 * 
 * @example
 * ```
 * @suite()
 * class ApiTests {
 *   @test()
 *   @ApiEndpoint('GET', '/api/users')
 *   @ExpectBody('users').toBeDefined()
 *   @ExpectBody('users.length').toEqual(10)
 *   async getUsersTest({ request }) {
 *     // Test implementation
 *   }
 * }
 * ```
 * 
 * @param path Path to the property in the response body
 * @returns Object with assertion methods
 */
export function ExpectBody(path: string) {
  const decoratorFactory = {
    toBeDefined() {
      return function(target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor): any {
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
          
          // Ensure options.api.expect.body exists
          if (!metadata.options.api.expect.body) {
            metadata.options.api.expect.body = {};
          }
          
          // Set body expectation
          metadata.options.api.expect.body[path] = {
            assertion: 'toBeDefined'
          };
          
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
          
          // Ensure options.api.expect.body exists
          if (!metadata.options.api.expect.body) {
            metadata.options.api.expect.body = {};
          }
          
          // Set body expectation
          metadata.options.api.expect.body[path] = {
            assertion: 'toBeDefined'
          };
          
          getMetadataStorage().store(originalMethod, metadata);
          
          return originalMethod;
        }
      };
    },
    
    toEqual(value: any) {
      return function(target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor): any {
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
          
          // Ensure options.api.expect.body exists
          if (!metadata.options.api.expect.body) {
            metadata.options.api.expect.body = {};
          }
          
          // Set body expectation
          metadata.options.api.expect.body[path] = {
            assertion: 'toEqual',
            value
          };
          
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
          
          // Ensure options.api.expect.body exists
          if (!metadata.options.api.expect.body) {
            metadata.options.api.expect.body = {};
          }
          
          // Set body expectation
          metadata.options.api.expect.body[path] = {
            assertion: 'toEqual',
            value
          };
          
          getMetadataStorage().store(originalMethod, metadata);
          
          return originalMethod;
        }
      };
    },
    
    toContain(value: any) {
      return function(target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor): any {
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
          
          // Ensure options.api.expect.body exists
          if (!metadata.options.api.expect.body) {
            metadata.options.api.expect.body = {};
          }
          
          // Set body expectation
          metadata.options.api.expect.body[path] = {
            assertion: 'toContain',
            value
          };
          
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
          
          // Ensure options.api.expect.body exists
          if (!metadata.options.api.expect.body) {
            metadata.options.api.expect.body = {};
          }
          
          // Set body expectation
          metadata.options.api.expect.body[path] = {
            assertion: 'toContain',
            value
          };
          
          getMetadataStorage().store(originalMethod, metadata);
          
          return originalMethod;
        }
      };
    }
  };
  
  return decoratorFactory;
}
