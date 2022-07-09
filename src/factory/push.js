import axios from 'axios'

const options = {
    headers: {
        'Authorization': `key=${process.env.PUSH_NOTIFY_KEY}`
    }
}

export const sendPush = async (to, body, title) => {
    const message = {
        to: to,
        notification: {
            body: body,
            title: title,
            icon: "myicon"
        }
    }
    return await axios.post("https://fcm.googleapis.com/fcm/send", message, options)
}