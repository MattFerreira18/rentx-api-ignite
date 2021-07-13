interface IParams {
  message: string;
  statusCode: number;
}

class AppError {
  public readonly message: string;

  public readonly statusCode: number;

  constructor(
    public readonly params: IParams = {
      message: 'internal server error',
      statusCode: 400,
    },
  ) {
    Object.assign(this, params);
  }
}

export { AppError };
