import axios from "axios";

axios.defaults.validateStatus = function () {
  return true;
}

test("Deve criar a conta do usuário", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "13299111485",
    password: "123456",
    isPassenger: true
  };
  const responseSignup = await axios.post("http://localhost:3000/signup", input);
  const outputSignup = responseSignup.data;
  expect(outputSignup.accountId).toBeDefined();
  const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${outputSignup.accountId}`);
  const outputGetAccount = responseGetAccount.data;
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);
  expect(outputGetAccount.password).toBe(input.password);
  //expect(outputGetAccount.is_passenger).toBe(input.isPassenger);
});


test("Não deve criar a conta de um usuário já existente", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "13299111485",
    password: "123456",
    isPassenger: true
  };
  await axios.post("http://localhost:3000/signup", input);
  const responseSignup = await axios.post("http://localhost:3000/signup", input);
  expect(responseSignup.status).toBe(422);
  const outputSignup = responseSignup.data;
  expect(outputSignup.message).toBe("Duplicated account");
});

test("Não deve criar a conta de um usuário com nome inválido", async function () {
  const input = {
    name: "John",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "13299111485",
    password: "123456",
    isPassenger: true
  };
  const responseSignup = await axios.post("http://localhost:3000/signup", input);
  expect(responseSignup.status).toBe(422);
  const outputSignup = responseSignup.data;
  expect(outputSignup.message).toBe("Invalid name");
});

test("Não deve criar a conta de um usuário com email inválido", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}gmail.com`,
    cpf: "13299111485",
    password: "123456",
    isPassenger: true
  };
  const responseSignup = await axios.post("http://localhost:3000/signup", input);
  expect(responseSignup.status).toBe(422);
  const outputSignup = responseSignup.data;
  expect(outputSignup.message).toBe("Invalid email");
});

test("Não deve criar a conta de um usuário com cpf inválido", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "13299111488",
    password: "123456",
    isPassenger: true
  };
  const responseSignup = await axios.post("http://localhost:3000/signup", input);
  expect(responseSignup.status).toBe(422);
  const outputSignup = responseSignup.data;
  expect(outputSignup.message).toBe("Invalid cpf");
});


test("Não deve criar a conta de um motorista com placa inválida", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "13299111485",
    password: "123456",
    carPlate: "ABC1A234",
    isDriver: true
  };
  const responseSignup = await axios.post("http://localhost:3000/signup", input);
  expect(responseSignup.status).toBe(422);
  const outputSignup = responseSignup.data;
  expect(outputSignup.message).toBe("Invalid car plate");
});
