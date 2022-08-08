type IResponse = (string | undefined)[]

type fields = {
  [key: string]: string
}

export default interface UUIDValidate {
  validate(uuid: fields[]): IResponse;
}