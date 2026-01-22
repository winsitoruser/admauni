const MOCK_USERS = {
  'alumni@admauni.ac.id': {
    password: 'password123',
    user: {
      id: '1',
      email: 'alumni@admauni.ac.id',
      nim: '2019001',
      fullName: 'John Doe Alumni',
      role: 'alumni',
      isVerified: true
    },
    token: 'mock-token-alumni-123'
  },
  'admin@admauni.ac.id': {
    password: 'admin123',
    user: {
      id: '2',
      email: 'admin@admauni.ac.id',
      nim: '2018001',
      fullName: 'Admin ADMA',
      role: 'admin',
      isVerified: true
    },
    token: 'mock-token-admin-456'
  }
};

export const mockLogin = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const userAccount = MOCK_USERS[email];
      
      if (!userAccount) {
        reject({ response: { data: { message: 'Email tidak ditemukan' } } });
        return;
      }
      
      if (userAccount.password !== password) {
        reject({ response: { data: { message: 'Password salah' } } });
        return;
      }
      
      resolve({
        data: {
          success: true,
          user: userAccount.user,
          token: userAccount.token
        }
      });
    }, 500);
  });
};

export const mockGetMe = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          success: true,
          data: {
            id: '1',
            email: 'alumni@admauni.ac.id',
            nim: '2019001',
            fullName: 'John Doe Alumni',
            role: 'alumni',
            isVerified: true,
            profile: {
              major: 'Teknik Informatika',
              faculty: 'Teknik',
              graduationYear: 2023,
              city: 'Jakarta',
              currentCompany: 'Tech Company',
              currentPosition: 'Senior Developer'
            }
          }
        }
      });
    }, 300);
  });
};
