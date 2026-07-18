import { test, expect, request} from  '@playwright/test';

test('Loggin and then put request', async ({ request }) => {
    const loginResponse = await request.post('https://qa.taltektc.com/api/login',{
                        headers:{
                                'Content-Type': 'application/json',
                                'api_token': 'DevGF4sg665s4ggFddfdgdgFFrs54D87sr54afggsTTC'
                            },
                        data: {
                            id:'TTC0140',
                            password:'123456'
                        }
    });

    expect(loginResponse.status()).toBe(200);
    const loginBody = await loginResponse.json();


    expect(loginBody.message).toBe('Successfully signed in');
    console.log(loginBody);

    const accesToken = loginBody.access_token;
    const studentId = loginBody.student_id;

    console.log('Access token:', accesToken);
    console.log('studentId:', studentId);
    


    const requestBody = {
        firstName:'JohnUpdated',
        lastName: 'DoeUpdated',
        email: `test${Date.now()}@taltektc.com`,
        dob:{
            year: 1999,
            month: 3,
            day:2
        },
        gender:'male'
    };


    const updateResponse = await request.put(`https://qa.taltektc.com/api/student/update/${studentId}`,{
                    headers:{
                                'Content-Type': 'application/json',
                                'api_token': 'DevGF4sg665s4ggFddfdgdgFFrs54D87sr54afggsTTC',
                                'Authorization': `Bearer ${accesToken}`
                            },
                    data:requestBody
    });

    const updateBody = await updateResponse.json();
    console.log(updateBody);
    
    expect(updateResponse.status()).toBe(200);
    expect(updateBody.data.first_name).toBe('JohnUpdated');
})
