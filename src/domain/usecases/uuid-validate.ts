type IResponse = { valid: boolean }

export default interface UUIDValidate {
  validate(uuid: string): IResponse;
}