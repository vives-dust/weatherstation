
import{ Request, Response, NextFunction} from 'express'

interface WeatherData {
    ID: string,
    PASSWORD: string,
    action: string,
    realtime: number,
    rtfreq: number,
    dateutc: string,
    baromin: number,
    tempf: number,
    dewptf: number,
    humidity: number,
    windspeedmph: number,
    windgustmph: number,
    winddir: number,
    rainin: number,
    dailyrainin: number,
    solarradiation: number,
    UV: number,
    indoortempf: number,
    indoorhumidity: number
}

export default (request: Request, response: Response, next: NextFunction) => {
    const data = request.query as unknown as WeatherData
    console.log(data)
}