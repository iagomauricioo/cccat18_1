import request from 'supertest';
import app from '../src/signup'; 
import pgp from "pg-promise";


const connection = pgp()("postgres://postgres:123456@localhost:5432/app");

beforeEach(async () => {
  await connection.query("DELETE FROM ccca.account");
});

describe('POST /signup', () => {
  it('deve retornar 200 e criar uma conta', async () => {
    const response = await request(app)
      .post('/signup')
      .send({
        account_id: "id",
        name: "John Doe",
        email: "johndoe@example.com",
        cpf: "132.991.114-85",
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
        cpf: "132.991.114-85",
        carPlate: "ABC1234",
        isPassenger: true,
        isDriver: false,
        password: "mysecurepassword"
      });

    expect(response.status).toBe(422);
    expect(response.body.message).toBe(-2);
  });

  it('deve retornar 422 se nome do usuário tiver só o primeiro nome', async () => {
    const response = await request(app)
      .post('/signup')
      .send({
        name: "John",
        email: "teste@email.com",
        cpf: "132.991.114-85",
        carPlate: "ABC1234",
        isPassenger: true,
        isDriver: false,
        password: "mysecurepassword"
      });

    expect(response.status).toBe(422);
    expect(response.body.message).toBe(-3);
  });
});
