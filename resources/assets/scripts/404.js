$ = window.jQuery

$(document).ready(() => {
  const jokes = $('.error-message').length
  let random = Math.floor(Math.random() * jokes)

  let selectedJoke = $('.error-message').eq(random)
  selectedJoke.toggleClass('hidden').toggleClass('selected')

  $('#do-it-again').click(() => {
    selectRandomJoke($('.error-message.hidden'))
  })
})


function selectRandomJoke(jokes) {
  let seed = Math.floor(Math.random() * jokes.length)
  let selectedJoke = jokes.eq(seed)
  let oldJoke = $('.error-message.selected')

  console.log(selectedJoke, oldJoke)

  oldJoke
    .toggleClass('hidden')
    .toggleClass('selected')

  selectedJoke
    .toggleClass('hidden')
    .toggleClass('selected')

}
