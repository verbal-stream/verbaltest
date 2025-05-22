import { TestOptions, getName, getMetadataStorage } from '@verbaltest/playwright-core';

/**
 * Decorator for marking a method as a test
 * 
 * @example
 * ```
 * @test()
 * async myTest({ page }) {
 *   // ...
 * }
 * ```
 * 
 * @param options Test options
 * @returns Method decorator
 */
export function test(options: TestOptions = {}) {
  return function(target: any, propertyKey: string | symbol, descriptor?: PropertyDescriptor) {
    // For class methods in experimental decorators mode
    if (descriptor) {
      const originalMethod = descriptor.value;
      const methodName = String(propertyKey);
      const testName = options.name || methodName;
      
      // Store metadata for the test
      getMetadataStorage().store(originalMethod, {
        type: 'test',
        name: testName,
        options
      });
      
      return descriptor;
    }
    
    // For property decorators or other cases
    return target;
  };
}
