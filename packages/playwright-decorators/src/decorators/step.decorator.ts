import { test } from '@playwright/test';

/**
 * Decorator for wrapping a method with a test step
 * 
 * @example
 * ```
 * @step('Custom step name')
 * async myMethod() {
 *   // ...
 * }
 * ```
 * 
 * @param name Optional custom step name
 * @returns Method decorator
 */
export function step(name?: string) {
  return function(target: any, propertyKey: string | symbol, descriptor?: PropertyDescriptor) {
    // Handle stage 2 decorators (with descriptor)
    if (descriptor) {
      const originalMethod = descriptor.value;
      
      // Replace the original method with a wrapped version
      descriptor.value = async function(...args: any[]) {
        // Use custom name or generate one from class and method name
        const stepName = name || `${this.constructor.name}.${String(propertyKey)}`;
        
        // Wrap the method call with test.step
        return await test.step(stepName, async () => {
          return await originalMethod.apply(this, args);
        });
      };
      
      return descriptor;
    }
    
    // For other cases, just return the target
    return target;
  };
}
