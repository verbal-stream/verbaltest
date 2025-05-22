import { test, TestType } from '@playwright/test';
import { SuiteOptions, getName, getMetadataStorage } from '@verbaltest/playwright-core';

// Store test suites to avoid duplicate registration
const registeredSuites = new Set<string>();

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
    
    // Generate a unique ID for this suite
    const suiteId = `${suiteName}_${Date.now()}`;
    
    // Skip if this suite has already been registered
    if (registeredSuites.has(suiteId)) {
      return target;
    }
    
    // Mark this suite as registered
    registeredSuites.add(suiteId);
    
    // Store metadata for the suite
    getMetadataStorage().store(target, {
      type: 'suite',
      name: suiteName,
      options
    });
    
    // Create a describe block for the suite
    const describeFn = options.only ? test.describe.only : test.describe;
    
    describeFn(suiteName, () => {
      // Create a single instance for all tests in this suite
      let instance: any;
      
      // Find all methods in the class
      const prototype = target.prototype;
      const methods = Object.getOwnPropertyNames(prototype)
        .filter(prop => typeof prototype[prop] === 'function');
      
      // Find hook methods
      const beforeAllMethods = methods.filter(method => {
        const metadata = getMetadataStorage().get(prototype[method]);
        return metadata && metadata.type === 'hook' && metadata.name === 'beforeAll';
      });
      
      const beforeEachMethods = methods.filter(method => {
        const metadata = getMetadataStorage().get(prototype[method]);
        return metadata && metadata.type === 'hook' && metadata.name === 'beforeEach';
      });
      
      const afterEachMethods = methods.filter(method => {
        const metadata = getMetadataStorage().get(prototype[method]);
        return metadata && metadata.type === 'hook' && metadata.name === 'afterEach';
      });
      
      const afterAllMethods = methods.filter(method => {
        const metadata = getMetadataStorage().get(prototype[method]);
        return metadata && metadata.type === 'hook' && metadata.name === 'afterAll';
      });
      
      // Find test methods
      const testMethods = methods.filter(method => {
        const metadata = getMetadataStorage().get(prototype[method]);
        return metadata && metadata.type === 'test';
      });
      
      // Register beforeAll hook to create instance
      test.beforeAll(async () => {
        // Create instance once before all tests
        instance = new target();
        
        // Run beforeAll hooks - note that page and request are not available in beforeAll
        for (const method of beforeAllMethods) {
          await instance[method]({});
        }
      });
      
      // Register beforeEach hook
      test.beforeEach(async ({ page, request }) => {
        // Run beforeEach hooks
        for (const method of beforeEachMethods) {
          await instance[method]({ page, request });
        }
      });
      
      // Register each test method with a unique name
      for (const methodName of testMethods) {
        // Create a unique test name using the method name
        const testTitle = String(methodName);
        
        // Get test metadata to apply options
        const metadata = getMetadataStorage().get(prototype[methodName]);
        const testOptions = metadata?.options || {};
        
        // Determine test modifiers
        const isOnly = testOptions.only === true;
        const isSkip = testOptions.skip === true;
        const isSlow = testOptions.slow === true;
        const tags = Array.isArray(testOptions.tags) ? testOptions.tags : [];
        
        // Create the test function with the appropriate modifiers
        if (isOnly) {
          // Only run this test
          test.only(testTitle, async ({ page, request }) => {
            // Apply tags and slow markers inside the test function
            if (tags.length > 0) {
              test.info().annotations.push({ type: 'tag', description: tags.join(', ') });
            }
            
            if (isSlow) {
              test.info().annotations.push({ type: 'slow', description: testOptions.slowReason || 'Marked as slow' });
            }
            
            if (!instance) instance = new target();
            return await instance[methodName]({ page, request });
          });
        } else if (isSkip) {
          // Skip this test
          test.skip(testTitle, async ({ page, request }) => {
            // Apply tags and slow markers inside the test function
            if (tags.length > 0) {
              test.info().annotations.push({ type: 'tag', description: tags.join(', ') });
            }
            
            if (isSlow) {
              test.info().annotations.push({ type: 'slow', description: testOptions.slowReason || 'Marked as slow' });
            }
            
            if (!instance) instance = new target();
            return await instance[methodName]({ page, request });
          });
        } else {
          // Regular test
          test(testTitle, async ({ page, request }) => {
            // Apply tags and slow markers inside the test function
            if (tags.length > 0) {
              test.info().annotations.push({ type: 'tag', description: tags.join(', ') });
            }
            
            if (isSlow) {
              test.info().annotations.push({ type: 'slow', description: testOptions.slowReason || 'Marked as slow' });
            }
            
            if (!instance) instance = new target();
            return await instance[methodName]({ page, request });
          });
        }
      }
      
      // Register afterEach hook
      test.afterEach(async ({ page, request }) => {
        // Run afterEach hooks
        for (const method of afterEachMethods) {
          await instance[method]({ page, request });
        }
      });
      
      // Register afterAll hook
      test.afterAll(async () => {
        // Run afterAll hooks - note that page and request are not available in afterAll
        for (const method of afterAllMethods) {
          await instance[method]({});
        }
      });
    });
    
    // Return the original class
    return target;
  };
}
