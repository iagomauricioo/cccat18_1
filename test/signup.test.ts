import request from 'supertest';
import app from '../src/signup';  // O caminho onde sua aplicação Express está sendo exportada

describe('POST /signup', () => {
  it('should return 200 and create an account', async () => {
    const response = await request(app)
      .post('/signup')
      .send({
        name: "John Doe",
        email: "john.doe@example.com",
        cpf: "12345678900",
        carPlate: "ABC1234",
        isPassenger: true,
        isDriver: false,
        password: "mysecurepassword"
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('accountId');
  });

  it('should return 422 when invalid email is provided', async () => {
    const response = await request(app)
      .post('/signup')
      .send({
        name: "John Doe",
        email: "invalid-email",
        cpf: "12345678900",
        carPlate: "ABC1234",
        isPassenger: true,
        isDriver: false,
        password: "mysecurepassword"
      });

    expect(response.status).toBe(422);
    expect(response.body.message).toBe(-2);
  });
});
