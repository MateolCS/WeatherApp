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
    const endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${keywoard}&units=metric&appid=${API_KEY}`
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
    UI.displaySearch(result)
})

class Search {
    data = null
    day = null

    constructor(data, day){
        this.data = data
        this.day = day
    }

    getDay(){
        return this.day
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
        return this.recentSearches.some((search) => search.getName() === keywoard)
    }

    deleteSearch(keywoard){
        this.recentSearches = this.recentSearches.filter((search) => search.getName() !== keywoard)
    }
}

class Storage{

    static setSearches(searches){
        localStorage.setItem('searches', JSON.stringify(searches))
    }

    static getSearches(){
        const searches = Object.assign(new RecentSearches,JSON.parse(localStorage.getItem('searches')))
        searches.setSearches(searches.getRecentSearches().map((search) => Object.assign(new Search, search)))
        return searches
    }

    static setSearch(keywoard){
        const searches = Storage.getSearches()
        searches.addSearch(keywoard)
        Storage.setSearches(searches)
    }

    static deleteSearch(keywoard){
        const searches = Storage.getSearches()
        searches.deleteSearch(keywoard)
        Storage.setSearches(searches)
    }
}

class UI{

    static initialize(){
        UI.displaySearches()
        UI.deleteSearchEvent()
    }

    static displayWeather(search){
        const possibleIcons = {
            'Thunderstorm': 'fa-cloud-bolt',
            'Drizzle': 'fa-cloud-drizzle',
            'Rain': 'fa-cloud-rain',
            'Snow': 'fa-cloud-snow',
            'Atmosphere': 'fa-cloud-fog',
            'Clear': 'fa-sun',
            'Clouds': 'fa-cloud'
        }

        const weatherContainer = document.querySelector('#weather-container')
        const weeatherTitle = document.querySelector('#city-name')
        const weatherTemperature = document.querySelector('#temperature')
        const weatherFeelsLike = document.querySelector('#feels-like')
        const weatherIcon = document.querySelector('#weather-icon')

        const icon = document.createElement('i')
        icon.classList.add('fa-solid', possibleIcons[search.getWeather()])

        weeatherTitle.textContent = search.getName()
        weatherTemperature.textContent = `${search.getTemperature()}°C`
        weatherFeelsLike.textContent = `${search.getFeelsLike()}°C`
        weatherIcon.innerHTML = ''
        weatherIcon.appendChild(icon)
        weatherContainer.classList.remove('hidden')
    }

    static displaySearches(){
        const searchesContainer = document.querySelector('#recent-searches')
        searchesContainer.innerHTML = ''
        
        const searches = Storage.getSearches().getRecentSearches()
        searches.forEach((search) =>{
            searchesContainer.appendChild(drawSearch(search))
        })
    }

    static displaySearch(search){
        const searchesContainer = document.querySelector('#recent-searches')
        searchesContainer.appendChild(drawSearch(search))
    }

    static deleteSearchEvent(){
        const deleteSearches = document.querySelectorAll('.recent__search__close')
        deleteSearches.forEach((deleteSearch) => {
            deleteSearch.addEventListener('click', (e) =>{
                const name = e.target.parentElement.firstChild.textContent
                Storage.deleteSearch(name)
                e.target.parentElement.remove()
            })
        })
    }

    static newSearchDeleteEvent(){
        const deleteSearches = document.querySelectorAll('.recent__search__close')
        const newSearch = deleteSearches[deleteSearches.length - 1]
        newSearch.addEventListener('click', (e) =>{
            const name = e.target.parentElement.firstChild.textContent
            Storage.deleteSearch(name)
            e.target.parentElement.remove()
        })
    }
}

const drawSearch = (inSearch) => {
    const search = document.createElement('div')
    search.classList.add('recent__search')

    const searchTitle = document.createElement('h3')
    searchTitle.classList.add('recent__search__title')
    searchTitle.textContent = inSearch.getName()

    const searchClose = document.createElement('i')
    searchClose.classList.add('fa-solid', 'fa-xmark' , 'recent__search__close')

    search.appendChild(searchTitle)
    search.appendChild(searchClose)

    return search
}

const search1 = new Search({ cityName: "Junoszyno", weather: "Clear", temperature: 27.06, feelsLike: 27.06 })
const search2 = new Search({ cityName: "Poznań", weather: "Clear", temperature: 27.06, feelsLike: 27.06 })
const search3 = new Search({ cityName: "Warszawa", weather: "Clear", temperature: 27.06, feelsLike: 27.06 })
const test = new RecentSearches([search1, search2, search3])
//Storage.setSearches(test)

UI.initialize()

const day = new Date()
const date = `${day.getDate()}-${day.getMonth() + 1}-${day.getFullYear()}`
const data2 = '23-7-2022'
console.log(date)
