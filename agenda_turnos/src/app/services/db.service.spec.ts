import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PostgresApiService } from './postgres-api.service';
import { User } from './datos';

describe('PostgresApiService', () => {
  let service: PostgresApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PostgresApiService]
    });
    service = TestBed.inject(PostgresApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get users', () => {
    const mockUsers: User[] = [
      { id: 1, name: 'Test User', email: 'test@example.com', password: 'hashedpassword' }
    ];

    service.getUsers().subscribe(users => {
      expect(users.length).toBe(1);
      expect(users[0].name).toBe('Test User');
    });

    const req = httpMock.expectOne('http://localhost:3000/users');
    expect(req.request.method).toBe('GET');
    req.flush({ users: mockUsers });
  });

  it('should create a user', () => {
    const newUser = { name: 'New User', email: 'new@example.com', password: 'password123' };
    const createdUser: User = { id: 2, ...newUser };

    service.createUser(newUser).subscribe(user => {
      expect(user).toBeTruthy();
      expect(user?.name).toBe('New User');
    });

    const req = httpMock.expectOne('http://localhost:3000/users');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newUser);
    req.flush({ user: createdUser });
  });

  it('should get a user by id', () => {
    const mockUser: User = { id: 1, name: 'Test User', email: 'test@example.com', password: 'hashedpassword' };

    service.getUser(1).subscribe(user => {
      expect(user).toBeTruthy();
      expect(user?.name).toBe('Test User');
    });

    const req = httpMock.expectOne('http://localhost:3000/users/1');
    expect(req.request.method).toBe('GET');
    req.flush({ user: mockUser });
  });

  it('should update a user', () => {
    const updatedUser: User = { id: 1, name: 'Updated User', email: 'updated@example.com', password: 'hashedpassword' };

    service.updateUser(1, { name: 'Updated User' }).subscribe(user => {
      expect(user).toBeTruthy();
      expect(user?.name).toBe('Updated User');
    });

    const req = httpMock.expectOne('http://localhost:3000/users/1');
    expect(req.request.method).toBe('PUT');
    req.flush({ user: updatedUser });
  });

  it('should delete a user', () => {
    service.deleteUser(1).subscribe(result => {
      expect(result).toBe(true);
    });

    const req = httpMock.expectOne('http://localhost:3000/users/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'User deleted successfully' });
  });

  it('should handle errors gracefully', () => {
    service.getUsers().subscribe(users => {
      expect(users).toEqual([]);
    });

    const req = httpMock.expectOne('http://localhost:3000/users');
    req.error(new ErrorEvent('Network error'));
  });
});
