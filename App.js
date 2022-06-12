const inputKeywoard = document.querySelector('#keywoard')
const searchButton = document.querySelector('#search')

const search = async (keywoard) => {
    const response = await fetch(`https://api.github.com/us${keywoard}`)
    const data = await response.json()
    return data
}

searchButton.addEventListener('click', async () => {
    const keywoard = inputKeywoard.value
    const data = await search(keywoard)
    console.log(data)

    keywoard.value = ''
})