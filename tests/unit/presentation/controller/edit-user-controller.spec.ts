import userEntity from "@/domain/entities/user-entity"
import { EditUser } from "@/domain/usecases"
import EditUserController from "@/presentation/controllers/edit-user-controller"

const makeEditUser = (): EditUser => {
  class EditUserStub implements EditUser {
    async edit(userData: userEntity): Promise<{ body: userEntity }> {
      const user = {
        userId: 'valid_userId',
        accountId: 'new_valid_accountId',
        firstName: 'new_valid_firstName',
        lastName: 'new_valid_lastName',
        email: 'new_valid_email',
        groupId: 'new_valid_groupId',
      }

      return ({
        body: user
      })
    }
  }

  return new EditUserStub
}

const makeSut = () => {
  const editUser = makeEditUser()
  // const uuidValidate = 
  // const userIdExists = 
  const sut = new EditUserController(editUser)

  return ({
    sut,
    editUser,
    // uuidValidate,
    // userIdExists
  })
}

describe('Edit User', () => {
  it('Should call editUser with correct values', async () => {
    const { sut, editUser } = makeSut()

    const editUserSpy = jest.spyOn(editUser, 'edit')

    const httpRequest = {
      body: {
        userId: 'valid_userId',
        accountId: 'valid_accountId',
        firstName: 'valid_firstName',
        lastName: 'valid_lastName',
        email: 'valid_email',
        groupId: 'valid_groupId',
      }
    }

    await sut.handle(httpRequest)

    expect(editUserSpy).toHaveBeenCalled()
    expect(editUserSpy).toBeCalledWith({ ...httpRequest.body })
  })

  it('Should return status 204 and a edited user', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        userId: 'valid_userId',
        accountId: 'valid_accountId',
        firstName: 'valid_firstName',
        lastName: 'valid_lastName',
        email: 'valid_email',
        groupId: 'valid_groupId',
      }
    }

    const expectedBody = {
      body: {
        userId: 'valid_userId',
        accountId: 'new_valid_accountId',
        firstName: 'new_valid_firstName',
        lastName: 'new_valid_lastName',
        email: 'new_valid_email',
        groupId: 'new_valid_groupId',
      }
    }

    const response = await sut.handle(httpRequest)

    expect(response.body).toEqual(expectedBody)
    expect(response.statusCode).toBe(204)
  })

  it('Should return status 500 if some dependency throw', async () => {
    const { sut, editUser } = makeSut()

    jest.spyOn(editUser, 'edit').mockImplementationOnce(() => { throw new Error() });

    const httpRequest = {
      body: {
        userId: 'invalid_userId',
        accountId: 'invalid_accountId',
        firstName: 'invalid_firstName',
        lastName: 'invalid_lastName',
        email: 'invalid_email',
        groupId: 'invalid_groupId',
      }
    }

    const response = await sut.handle(httpRequest)
    expect(response.statusCode).toBe(500)
    expect(response.body.message).toBe('internal server error')
  })
})