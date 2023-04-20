import { useEffect, useState } from 'react'

interface Coordinates {
	latitude: number
	longitude: number
}

function App() {
	const [coordinates, setCoordinates] = useState<Coordinates | null>(null)
	const [city, setCity] = useState('')

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				setCoordinates(position.coords);
			},
			(error) => {
				console.log(error);
			}
		)
	}, [])

	useEffect(() => {
		const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address"
		const token = "2c022aa14af7670e488dfadc6868d887eb4bc224"
		const query = { lat: coordinates?.latitude, lon: coordinates?.longitude, count: 1 }

		const options: RequestInit = {
			method: "POST",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json",
				"Authorization": `Token ${token}`
			},
			body: JSON.stringify(query)
		}

		async function fetchData() {
			try {
				const response = await fetch(url, options)
				const result = await response.json()
				const city = result.suggestions[0]?.data.city
				setCity(city)
			} catch (error) {
				console.log("error", error)
			}
		}

		fetchData()
	}, [coordinates])

	return (
		<>
			<div>Город: {city}</div>
			<div>Широта: {coordinates?.latitude}</div>
			<div>Долгота: {coordinates?.longitude}</div>
		</>
	)
}

export default App
