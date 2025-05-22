import { HookOptions, getMetadataStorage } from '@verbaltest/playwright-core';

/**
 * Base hook decorator factory
 * 
 * @param hookName Name of the hook
 * @param options Hook options
 * @returns Method decorator
 */
function createHookDecorator(hookName: string, options: HookOptions = {}) {
  return function(target: any, propertyKey: string | symbol, descriptor?: PropertyDescriptor) {
    // For class methods in experimental decorators mode
    if (descriptor) {
      const originalMethod = descriptor.value;
      
      // Store metadata for the hook
      getMetadataStorage().store(originalMethod, {
        type: 'hook',
        name: hookName,
        options
      });
      
      return descriptor;
    }
    
    // For property decorators or other cases
    return target;
  };
}

/**
 * Decorator for beforeAll hook
 * 
 * @example
 * ```
 * @beforeAll()
 * async setupSuite({ page }) {
 *   // ...
 * }
 * ```
 * 
 * @param options Hook options
 * @returns Method decorator
 */
export function beforeAll(options: HookOptions = {}) {
  return createHookDecorator('beforeAll', options);
}

/**
 * Decorator for beforeEach hook
 * 
 * @example
 * ```
 * @beforeEach()
 * async setupTest({ page }) {
 *   // ...
 * }
 * ```
 * 
 * @param options Hook options
 * @returns Method decorator
 */
export function beforeEach(options: HookOptions = {}) {
  return createHookDecorator('beforeEach', options);
}

/**
 * Decorator for afterAll hook
 * 
 * @example
 * ```
 * @afterAll()
 * async teardownSuite({ page }) {
 *   // ...
 * }
 * ```
 * 
 * @param options Hook options
 * @returns Method decorator
 */
export function afterAll(options: HookOptions = {}) {
  return createHookDecorator('afterAll', options);
}

/**
 * Decorator for afterEach hook
 * 
 * @example
 * ```
 * @afterEach()
 * async teardownTest({ page }) {
 *   // ...
 * }
 * ```
 * 
 * @param options Hook options
 * @returns Method decorator
 */
export function afterEach(options: HookOptions = {}) {
  return createHookDecorator('afterEach', options);
}
