import validator from "express-validator";
import * as helpers from "../utils/helpers.mjs";
import { createUserHandler, getUserByIdHandler } from "../handlers/users.mjs";
import { UserModel } from "../mongoose/schemas/user.mjs";

const mockUser = {
  username: "testuser@email.com",
  displayName: "Test User",
  password: "test1234",
};

// mock modules
jest.mock("express-validator", () => {
  return {
    validationResult: jest.fn(() => {
      return {
        isEmpty: jest.fn(() => false),
        array: jest.fn(() => [{ msg: "Invalid Field" }]),
      };
    }),
    matchedData: jest.fn(() => {
      return mockUser;
    }),
  };
});

jest.mock("../utils/helpers.mjs");
helpers.hashPassword.mockImplementation((password) => `hashed_${password}`);

// mock mongoose model
jest.mock("../mongoose/schemas/user.mjs");

const mockResponse = {
  sendStatus: jest.fn(),
  status: jest.fn(() => mockResponse),
  send: jest.fn(),
};

describe("get users", () => {
  const mockRequest = {
    params: {
      id: "1",
    },
  };

  it("should get user by id", async () => {
    const theId = mockRequest.params.id;
    const foundMockUser = { id: theId, ...mockUser };
    UserModel.findById.mockResolvedValueOnce(foundMockUser);

    await getUserByIdHandler(mockRequest, mockResponse);
    expect(UserModel.findById).toHaveBeenCalledWith(theId);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.send).toHaveBeenCalledWith(foundMockUser);

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.send).toHaveBeenCalledTimes(1);
  });

  it("should call sendStatus with 404 - User not found", async () => {
    const theId = mockRequest.params.id;
    const foundMockUser = null;
    UserModel.findById.mockImplementationOnce(() => foundMockUser);

    await getUserByIdHandler(mockRequest, mockResponse);
    expect(UserModel.findById).toHaveBeenCalledWith(theId);
    expect(UserModel.findById).toHaveReturnedWith(foundMockUser);
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(404);
  });

  it("should return status 400 on CastError", async () => {
    const theId = mockRequest.params.id;
    const error = { name: "CastError", msg: "Invalid ID" };
    UserModel.findById.mockImplementationOnce(() => Promise.reject(error));
    await getUserByIdHandler(mockRequest, mockResponse);
    expect(UserModel.findById).toHaveBeenCalledWith(theId);
    expect(mockResponse.sendStatus).not.toHaveBeenCalledWith(404);
    expect(mockResponse.status).not.toHaveBeenCalledWith(200);
    expect(mockResponse.status).not.toHaveBeenCalledWith(500);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith({ error: error.msg });
  });

  it("should return status 500 on error(s)", async () => {
    const theId = mockRequest.params.id;
    const error = { msg: "User not found" };
    UserModel.findById.mockImplementationOnce(() => Promise.reject(error));
    await getUserByIdHandler(mockRequest, mockResponse);
    expect(UserModel.findById).toHaveBeenCalledWith(theId);
    expect(mockResponse.sendStatus).not.toHaveBeenCalledWith(404);
    expect(mockResponse.status).not.toHaveBeenCalledWith(200);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.send).toHaveBeenCalledWith({ error: error });
  });
});

describe("create users", () => {
  const mockRequest = {};
  it("should return status 400 when there are validation error", async () => {
    await createUserHandler(mockRequest, mockResponse);
    expect(validator.validationResult).toHaveBeenCalled();
    expect(validator.validationResult).toHaveBeenCalledWith(mockRequest);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith({
      errors: [{ msg: "Invalid Field" }],
    });
  });

  it("should return status 201 and create user", async () => {
    const copyMockUser = { ...mockUser };
    const finalMockUser = {
      ...copyMockUser,
      password: `hashed_${copyMockUser.password}`,
    };
    const savedMockUser = { id: 1, ...finalMockUser };

    // mock function - override result return from validationResult
    jest.spyOn(validator, "validationResult").mockImplementationOnce(() => {
      return { isEmpty: jest.fn(() => true) };
    });
    const saveMethod = jest
      .spyOn(UserModel.prototype, "save")
      .mockResolvedValueOnce(savedMockUser); // short for jest.fn().mockImplementationOnce(() => Promise.resolve(value))

    await createUserHandler(mockRequest, mockResponse);
    expect(validator.matchedData).toHaveBeenCalledWith(mockRequest);
    expect(helpers.hashPassword).toHaveBeenCalledWith(copyMockUser.password);
    expect(helpers.hashPassword).toHaveReturnedWith(
      `hashed_${copyMockUser.password}`
    );
    expect(UserModel).toHaveBeenCalledWith(finalMockUser);
    // access saved instance: UserModel.mock.instances[0]
    // expect(UserModel.mock.instances[0].save).toHaveBeenCalled();
    expect(saveMethod).toHaveBeenCalled();

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.send).toHaveBeenCalledWith(savedMockUser);
  });

  it("should send status 400 when fail to save user", async () => {
    jest.spyOn(validator, "validationResult").mockImplementationOnce(() => {
      return { isEmpty: jest.fn(() => true) };
    });
    const saveMethod = jest
      .spyOn(UserModel.prototype, "save")
      .mockImplementationOnce(() => Promise.reject("Failed to save user"));
    await createUserHandler(mockRequest, mockResponse);
    expect(saveMethod).toHaveBeenCalled();
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(400);
  });
});
