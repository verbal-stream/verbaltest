import { 
  TestContext, 
  SuiteContext, 
  TestDecoratorCreator, 
  SuiteDecoratorCreator,
  getMetadataStorage,
  validateClassDecorator,
  validateMethodDecorator,
  SuiteOptions,
  TestOptions
} from '@verbalstream/verbaltest-playwright-core';

/**
 * Creates a custom test decorator
 * 
 * @param name Name of the decorator
 * @param handler Handler function that receives the test context
 * @returns Decorator factory function
 */
export function createTestDecorator(name: string, options: TestOptions = {}) {
  return function(target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    validateMethodDecorator(target, propertyKey, name);
    
    const testName = options.name || String(propertyKey);
    const testFn = descriptor.value;
    
    // Store metadata for the test
    getMetadataStorage().store(testFn, {
      type: 'test',
      name: testName,
      options,
      hooks: {
        before: [],
        after: []
      }
    });
    
    // We don't create the test block here anymore
    // The suite decorator will handle creating test blocks
    // This is just for registering the test method
    
    // Keep the original method
    return descriptor;
  };
}

/**
 * Creates a custom suite decorator
 * 
 * @param name Name of the decorator
 * @param handler Handler function that receives the suite context
 * @returns Decorator factory function
 */
export function createSuiteDecorator(name: string, options: SuiteOptions = {}) {
  return function(target: Function) {
    validateClassDecorator(target, name);
    
    const suiteName = options.name || target.name;
    
    // Store metadata for the suite
    getMetadataStorage().store(target, {
      type: 'suite',
      name: suiteName,
      options,
      hooks: {
        before: [],
        after: []
      }
    });
    
    return target;
  };
}

/**
 * Creates a decorator that can be applied to both suites and tests
 * 
 * @param name Name of the decorator
 * @param suiteHandler Handler function for suite decoration
 * @param testHandler Handler function for test decoration
 * @returns Decorator factory function
 */
export function createSuiteAndTestDecorator(name: string) {
  return function(target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor) {
    if (descriptor) {
      // Method decorator (test)
      return createTestDecorator(name)(target, propertyKey!, descriptor);
    } else {
      // Class decorator (suite)
      return createSuiteDecorator(name)(target as Function);
    }
  };
}
