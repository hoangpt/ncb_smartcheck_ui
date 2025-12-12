export const MOCK_USERS = [
    {
        username: 'admin',
        password: '123456Aa@',
        response: {
            access_token: 'mock_token_admin_',
            token_type: 'Bearer',
            expires_in: 3600,
            user_id: 1,
            username: 'Admin NCB',
            role: 'Admin'
        }
    },
    {
        username: 'ncb',
        password: '123456Aa@',
        response: {
            access_token: 'mock_token_ncb_',
            token_type: 'Bearer',
            expires_in: 3600,
            user_id: 2,
            username: 'Tran Thu Ha',
            role: 'User'
        }
    }
];
