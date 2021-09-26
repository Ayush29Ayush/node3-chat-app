//! Client-side Javascript Code

const socket = io()

//!Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//! Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML 

//! Options
// ignoreQueryPrefix: true se URL mein querystring(?) nahi dikhega
const { username , room }  = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('message', (message)=>{
    console.log(message)
    const html = Mustache.render(messageTemplate,{
        message: message.text,
        createdAt: moment(message.createdAt).format('hh:mm:ss a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (messageurl)=>{
    console.log(messageurl)
    const html = Mustache.render(locationMessageTemplate, {
        url: messageurl.url,
        createdAt: moment(messageurl.createdAt).format('hh:mm:ss a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})


// $messageForm.document.querySelector('#message-form').addEventListener('submit',(e)=>{
$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault() 

    //This area is for => disable the form send button
    $messageFormButton.setAttribute('disable', 'disabled')


    // const message = document.querySelector('input').value
    const message = e.target.elements.message.value //! This is alternative of the above line

    //! here the 3rd parameter i.e the function runs for acknowledgement
    socket.emit('sendMessage', message, (error)=>{
        //This area is for => enable the form send button
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = '' // default form entry is empty , also after sending msg it goes blank
        $messageFormInput.focus() // cursor focuses on form area

        // console.log('The message was delivered!')
        if (error) {
            return console.log(error)
        }

        console.log('Message delivered')

    })
})

// document.querySelector('#send-location').addEventListener('click', ()=>{
$sendLocationButton.addEventListener('click', ()=>{
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position)=>{
        // console.log(position)
        socket.emit('sendLocation',{
            // these values are taken according to the chrome developer tools
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, ()=>{
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared')
        })
    })
})

socket.emit('join', { username , room })

