import { Result } from "true-myth";

function toResult<T, E>(promise: Promise<T>): Promise<Result<T, E>> {
  return new Promise((res, rej) => {
    promise
      .then((result) => res(Result.ok(result)))
      .catch((error) => rej(Result.err(error)));
  });
}

interface ProviderRequest {
  entity: string;
  options?: Record<string, unknown>;
}

type ProviderFetch<RequestType extends ProviderRequest = ProviderRequest> = (
  request: RequestType
) => Promise<Result<unknown, Error | string>>;

interface Provider<RequestType extends ProviderRequest = ProviderRequest> {
  apiKey: string;
  baseURL: string;
  fetch: ProviderFetch<RequestType>;
}

interface FaveNumberRequest {
  entity: "FAVORITE_NUMBER";
}

interface FaveColorRequest {
  entity: "FAVORITE_COLOR";
}

type WarrenProviderRequest = FaveColorRequest | FaveNumberRequest;

const service = async (req: WarrenProviderRequest) => {
  switch (req.entity) {
    case "FAVORITE_NUMBER":
      return 1;
    case "FAVORITE_COLOR":
      return "red";
    default:
      throw Error("Oh no! I do not know!");
  }
};

const WarrenProvider: Provider<WarrenProviderRequest> = {
  apiKey: "12345",
  baseURL: "http://localhost:5000",
  async fetch(request: WarrenProviderRequest) {
    switch (request.entity) {
      case "FAVORITE_COLOR":
        return toResult(service(request)) as Promise<Result<string, never>>;
      case "FAVORITE_NUMBER":
        return toResult(service(request)) as Promise<Result<number, never>>;
    }
  }
};
