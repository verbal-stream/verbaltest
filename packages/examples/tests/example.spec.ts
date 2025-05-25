import { test as baseTest, expect, Page } from '@playwright/test';
import { suite, test, beforeAll, afterAll, beforeEach, afterEach, tag, slow } from '@verbalstream/verbaltest-playwright-decorators';
import { extend } from '@verbalstream/verbaltest-playwright-fixtures';

// Example of a basic test suite using decorators
@suite()
class BasicTestSuite {
  // Hook that runs before all tests in the suite
  @beforeAll()
  async setupSuite({ page }: { page: Page }) {
    console.log('Setting up test suite');
  }

  // Hook that runs before each test
  @beforeEach()
  async setupTest({ page }: { page: Page }) {
    await page.goto('https://playwright.dev/');
  }

  // Basic test using the @test decorator
  @test()
  async hasTitle({ page }: { page: Page }) {
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Playwright/);
  }

  // Test with tags and slow marker
  @tag(['regression', 'smoke'])
  @slow('This test takes longer to run')
  @test()
  async getStartedLink({ page }: { page: Page }) {
    // Click the get started link.
    await page.getByRole('link', { name: 'Get started' }).click();

    // Expects page to have a heading with the name of Installation.
    await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
  }

  // Hook that runs after each test
  @afterEach()
  async teardownTest({ page }: { page: Page }) {
    console.log('Cleaning up after test');
  }

  // Hook that runs after all tests in the suite
  @afterAll()
  async teardownSuite({ page }: { page: Page }) {
    console.log('Cleaning up test suite');
  }
}

type User = {
  name: string
  role: string
}

// Example of using custom fixtures
type UserFixture = {
  user: User
};

// Create user fixture
const withUser = baseTest.extend<UserFixture>({
  user: async ({ }, use) => {
    await use({
      name: 'Test User',
      role: 'Admin'
    });
  }
});

// Generate decorators with access to the user fixture
const { test: testWithUser } = extend<UserFixture>(withUser);

// Example of a test suite with custom fixtures
@suite()
class FixtureTestSuite {
  @testWithUser()
  async testWithUserFixture({ page, user } : { page: Page, user: User }) {
    console.log(`Testing with user: ${user.name}, role: ${user.role}`);
    await page.goto('https://playwright.dev/');
    await expect(page).toHaveTitle(/Playwright/);
  }
}
