import { test as baseTest, TestInfo } from '@playwright/test';
import { TestArgs } from '@verbalstream/verbaltest-playwright-core';



/**
 * Class to handle fixture hook decoration and registration
 */
class FixtureHookDecorator<T> {
  constructor(
    private method: Function,
    private hookName: string,
    private test: any,
    private options: { playwright?: any } = {}
  ) {}

  /**
   * Register the hook with the test runner
   */
  register(target: any) {
    const hookFn = this.method;
    
    // Register the hook with the test runner based on hook type
    switch (this.hookName) {
      case 'beforeAll':
        this.test.beforeAll(async (args: TestArgs & T, testInfo: TestInfo) => {
          return hookFn.call(target, args, testInfo);
        });
        break;
      case 'beforeEach':
        this.test.beforeEach(async (args: TestArgs & T, testInfo: TestInfo) => {
          return hookFn.call(target, args, testInfo);
        });
        break;
      case 'afterEach':
        this.test.afterEach(async (args: TestArgs & T, testInfo: TestInfo) => {
          return hookFn.call(target, args, testInfo);
        });
        break;
      case 'afterAll':
        this.test.afterAll(async (args: TestArgs & T, testInfo: TestInfo) => {
          return hookFn.call(target, args, testInfo);
        });
        break;
    }
  }
}

/**
 * Class to handle fixture test decoration and registration
 */
class FixtureTestDecorator<T> {
  constructor(
    private method: Function,
    private methodName: string,
    private test: any,
    private options: { name?: string; only?: boolean } = {}
  ) {}

  /**
   * Register the test with the test runner
   */
  register(target: any) {
    const testFn = this.method;
    const testName = this.options.name || this.methodName;
    
    // Create test block with custom fixture
    const testRunner = this.options.only ? this.test.only : this.test;
    testRunner(testName, async (args: TestArgs & T, testInfo: TestInfo) => {
      return testFn.call(target, args, testInfo);
    });
  }
}

/**
 * Extends the base test with custom fixtures
 * 
 * @param customFixture The custom fixture to extend with
 * @returns Object with decorators that have access to the custom fixture
 */
export function extend<T>(customFixture: any) {
  // Create test function with custom fixture
  const test = customFixture;
  
  /**
   * BeforeAll decorator with custom fixture
   */
  const beforeAll = (options: { playwright?: any } = {}) => {
    return (target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor | ClassMethodDecoratorContext) => {
      // Handle stage 3 decorators (with context)
      if (descriptor && typeof descriptor === 'object' && 'addInitializer' in descriptor) {
        const context = descriptor as ClassMethodDecoratorContext;
        const methodName = String(propertyKey);
        
        context.addInitializer(function(this: any) {
          const hookFn = this[methodName];
          const decorator = new FixtureHookDecorator<T>(hookFn, 'beforeAll', test, options);
          decorator.register(this);
        });
        
        return;
      }
      // Handle stage 2 decorators
      else if (descriptor && propertyKey) {
        const hookFn = descriptor.value;
        const decorator = new FixtureHookDecorator<T>(hookFn, 'beforeAll', test, options);
        decorator.register(target);
        
        return descriptor;
      } else {
        // Just return the target for any other case
        return target;
      }
    };
  };
  
  /**
   * BeforeEach decorator with custom fixture
   */
  const beforeEach = (options: { playwright?: any } = {}) => {
    return (target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor | ClassMethodDecoratorContext) => {
      // Handle stage 3 decorators (with context)
      if (descriptor && typeof descriptor === 'object' && 'addInitializer' in descriptor) {
        const context = descriptor as ClassMethodDecoratorContext;
        const methodName = String(propertyKey);
        
        context.addInitializer(function(this: any) {
          const hookFn = this[methodName];
          const decorator = new FixtureHookDecorator<T>(hookFn, 'beforeEach', test, options);
          decorator.register(this);
        });
        
        return;
      }
      // Handle stage 2 decorators
      else if (descriptor && propertyKey) {
        const hookFn = descriptor.value;
        const decorator = new FixtureHookDecorator<T>(hookFn, 'beforeEach', test, options);
        decorator.register(target);
        
        return descriptor;
      } else {
        // Just return the target for any other case
        return target;
      }
    };
  };
  
  /**
   * AfterAll decorator with custom fixture
   */
  const afterAll = (options: { playwright?: any } = {}) => {
    return (target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor | ClassMethodDecoratorContext) => {
      // Handle stage 3 decorators (with context)
      if (descriptor && typeof descriptor === 'object' && 'addInitializer' in descriptor) {
        const context = descriptor as ClassMethodDecoratorContext;
        const methodName = String(propertyKey);
        
        context.addInitializer(function(this: any) {
          const hookFn = this[methodName];
          const decorator = new FixtureHookDecorator<T>(hookFn, 'afterAll', test, options);
          decorator.register(this);
        });
        
        return;
      }
      // Handle stage 2 decorators
      else if (descriptor && propertyKey) {
        const hookFn = descriptor.value;
        const decorator = new FixtureHookDecorator<T>(hookFn, 'afterAll', test, options);
        decorator.register(target);
        
        return descriptor;
      } else {
        // Just return the target for any other case
        return target;
      }
    };
  };
  
  /**
   * AfterEach decorator with custom fixture
   */
  const afterEach = (options: { playwright?: any } = {}) => {
    return (target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor | ClassMethodDecoratorContext) => {
      // Handle stage 3 decorators (with context)
      if (descriptor && typeof descriptor === 'object' && 'addInitializer' in descriptor) {
        const context = descriptor as ClassMethodDecoratorContext;
        const methodName = String(propertyKey);
        
        context.addInitializer(function(this: any) {
          const hookFn = this[methodName];
          const decorator = new FixtureHookDecorator<T>(hookFn, 'afterEach', test, options);
          decorator.register(this);
        });
        
        return;
      }
      // Handle stage 2 decorators
      else if (descriptor && propertyKey) {
        const hookFn = descriptor.value;
        const decorator = new FixtureHookDecorator<T>(hookFn, 'afterEach', test, options);
        decorator.register(target);
        
        return descriptor;
      } else {
        // Just return the target for any other case
        return target;
      }
    };
  };
  
  /**
   * Test decorator with custom fixture
   */
  const testWithFixture = (options: { name?: string; only?: boolean } = {}) => {
    return (target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor | ClassMethodDecoratorContext) => {
      // Handle stage 3 decorators (with context)
      if (descriptor && typeof descriptor === 'object' && 'addInitializer' in descriptor) {
        const context = descriptor as ClassMethodDecoratorContext;
        const methodName = String(propertyKey);
        
        context.addInitializer(function(this: any) {
          const testFn = this[methodName];
          const decorator = new FixtureTestDecorator<T>(testFn, methodName, test, options);
          decorator.register(this);
        });
        
        return;
      }
      // Handle stage 2 decorators
      else if (descriptor && propertyKey) {
        const testFn = descriptor.value;
        const methodName = String(propertyKey);
        
        const decorator = new FixtureTestDecorator<T>(testFn, methodName, test, options);
        decorator.register(target);
        
        return descriptor;
      } else {
        // Just return the target for any other case
        return target;
      }
    };
  };
  
  // Return all decorators with access to custom fixture
  return {
    beforeAll,
    beforeEach,
    afterAll,
    afterEach,
    test: testWithFixture
  };
}
