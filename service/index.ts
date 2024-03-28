import service from "./axios";
class Server {
  static submitGear = async (data: Record<string, any> = {}, _options: Record<string, any> = {}): Promise<any> => {
    return await service.post("/v1/gear/create-gear", data, _options);
  };
  static updateGear = async (data: Record<string, any> = {}, _options: Record<string, any> = { withCredentials: true }): Promise<any> => {
    return await service.post("/v1/gear/update-gear", data, _options);
  };
  static fetchGears = async (data: Record<string, any> = {}, _options: Record<string, any> = {}): Promise<any> => {
    return await service.post("/v1/gear/gear-list", data, _options);
  };
  static fetchHistory = async (params: Record<string, any> = {}, _options: Record<string, any> = {}): Promise<any> => {
    return await service.get("/v1/gear/call-history", { params }, _options);
  };
  static callGears = async (data: Record<string, any> = {}, _options: Record<string, any> = {}): Promise<any> => {
    return await service.post("/v1/gear/call-gear", data, _options);
  };
}

export default Server;
