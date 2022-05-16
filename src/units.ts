
export function fahrenheitToCelsius(temperature: number) :number {
    return parseFloat(((temperature - 32) * (5/9)).toFixed(2))
}

export function mphTokmh(speed: number) :number {
    return parseFloat((speed * 1.609344).toFixed(2))
}

export function inchToMm(distance: number) :number {
    return parseFloat((distance * 25.4).toFixed(2))
}

export function mmhgToHpa(pressure: number) :number {
    return parseFloat((pressure / 0.029529983071445).toFixed(2))
}