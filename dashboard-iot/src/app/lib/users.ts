export interface User {
  email: string;
  password: string;
  name: string;
  surname: string;
}

// Mock in-memory user store
export const users: User[] = [
  {
    email: "test@example.com",
    password: "Password123",
    name: "Test",
    surname: "User",
  },
];

export function addUser(user: User) {
  users.push(user);
}

export function findUser(email: string, password: string): User | undefined {
  return users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
}