import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { PostgresApiService } from './postgres-api.service';
import { User } from './datos';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let postgresApiService: jasmine.SpyObj<PostgresApiService>;

  const mockUsers: User[] = [
    { id: 1, name: 'testuser', email: 'test@example.com', password: 'password123' },
    { id: 2, name: 'admin', email: 'admin@example.com', password: 'admin123' }
  ];

  beforeEach(() => {
    const spy = jasmine.createSpyObj('PostgresApiService', ['getUsers', 'createUser']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: PostgresApiService, useValue: spy }
      ]
    });
    
    service = TestBed.inject(AuthService);
    postgresApiService = TestBed.inject(PostgresApiService) as jasmine.SpyObj<PostgresApiService>;
  });

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully with valid credentials', async () => {
    postgresApiService.getUsers.and.returnValue(of(mockUsers));

    const result = await service.login('testuser', 'password123');

    expect(result.success).toBe(true);
    expect(result.message).toBe('Ingreso exitoso');
    expect(service.getCurrentUser()).toBeTruthy();
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should fail login with invalid credentials', async () => {
    postgresApiService.getUsers.and.returnValue(of(mockUsers));

    const result = await service.login('testuser', 'wrongpassword');

    expect(result.success).toBe(false);
    expect(result.message).toBe('Usuario o Contraseña incorrectas');
    expect(service.getCurrentUser()).toBe(null);
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should register a new user successfully', async () => {
    postgresApiService.getUsers.and.returnValue(of([])); // No existing users
    const newUser = { id: 3, name: 'newuser', email: 'new@example.com', password: 'newpass123' };
    postgresApiService.createUser.and.returnValue(of(newUser));

    const result = await service.register({ name: 'newuser', email: 'new@example.com', password: 'newpass123' });

    expect(result.success).toBe(true);
    expect(result.message).toBe('Registro exitoso');
  });

  it('should logout user successfully', () => {
    // First set a user
    service['currentUserSubject'].next(mockUsers[0]);
    expect(service.isAuthenticated()).toBe(true);

    // Then logout
    service.logout();

    expect(service.getCurrentUser()).toBe(null);
    expect(service.isAuthenticated()).toBe(false);
  });
});
