const inputKeywoard = document.querySelector('#keywoard')
const searchButton = document.querySelector('#search')

const API_KEY = 'cf16fe3bca02efc84a2c2b0fee237e66'

//Helper functions

const formatData = async (data) => {
    const cityName = data.name
    const weather = data.weather[0].main
    const temperature = data.main.temp
    const feelsLike = data.main.feels_like

    return {cityName, weather, temperature, feelsLike}
}

const fetchData = async (keywoard) => {
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

const getDateFormatted = () =>{
    const day = new Date()
    const date = `${day.getDate()}-${day.getMonth() + 1}-${day.getFullYear()}`

    return date
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

//Search button event

searchButton.addEventListener('click', async (e) => {
    const keywoard = inputKeywoard.value
    if(Storage.alreadySerched(keywoard)){
        if(Storage.getSearch(keywoard).getDay() !== getDateFormatted()){
            try{
                const data = new Search(await fetchData(keywoard),getDateFormatted())
                Storage.updateSearch(keywoard, data)
                UI.displayWeather(data)
                clearSearch()
            }catch(err){
                console.log(err)
            }  
        }else{
            UI.displayWeather(Storage.getSearch(keywoard))
            clearSearch()
        }
    }else{
        try{
            const data = new Search(await fetchData(keywoard), getDateFormatted())
            Storage.setSearch(data)
            UI.displaySearch(data)
            UI.newSearchDeleteEvent()
            UI.displayWeather(data)
            clearSearch()
        }catch(err){
            console.log(err)
        }
    }
})

// Search class definition


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

    updateSearch(search){
        this.data = search.getData()
        this.day = search.getDay()
    }
}

//Recent searches class definition

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

    addSearch(inSearch){
        if(!this.alreadySerched(inSearch.getName())){
            if(this.recentSearches.length >= 6){
                this.recentSearches.shift()
                this.recentSearches.push(inSearch)
            }else{
                this.recentSearches.push(inSearch)
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

    getSearch(keywoard){
        return this.recentSearches.find((search) => search.getName() === keywoard)
    }

}

//Storage class definition

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

    static alreadySerched(keywoard){
        const searches = Storage.getSearches()
        return searches.alreadySerched(keywoard)
    }

    static getSearch(keywoard){
        const searches = Storage.getSearches()
        return searches.getSearch(keywoard)
    }

    static updateSearch(keywoard, inSearche){
        const searches = Storage.getSearches()
        searches.getSearch(keywoard).updateSearch(inSearche)
        Storage.setSearches(searches)
    }
}

//UI class definition

class UI{

    static initialize(){
        UI.displaySearches()
        UI.deleteSearchEvent()
        UI.searchEvent()
    }

    static displayWeather(inSearch){
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
        icon.classList.add('fa-solid', possibleIcons[inSearch.getWeather()])

        weeatherTitle.textContent = inSearch.getName()
        weatherTemperature.textContent = `${inSearch.getTemperature()}°C`
        weatherFeelsLike.textContent = `${inSearch.getFeelsLike()}°C`
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
                this.clearWeather()
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
            this.clearWeather()
        })
    }

    static searchEvent(){
        const searches = document.querySelectorAll('.recent__search')
        searches.forEach((search) => {
            search.addEventListener('click', async (e) =>{
                const name = e.target.firstChild.textContent
                const data = Storage.getSearch(name)
                if(data.getDay() !== getDateFormatted()){
                    try{
                        const data = new Search(await fetchData(name),getDateFormatted())
                        Storage.updateSearch(name, data)
                        UI.displayWeather(Storage.getSearch(name))
                    }catch(err){
                        console.log(err)
                    }
                }else{
                    UI.displayWeather(data)
                }
            })
        })
    }

    static clearWeather(){
        const weatherContainer = document.querySelector('#weather-container')
        weatherContainer.classList.add('hidden')
    }
}

//UI initialization

UI.initialize()

