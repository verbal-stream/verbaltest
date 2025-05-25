# VerbalTest

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

A powerful meta-framework for Playwright that provides elegant decorators for both UI and API testing, making your test code cleaner, more maintainable, and easier to write.

## Features

- **Decorator-based testing** - Write cleaner, more maintainable tests using TypeScript decorators
- **UI Testing** - Comprehensive decorators for UI testing with Playwright
- **API Testing** - Specialized decorators for API testing with built-in request/response handling
- **Custom Fixtures** - Extend Playwright's fixture system with your own custom fixtures
- **Test Organization** - Tag, categorize, and organize your tests with built-in decorators
- **Response Validation** - Validate API responses with schema validation and expectations

## Installation

```bash
# Install using npm
npm install @verbaltest/playwright-decorators @verbaltest/playwright-core

# Or using yarn
yarn add @verbaltest/playwright-decorators @verbaltest/playwright-core

# Or using pnpm
pnpm add @verbaltest/playwright-decorators @verbaltest/playwright-core
```

## Quick Start

### UI Testing Example

```typescript
import { expect, Page } from '@playwright/test';
import { suite, test, beforeEach, afterEach, tag, slow } from '@verbaltest/playwright-decorators';

@suite()
class BasicTestSuite {
  @beforeEach()
  async setupTest({ page }: { page: Page }) {
    await page.goto('https://playwright.dev/');
  }

  @test()
  async hasTitle({ page }: { page: Page }) {
    await expect(page).toHaveTitle(/Playwright/);
  }

  @tag(['regression', 'smoke'])
  @slow('This test takes longer to run')
  @test()
  async getStartedLink({ page }: { page: Page }) {
    await page.getByRole('link', { name: 'Get started' }).click();
    await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
  }

  @afterEach()
  async teardownTest() {
    console.log('Cleaning up after test');
  }
}
```

### API Testing Example

```typescript
import { expect, APIResponse, APIRequestContext } from '@playwright/test';
import { 
  suite, test, ApiEndpoint, PathParams, QueryParams, 
  Headers, RequestBody, ExpectStatus, ExpectBody, ExpectSchema 
} from '@verbaltest/playwright-decorators';

const userSchema = {
  type: 'object',
  required: ['id', 'name', 'email'],
  properties: {
    id: { type: 'number' },
    name: { type: 'string' },
    email: { type: 'string' }
  }
};

@suite()
class UserApiTests {
  @test()
  @ApiEndpoint('GET', 'https://jsonplaceholder.typicode.com/users/{id}')
  @PathParams({ id: '1' })
  @Headers({ 'Accept': 'application/json' })
  @ExpectStatus(200)
  @(ExpectBody('name').toBeDefined())
  @ExpectSchema(userSchema)
  async getUserTest(args: { response?: APIResponse, request: APIRequestContext }) {
    const responseBody = await args.response.json();
    expect(responseBody.id).toBe(1);
    return args.response;
  }
}
```

## Available Decorators

### Core Decorators

- `@suite()` - Define a test suite class
- `@test()` - Mark a method as a test
- `@beforeAll()` - Run before all tests in the suite
- `@afterAll()` - Run after all tests in the suite
- `@beforeEach()` - Run before each test
- `@afterEach()` - Run after each test

### Utility Decorators

- `@tag(['tag1', 'tag2'])` - Add tags to tests for filtering
- `@slow(reason)` - Mark a test as slow-running
- `@skip(reason)` - Skip a test
- `@only()` - Only run this test
- `@fail(reason)` - Mark a test as expected to fail
- `@fixme(reason)` - Mark a test as needing fixing

### API Testing Decorators

- `@ApiEndpoint(method, path)` - Define an API endpoint to test
- `@PathParams(params)` - Add path parameters to the request
- `@QueryParams(params)` - Add query parameters to the request
- `@Headers(headers)` - Add headers to the request
- `@RequestBody(body)` - Add a request body
- `@ExpectStatus(code)` - Expect a specific status code
- `@ExpectBody(path).toEqual(value)` - Expect a specific value in the response body
- `@ExpectSchema(schema)` - Validate response against a JSON schema

## Custom Fixtures

VerbalTest allows you to extend Playwright's fixture system with your own custom fixtures:

```typescript
import { test as baseTest } from '@playwright/test';
import { extend } from '@verbaltest/playwright-fixtures';

// Define your fixture type
type UserFixture = {
  user: { name: string, role: string }
};

// Create the fixture
const withUser = baseTest.extend<UserFixture>({
  user: async ({ }, use) => {
    await use({
      name: 'Test User',
      role: 'Admin'
    });
  }
});

// Generate decorators with access to the fixture
const { test: testWithUser } = extend<UserFixture>(withUser);

// Use in your test suite
@suite()
class FixtureTestSuite {
  @testWithUser()
  async testWithUserFixture({ page, user }) {
    console.log(`User: ${user.name}, Role: ${user.role}`);
    // Your test code here
  }
}
```

## Project Structure

This monorepo includes the following packages:

- `packages/playwright-core` - Core functionality and metadata storage
- `packages/playwright-decorators` - All decorators for UI and API testing
- `packages/playwright-fixtures` - Custom fixture support
- `packages/examples` - Example test suites showing usage

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo
pnpm dev
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd my-turborepo
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)
