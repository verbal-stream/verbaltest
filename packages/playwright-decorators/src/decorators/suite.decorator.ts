import { test as base } from '@playwright/test';
import { SuiteOptions, getName, getMetadataStorage } from '@verbaltest/playwright-core';

/**
 * Decorator for marking a class as a test suite
 * 
 * @example
 * ```
 * @suite()
 * class MyTestSuite {
 *   // ...
 * }
 * ```
 * 
 * @param options Suite options
 * @returns Class decorator
 */
export function suite(options: SuiteOptions = {}) {
  return function(target: any): any {
    // Get suite name from options or class name
    const suiteName = options.name || getName(target);
    
    // Store metadata for the suite
    getMetadataStorage().store(target, {
      type: 'suite',
      name: suiteName,
      options
    });
    
    // Get the caller file name to include in the test name
    const stack = new Error().stack;
    const callerMatch = stack?.split('\n')[2]?.match(/at (?:Object\.|Function\.|)(?:.*) \((.*):\d+:\d+\)/);
    const callerFile = callerMatch ? callerMatch[1] : '';
    const fileName = callerFile ? callerFile.split('/').pop() || '' : '';
    
    // Create a test file that will be discovered by Playwright with the file name in the test name
    const fullSuiteName = fileName ? `[${fileName}] ${suiteName}` : suiteName;
    base(fullSuiteName, async ({ page }) => {
      // Create an instance of the suite
      const instance = new target();
      
      // Find all methods in the class
      const prototype = target.prototype;
      const methods = Object.getOwnPropertyNames(prototype)
        .filter(prop => typeof prototype[prop] === 'function');
      
      // Find and run beforeEach methods
      const beforeEachMethods = methods.filter(method => {
        const metadata = getMetadataStorage().get(prototype[method]);
        return metadata && metadata.type === 'hook' && metadata.name === 'beforeEach';
      });
      
      for (const method of beforeEachMethods) {
        await instance[method]({ page });
      }
      
      // Find and run test methods
      const testMethods = methods.filter(method => {
        const metadata = getMetadataStorage().get(prototype[method]);
        return metadata && metadata.type === 'test';
      });
      
      // Run each test method
      for (const method of testMethods) {
        // Get the file path from the stack trace
        const stack = new Error().stack;
        const callerFile = stack?.split('\n')[2]?.match(/\((.*):\d+:\d+\)/)?.[1] || '';
        const fileName = callerFile.split('/').pop() || '';
        
        // Include the file name in the step name for better reporting
        const stepName = fileName ? `${fileName}: ${method}` : method;
        
        await base.step(stepName, async () => {
          await instance[method]({ page });
        });
      }
      
      // Find and run afterEach methods
      const afterEachMethods = methods.filter(method => {
        const metadata = getMetadataStorage().get(prototype[method]);
        return metadata && metadata.type === 'hook' && metadata.name === 'afterEach';
      });
      
      for (const method of afterEachMethods) {
        await instance[method]({ page });
      }
    });
    
    // Return the original class
    return target;
  };
}
