import axios from "axios";
import { getAccountById, signup } from "../src/signup";

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
  
  const outputSignup = await signup(input);
  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await getAccountById(outputSignup.accountId);
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);
  expect(outputGetAccount.password).toBe(input.password);
  expect(outputGetAccount.is_passenger).toBe(input.isPassenger);
});


test("Não deve criar a conta de um usuário já existente", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "13299111485",
    password: "123456",
    isPassenger: true
  };
  await signup(input);
  await expect(() => signup(input)).rejects.toThrow(new Error("Duplicated account"));
});

test("Não deve criar a conta de um usuário com nome inválido", async function () {
  const input = {
    name: "John",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "13299111485",
    password: "123456",
    isPassenger: true
  };
  await expect(() => signup(input)).rejects.toThrow(new Error("Invalid name"));
});

test("Não deve criar a conta de um usuário com email inválido", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}gmail.com`,
    cpf: "13299111485",
    password: "123456",
    isPassenger: true
  };
  await expect(() => signup(input)).rejects.toThrow(new Error("Invalid email"));
});

test("Não deve criar a conta de um usuário com cpf inválido", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "13299111488",
    password: "123456",
    isPassenger: true
  };
  await expect(() => signup(input)).rejects.toThrow(new Error("Invalid cpf"));
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
  await expect(() => signup(input)).rejects.toThrow(new Error("Invalid car plate"));
});