import { getMetadataStorage } from '@verbalstream/verbaltest-playwright-core';

/**
 * Decorator for validating the response body against a JSON schema
 * 
 * @example
 * ```
 * @suite()
 * class ApiTests {
 *   @test()
 *   @ApiEndpoint('GET', '/api/users')
 *   @ExpectSchema(userSchema)
 *   async getUsersTest({ request }) {
 *     // Test implementation
 *   }
 * }
 * ```
 * 
 * @param schema JSON schema object
 * @returns Method decorator
 */
export function ExpectSchema(schema: Record<string, any>) {
  return function(target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor): any {
    const originalMethod = descriptor?.value || target;
    
    // Store metadata for the test
    const metadata = getMetadataStorage().get(originalMethod) || {
      type: 'test',
      name: String(propertyKey),
      options: {}
    };
    
    metadata.options.api = {
      ...(metadata.options.api || {}),
      expect: {
        ...(metadata.options.api?.expect || {}),
        schema
      }
    };
    
    getMetadataStorage().store(originalMethod, metadata);
    
    return descriptor;
  };
}
