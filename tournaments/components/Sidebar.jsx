/* eslint-disable react/prop-types */
import '../styles/Sidebar.css'
import search_icon from '/src/assets/search-icon.png'
import dropdown_button from '/src/assets/menu-down.svg'
import { useEffect } from 'react'

function Sidebar({tournaments}) {

  useEffect(() => {
    generateCategoryFilterDropdown()
    dropdownHandler()
  })

  return (
    <div id="sidebar">
      <form id='search' action="" method='get'>
        <input id='searchbar' type="search" placeholder='ID, title...' name='search' />
        <button type='submit'><img className='search_icon' src={search_icon} alt="" /></button>
      </form>
      <span className='filters-header'>Filters</span>
      <form id="filters">
        <div id='filter-category' className="filter dropdown" data-name="category">
          <span className="name">Category</span>
          <div className="select">
              <span className="selected"></span>
              <div className="imgContainer">
                <img src={dropdown_button} alt="" />
              </div>
          </div>
          <ul className='menu category'></ul>
        </div>
        <div id='filter-entryFee' className="filter" data-name="entryFee">
          <span className="name">Entry Fee</span>
          <div className="slider"></div>
          <div className="valueDisplay">
            <span>Min: </span>
            <span className="value-min"></span>
            <br />
            <span>Max: </span>
            <span className="value-max"></span>
          </div>
        </div>
        <div id="filter-type" className="filter" data-name="type">
          <span className="name">Type</span>
          <div className="radio">
            <div className="radio-item">
              <input id='radio-brackets' type="radio" name='type' value="Brackets" defaultChecked={true} readOnly={true} />
              <label htmlFor="radio-brackets">Brackets</label>
            </div>
            <div className="radio-item">
              <input id='radio-br' type="radio" name='type' value="Battle Royale" />
              <label htmlFor="radio-br">Battle Royale</label>
            </div>
          </div>
        </div>
        <ul>
          <li>tournament type</li>
          <li>public/private</li>
        </ul>
      </form>
    </div>
  )
}

function generateCategoryFilterDropdown() {
  let container = document.getElementById('filter-category')
  let list = container.querySelector('.menu')
  let selected = container.querySelector('.selected')

  let categories = api_getCategories()
  categories.forEach(category => {
    let li = document.createElement('li')
    li.setAttribute("data-value", category)
    li.innerHTML = category

    list.appendChild(li)
  })

  let first = list.childNodes[0]
  selected.innerText = first.innerText
  first.classList.add('active')
}

function api_getCategories() {
  return ["League of Legends", "Poker", "Chess", "Fortnite", "Football", "Coding"]
}

function dropdownHandler() {
  let dropdowns = document.querySelectorAll(".dropdown")

  Array.from(dropdowns).forEach(dropdown => {
    let name = dropdown.dataset.name
    let select = dropdown.querySelector('.select')
    select.addEventListener('click', () => { toggledropdown(name) } )

    Array.from(dropdown.querySelectorAll('.menu li')).forEach(option => {
      option.addEventListener('click', () => {
        let value = option.dataset.value
        let selected = dropdown.querySelector('.selected')
        let active = dropdown.querySelector('.active')
        active.classList.remove('active')
        option.classList.add('active')
        selected.innerText = value
        toggledropdown(name)
      })
    })
  })
}

function toggledropdown(name) {
  let menu = document.querySelector(".menu." + name)
  let display = window.getComputedStyle(menu).display
  if(display == "none") {
    menu.style.display = "block"
  }
  else {
    menu.style.display = "none"
  }
}

function getHighestEntryFee(tournaments) {
  let highest = 0
  tournaments.forEach(tourney => {
    if(tourney.entryFee > highest) {
      highest = tourney.entryFee
    }
  })
  return highest
}


function getFilterFormData() {

}

export default Sidebar