import service from './axios';
class Server {
  static submitCell = async (data: Record<string, any> = {}, _options: Record<string, any> = {}): Promise<any> => {
    return await service.post('/v1/cell/create-cell', data, _options);
  };
  static updateCell = async (data: Record<string, any> = {}, _options: Record<string, any> = { withCredentials: true }): Promise<any> => {
    return await service.post('/v1/cell/update-cell', data, _options);
  };
  static fetchCells = async (data: Record<string, any> = {}, _options: Record<string, any> = {}): Promise<any> => {
    return await service.post('/v1/cell/cell-list', data, _options);
  };
  static fetchHistory = async (params: Record<string, any> = {}, _options: Record<string, any> = {}): Promise<any> => {
    return await service.get('/v1/cell/call-history', { params }, _options);
  };
  static callCells = async (data: Record<string, any> = {}, _options: Record<string, any> = {}): Promise<any> => {
    return await service.post('/v1/cell/call-cell', data, _options);
  };
}

export default Server;
