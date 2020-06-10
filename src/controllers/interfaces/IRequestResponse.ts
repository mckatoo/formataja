import { Request, Response } from 'express'

interface IRequestResponse {
  request: Request;
  response: Response;
}

export default IRequestResponse
