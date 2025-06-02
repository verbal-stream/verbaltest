import { expect, APIResponse, APIRequestContext, Page } from '@playwright/test';
import { suite, test } from '@verbalstream/verbaltest-playwright-decorators';
import { beforeAll, beforeEach, afterEach, afterAll } from '@verbalstream/verbaltest-playwright-decorators';
import { 
  ApiEndpoint, 
  PathParams, 
  QueryParams, 
  Headers, 
  RequestBody,
  ExpectStatus,
  ExpectBody,
  ExpectSchema
} from '@verbalstream/verbaltest-playwright-decorators';

// Define a schema for user data
const userSchema = {
  type: 'object',
  required: ['id', 'name', 'email'],
  properties: {
    id: { type: 'number' },
    name: { type: 'string' },
    email: { type: 'string' },
    phone: { type: 'string' }
  }
};

@suite()
class UserApiTests {
  baseUrl = 'https://jsonplaceholder.typicode.com';

  @beforeAll()
  async setup() {
    console.log('Setting up API tests');
  }

  @beforeEach()
  async setupEach({ page }: { page: Page }) {
    console.log('Setting up test');
  }

  @test()
  @ApiEndpoint('GET', 'https://jsonplaceholder.typicode.com/users/{id}')
  @PathParams({ id: '1' })
  @Headers({ 'Accept': 'application/json' })
  @ExpectStatus(200)
  @ExpectSchema(userSchema)
  async getUserTest(args: { response: APIResponse, request: APIRequestContext }): Promise<APIResponse> {
    // The response is provided by the decorator
    const responseBody = await args.response.json();
    console.log('Response body:', responseBody);
    
    // Additional assertions if needed
    expect(responseBody.id).toBe(1);
    expect(responseBody.name).toBeDefined();
    
    return args.response;
  }

  @test()
  @ApiEndpoint('GET', 'https://jsonplaceholder.typicode.com/users')
  @QueryParams({ _limit: '3' }) // Make sure _limit is a string to match URL param format
  @ExpectStatus(200)
  @(ExpectBody('length').toEqual(3))
  async getUsersTest(args: { response: APIResponse, request: APIRequestContext }): Promise<APIResponse> {
    // The response is provided by the decorator
    const responseBody = await args.response.json();
    console.log('Response body:', responseBody);
    
    // Additional assertions
    expect(Array.isArray(responseBody)).toBe(true);
    expect(responseBody.length).toBe(3); // JSONPlaceholder should return 3 users with _limit=3
    expect(responseBody[0].id).toBeDefined();
    
    return args.response;
  }

  @test()
  @ApiEndpoint('POST', 'https://jsonplaceholder.typicode.com/users')
  @Headers({ 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  })
  @RequestBody({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '1-234-567-8901'
  })
  @ExpectStatus(201)
  async createUserTest(args: { response: APIResponse, request: APIRequestContext }): Promise<APIResponse> {
    // The response is provided by the decorator
    const responseBody = await args.response.json();
    console.log('Response body:', responseBody);
    
    // JSONPlaceholder only returns the id for new resources
    expect(responseBody.id).toBeDefined();
    // We can't check for name since JSONPlaceholder doesn't return it
    // expect(responseBody.name).toBe('John Doe');
    
    return args.response;
  }

  @afterEach()
  async teardownEach() {
    console.log('Cleaning up after test');
  }

  @afterAll()
  async teardown() {
    console.log('Cleaning up after all tests');
  }
}
