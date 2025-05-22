import { Page, TestInfo, Fixtures } from '@playwright/test';

/**
 * Basic test arguments provided to test methods
 */
export interface TestArgs {
  page: Page;
  [key: string]: any;
}

/**
 * Options for the suite decorator
 */
export interface SuiteOptions {
  name?: string;
  only?: boolean;
}

/**
 * Options for the test decorator
 */
export interface TestOptions {
  name?: string;
  only?: boolean;
  playwright?: any;
}

/**
 * Options for hook decorators (beforeAll, beforeEach, afterAll, afterEach)
 */
export interface HookOptions {
  playwright?: any;
}

/**
 * Suite context provided to custom suite decorators
 */
export interface SuiteContext {
  name: string;
  initialized: (callback: () => void) => void;
  options: SuiteOptions;
}

/**
 * Test context provided to custom test decorators
 */
export interface TestContext {
  name: string;
  beforeTest: (callback: (args: TestArgs, testInfo: TestInfo) => Promise<void> | void) => void;
  afterTest: (callback: (args: TestArgs, testInfo: TestInfo) => Promise<void> | void) => void;
  options: TestOptions;
}

// Generic type helper for test arguments with custom fixtures
export type TestArgsWithFixtures<T = {}> = TestArgs & T;

/**
 * Metadata storage for decorated classes and methods
 */
export interface DecoratorMetadata {
  type: 'suite' | 'test' | 'hook';
  name: string;
  options?: any;
  hooks?: {
    before?: Function[];
    after?: Function[];
  };
}

/**
 * Type for decorator factory functions
 */
export type DecoratorFactory<T> = (options?: T) => ClassDecorator | MethodDecorator;

/**
 * Type for custom test decorator creator
 */
export type TestDecoratorCreator = (
  name: string,
  handler: (context: { test: TestContext }) => void
) => DecoratorFactory<any>;

/**
 * Type for custom suite decorator creator
 */
export type SuiteDecoratorCreator = (
  name: string,
  handler: (context: { suite: SuiteContext }) => void
) => DecoratorFactory<any>;
