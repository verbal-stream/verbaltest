import { HookOptions, getMetadataStorage } from '@verbaltest/playwright-core';

type TestMethod = (args: any, testInfo?: any) => void | Promise<void>;

/**
 * Run method before all tests in the suite.
 * Target class should be marked by @suite decorator.
 * 
 * @example
 * ```
 * @suite()
 * class MyTestSuite {
 *   @beforeAll()
 *   async setup() {
 *     // Setup logic that runs once before all tests
 *   }
 * }
 * ```
 */
export function beforeAll(options: HookOptions = {}) {
  return function(target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor): any {
    const originalMethod = descriptor?.value || target;
    
    // Store metadata for the hook
    getMetadataStorage().store(originalMethod, {
      type: 'hook',
      name: 'beforeAll',
      options
    });
    
    return descriptor;
  };
}

/**
 * Run method before each test in suite.
 * Target class should be marked by @suite decorator.
 * 
 * @example
 * ```
 * @suite()
 * class MyTestSuite {
 *   @beforeEach()
 *   async setupEach({ page }) {
 *     // Setup logic that runs before each test
 *     await page.goto('https://example.com');
 *   }
 * }
 * ```
 */
export function beforeEach(options: HookOptions = {}) {
  return function(target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor): any {
    const originalMethod = descriptor?.value || target;
    
    // Store metadata for the hook
    getMetadataStorage().store(originalMethod, {
      type: 'hook',
      name: 'beforeEach',
      options
    });
    
    return descriptor;
  };
}

/**
 * Run method after each test in suite.
 * Target class should be marked by @suite decorator.
 * 
 * @example
 * ```
 * @suite()
 * class MyTestSuite {
 *   @afterEach()
 *   async teardownEach({ page }) {
 *     // Cleanup logic that runs after each test
 *   }
 * }
 * ```
 */
export function afterEach(options: HookOptions = {}) {
  return function(target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor): any {
    const originalMethod = descriptor?.value || target;
    
    // Store metadata for the hook
    getMetadataStorage().store(originalMethod, {
      type: 'hook',
      name: 'afterEach',
      options
    });
    
    return descriptor;
  };
}

/**
 * Run method after all tests in the suite.
 * Target class should be marked by @suite decorator.
 * 
 * @example
 * ```
 * @suite()
 * class MyTestSuite {
 *   @afterAll()
 *   async teardown() {
 *     // Cleanup logic that runs once after all tests
 *   }
 * }
 * ```
 */
export function afterAll(options: HookOptions = {}) {
  return function(target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor): any {
    const originalMethod = descriptor?.value || target;
    
    // Store metadata for the hook
    getMetadataStorage().store(originalMethod, {
      type: 'hook',
      name: 'afterAll',
      options
    });
    
    return descriptor;
  };
}
