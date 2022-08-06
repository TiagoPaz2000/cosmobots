type IResponse = boolean

export default interface UUIDValidator {
  validate(uuid: string): IResponse;
}