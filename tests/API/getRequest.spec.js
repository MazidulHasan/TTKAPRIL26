import { test, expect} from  '@playwright/test';


// page is fixture, comming from playwright
// resuest is also fixture from playwright

test('Get all the student', async ({ request,page }) => {
    const response = await request.get('https://qa.taltektc.com/api/students',{
                            headers:{
                                'Content-Type': 'application/json',
                                'api_token': 'DevGF4sg665s4ggFddfdgdgFFrs54D87sr54afggsTTC'
                            }
                        });
    expect(response.status()).toBe(200);
    // console.log(response);
    
    const responseBody = await response.json();
    console.log(responseBody);
    expect(responseBody.message).toBe('Students retrieved successfully');

    
})