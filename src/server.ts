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
    realtime: string,
    rtfreq: string,
    dateutc: string,
    baromin: string,
    tempf: string,
    dewptf: string,
    humidity: string,
    windspeedmph: string,
    windgustmph: string,
    winddir: string,
    rainin: string,
    dailyrainin: string,
    solarradiation: string,
    UV: string,
    indoortempf: string,
    indoorhumidity: string
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


const mqtt: MqttClient = MQTT.connect(`mqtt://${MQTT_HOST}`)

console.log(`Connecting MQTT to ${MQTT_HOST}`)
// mqtt.on("connect", () => {
//     console.log(`Connected to MQTT host: ${MQTT_HOST}`)
// })

const app: Application = express()
const server = http.createServer(app)

app.get(WEATHERSTATION_UPDATE_PATH, (request: Request, response: Response, next: NextFunction) => {
    const data = request.query as unknown as WeatherData

    const stationId = data.ID

    const publishData: PublishData = {
        barometer_hpa: mmhgToHpa(parseFloat(data.baromin)),
        temperature_c: fahrenheitToCelsius(parseFloat(data.tempf)),
        dewpoint_c: fahrenheitToCelsius(parseFloat(data.dewptf)),
        humidity_percent: parseFloat(data.humidity),
        windspeed_kmh: mphTokmh(parseFloat(data.windspeedmph)),
        windgust_kmh: mphTokmh(parseFloat(data.windgustmph)),
        winddirection_degrees: parseFloat(data.winddir),
        rain_mm: inchToMm(parseFloat(data.rainin)),
        dailyrain_mm: parseFloat(data.dailyrainin),
        solarradiation_wm2: parseFloat(data.solarradiation),
        uv_index: parseFloat(data.UV)
    }
    mqtt.publish(`${MQTT_TOPIC_PREFIX}/${stationId}`, JSON.stringify(publishData))

    for (let [key, value] of Object.entries(publishData	)) {
        mqtt.publish(`${MQTT_TOPIC_PREFIX}/${stationId}/${key}`, `${value}`)
    }

    console.log(data)
    console.log(publishData)
    response.status(200).end()
})

server.listen(PORT, () => {
    console.log(`Listing on port ${PORT}`)
})







