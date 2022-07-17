const inputKeywoard = document.querySelector('#keywoard')
const searchButton = document.querySelector('#search')

const API_KEY = 'cf16fe3bca02efc84a2c2b0fee237e66'

const formatData = async (data) => {
    const cityName = data.name
    const weather = data.weather[0].main
    const temperature = data.main.temp
    const feelsLike = data.main.feels_like

    return {cityName, weather, temperature, feelsLike}
}

const search = async (keywoard) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${keywoard}&appid=${API_KEY}`)
    const data = await response.json()
    const formatedData = await formatData(data)
    return formatedData
}

searchButton.addEventListener('click', async () => {
    const keywoard = inputKeywoard.value
    const data = await search(keywoard)
    console.log(data)

    keywoard.value = '' 
})



search('Poznań').then(console.log)
