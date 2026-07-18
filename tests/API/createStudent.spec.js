import { test, expect} from  '@playwright/test';

test('Create Student', async ({ request }) => {
    const requestBody = {
        firstName:'John',
        lastName: 'Doe',
        email: `test${Date.now()}@taltektc.com`,
        password:'123456',
        confirmPassword: '123456',
        dob:{
            year: 1999,
            month: 3,
            day:2
        },
        gender:'male',
        agree: true
    };


    const response = await request.post('https://qa.taltektc.com/api/signup',{
                        headers:{
                                'Content-Type': 'application/json',
                                'api_token': 'DevGF4sg665s4ggFddfdgdgFFrs54D87sr54afggsTTC'
                            },
                        data: requestBody
                    })
    
    const responseBody = await response.json();
    console.log(responseBody);
    expect(response.status()).toBe(200);
    expect(responseBody.message).toBe('User created successfully');

    expect(responseBody.data.firstName).toBe(requestBody.firstName);
    expect(responseBody.data.lastName).toBe(requestBody.lastName);
    expect(responseBody.data.dob.year).toBe(requestBody.dob.year);
})
