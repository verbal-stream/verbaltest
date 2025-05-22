import { DecoratorMetadata } from './types';

/**
 * Metadata storage for decorated classes and methods
 */
class MetadataStorage {
  private static instance: MetadataStorage;
  private metadata: Map<any, DecoratorMetadata> = new Map();

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): MetadataStorage {
    if (!MetadataStorage.instance) {
      MetadataStorage.instance = new MetadataStorage();
    }
    return MetadataStorage.instance;
  }

  /**
   * Store metadata for a class or method
   */
  public store(target: any, metadata: DecoratorMetadata): void {
    this.metadata.set(target, metadata);
  }

  /**
   * Get metadata for a class or method
   */
  public get(target: any): DecoratorMetadata | undefined {
    return this.metadata.get(target);
  }

  /**
   * Check if target has metadata
   */
  public has(target: any): boolean {
    return this.metadata.has(target);
  }

  /**
   * Get all stored metadata
   */
  public getAll(): Map<any, DecoratorMetadata> {
    return this.metadata;
  }
}

/**
 * Get the metadata storage instance
 */
export const getMetadataStorage = (): MetadataStorage => {
  return MetadataStorage.getInstance();
};

/**
 * Get the name of a class or method
 */
export function getName(target: any): string {
  if (typeof target === 'function') {
    return target.name;
  }
  return target.constructor.name;
}

/**
 * Check if a decorator is applied to a class
 */
export function isClassDecorator(target: any): boolean {
  return typeof target === 'function' && target.prototype !== undefined;
}

/**
 * Check if a decorator is applied to a method
 */
export function isMethodDecorator(target: any, propertyKey: string | symbol): boolean {
  return typeof target === 'object' && propertyKey !== undefined && target !== null;
}

/**
 * Validate that a decorator is applied to a class
 */
export function validateClassDecorator(target: any, decoratorName: string): void {
  if (!isClassDecorator(target)) {
    throw new Error(`@${decoratorName} decorator can only be applied to a class`);
  }
}

/**
 * Validate that a decorator is applied to a method
 */
export function validateMethodDecorator(
  target: any,
  propertyKey: string | symbol,
  decoratorName: string
): void {
  if (!isMethodDecorator(target, propertyKey)) {
    throw new Error(`@${decoratorName} decorator can only be applied to a method`);
  }
}
