import { TestOptions, getMetadataStorage } from '@verbalstream/verbaltest-playwright-core';

/**
 * Decorator for marking a method as a test
 * 
 * @example
 * ```
 * @suite()
 * class MyTestSuite {
 *   @test()
 *   async myTest() {
 *     // ...
 *   }
 * }
 * ```
 * 
 * @param options Test options
 * @returns Method decorator
 */
export function test(options: TestOptions = {}) {
  return function(target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor): any {
    const originalMethod = descriptor?.value || target;
    
    // Get test name from options or method name
    const testName = options.name || propertyKey?.toString() || originalMethod.name;
    
    // Store metadata for the test
    getMetadataStorage().store(originalMethod, {
      type: 'test',
      name: testName,
      options
    });
    
    return descriptor;
  };
}
