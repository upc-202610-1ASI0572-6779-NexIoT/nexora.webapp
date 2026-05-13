/**
 * Mock data for authentication responses
 * Following the DTO structure expected from the .NET Backend
 */
export const MOCK_USER_RESPONSE = {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    user: {
        id: '1',
        firstName: 'Manny',
        lastName: 'Ramirez',
        email: 'jh_slin',
        role: 'tenant'
    }
};