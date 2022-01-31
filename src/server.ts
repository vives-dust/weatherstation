import express, { Application, NextFunction, Request, Response} from 'express'
import http from 'http'
// import WeahterStationUpdate from './weather_update'
import MQTT, { MqttClient } from 'mqtt'
import { fahrenheitToCelsius, inchToMm, mmhgToHpa, mphTokmh } from './units'


const PORT = process.env.PORT || 3000
const WEATHERSTATION_UPDATE_PATH:string = '/weatherstation/updateweatherstation.php'

const MQTT_TOPIC_PREFIX :string = process.env.MQTT_TOPIC_PREFIX || 'weatherstation'
const MQTT_HOST :string = process.env.MQTT_HOST || 'localhost'

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

interface PublishData {
    barometer_hpa: number,
    temperature_c: number,
    dewpoint_c: number,
    humidity_percent: number,
    windspeed_kmh: number,
    windgust_kmh: number,
    winddirection_degrees: number,
    rain_mm: number,
    dailyrain_mm: number,
    solarradiation_wm2: number,
    uv_index: number
}


const mqtt: MqttClient = MQTT.connect('mqtt://mqtt.littlewan.be')

const app: Application = express()
const server = http.createServer(app)

app.get(WEATHERSTATION_UPDATE_PATH, (request: Request, response: Response, next: NextFunction) => {
    const data = request.query as unknown as WeatherData

    const stationId = data.ID

    const publishData: PublishData = {
        barometer_hpa: mmhgToHpa(data.baromin),
        temperature_c: fahrenheitToCelsius(data.tempf),
        dewpoint_c: fahrenheitToCelsius(data.dewptf),
        humidity_percent: data.humidity,
        windspeed_kmh: mphTokmh(data.windspeedmph),
        windgust_kmh: mphTokmh(data.windgustmph),
        winddirection_degrees: data.winddir,
        rain_mm: inchToMm(data.rainin),
        dailyrain_mm: data.dailyrainin,
        solarradiation_wm2: data.solarradiation,
        uv_index: data.UV
    }
    mqtt.publish(`${MQTT_TOPIC_PREFIX}/${stationId}`, JSON.stringify(publishData))

    for (let [key, value] of Object.entries(publishData	)) {
        mqtt.publish(`${MQTT_TOPIC_PREFIX}/${stationId}/${key}`, `${value}`)
    }

    console.log(data)
    response.status(200).end()
})

server.listen(PORT, () => {
    console.log(`Listing on port ${PORT}`)
})







