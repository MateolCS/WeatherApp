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
    const endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${keywoard}&appid=${API_KEY}`
    try{
        const response = await fetch(endpoint, {mode: 'cors'})
        const data = await response.json()
        const formatedData = await formatData(data)
        return formatedData
    }catch(err){
        console.log(err)
        return null
    }
}

const clearSearch = () => {
    inputKeywoard.value = ''
}

searchButton.addEventListener('click', async () => {
    const keywoard = inputKeywoard.value
    const data = await search(keywoard)
    const result = new Search(data)
    console.log(result)
    clearSearch() 
})

class Search {
    data = null

    constructor(data){
        this.data = data
    }

    getName(){
        return this.data.cityName
    }

    getWeather(){
        return this.data.weather
    }

    getTemperature(){
        return this.data.temperature
    }

    getFeelsLike(){
        return this.data.feelsLike
    }

    getData(){
        return this.data
    }
}


class RecentSearches {
    recentSearches = []
    constructor(inSearches){
        if(inSearches === undefined){
            this.recentSearches = []
        }else{
            this.recentSearches = inSearches
        }
    }

    setSearches(data){
        this.recentSearches = data
    }

    addSearch(keywoard){
        if(!this.alreadySerched(keywoard)){
            if(this.recentSearches.length >= 6){
                this.recentSearches.shift()
                this.recentSearches.push(keywoard)
            }else{
                this.recentSearches.push(keywoard)
            }
        }else{
            return null
        }
    }

    getRecentSearches(){
        return this.recentSearches
    }

    alreadySerched(keywoard){
        return this.recentSearches.some(search => search === keywoard)
    }
}

class Storage{

    static setSearches(searches){
        localStorage.setItem('searches', JSON.stringify(searches))
    }

    static getSearches(){
        const searches = Object.assign(new RecentSearches,JSON.parse(localStorage.getItem('searches')))
        return searches
    }

    static setSearch(keywoard){
        const searches = Storage.getSearches()
        searches.addSearch(keywoard)
        Storage.setSearches(searches)
    }


}

const recents = ['Poznań', 'Junoszyno', 'Warszawa', 'Radom', 'Gdynia', 'Powidz']
const test = new RecentSearches(recents)
console.log(test.getRecentSearches())
test.addSearch('Wilno')
console.log(test.getRecentSearches())
test.addSearch('Szczytniki')
console.log(test.getRecentSearches())
