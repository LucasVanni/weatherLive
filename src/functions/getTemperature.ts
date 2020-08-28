import api from '../services';

interface getTemperatureDTO {
  latitude: number;
  longitude: number;
}

export default async ({ latitude, longitude }: getTemperatureDTO): Promise<number> => {
  const response = await api.get(`onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=51a72be711c3639bf03cefb8e080dadd`);

  const { data: { current: { temp } } } = response;

  const temperature = Number(temp);

  return temperature;
};
