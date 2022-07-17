const inputKeywoard = document.querySelector('#keywoard')
const searchButton = document.querySelector('#search')

const API_KEY = 'cf16fe3bca02efc84a2c2b0fee237e66'

const search = async (keywoard) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${keywoard}&appid=${API_KEY}`)
    const data = await response.json()
    return data
}

searchButton.addEventListener('click', async () => {
    const keywoard = inputKeywoard.value
    const data = await search(keywoard)
    console.log(data)

    keywoard.value = '' 
})

