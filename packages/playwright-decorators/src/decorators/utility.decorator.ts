import { test as baseTest } from '@playwright/test';
import { getMetadataStorage } from '@verbaltest/playwright-core';

/**
 * Skip decorator - skips a test or suite
 * 
 * @param reason Optional reason for skipping
 * @returns Decorator function
 */
export function skip(reason?: string) {
  return function(target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor) {
    if (descriptor) {
      // Method decorator (test)
      const testFn = descriptor.value;
      
      // Store metadata for the test
      getMetadataStorage().store(testFn, {
        type: 'test',
        name: String(propertyKey),
        options: { skip: true, skipReason: reason || '' }
      });
      
      return descriptor;
    } else {
      // Class decorator (suite)
      getMetadataStorage().store(target, {
        type: 'suite',
        name: target.name,
        options: { skip: true, skipReason: reason || '' }
      });
      
      return target;
    }
  };
}

/**
 * Only decorator - runs only this test or suite
 * 
 * @returns Decorator function
 */
export function only() {
  return function(target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor) {
    if (descriptor) {
      // Method decorator (test)
      const testFn = descriptor.value;
      const metadata = getMetadataStorage().get(testFn);
      
      if (metadata) {
        metadata.options = { ...metadata.options, only: true };
        getMetadataStorage().store(testFn, metadata);
      } else {
        // Store metadata for the test
        getMetadataStorage().store(testFn, {
          type: 'test',
          name: String(propertyKey),
          options: { only: true }
        });
      }
      
      return descriptor;
    } else {
      // Class decorator (suite)
      const metadata = getMetadataStorage().get(target);
      
      if (metadata) {
        metadata.options = { ...metadata.options, only: true };
        getMetadataStorage().store(target, metadata);
      } else {
        // Store metadata for the suite
        getMetadataStorage().store(target, {
          type: 'suite',
          name: target.name,
          options: { only: true }
        });
      }
      
      return target;
    }
  };
}

/**
 * Tag decorator - adds tags to a test or suite
 * 
 * @param tags Array of tags
 * @returns Decorator function
 */
export function tag(tags: string[]) {
  return function(target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor) {
    if (descriptor) {
      // Method decorator (test)
      const testFn = descriptor.value;
      const metadata = getMetadataStorage().get(testFn);
      
      if (metadata) {
        metadata.options = { ...metadata.options, tags };
        getMetadataStorage().store(testFn, metadata);
      } else {
        // Store metadata for the test
        getMetadataStorage().store(testFn, {
          type: 'test',
          name: String(propertyKey),
          options: { tags }
        });
      }
      
      return descriptor;
    } else {
      // Class decorator (suite)
      const metadata = getMetadataStorage().get(target);
      
      if (metadata) {
        metadata.options = { ...metadata.options, tags };
        getMetadataStorage().store(target, metadata);
      } else {
        // Store metadata for the suite
        getMetadataStorage().store(target, {
          type: 'suite',
          name: target.name,
          options: { tags }
        });
      }
      
      return target;
    }
  };
}

/**
 * Fail decorator - marks a test or suite as "should fail"
 * 
 * @param reason Optional reason for expecting failure
 * @returns Decorator function
 */
export function fail(reason?: string) {
  return (target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor) => {
    if (descriptor) {
      // Method decorator (test)
      baseTest.fail(true, reason || '');
      
      return descriptor;
    } else {
      // Class decorator (suite)
      // Mark all tests in the suite as failing
      baseTest.describe.configure({ timeout: 0 });
      
      return target;
    }
  };
}

/**
 * Fixme decorator - marks a test or suite as "fixme"
 * 
 * @param reason Optional reason for fixme
 * @returns Decorator function
 */
export function fixme(reason?: string) {
  return (target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor) => {
    if (descriptor) {
      // Method decorator (test)
      baseTest.fixme(true, reason || '');
      
      return descriptor;
    } else {
      // Class decorator (suite)
      // Skip all tests in the suite
      baseTest.describe(reason || 'Fixme suite', () => {});
      
      return target;
    }
  };
}

/**
 * Slow decorator - marks a test or suite as "slow"
 * 
 * @param reason Optional reason for marking as slow
 * @returns Decorator function
 */
export function slow(reason?: string) {
  return function(target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor) {
    if (descriptor) {
      // Method decorator (test)
      const testFn = descriptor.value;
      const metadata = getMetadataStorage().get(testFn);
      
      if (metadata) {
        metadata.options = { ...metadata.options, slow: true, slowReason: reason };
        getMetadataStorage().store(testFn, metadata);
      } else {
        // Store metadata for the test
        getMetadataStorage().store(testFn, {
          type: 'test',
          name: String(propertyKey),
          options: { slow: true, slowReason: reason }
        });
      }
      
      return descriptor;
    } else {
      // Class decorator (suite)
      const metadata = getMetadataStorage().get(target);
      
      if (metadata) {
        metadata.options = { ...metadata.options, slow: true, slowReason: reason };
        getMetadataStorage().store(target, metadata);
      } else {
        // Store metadata for the suite
        getMetadataStorage().store(target, {
          type: 'suite',
          name: target.name,
          options: { slow: true, slowReason: reason }
        });
      }
      
      return target;
    }
  };
}
