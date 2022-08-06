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
})