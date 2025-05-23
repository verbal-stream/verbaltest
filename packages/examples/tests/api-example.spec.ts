import { expect, APIResponse, APIRequestContext, Page } from '@playwright/test';
import { suite, test } from '@verbaltest/playwright-decorators';
import { beforeAll, beforeEach, afterEach, afterAll } from '@verbaltest/playwright-decorators';
import { 
  ApiEndpoint, 
  PathParams, 
  QueryParams, 
  Headers, 
  RequestBody,
  ExpectStatus,
  ExpectBody,
  ExpectSchema
} from '@verbaltest/playwright-decorators';

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
  @(ExpectBody('name').toBeDefined())
  @ExpectSchema(userSchema)
  async getUserTest(args: { response?: APIResponse, request: APIRequestContext }) {
    console.log('Test args:', args);
    
    // If response is not passed from the decorator, make the request directly
    if (!args.response) {
      console.log('Response not provided, making direct request');
      const response = await args.request.get('https://jsonplaceholder.typicode.com/users/1', {
        headers: { 'Accept': 'application/json' }
      });
      const responseBody = await response.json();
      console.log('Direct response body:', responseBody);
      expect(responseBody.id).toBe(1);
      expect(responseBody.name).toBeDefined();
      return response;
    }
    
    // If response is provided by the decorator
    const responseBody = await args.response.json();
    console.log('Decorator response body:', responseBody);
    expect(responseBody.id).toBe(1);
    expect(responseBody.name).toBeDefined();
    return args.response
  }

  @test()
  @ApiEndpoint('GET', 'https://jsonplaceholder.typicode.com/users')
  @QueryParams({ _limit: 3 })
  @ExpectStatus(200)
  @(ExpectBody('length').toEqual(3))
  async getUsersTest(args: { response?: APIResponse, request: APIRequestContext }) {
    console.log('getUsersTest args:', args);
    
    // If response is not passed from the decorator, make the request directly
    if (!args.response) {
      console.log('Response not provided, making direct request');
      const response = await args.request.get('https://jsonplaceholder.typicode.com/users?_limit=3', {
        headers: { 'Accept': 'application/json' }
      });
      const responseBody = await response.json();
      console.log('Direct response body:', responseBody);
      expect(responseBody.length).toBe(3);
      expect(responseBody[0].id).toBeDefined();
      return response;
    }
    
    // If response is provided by the decorator
    const responseBody = await args.response.json();
    console.log('Decorator response body:', responseBody);
    expect(responseBody.length).toBe(3);
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
  @(ExpectBody('name').toEqual('John Doe'))
  async createUserTest(args: { response?: APIResponse, request: APIRequestContext }) {
    console.log('createUserTest args:', args);
    
    const requestBody = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '1-234-567-8901'
    };
    
    // If response is not passed from the decorator, make the request directly
    if (!args.response) {
      console.log('Response not provided, making direct request');
      const response = await args.request.post('https://jsonplaceholder.typicode.com/users', {
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        data: JSON.stringify(requestBody)
      });
      const responseBody = await response.json();
      console.log('Direct response body:', responseBody);
      expect(responseBody.id).toBeDefined();
      expect(responseBody.name).toBe('John Doe');
      return response;
    }
    
    // If response is provided by the decorator
    const responseBody = await args.response.json();
    console.log('Decorator response body:', responseBody);
    expect(responseBody.id).toBeDefined();
    expect(responseBody.name).toBe('John Doe');
    
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
